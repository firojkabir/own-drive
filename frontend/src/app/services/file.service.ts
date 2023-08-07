import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  getFiles = (): Observable<string[]> => {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/files`)
      .pipe(map((res) => res.data));
  };
}
