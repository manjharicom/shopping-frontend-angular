import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { ProductModel } from '../models/product.model';
import { NewProductModel } from '../models/new-product.model';
import { NewProductResponseModel } from '../models/new-product-response.model';
import { EditProductModel } from '../models/edit-product.model';
import { FullProductModel } from '../models/full-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsapiService {

  constructor(private httpClient: HttpClient) { }
  private baseProductUrl: string = baseApiUrl + "Product/";
  
  getShoppingListProducts(query?: string): Observable<ProductModel[]>{
    let url = this.baseProductUrl + 'ShoppingList'
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<ProductModel[]>(url);
  }

  removeProductFromList(productId: number, shoppingListId?: number): Observable<any>{
      const url = this.baseProductUrl + 'Delete/'+shoppingListId+'/'+productId;
      return this.httpClient.delete(url);
  }

  addProductToList(shoppingListId:number, productId: number, quantity: number, purchased?: boolean): Observable<any>{
    console.log(purchased);
    let p = purchased == undefined || purchased == null ? 'false' : purchased;
    const url = this.baseProductUrl + 'Add/'+shoppingListId+'/'+productId+'/'+quantity+'/'+p;
    return this.httpClient.post(url,null);
  }

  updateProductQuantity(productId: number, quantity: number, shoppingListId?: number){
    const url = this.baseProductUrl + 'Update/'+shoppingListId+'/'+productId+'/'+quantity;
    return this.httpClient.put(url,null);
   
  }

  addProduct(product: NewProductModel): Observable<NewProductResponseModel>{
    const url = this.baseProductUrl + 'Add';
    return this.httpClient.post<NewProductResponseModel>(url,product);
  }

  updateProduct(product: EditProductModel): Observable<NewProductResponseModel>{
    const url = this.baseProductUrl + 'Update';
    return this.httpClient.put<NewProductResponseModel>(url,product);
  }

  search(query?: string): Observable<ProductModel[]>{
    let url = this.baseProductUrl + 'Search'
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<ProductModel[]>(url);
  }

  getProducts(orderBy: number, query?: string): Observable<FullProductModel[]>{
    let url = this.baseProductUrl + 'GetProducts';
    if (query !== undefined && query != ''){
      url += query + '&orderBy='+orderBy;
    }
    else{
      url += '?orderBy='+orderBy;
    }
   return this.httpClient.get<FullProductModel[]>(url);
  }

  getProduct(productId: number): Observable<FullProductModel>{
    let url = this.baseProductUrl + 'GetProduct?productId='+productId;
    return this.httpClient.get<FullProductModel>(url);
  }
}
