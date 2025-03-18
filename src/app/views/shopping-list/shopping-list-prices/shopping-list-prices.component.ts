import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule, FormArray, FormBuilder  } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ShoppinglistApiService } from '../../../shared/services/shoppinglist-api.service';
import { ProductsapiService } from '../../../shared/services/productsapi.service';
import { ProductModel } from '../../../shared/models/product.model';
import { AddPriceModel } from '../../../shared/models/add-price.model';
import { AddPriceItemModel } from "../../../shared/models/add-price-item.model";
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../cbo-filter-selector/filter.service'
import { ToastrService } from 'ngx-toastr';
import { PricesApiService } from 'src/app/shared/services/prices-api.service';

@Component({
  selector: 'app-shopping-list-prices',
  templateUrl: './shopping-list-prices.component.html',
  styleUrls: ['./shopping-list-prices.component.scss']
})
export class ShoppingListPricesComponent implements OnInit {
  constructor(
    private apiService: PricesApiService,
    private productsApiService: ProductsapiService,
    private shoppingListApiService: ShoppinglistApiService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,){}

  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  shoppingLists: CboFilterListArray[] = [];
  shoppingListForm!: FormGroup;

  ngOnInit(): void {
    this.shoppingListForm = this.fb.group({
      shoppingDate: this.fb.control('', [Validators.required]),
      prices: this.fb.array([]),
    });
    this.loadFilterOptions();
   }

  get shoppingDate(){
    return this.shoppingListForm.get('shoppingDate') as FormControl;
  }

  get prices(): FormArray{
    return this.shoppingListForm.get("prices") as FormArray
  }

  private createPricesFormGroup(prod?: ProductModel): FormGroup {
    return this.fb.group({
      productId: this.fb.control(prod ? prod.productId : ''),
      name: this.fb.control(prod ? prod.name : ''),
      quantity: this.fb.control(prod ? prod.quantity : '', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      total: this.fb.control('', [Validators.required]),
      priceUom: this.fb.control(prod?.priceUom),
      allowDecimalQuantity: this.fb.control(prod ? prod.allowDecimalQuantity : '')
    })
  }

  private loadProducts(query?: string){
    this.prices.clear();
    this.productsApiService.getShoppingListProducts(query).subscribe(prods =>{
        prods.forEach(p => {
          this.prices.push(this.createPricesFormGroup(p));
        });
    });
  }

  private loadFilterOptions(){
    this.isLoading = true;
    const shops = this.shoppingListApiService.getShoppingLists().subscribe(data => {
      data.forEach((cat) => {
        this.shoppingLists.push({
          Value: cat.shoppingListId,
          Name: cat.name,
          Selected: cat.shoppingListId === 1 ? true : false,
          Id: cat.shoppingListId
        });
        this.loadFilters();
        this.saveInitialFilters();
        this.isLoading = false;
      });
    });
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
        },
        {
          label: 'Only Purchased Items',
          name: 'isPurchased',
          type: FilterPageType.Checkbox,
          value: "true"
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
  
  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each certificate type section
    localStorage.removeItem('certificate_dashboard');
    this.prices.clear();
  };

  handleOnFilter = () => {
    this.isLoading = true;
    var query = this.generateSearchQuery();
    this.loadProducts(query);
    this.isLoading = false;
  };

  handleOnChange = () => {
  }

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }

  showToastrMessage(code: number, message: string){
    if (code < 0){
      this.toastr.error(message);
    }
    else{
      this.toastr.success(message);
    }
  }

  submit(){
    if (this.shoppingListForm.invalid){
      console.log("Form is invalid");
      return;
    }
    this.save();
  }

  save(){
    const shoppingDate = this.shoppingDate.value as Date;
    let addPrices:AddPriceModel = {
      shoppingListId: Number(this.filterService.getFilterValue(this.filterModel.filters, "shoppingListId")),
      shoppingDate: shoppingDate,
      prices: []
    };
    var controls = this.prices.controls as FormGroup[]
    controls.forEach(c => {
      let price:AddPriceItemModel = {
        productId: Number(c.get('productId')?.value),
        quantity: Number(c.get('quantity')?.value),
        price: Number(c.get('price')?.value),
        total: Number(c.get('total')?.value),
      }
      addPrices.prices.push(price);
    });
    //console.log(addPrices);
    this.apiService.add(addPrices).subscribe(p => {
      this.showToastrMessage(p.responseCode, p.responseMessage);
      this.handleOnClear();
    });
  }

  getControlValue(control: any, key:string):any{
    let g = control as FormGroup;
    return g.controls[key].value;
  }

  showDate(date:any){
    console.log(date);
  }

  getStep(control: any):number{
    let value = this.getControlValue(control,'allowDecimalQuantity');
    //console.log(value);
    if (value.toString() == "true"){
      return 0.01;
    }
    return 1;
  }

  onRemoveBtnClick(control: any){
    let productId = this.getControlValue(control, "productId");
    let shoppingListId = Number(this.filterService.getFilterValue(this.filterModel.filters, "shoppingListId"));
      this.productsApiService.removeProductFromList(productId, shoppingListId).subscribe(
        {
          next: p => {
            var query = this.generateSearchQuery();
            this.loadProducts(query);
          }
        }
      );
  }
}
