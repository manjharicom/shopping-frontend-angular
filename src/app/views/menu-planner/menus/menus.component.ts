import { Component, OnInit } from '@angular/core';
import { MenuApiService } from '../../../shared/services/menu-api.service';
import { MenuModel } from 'src/app/shared/models/menu.model';
import { Router } from '@angular/router';
import {
  ApiCallState,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { ListItem } from '../../../containers/list-container/list-types/list-item';
import { FilterService } from '../../cbo-filter-selector/filter.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  constructor(private apiService: MenuApiService
    , private router: Router
    , private filterService: FilterService){}

  menus: MenuModel[] = [];
  listItems: ListItem[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  
  ngOnInit(): void {
    this.loadFilters();
    this.saveInitialFilters();
    this.loadMenus();
  }

  private loadFilters(){
    this.filterModel = {
      apiCallState: ApiCallState.New,
      apiData: [],
      columns: [],
      sorts: [],
      filters: [
        {
          label: "name",
          name: 'name',
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
          name: 'Filter',
          label: 'Filter',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
        },
      ]
    }
  }


  private loadMenus(query?: string){
    this.apiService.list(query).subscribe(l => {
      this.menus = l;
    });
  }

  handleAdd(){
    this.router.navigate(['menu-planner/menus/new']);
  }
 
  handleEdit(menu:any){
    this.router.navigate(['menu-planner/menus/edit/'+menu.menuId]);
  }

  handleView(menu:any){
    this.router.navigate(['menu-planner/menus/view/'+menu.menuId]);
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
    this.isLoading = true;
    var query = this.generateSearchQuery();
    this.listItems = [];
    this.loadMenus(query);
    this.isLoading = false;
  };

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }
}
