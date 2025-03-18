import { Component, EventEmitter, OnInit, TemplateRef, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';  
import { ProductsapiService } from '../../services/productsapi.service';
import {
  ApiCallState,
  CboFilterModel,
  FilterPageType,
} from '../../../views/cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../../views/cbo-filter-selector/filter.service';
import { ProductModel } from '../../models/product.model';
import { RecipeApiService } from '../../services/recipe-api.service';
import { MenuApiService } from '../../services/menu-api.service';

@Component({
  selector: 'app-add-product-recipe-modal',
  templateUrl: './add-product-recipe-modal.component.html',
  styleUrls: ['./add-product-recipe-modal.component.scss']
})
export class AddProductRecipeModalComponent implements OnInit {
  constructor(private productsApiService: ProductsapiService
    , public modalRef: BsModalRef
    , private filterService: FilterService
    , private recipeApiService: RecipeApiService
    , private menuApiService: MenuApiService){}

  @Input('recipeId') recipeId!: number;
  @Input('menuId') menuId!: number;
  @Input('name') name!: string;
  @Output() added = new EventEmitter<any>();

  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  products: ProductModel[] = [];
  measurement: string = '';

  ngOnInit() {
    this.loadFilters();
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
          name: 'searchText',
          type: FilterPageType.Text,
          value: ""
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
          name: 'Search',
          label: 'Search',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
        },
      ]
    };
  }

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }

  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each section
    localStorage.removeItem('categories');

    this.handleOnFilter();
  };

  handleOnFilter = () => {
    var query = this.generateSearchQuery();
    this.search(query);
  };

  search(query:string){
    this.productsApiService.search(query).subscribe(s => {
      this.products = s;
    });
  }

  submit(productId: number, measurement:string){
    if (this.recipeId && this.recipeId > 0){
      this.recipeApiService.addProduct(this.recipeId, productId, measurement).subscribe(p => {
        this.added.emit(productId);
        this.modalRef.hide();
      });
    } else if (this.menuId && this.menuId > 0){
      this.menuApiService.addProduct(this.menuId, productId, measurement).subscribe(p => {
        this.added.emit(productId);
        this.modalRef.hide();
      });
    }

  }
}
