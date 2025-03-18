import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { UomModel } from '../models/uom.model';
import { NewItemModel } from '../models/new-item.model';
import { EditItemModel } from '../models/edit-item.model';
import { NewProductResponseModel } from '../models/new-product-response.model';
import { NewUomModel } from '../models/new-uom.model';
import { EditUomModel } from '../models/edit-uom.model';

@Injectable({
  providedIn: 'root'
})
export class UomsapiService {

  constructor(private httpClient: HttpClient) { }
  private baseUomUrl: string = baseApiUrl + "Uom/";

  addUom(postObj: NewUomModel): Observable<NewProductResponseModel>{
    const url = this.baseUomUrl;
    return this.httpClient.post<NewProductResponseModel>(url,postObj);
  }

  updateUom(putObj: EditUomModel): Observable<NewProductResponseModel>{
    const url = this.baseUomUrl;
    return this.httpClient.put<NewProductResponseModel>(url,putObj);
  }

  getUoms(query?: string): Observable<UomModel[]>{
    let url = this.baseUomUrl;
    if (query !== undefined){
      url += query;
    }
    return this.httpClient.get<UomModel[]>(url);
  }

  getUom(uom: number): Observable<UomModel>{
    let url = this.baseUomUrl + uom;
    return this.httpClient.get<UomModel>(url);
  }
}
