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

  getTop10Ranking() {
    return this.http.get<any[]>(`${this.baseUrl}/transactions/top-10-ranking`);
  }

  getTotalEarnedPoints() {
    return this.http.get<{ totalEarnedPoints: number }>(`${this.baseUrl}/transactions/total-earned-points`);
  }

  getLatestTransactions() {
    return this.http.get<any[]>(`${this.baseUrl}/vouchers/latest-transactions`);
  }

  getMemberById(id: string) {
    return this.http.get(`${this.baseUrl}/members/${id}`);
  }

  getBranches() {
    return this.http.get<any[]>(`${this.baseUrl}/branches`);
  }

  getNewMembersCountThisMonth() {
    return this.http.get<{ count: number }>(`${this.baseUrl}/users/new-members`);
  }
}