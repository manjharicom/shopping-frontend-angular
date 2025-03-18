import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { SuperMarketModel } from '../models/super-market.model';
import { NewItemModel } from '../models/new-item.model';
import { EditItemModel } from '../models/edit-item.model';
import { CategorySupermarketModel } from '../models/category-supermarket.model';
import { MergeCategorySupermarketModel } from '../models/merge-category-supermarket.model';
import { NewProductResponseModel } from '../models/new-product-response.model';

@Injectable({
  providedIn: 'root'
})
export class SupermarketApiService {
  constructor(private httpClient: HttpClient) { }
  private baseSuperMarketUrl: string = baseApiUrl + "SuperMarket/";

  getSuperMarkets(query?: string): Observable<SuperMarketModel[]>{
    let url = this.baseSuperMarketUrl;
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<SuperMarketModel[]>(url);
  }
  
  getSuperMarket(superMarketId: number): Observable<SuperMarketModel>{
    let url = this.baseSuperMarketUrl + superMarketId;
    return this.httpClient.get<SuperMarketModel>(url);
  }

  getCategorySuperMarkets(query: string): Observable<CategorySupermarketModel[]>{
    let url = this.baseSuperMarketUrl + 'cat/' + query;
    return this.httpClient.get<CategorySupermarketModel[]>(url);
  }

  setSuperMarket(superMarketId: number): Observable<any>{
    let url = this.baseSuperMarketUrl + superMarketId;
    return this.httpClient.post(url,null);
  }

  addSuperMarket(superMarket: NewItemModel): Observable<NewProductResponseModel>{
    const url = this.baseSuperMarketUrl;
    return this.httpClient.post<NewProductResponseModel>(url,superMarket);
  }

  updateSuperMarket(superMarket: EditItemModel): Observable<NewProductResponseModel>{
    const url = this.baseSuperMarketUrl;
    return this.httpClient.put<NewProductResponseModel>(url,superMarket);
  }

  deleteSuperMarket(superMarketId: number) : Observable<any>{
    let url = this.baseSuperMarketUrl + superMarketId;
    return this.httpClient.delete(url);
  }

  mergeCategorySuperMarkets(superMarketId: number, categorySuperMarket: MergeCategorySupermarketModel[]): Observable<NewProductResponseModel>{
    let url = this.baseSuperMarketUrl + superMarketId;
    return this.httpClient.put<NewProductResponseModel>(url, categorySuperMarket);
  }
}
