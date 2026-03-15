import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cat, CreateCatPayload, UpdateCatPayload } from '../models/cat.model';
import { API_BASE_URL } from '../constants/api.constants';

interface ApiResponse<T> {
  status_code: number;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CatService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  getAll(): Observable<Cat[]> {
    return this.http.get<ApiResponse<Cat[]>>(`${this.baseUrl}/list`).pipe(
      map(res => res.data || [])
    );
  }

  getById(id: string): Observable<Cat> {
    return this.http.get<ApiResponse<Cat | Cat[]>>(`${this.baseUrl}/list?id=${id}`).pipe(
      map(res => Array.isArray(res.data) ? res.data[0] : res.data)
    );
  }

  create(payload: CreateCatPayload): Observable<Cat> {
    return this.http.post<ApiResponse<Cat>>(`${this.baseUrl}/create`, payload).pipe(
      map(res => res.data)
    );
  }

  update(id: string, payload: UpdateCatPayload): Observable<Cat> {
    return this.http.put<ApiResponse<Cat>>(`${this.baseUrl}/update?id=${id}`, payload).pipe(
      map(res => res.data)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete?id=${id}`);
  }
}
