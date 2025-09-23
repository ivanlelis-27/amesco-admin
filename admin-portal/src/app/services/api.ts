import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://localhost:5006/api';

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get(`${this.baseUrl}/members`);
  }

  getMemberCount() {
    return this.http.get<{ count: number }>(`${this.baseUrl}/users/count`);
  }

  getVoucherCount() {
    return this.http.get<{ count: number }>(`${this.baseUrl}/vouchers/count`);
  }

  getVoucherCountDetails() {
    return this.http.get<{ count: number, used: number, unused: number }>(`${this.baseUrl}/vouchers/count-details`);
  }

  getPointsRedeemersCount() {
    return this.http.get<{ pointsRedeemers: number }>(`${this.baseUrl}/vouchers/points-redeemers-count`);
  }

  getMemberById(id: string) {
    return this.http.get(`${this.baseUrl}/members/${id}`);
  }
}