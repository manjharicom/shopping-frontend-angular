import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { TrelloBoardModel } from '../models/trello-board.model';
import { TrelloChecklistModel } from '../models/trello-checklist.model';
import { TrelloListModel } from '../models/trello-list.model';
import { TrelloCardModel } from '../models/trello-card.model';
import { TrelloChecklistCreateModel } from '../models/trello-checklist-create.model';
import { TrelloChecklistUpdateModel } from '../models/trello-checklist-update.model';

@Injectable({
  providedIn: 'root'
})
export class TrelloApiService {
  constructor(private httpClient: HttpClient) { }

  private baseTrelloUrl: string = baseApiUrl + "Trello/";
  trello(shoppingListId: number): Observable<any>{
    const url = this.baseTrelloUrl + 'CreateCheckListItems/' + shoppingListId + '/true';
    return this.httpClient.post(url,null);
  }

  getBoards(): Observable<TrelloBoardModel[]>{
    const url = this.baseTrelloUrl + 'GetBoards/';

    return this.httpClient.get<TrelloBoardModel[]>(url);
  }

  getLists(boardId: string) : Observable<TrelloListModel[]>{
    const url = this.baseTrelloUrl + 'GetLists?boardId=' + boardId;
    return this.httpClient.get<TrelloListModel[]>(url);
  }

  getCards(listId: string): Observable<TrelloCardModel[]>{
    const url = this.baseTrelloUrl + 'GetCards?listId=' + listId;
    return this.httpClient.get<TrelloCardModel[]>(url);
  }

  getBoardCheckLists(boardId: string): Observable<TrelloChecklistModel[]>{
    const url = this.baseTrelloUrl + 'GetBoardChecklists?boardId=' + boardId;

    return this.httpClient.get<TrelloChecklistModel[]>(url);
  }

  getCardCheckLists(cardId: string): Observable<TrelloChecklistModel[]>{
    const url = this.baseTrelloUrl + 'GetCardChecklists?cardId=' + cardId;

    return this.httpClient.get<TrelloChecklistModel[]>(url);
  }

  createCheckList(model: TrelloChecklistCreateModel): Observable<any>{
    const url = this.baseTrelloUrl + 'CreateCheckList';

    return this.httpClient.post(url,model);
  }

  updateCheckList(checkListId: string, model: TrelloChecklistUpdateModel): Observable<any>{
    const url = this.baseTrelloUrl  + checkListId;
    return this.httpClient.put(url,model);
  }
}
