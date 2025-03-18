import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private httpClient: HttpClient) { }

  private baseReconcileUrl: string = baseApiUrl + "ListReconciliation/";

  //reconcile
  reconcile(shoppingListId: number): Observable<any>{
    let url = this.baseReconcileUrl + shoppingListId;
    return this.httpClient.post(url,null);
  }
}
