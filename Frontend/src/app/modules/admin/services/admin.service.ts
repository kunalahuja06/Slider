import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { Content, UpdateContent } from 'src/app/core/models/Content';
import { FilterOptions } from 'src/app/core/models/Filter';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private readonly httpClient: HttpClient) {}

  upload(formData: FormData): Observable<ApiResponse<boolean>> {
    return this.httpClient.post<ApiResponse<boolean>>(
      `${environment.adminApiUrl}/upload`,
      formData
    );
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.httpClient.delete<ApiResponse<boolean>>(
      `${environment.adminApiUrl}/delete?id=${id}`
    );
  }

  getContentById(id: string): Observable<ApiResponse<Content>> {
    return this.httpClient.get<ApiResponse<Content>>(
      `${environment.adminApiUrl}/content?id=${id}`
    );
  }

  getAll(): Observable<ApiResponse<Content[]>> {
    return this.httpClient.get<ApiResponse<Content[]>>(
      `${environment.adminApiUrl}/contents`
    );
  }

  update(content: UpdateContent): Observable<ApiResponse<boolean>> {
    return this.httpClient.put<ApiResponse<boolean>>(
      `${environment.adminApiUrl}/update`,
      content
    );
  }

  getContentByCategory(category: string): Observable<ApiResponse<Content[]>> {
    return this.httpClient.get<ApiResponse<Content[]>>(
      `${environment.adminApiUrl}/contents/category?category=${category}`
    );
  }

  getFilteredContent(filterOptions: FilterOptions): Observable<ApiResponse<Content[]>> {
    return this.httpClient.post<ApiResponse<Content[]>>(
      `${environment.adminApiUrl}/contents/filtered`,
      filterOptions
    );
  }
}
