import { Component, OnInit, TemplateRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { AreasApiService } from '../../shared/services/areas-api.service'
import { CategoriesApiService } from '../../shared/services/categories-api.service'
import { ProductsapiService } from '../../shared/services/productsapi.service';
import { ProductModel } from '../../shared/models/product.model';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../cbo-filter-selector/filter.service'
import { ModalService } from '../../shared/services/modal.service'
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapModalComponent } from '../../shared/components/ngx-bootstrap-modal/ngx-bootstrap-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NewProductResponseModel } from 'src/app/shared/models/new-product-response.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private productsApiService: ProductsapiService,
    private areasApiService: AreasApiService,
    private categoriesApiService: CategoriesApiService,
    private toastr: ToastrService,
    private router: Router,
    private filterService: FilterService,
    protected modalService: ModalService,
    protected listModelService: BsModalService){}

  products: ProductModel[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  categories: CboFilterListArray[] = [];
  areas: CboFilterListArray[] = [];

  ngOnInit(): void {
    this.loadFilterOptions();
  }
  
  private loadFilterOptions(){
    this.isLoading = true;

    const cats = this.categoriesApiService.getCategories(false);
    const areas = this.areasApiService.getAreas(false);

    forkJoin([cats, areas]).subscribe(data => {
      this.categories.push({
        Value: undefined,
        Name: 'Select a Category',
        Selected: true,
        Id: undefined
      });
      data[0].forEach((cat) => {
        this.categories.push({
          Value: cat.categoryId,
          Name: cat.name,
          Selected: false,
          Id: cat.categoryId
        });
      });
      this.areas.push({
        Value: undefined,
        Name: 'Select a Storage Area',
        Selected: true,
        Id: undefined
      });
      data[1].forEach((area) => {
        this.areas.push({
          Value: area.areaId,
          Name: area.name,
          Selected: false,
          Id: area.areaId
        });
      });
      this.loadFilters();
      this.saveInitialFilters()
      this.isLoading = false;
    });

  }

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }

  private loadFilters(){
    this.filterModel = {
      apiCallState: ApiCallState.New,
      apiData: [],
      columns: [],
      sorts: [],
      filters: [
        {
          label: "Product",
          name: "searchText",
          type: FilterPageType.Text
        },
        {
          label: 'Category',
          name: 'categoryId',
          type: FilterPageType.SelectList,
          listArray: this.categories,
          value: "Select category"
        },
        {
          label: 'Storage Area',
          name: 'areaId',
          type: FilterPageType.SelectList,
          listArray: this.areas,
          value: "Select area"
        },
      ],
      buttons: [
        {
          name: 'Clear',
          label: 'Clear',
          cssClasses: 'btn btn-default border',
          function: this.handleOnClear,
        },
        {
          name: 'Search',
          label: 'Search',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
        },
      ]
    }
  }
  
  openListModal(product: ProductModel) {
    const modalRef = this.listModelService.show(NgxBootstrapModalComponent, Object.assign({}, { class: 'gray modal-lg' }));
    modalRef.content.product = product;
    modalRef.content.modalRef = modalRef;
    modalRef.content.added.subscribe((p:any) => {
      this.handleAdded(p);
    });
  }
  
  openProductModal(product: ProductModel) {

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
    this.search(query);
    this.isLoading = false;
  };

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }

  search(query?: string){
    this.isLoading = true;
    this.productsApiService.search(query).subscribe((data) => {
      this.products = data;
      this.isLoading = false;
    });
  }

  onRemoveBtnClick(productId:number, shoppingListId?: number){
    this.productsApiService.removeProductFromList(productId, shoppingListId).subscribe(() => {
      var query = this.generateSearchQuery();
      this.search(query);
    });
  }


  handleAdded(e:any){
    this.toastr.success('Product "' + e.product + '" Successfully Added to Shopping List "' + e.name + '"');
    this.handleOnFilter();
    this.modalService.close();
  }
  
  handleAdd(){
    this.router.navigate(['items/products/new']);
  }

  handleEdited(d:NewProductResponseModel){
    this.showToastrMessage(d.responseCode, d.responseMessage);
    this.handleOnFilter();
    this.modalService.close();
  }
  
  showToastrMessage(code: number, message: string){
    if (code < 0){
      this.toastr.error(message);
    }
    else{
      this.toastr.success(message);
    }
  }
}
