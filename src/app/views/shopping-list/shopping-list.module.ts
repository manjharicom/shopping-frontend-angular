import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingListComponent } from './list/shopping-list.component';
import { CboFilterSelectorModule } from '../cbo-filter-selector/cbo-filter-selector.module';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { ShoppingListsComponent } from './shopping-lists/shopping-lists.component';
import { ShoppingListPricesComponent } from './shopping-list-prices/shopping-list-prices.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
    ShoppingListsComponent,
    ShoppingListPricesComponent
  ],
  imports: [
    CommonModule,
    ShoppingListRoutingModule,
    CboFilterSelectorModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    BsDatepickerConfig
  ]
})
export class ShoppingListModule { }
