import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { CategoriesApiService } from '../../../shared/services/categories-api.service'
import { ProductsapiService } from '../../../shared/services/productsapi.service';
import { CategoryModel } from '../../../shared/models/category.model';
import { ListItem } from '../../../containers/list-container/list-types/list-item';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';

import { FilterService } from '../../cbo-filter-selector/filter.service'
import { ModalService } from '../../../shared/services/modal.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  constructor(
    private apiService: CategoriesApiService,
    private productsApiService: ProductsapiService,
    private filterService: FilterService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    protected modalService: ModalService,){}

  categoriesWithProducts: CategoryModel[] = [];
  listItems: ListItem[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  isFalse: boolean = false;
  categories: CboFilterListArray[] = [];

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadCategories();
  }

  private loadCategories(query?: string){
    this.apiService.getCategories(true, query).subscribe({
      next: categories => {
        this.categoriesWithProducts = categories;
        categories.forEach((cat) => {
          if (cat.hasProducts){
            this.listItems.push({
              Id: cat.categoryId,
              Name: cat.name,
              isSubItemExpanded: true,
              SubItems: cat.products
            })
          }
        });
      }
    });
  }

  private loadFilterOptions(){
    this.isLoading = true;
    this.apiService.getCategories(false).subscribe((data) => {
      data.forEach((cat) => {
        this.categories.push({
          Value: cat.categoryId,
          Name: cat.name,
          Selected: false,
          Id: cat.categoryId
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
      sorts: [],
      filters: [
        {
          label: 'Category',
          name: 'categoryIds',
          type: FilterPageType.SelectList,
          listArray: this.categories,
          value: "Select category"
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
          name: 'Filter',
          label: 'Filter',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
        },
      ]
    };
  }

  getStatusIndicator = (status: string) => {
    return "Active";
  };

  handleOnAddClick(prod:any) {
    //this.modalService.open('add-product-category', prod.productId, prod.name)
    this.toastr.success('Product Successfully Added to Shopping List');
    this.handleOnFilter();
  }

  handleOnRemoveClick(prod:any) {
    this.productsApiService.removeProductFromList(prod.productId, prod.shoppingListId).subscribe(
      {
        next: p => {
          this.listItems = [];
          var query = this.generateSearchQuery();
          this.loadCategories(query);
        }
      }
    );
  }

  handleEdit(cat:any){
    this.router.navigate(['items/categories/edit/'+cat.categoryId]);
  }
  
  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each section
    localStorage.removeItem('categories');

    this.handleOnFilter();
  };

  handleOnFilter = () => {
    this.isLoading = true;
    var query = this.generateSearchQuery();
    this.listItems = [];
    this.loadCategories(query);
    this.isLoading = false;
  };

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }
  
  handleAdd(){
    this.router.navigate(['items/categories/new']);
  }

  handleAdded(x:any){
    this.toastr.success('Product Successfully Added to Shopping List');
    this.handleOnFilter();
    this.modalService.close();

  }
}
