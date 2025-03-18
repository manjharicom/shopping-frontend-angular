import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { MenuModel } from '../models/menu.model';
import { AddRecipeModel } from '../models/add-recipe.model';
import { NewProductResponseModel } from '../models/new-product-response.model';
import { UpdateMenuModel } from '../models/update-menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuApiService {

  constructor(private httpClient: HttpClient) { }
  private baseUrl: string = baseApiUrl + "Menu/";

  list(query?: string): Observable<MenuModel[]>{
    let url = this.baseUrl;
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<MenuModel[]>(url);
  }

  get(menuId: number): Observable<MenuModel>{
    let url = this.baseUrl + menuId;
    return this.httpClient.get<MenuModel>(url);
  }

  add(menu: AddRecipeModel): Observable<NewProductResponseModel>{
    return this.httpClient.post<NewProductResponseModel>(this.baseUrl,menu);
  }

  addProduct(menuId: number, productId: number, measurement: string): Observable<NewProductResponseModel>{
    let url = this.baseUrl + menuId;
    let postObj = {
      ProductId: productId,
      measurement:measurement
    }
    return this.httpClient.post<NewProductResponseModel>(url,postObj);
  }

  addRecipe(menuId: number, recipeId: number): Observable<NewProductResponseModel>{
    let url = this.baseUrl + menuId + '/' + recipeId;
    return this.httpClient.post<NewProductResponseModel>(url, null);
  }

  update(recipe: UpdateMenuModel): Observable<NewProductResponseModel>{
    return this.httpClient.put<NewProductResponseModel>(this.baseUrl,recipe);
  }

  deleteProduct(menuId?: number, productId?: number): Observable<NewProductResponseModel>{
    let url = this.baseUrl + 'deleteproduct/' + menuId + '/' + productId;
    return this.httpClient.delete<NewProductResponseModel>(url);
  }

  deleteRecipe(menuId?: number, recipeId?: number): Observable<NewProductResponseModel>{
    let url = this.baseUrl + 'deleterecipe/' + menuId + '/' + recipeId;
    return this.httpClient.delete<NewProductResponseModel>(url);
  }
}
