import { Component, OnInit } from '@angular/core';
import { MenuApiService } from '../../../../shared/services/menu-api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeProductModel } from 'src/app/shared/models/recipe-product.model';
import { RecipeModel } from 'src/app/shared/models/recipe.model';
import { IngredientModel } from 'src/app/shared/models/ingredient.model';

@Component({
  selector: 'app-menus-view',
  templateUrl: './menus-view.component.html',
  styleUrls: ['./menus-view.component.scss']
})
export class MenusViewComponent implements OnInit {
  constructor(private apiService: MenuApiService,
    private route: ActivatedRoute,
    public router: Router){}
  routeParamsSub!: Subscription;
  menuId?:number;
  menuName?:string;
  products:RecipeProductModel[] = [];
  recipes: RecipeModel[] = [];
  ingredients: IngredientModel[] = [];

  ngOnInit(): void {
    this.loadMenu();
  }
 
  private loadMenu(){
    this.routeParamsSub = this.route.params.subscribe(r => {
      var id = r['id'];
      if (id != undefined){
        this.menuId = JSON.parse(id);
        this.apiService.get(id).subscribe(r => {
          this.menuName = r.name;
          if (r.products){
            r.products?.forEach(p => {
              this.products.push(p);
            })
          }
          if (r.recipes){
            r.recipes.forEach(p => {
              this.recipes.push(p);
            });
          }
          if (r.ingredients){
            r.ingredients.forEach(p => {
              this.ingredients.push(p);
            })
          }
        });
      }

    });
  }


}
