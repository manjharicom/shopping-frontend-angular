import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { ShoppingListModel } from '../models/shopping-list.model';
import { NewProductResponseModel } from '../models/new-product-response.model';
import { CreateShoppingListModel } from '../models/create-shoppinglist.model';
import { EditShoppinglistModel } from '../models/edit-shoppinglist.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppinglistApiService {
  constructor(private httpClient: HttpClient) { }
  private baseShoppingListUrl: string = baseApiUrl + "ShoppingList/";

  getShoppingList(shoppingListId: number): Observable<ShoppingListModel>{
    let url = this.baseShoppingListUrl + shoppingListId;
    return this.httpClient.get<ShoppingListModel>(url);
  }

  getShoppingLists(query?: string): Observable<ShoppingListModel[]>{
    let url = this.baseShoppingListUrl;
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<ShoppingListModel[]>(url);
  }

  addShoppingList(shoppingList: CreateShoppingListModel): Observable<NewProductResponseModel>{
    const url = this.baseShoppingListUrl;
    return this.httpClient.post<NewProductResponseModel>(url,shoppingList);
  }

  updateShoppingList(shoppingList: EditShoppinglistModel): Observable<NewProductResponseModel>{
    const url = this.baseShoppingListUrl;
    return this.httpClient.put<NewProductResponseModel>(url,shoppingList);
  }

  deleteShoppingListItems(shoppingListId: number, query?: string): Observable<any>{
    let url = this.baseShoppingListUrl + 'products/' + shoppingListId;
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.delete(url);
  }
}
