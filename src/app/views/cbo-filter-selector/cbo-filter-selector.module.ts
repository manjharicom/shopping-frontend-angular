import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CboFilterSelectorComponent } from './cbo-filter-selector.component';

@NgModule({
  declarations: [
    CboFilterSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [CboFilterSelectorComponent],
})
export class CboFilterSelectorModule { }
