import { Component, EventEmitter, OnInit, TemplateRef, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';  
import {
  ApiCallState,
  CboFilterModel,
  FilterPageType,
} from '../../../views/cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../../views/cbo-filter-selector/filter.service';
import { RecipeApiService } from '../../services/recipe-api.service';
import { MenuApiService } from '../../services/menu-api.service';
import { RecipeModel } from '../../models/recipe.model';

@Component({
  selector: 'app-add-recipe-menu-modal',
  templateUrl: './add-recipe-menu-modal.component.html',
  styleUrls: ['./add-recipe-menu-modal.component.scss']
})
export class AddRecipeMenuModalComponent implements OnInit {
  constructor(
    public modalRef: BsModalRef
    , private filterService: FilterService
    , private recipeApiService: RecipeApiService
    , private menuApiService: MenuApiService){}

  @Input('menuId') menuId!: number;
  @Input('name') name!: string;
  @Output() added = new EventEmitter<any>();

  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  recipes: RecipeModel[] = [];

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
          label: "Recipe",
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
    this.recipeApiService.search(query).subscribe(s => {
      this.recipes = s;
    });
  }

  submit(recipeId: number){
    if (this.menuId && this.menuId > 0){
      this.menuApiService.addRecipe(this.menuId, recipeId).subscribe(p => {
        this.added.emit(recipeId);
        this.modalRef.hide();
      });
    }
  }

}
