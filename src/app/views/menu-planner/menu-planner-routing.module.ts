import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipesEditComponent } from './recipes/recipes-edit/recipes-edit.component';
import { MenusComponent } from './menus/menus.component';
import { MenusEditComponent } from './menus/menus-edit/menus-edit.component';
import { MenusViewComponent } from './menus/menus-view/menus-view.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Menu Planner'
    },
    children: [
      {
        path: '',
        redirectTo: 'menus',
        pathMatch: 'full'
      },
      {
        path: 'menus/new',
        component: MenusEditComponent,
        data: {
          title: 'Menus',
        },
      },
      {
        path: 'menus/edit/:id',
        component: MenusEditComponent,
        data: {
          title: 'Menus',
        },
      },
      {
        path: 'menus/view/:id',
        component: MenusViewComponent,
        data: {
          title: 'Menus',
        },
      },
      {
        path: 'recipes',
        component: RecipesComponent,
        data: {
          title: 'Recipes',
        },
      },
      {
        path: 'recipes/new',
        component: RecipesEditComponent,
        data: {
          title: 'Recipes',
        },
      },
      {
        path: 'recipes/edit/:id',
        component: RecipesEditComponent,
        data: {
          title: 'Recipes',
        },
      },
      {
        path: 'menus',
        component: MenusComponent,
        data: {
          title: 'Menus',
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPlannerRoutingModule { }
