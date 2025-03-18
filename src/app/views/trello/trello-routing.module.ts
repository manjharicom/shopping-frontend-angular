import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrelloComponent } from './trello.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Items'
    },
    children:[
      {
        path: '',
        redirectTo: 'trello',
        pathMatch: 'full',
      },
      {
        path: 'trello',
        component: TrelloComponent,
        data: {
          title: 'Trello',
        },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrelloRoutingModule { }
