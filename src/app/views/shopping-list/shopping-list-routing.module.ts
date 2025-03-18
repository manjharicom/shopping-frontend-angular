import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { ShoppingListComponent } from './list/shopping-list.component';
import { ShoppingListsComponent } from './shopping-lists/shopping-lists.component';
import { ShoppingListPricesComponent } from './shopping-list-prices/shopping-list-prices.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Shopping List',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ShoppingListsComponent,
        data: {
          title: 'Items',
        },
      },
      {
        path: 'items',
        component: ShoppingListComponent,
        data: {
          title: 'Items',
        },
      },
      {
        path: 'new',
        component: ShoppingListEditComponent,
        data: {
          title: 'Shopping List',
        },
      },
      {
        path: 'edit/:id',
        component: ShoppingListEditComponent,
        data: {
          title: 'Shopping List',
        },
      },
      {
        path: 'prices',
        component: ShoppingListPricesComponent,
        data: {
          title: 'Shopping List Prices',
        },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule { }
