import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemsRoutingModule } from './items-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { AreasComponent } from './areas/areas.component';
import { ProductsComponent } from './products/products.component';
import { ListContainerComponent } from '../../containers/list-container/list-container.component'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CboFilterSelectorModule } from '../cbo-filter-selector/cbo-filter-selector.module';
import { ProductsEditComponent } from './products/products-edit/products-edit.component';
import { AreasEditComponent } from './areas/areas-edit/areas-edit.component';
import { CategoriesEditComponent } from './categories/categories-edit/categories-edit.component';
import { SharedModule } from '../../shared/shared.module';
import { UomsComponent } from './uoms/uoms.component';
import { UomsEditComponent } from './uoms/uoms-edit/uoms-edit.component';

@NgModule({
  declarations: [
    CategoriesComponent,
    ProductsComponent,
    ListContainerComponent,
    AreasComponent,
    ProductsEditComponent,
    AreasEditComponent,
    CategoriesEditComponent,
    UomsComponent,
    UomsEditComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    CboFilterSelectorModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot(),
  ]
})
export class ItemsModule { }
