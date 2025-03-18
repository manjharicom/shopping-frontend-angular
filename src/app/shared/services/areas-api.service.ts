import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { AreaModel } from '../models/area.model';
import { NewItemModel } from '../models/new-item.model';
import { EditItemModel } from '../models/edit-item.model';
import { NewProductResponseModel } from '../models/new-product-response.model';

@Injectable({
  providedIn: 'root'
})
export class AreasApiService {
  constructor(private httpClient: HttpClient) { }
  private baseAreaUrl: string = baseApiUrl + "Area/";

  getAreas(includeProds?: boolean, query?: string): Observable<AreaModel[]>{
    let url = this.baseAreaUrl;
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
    return this.httpClient.get<AreaModel[]>(url);
  }

  getArea(areaId: number): Observable<AreaModel>{
    let url = this.baseAreaUrl + areaId;
    return this.httpClient.get<AreaModel>(url);
  }

  addArea(area: NewItemModel): Observable<NewProductResponseModel>{
    const url = this.baseAreaUrl;
    return this.httpClient.post<NewProductResponseModel>(url,area);
  }

  updateArea(area: EditItemModel): Observable<NewProductResponseModel>{
    const url = this.baseAreaUrl;
    return this.httpClient.put<NewProductResponseModel>(url,area);
  }
}
