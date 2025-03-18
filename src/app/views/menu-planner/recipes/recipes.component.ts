import { Component, OnInit } from '@angular/core';
import { RecipeApiService } from '../../../shared/services/recipe-api.service';
import { RecipeModel } from 'src/app/shared/models/recipe.model';
import { Router } from '@angular/router';
import {
  ApiCallState,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { ListItem } from '../../../containers/list-container/list-types/list-item';
import { FilterService } from '../../cbo-filter-selector/filter.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  constructor(private apiService: RecipeApiService
    , private router: Router
    , private filterService: FilterService){}
  recipes: RecipeModel[] = [];
  listItems: ListItem[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadFilters();
    this.saveInitialFilters();
    this.loadRecipes();
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

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }

  private loadRecipes(query?: string){
    this.apiService.list(query).subscribe(l => {
      this.recipes = l;
    });
  }

  handleAdd(){
    this.router.navigate(['menu-planner/recipes/new']);
  }
 
  handleEdit(recipe:any){
    this.router.navigate(['menu-planner/recipes/edit/'+recipe.recipeId]);
  }

  handle(recipe:any){
    this.router.navigate(['menu-planner/recipes/edit/'+recipe.recipeId]);
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
    this.loadRecipes(query);
    this.isLoading = false;
  };
}
