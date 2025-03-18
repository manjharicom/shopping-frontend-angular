import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingListModel } from 'src/app/shared/models/shopping-list.model';
import { ShoppinglistApiService } from '../../../shared/services/shoppinglist-api.service';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../cbo-filter-selector/filter.service'

@Component({
  selector: 'app-shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent implements OnInit {
  constructor(
    private apiService: ShoppinglistApiService,
    private router: Router,
    private filterService: FilterService,){}

  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  shoppingListFilters: CboFilterListArray[] = [];
  shoppingLists: ShoppingListModel[] = [];


  ngOnInit(): void{
    this.loadFilterOptions();
    this.loadShoppingLists();
  }

  private loadShoppingLists(query?: string){
    //console.log(query);
    this.apiService.getShoppingLists(query).subscribe(sups => {
        this.shoppingLists = sups;
    });
  }

  private loadFilterOptions(){
    this.isLoading = true;

    this.apiService.getShoppingLists().subscribe(d => {
      this.shoppingListFilters.push({
        Value: undefined,
        Name: 'All',
        Selected: true,
        Id: undefined
      });
      d.forEach((s) => {
        this.shoppingListFilters.push({
          Value: s.shoppingListId,
          Name: s.name,
          Selected: false,
          Id: s.shoppingListId
        });
      });
      
      //console.log(this.areas);
      this.loadFilters();
      this.saveInitialFilters();
      this.isLoading = false;
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
          label: "Shopping List",
          name: "shoppingListIds",
          type: FilterPageType.SelectList,
          listArray: this.shoppingListFilters,
          value: "Select Shop"
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
    }
  }
  
  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    //console.log(value);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each certificate type section
    localStorage.removeItem('products');

    this.handleOnFilter();
  };

  handleOnFilter = () => {
    this.isLoading = true;
    var query = this.generateSearchQuery();
    //console.log(query);
    this.loadShoppingLists(query);
    //console.log(query);
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
    this.router.navigate(['shopping-list/new/']);
  }
  
  handleEdit(prod:any){
    this.router.navigate(['shopping-list/edit/'+prod.shoppingListId]);
  }
}
