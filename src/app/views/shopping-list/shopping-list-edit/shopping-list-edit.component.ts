import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { ShoppinglistApiService } from '../../../shared/services/shoppinglist-api.service';
import { TrelloApiService } from '../../../shared/services/trello-api.service';
import { SupermarketApiService } from '../../../shared/services/supermarket-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TrelloBoardModel } from 'src/app/shared/models/trello-board.model';
import { TrelloChecklistModel } from 'src/app/shared/models/trello-checklist.model';
import { CreateShoppingListModel } from 'src/app/shared/models/create-shoppinglist.model';
import { SuperMarketModel } from 'src/app/shared/models/super-market.model';
import { EditShoppinglistModel } from 'src/app/shared/models/edit-shoppinglist.model';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit {
  shoppingListForm!: FormGroup;
  routeParamsSub!: Subscription;
  mode!: string;
  shoppingListId!:number;
  trelloboards!: TrelloBoardModel[];
  checklLists:TrelloChecklistModel[] | undefined;
  superMarkets!: SuperMarketModel[];

  constructor(
    private apiService: ShoppinglistApiService,
    private trelloApiService: TrelloApiService,
    private superMarketApiService: SupermarketApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.shoppingListForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      superMarket: new FormControl('', [Validators.required]),
      board: new FormControl('', [Validators.required]),
      checklist: new FormControl('', [Validators.required]),
    });
    this.loadShoppingList();
  }
  
  get name(){
    return this.shoppingListForm.get('name');
  }

  get superMarket(){
    return this.shoppingListForm.get('superMarket');
  }

  get board(){
    return this.shoppingListForm.get('board');
  }

  get checklist(){
    return this.shoppingListForm.get('checklist');
  }

  private loadShoppingList(){
    const sups = this.superMarketApiService.getSuperMarkets();
    const boards = this.trelloApiService.getBoards();
    forkJoin([sups, boards]).subscribe(d => {
      this.superMarkets = d[0];
      this.trelloboards = d[1];
      this.routeParamsSub = this.route.params.subscribe(r => {
        var id = r['id'];
        if (id == undefined){
          this.mode='new';
        }
        else{
          this.mode='edit';
          this.shoppingListId = JSON.parse(id);
          this.apiService.getShoppingList(id).subscribe(c => {
            let boardId = c.boardId;
            this.trelloApiService.getBoardCheckLists(boardId).subscribe(b => {
              this.checklLists = b;
              this.shoppingListForm.patchValue({
                name: c.name,
                superMarket: c.superMarketId,
                checklist: c.checkListId,
                board: boardId
              });
              });
          });
        }
      });
      });
  }

  loadChecklList(boardId: string){
    this.trelloApiService.getBoardCheckLists(boardId).subscribe(b => {
      this.checklLists = b;
    });
  }

  onChange(event: any){
    let boardId: string = event.target.value;
    this.loadChecklList(boardId);
  }

  submit(){
    if(this.mode == "new"){
      const newList: CreateShoppingListModel={
        superMarketId: Number(this.superMarket?.value),
        name: this.name?.value,
        checkListId: this.checklist?.value,
        boardId: this.board?.value
      };
      this.apiService.addShoppingList(newList).subscribe(d => {
        this.showToastrMessage(d.responseCode, d.responseMessage);
      });
    }else{
      const editList:EditShoppinglistModel={
        shoppingListId: this.shoppingListId,
        name: this.name?.value,
        checkListId: this.checklist?.value,
        boardId: this.board?.value
      };
      this.apiService.updateShoppingList(editList).subscribe(d => {
        this.showToastrMessage(d.responseCode, d.responseMessage);
      });
    }
  }

  showToastrMessage(code: number, message: string){
    if (code < 0){
      this.toastr.error(message);
    }
    else{
      this.toastr.success(message);
    }
  }
}
