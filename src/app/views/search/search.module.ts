import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { CboFilterSelectorModule } from '../cbo-filter-selector/cbo-filter-selector.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    CboFilterSelectorModule,
    SharedModule
  ]
})
export class SearchModule { }
