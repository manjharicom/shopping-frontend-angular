import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { AreaModel } from '../models/area.model';
import { NewItemModel } from '../models/new-item.model';
import { EditItemModel } from '../models/edit-item.model';
import { NewProductResponseModel } from '../models/new-product-response.model';
import { CategoryModel } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {
  constructor(private httpClient: HttpClient) { }
  private baseCategoryUrl: string = baseApiUrl + "Category/";

  getCategories(includeProds?: boolean, query?: string): Observable<CategoryModel[]>{
    let url = this.baseCategoryUrl;
    if (query !== undefined){
      url += query;
    }
    if(includeProds !== undefined){
      if (query !== undefined){
        url += '&includeProducts='+includeProds;
      }
      else{
        url += '?includeProducts='+includeProds;
      }
    }
    
    return this.httpClient.get<CategoryModel[]>(url);
  }

  getCategory(categoryId: number): Observable<CategoryModel>{
    let url = this.baseCategoryUrl + categoryId;
    return this.httpClient.get<CategoryModel>(url);
  }

  addCategory(category: NewItemModel): Observable<NewProductResponseModel>{
    const url = this.baseCategoryUrl;
    return this.httpClient.post<NewProductResponseModel>(url,category);
  }

  updateCategory(category: EditItemModel): Observable<NewProductResponseModel>{
    const url = this.baseCategoryUrl;
    return this.httpClient.put<NewProductResponseModel>(url,category);
  }

}
