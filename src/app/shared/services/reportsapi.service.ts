import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'
import { ExportProductModel } from '../models/export-product.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsapiService {

  constructor(private httpClient: HttpClient) { }
  private baseReportUrl: string = baseApiUrl + "Report/";

  exportProducts(postObj?:ExportProductModel): Observable<any>{
    let url = this.baseReportUrl;
    return this.httpClient.post(url, postObj);
  }
}
