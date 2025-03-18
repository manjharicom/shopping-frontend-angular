import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { RecipeModel } from '../models/recipe.model';
import { NewProductResponseModel } from '../models/new-product-response.model';
import { AddRecipeModel } from '../models/add-recipe.model';
import { UpdateRecipeModel } from '../models/update-recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {

  constructor(private httpClient: HttpClient) { }
  private baseUrl: string = baseApiUrl + "Recipe/";

  list(query?: string): Observable<RecipeModel[]>{
    let url = this.baseUrl;
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<RecipeModel[]>(url);
  }

  get(recipeId: number): Observable<RecipeModel>{
    let url = this.baseUrl + recipeId;
    return this.httpClient.get<RecipeModel>(url);
  }

  add(recipe: AddRecipeModel): Observable<NewProductResponseModel>{
    return this.httpClient.post<NewProductResponseModel>(this.baseUrl,recipe);
  }

  update(recipe: UpdateRecipeModel): Observable<NewProductResponseModel>{
    return this.httpClient.put<NewProductResponseModel>(this.baseUrl,recipe);
  }

  addProduct(recipeId: number, productId: number, measurement: string): Observable<NewProductResponseModel>{
    let url = this.baseUrl + recipeId;
    let postObj = {
      ProductId: productId,
      measurement:measurement
    }
    return this.httpClient.post<NewProductResponseModel>(url,postObj);
  }

  delete(recipeId?: number, productId?: number): Observable<NewProductResponseModel>{
    let url = this.baseUrl + recipeId + '/' + productId;
    return this.httpClient.delete<NewProductResponseModel>(url);
  }

  search(query?: string): Observable<RecipeModel[]>{
    let url = this.baseUrl + 'search/';
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<RecipeModel[]>(url);
  }
}
