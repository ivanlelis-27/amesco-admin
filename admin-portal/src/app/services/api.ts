import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://localhost:5006/api';

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get(`${this.baseUrl}/members`);
  }

  getMemberCount(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ count: number }>(
      `${this.baseUrl}/users/count`,
      params
    );
  }

  getVoucherCount() {
    return this.http.get<{ count: number }>(`${this.baseUrl}/vouchers/count`);
  }

  getVoucherCountDetails(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ count: number, used: number, unused: number }>(
      `${this.baseUrl}/vouchers/count-details`,
      params
    );
  }

  getPointsRedeemersCount(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ pointsRedeemers: number, memberCount: number }>(
      `${this.baseUrl}/vouchers/points-redeemers-count`,
      params
    );
  }

  getTopBranchesRanking(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      };
    }
    return this.http.get<any[]>(`${this.baseUrl}/branches/branches-rankings`, params);
  }

  getTop10Ranking() {
    return this.http.get<any[]>(`${this.baseUrl}/transactions/top-10-ranking`);
  }

  getTotalEarnedPoints() {
    return this.http.get<{ totalEarnedPoints: number }>(`${this.baseUrl}/transactions/total-earned-points`);
  }

  getEarnedPoints(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ earnedPoints: number }>(
      `${this.baseUrl}/transactions/earned-points`,
      params
    );
  }

  getRedeemedPoints(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ redeemedPoints: number }>(
      `${this.baseUrl}/vouchers/redeemed-points`,
      params
    );
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

  addBranch(branch: any) {
    return this.http.post(`${this.baseUrl}/branches`, branch);
  }

  updateBranch(id: number, branch: any) {
    return this.http.put(`${this.baseUrl}/branches/${id}`, branch);
  }

  deleteBranch(id: number) {
    return this.http.delete(`${this.baseUrl}/branches/${id}`);
  }

  getAllMembers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  getAccessUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/accesscontrol`);
  }

  generateMemberId() {
    return this.http.get<{ memberId: string }>(`${this.baseUrl}/auth/generate-memberid`);
  }

  registerMember(request: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, request);
  }
}

