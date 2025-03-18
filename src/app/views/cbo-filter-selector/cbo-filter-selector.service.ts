import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CboFilterSelectorService {
  constructor(private httpClient: HttpClient) {}

  getData(url: any): Observable<string> {
    return this.httpClient.get(url).pipe(
      map((body: any) => body.value),
      catchError(() => of('Error, could not load list options'))
    );
  }
}
