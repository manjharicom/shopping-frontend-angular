import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupermarketEditComponent } from './supermarket-list/supermarket-edit/supermarket-edit.component';
import { SupermarketListComponent } from './supermarket-list/supermarket-list.component';
import { SupermarketMergeComponent } from './supermarket-merge/supermarket-merge.component';
import { SupermarketSetComponent } from './supermarket-set/supermarket-set.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Items'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SupermarketListComponent,
        data: {
          title: 'List',
        },
      },
      {
        path: 'set',
        component: SupermarketSetComponent,
        data: {
          title: 'Set Super Market',
        },
      },
      {
        path: 'merge',
        component: SupermarketMergeComponent,
        data: {
          title: 'Merge Category/Super Market',
        },
      },
      {
        path: 'new',
        component: SupermarketEditComponent,
        data: {
          title: 'Shops',
        },
      },
      {
        path: 'edit/:id',
        component: SupermarketEditComponent,
        data: {
          title: 'Shops',
        },
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupermarketsRoutingModule { }
