import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { TrelloApiService } from '../../shared/services/trello-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TrelloBoardModel } from 'src/app/shared/models/trello-board.model';
import { TrelloCardModel } from 'src/app/shared/models/trello-card.model';
import { TrelloListModel } from 'src/app/shared/models/trello-list.model';
import { TrelloChecklistModel } from 'src/app/shared/models/trello-checklist.model';
import { TrelloChecklistUpdateModel } from 'src/app/shared/models/trello-checklist-update.model';
import { TrelloChecklistCreateModel } from 'src/app/shared/models/trello-checklist-create.model';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent {
  form!: FormGroup;
  trelloboards!: TrelloBoardModel[];
  trelloLists!: TrelloListModel[];
  trelloCards!: TrelloCardModel[];
  trelloCheckLists!: TrelloChecklistModel[];
  isLoading: boolean = false;
  mode:string = "edit";


  constructor(
    private apiService: TrelloApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}


  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      card: new FormControl({value: 'card', diabled: this.isLoading}, [Validators.required]),
      checklist: new FormControl({value: 'checklist', diabled: this.isLoading}, [Validators.required]),
    });
    this.loadBoards();
  } 
  
  get name(){
    return this.form.get('name');
  }

  set name(value: any){
    this.form.get('name')?.setValue(value);
  }

  get card(){
    return this.form.get('card');
  }

  get checklist(){
    return this.form.get('checklist');
  }

  private loadBoards(){
    this.isLoading = true;
    this.apiService.getBoards().subscribe(b => {
      this.trelloboards = b;
      this.isLoading = false;
    });
  }

  loadLists(boardId: string){
    if(boardId){
      this.isLoading = true;
      this.apiService.getLists(boardId).subscribe(b => {
        this.trelloLists = b;
        this.isLoading = false;
      });
      }
  }

  loadCards(listId: string){
    if(listId){
      this.isLoading = true;
      this.apiService.getCards(listId).subscribe(b => {
        this.trelloCards = b;
        this.isLoading = false;
      });
      }
  }

  loadChecklLists(cardId: string){
    if (cardId){
      this.isLoading = true;
      this.apiService.getCardCheckLists(cardId).subscribe(b => {
        this.trelloCheckLists = b;
        this.isLoading = false;
      });
      }
  }

  onChangeBoard(event: any){
    this.trelloLists = [];
    this.trelloCards = [];
    this.trelloCheckLists = [];
    let boardId: string = event.target.value;
    this.loadLists(boardId);
  }

  onChangeList(event: any){
    this.trelloCards = [];
    this.trelloCheckLists = [];
    let listId: string = event.target.value;
    this.loadCards(listId);
  }

  onChangeCard(event: any){
    this.trelloCheckLists = [];
    let cardId: string = event.target.value;
    this.loadChecklLists(cardId);
  }

  onChangeCheckList(event: any): void{
    let checkListId = event.target.value;
    var checkList = this.trelloCheckLists.find(c => c.id === checkListId);
    //console.log(checkList);
    this.name = checkList?.name;
  }

  disable(){
    this.card?.disable();
  }

  submit(){
    if (this.mode == "edit"){
      const model: TrelloChecklistUpdateModel = { 
        name: this.name?.value 
      };
      //console.log(model);
      let checkListId = this.checklist?.value;
      //console.log(checkListId);
      this.apiService.updateCheckList(checkListId, model).subscribe(() => {
        this.showToastrMessage("Checklist Updated!");
        this.name = '';
        this.loadChecklLists(this.card?.value);
      });
    }
    else{
      const model: TrelloChecklistCreateModel = {
        idCard: this.card?.value,
        name: this.name?.value 
      }
      console.log(model);
      this.apiService.createCheckList(model).subscribe(() => {
        this.showToastrMessage("Checklist Created!");
      });
    }
  }

  showToastrMessage(message: string){
      this.toastr.success(message);
  }

  add(){
    if (this.mode === "add"){
      this.mode = "edit";
      let checkListId = this.checklist?.value;
      if(checkListId){
        var checkList = this.trelloCheckLists.find(c => c.id === checkListId);
        this.name = checkList?.name;
      }
    }
    else{
      this.mode = "add";
      this.name = '';
    }
  }
}
