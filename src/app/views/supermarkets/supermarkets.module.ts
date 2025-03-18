import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupermarketsRoutingModule } from './supermarkets-routing.module';
import { SupermarketListComponent } from './supermarket-list/supermarket-list.component';
import { SupermarketSetComponent } from './supermarket-set/supermarket-set.component';
import { SupermarketMergeComponent } from './supermarket-merge/supermarket-merge.component';
import { CboFilterSelectorModule } from '../cbo-filter-selector/cbo-filter-selector.module';
import { SupermarketEditComponent } from './supermarket-list/supermarket-edit/supermarket-edit.component';


@NgModule({
  declarations: [
    SupermarketListComponent,
    SupermarketSetComponent,
    SupermarketMergeComponent,
    SupermarketEditComponent
  ],
  imports: [
    CommonModule,
    SupermarketsRoutingModule,
    CboFilterSelectorModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SupermarketsModule { }
