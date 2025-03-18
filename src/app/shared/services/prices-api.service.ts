import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { NewProductResponseModel } from '../models/new-product-response.model';
import { AddPriceModel } from '../models/add-price.model';

@Injectable({
  providedIn: 'root'
})
export class PricesApiService {
  constructor(private httpClient: HttpClient) { }
  private baseUrl: string = baseApiUrl + "ShoppingListPrice/";

  add(postObj: AddPriceModel): Observable<NewProductResponseModel>{
    return this.httpClient.post<NewProductResponseModel>(this.baseUrl,postObj);
  }

}
