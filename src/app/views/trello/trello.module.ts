import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrelloRoutingModule } from './trello-routing.module';
import { TrelloComponent } from './trello.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TrelloComponent
  ],
  imports: [
    CommonModule,
    TrelloRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class TrelloModule { }
