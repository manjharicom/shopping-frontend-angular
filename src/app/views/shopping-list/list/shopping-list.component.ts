import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { forkJoin } from 'rxjs';
import { ShoppinglistApiService } from '../../../shared/services/shoppinglist-api.service';
import { ProductsapiService } from '../../../shared/services/productsapi.service';
import { SupermarketApiService } from '../../../shared/services/supermarket-api.service';
import { TrelloApiService } from '../../../shared/services/trello-api.service';
import { ApiService } from '../../../shared/services/api.service';
import { ProductModel } from '../../../shared/models/product.model';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../cbo-filter-selector/filter.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  constructor(
    private apiService: ShoppinglistApiService,
    private trelloApiService: TrelloApiService,
    private productsApiService: ProductsapiService,
    private superMarketApiService: SupermarketApiService,
    private reconcileApiService: ApiService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,){}

  products: ProductModel[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  shoppingLists: CboFilterListArray[] = [];

  ngOnInit(): void {
    this.loadFilterOptions();
   }
  
  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each certificate type section
    localStorage.removeItem('certificate_dashboard');

    this.products = [];
  };

  handleOnFilter = () => {
    this.isLoading = true;
    var query = this.generateSearchQuery();
    this.loadProducts(undefined, query);
    this.isLoading = false;
  };

  handleOnChange = (e:any) => {
  }

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }
  
  getFilterValue(): string{
    return this.filterService.getFilterValue(this.filterModel.filters, "shoppingListId");
  }

  private loadProducts(showToastMessage?: number, query?: string){
      this.productsApiService.getShoppingListProducts(query).subscribe({
        next: products => {
          this.products = products;
          if(showToastMessage !== undefined)
          {
            if (showToastMessage === 1){
              this.showSuccessToaster();
            }
            else if (showToastMessage === 2){
              this.showDeletedToaster();
            }
            else if (showToastMessage === 3){
              this.showRemovedToaster();
            }
            else if (showToastMessage === 4){
              this.showReconciledToaster();
            }
            else if (showToastMessage === 5){
              this.showUpdatedToaster();
            }
          }
        }
      });
  }

  onRemoveBtnClick(productId: number, shoppingListId?: number){
      this.productsApiService.removeProductFromList(productId, shoppingListId).subscribe(
        {
          next: p => {
            var query = this.generateSearchQuery();
            this.loadProducts(3, query);
          }
        }
      );
  }

  private loadFilterOptions(){
    this.isLoading = true;
    var shoppingListId = this.getShoppingListId();
    console.log(shoppingListId);

    const shops = this.apiService.getShoppingLists().subscribe(data => {
      data.forEach((cat) => {
        this.shoppingLists.push({
          Value: cat.shoppingListId,
          Name: cat.name,
          Selected: cat.shoppingListId === Number(shoppingListId) ? true : false,
          Id: cat.shoppingListId
        });
        this.loadFilters();
        this.saveInitialFilters();
        this.isLoading = false;
      });
    });
  }
  
  private getShoppingListId() : number {
    var shoppingListId = sessionStorage.getItem('shoppingListId');
    if(shoppingListId)
      return Number(shoppingListId)
    else
      return 0;
  }

  private loadFilters(){
    this.filterModel = {
      apiCallState: ApiCallState.New,
      apiData: [],
      columns: [],
      changeListener: this.handleOnChange,
      filters: [
        {
          label: 'Shopping List',
          name: 'shoppingListId',
          type: FilterPageType.SelectList,
          listArray: this.shoppingLists,
          value: "Select Shopping List"
        }
      ],
      buttons: [
        {
          name: 'Clear',
          label: 'Clear',
          cssClasses: 'btn btn-default border',
          function: this.handleOnClear,
        },
        {
          name: 'ListProducts',
          label: 'List Products',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
        },
      ]
    };
  }

  private saveInitialFilters() {
    this.filterModelClearState = JSON.parse(
      JSON.stringify(this.filterModel.filters)
    );
  }

  delete(showToastMessage?: number){
    var value = this.getFilterValue();
    if (!value){
      this.showErrorToaster();
      return;
    }

    this.apiService.deleteShoppingListItems(Number(value)).subscribe(() => {
      this.loadProducts(showToastMessage);
    });
  }

  trello(){
    var value = this.getFilterValue();
    if (!value){
      this.showErrorToaster();
      return;
    }

    this.trelloApiService.trello(Number(value)).subscribe(() => {
      //this.delete(1);
      var query = this.generateSearchQuery();
      this.loadProducts(1, query);
    });
  }

  reconcile(){
    if (this.products == undefined || this.products.some(x => x) === false){
      this.showErrorToaster();
      return;
    }

    var value = this.getFilterValue();
    if (!value){
      this.showErrorToaster();
      return;
    }

    this.reconcileApiService.reconcile(Number(value)).subscribe(() => {
      var query = this.generateSearchQuery();
      this.loadProducts(4, query);
    });
  }

  showSuccessToaster(){
    this.toastr.success("Shopping list posted to Trello.")
  }

  showErrorToaster(){
    this.toastr.error("Shopping list is empty");
  }

  showDeletedToaster(){
    this.toastr.success("Shopping list is deleted");
  }

  showRemovedToaster(){
    this.toastr.success("Product Removed");
  }

  showReconciledToaster(){
    this.toastr.success("Shopping list Reconciled.")
  }

  showUpdatedToaster(){
    this.toastr.success("Quantity Updated.")
  }

  onChange(productId: number, shoppingListId?: number, value?: string){
    if (value){
      var quantity:number = JSON.parse(value);
      this.productsApiService.updateProductQuantity(productId, quantity, shoppingListId).subscribe(() => {
        var query = this.generateSearchQuery();
        this.loadProducts(5, query);
      });
    }
  }

  handleEdited(e:any){

  }
}
