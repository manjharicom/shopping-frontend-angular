import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';

import { MenuPlannerRoutingModule } from './menu-planner-routing.module';
import { RecipesComponent } from './recipes/recipes.component';
import { MenusComponent } from './menus/menus.component';
import { RecipesEditComponent } from './recipes/recipes-edit/recipes-edit.component';
import { CboFilterSelectorModule } from '../cbo-filter-selector/cbo-filter-selector.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MenusEditComponent } from './menus/menus-edit/menus-edit.component';
import { MenusViewComponent } from './menus/menus-view/menus-view.component';


@NgModule({
  declarations: [
    RecipesComponent,
    MenusComponent,
    RecipesEditComponent,
    MenusEditComponent,
    MenusViewComponent
  ],
  imports: [
    CommonModule,
    MenuPlannerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CboFilterSelectorModule,
    NgxEditorModule
  ],
  providers: [BsModalService]
})
export class MenuPlannerModule { }
