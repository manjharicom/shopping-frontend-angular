import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { AreasComponent } from './areas/areas.component';
import { ProductsEditComponent } from './products/products-edit/products-edit.component';
import { AreasEditComponent } from './areas/areas-edit/areas-edit.component';
import { CategoriesEditComponent } from './categories/categories-edit/categories-edit.component';
import { UomsComponent } from './uoms/uoms.component';
import { UomsEditComponent } from './uoms/uoms-edit/uoms-edit.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Items'
    },
    children :[
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: {
          title: 'Categories',
        },
      },
      {
        path: 'categories/new',
        component: CategoriesEditComponent,
        data: {
          title: 'Categories',
        },
      },
      {
        path: 'categories/edit/:id',
        component: CategoriesEditComponent,
        data: {
          title: 'Categories',
        },
      },
      {
        path: 'areas',
        component: AreasComponent,
        data: {
          title: 'Areas',
        },
      },
      {
        path: 'areas/new',
        component: AreasEditComponent,
        data: {
          title: 'Areas',
        },
      },
      {
        path: 'areas/edit/:id',
        component: AreasEditComponent,
        data: {
          title: 'Areas',
        },
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          title: 'Products',
        },
      },
      {
        path: 'products/new',
        component: ProductsEditComponent,
        data: {
          title: 'Products',
        },
      },
      {
        path: 'products/edit/:id',
        component: ProductsEditComponent,
        data: {
          title: 'Products',
        },
      },
      {
        path: 'uoms',
        component: UomsComponent,
        data: {
          title: 'Uoms',
        },
      },
      {
        path: 'uoms/new',
        component: UomsEditComponent,
        data: {
          title: 'Uoms',
        },
      },
      {
        path: 'uoms/edit/:id',
        component: UomsEditComponent,
        data: {
          title: 'Uoms',
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
