import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Example GET
  getMembers() {
    return this.http.get(`${this.baseUrl}/members`);
  }

  // Example POST
  createAdBanner(data: any) {
    return this.http.post(`${this.baseUrl}/ad-banners`, data);
  }

  // Example with params
  getMemberById(id: string) {
    return this.http.get(`${this.baseUrl}/members/${id}`);
  }
}