import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApiUrl } from './constants'

@Injectable({
  providedIn: 'root'
})
export class MenuPlannerApiService {

  constructor(private httpClient: HttpClient) { }
  private baseUrl: string = baseApiUrl + "MenuPlanner/";
}
