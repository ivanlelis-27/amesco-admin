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

  getAllTimeUsedVoucherCount() {
    return this.http.get<{ count: number }>(`${this.baseUrl}/vouchers/count-used`);
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

  getHighestRedeemedVoucherDate(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ date: string }>(`${this.baseUrl}/vouchers/highest-redeemed-date`, params);
  }

  getTop10Ranking(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      };
    }
    return this.http.get<any[]>(`${this.baseUrl}/transactions/top-10-ranking`, params);
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

  getTopRedeemer(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      };
    }
    return this.http.get<{ name: string, pointsRedeemed: number, profileImage: string }>(
      `${this.baseUrl}/vouchers/top-redeemer`,
      params
    );
  }

  getMostLikedNotification(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10)
        }
      };
    }
    return this.http.get<any>(`${this.baseUrl}/notifications/most-liked`, params);
  }

  getAllTransactions() {
    return this.http.get<any[]>(`${this.baseUrl}/transactions`);
  }

  getPromoGroups() {
    return this.http.get<any[]>(`${this.baseUrl}/promogroups`);
  }

  createAnnouncement(formData: FormData) {
    return this.http.post(`${this.baseUrl}/announcements/create`, formData);
  }

  getAllAnnouncements() {
    return this.http.get<any[]>(`${this.baseUrl}/announcements`);
  }

  editAnnouncementIndex(announcementId: number, sortIndex: number | null) {
    return this.http.put(
      `${this.baseUrl}/announcements/edit-index/${announcementId}`,
      sortIndex,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  deleteAnnouncement(id: number) {
    return this.http.delete(`${this.baseUrl}/announcements/${id}`);
  }

  uploadPromo(formData: FormData) {
    return this.http.post(`${this.baseUrl}/promos/upload`, formData);
  }

  deletePromo(promoId: number) {
    return this.http.delete(`${this.baseUrl}/promos/delete/${promoId}`);
  }

  getPromos() {
    return this.http.get<any[]>(`${this.baseUrl}/promos/list`);
  }

  getPromosWithGroup() {
    return this.http.get<any[]>(`${this.baseUrl}/promos/with-group`);
  }

  getHeadOffice() {
    return this.http.get<any>(`${this.baseUrl}/branches/head-office`);
  }

  updateHeadOffice(branch: any) {
    return this.http.put(`${this.baseUrl}/branches/head-office`, branch);
  }

  addAccessUser(request: any) {
    return this.http.post(`${this.baseUrl}/accesscontrol`, request);
  }

  createNotification(formData: FormData) {
    return this.http.post(`${this.baseUrl}/notifications/create`, formData);
  }

  getAllNotifications() {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/all`);
  }

  editScheduledNotification(notificationId: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/notifications/edit/${notificationId}`, formData);
  }

  deleteNotification(notificationId: number) {
    return this.http.delete(`${this.baseUrl}/notifications/delete/${notificationId}`);
  }

  getLatestTransactions(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      };
    }
    return this.http.get<any[]>(`${this.baseUrl}/vouchers/latest-transactions`, params);
  }

  getMemberById(id: string) {
    return this.http.get(`${this.baseUrl}/members/${id}`);
  }

  getBranches() {
    return this.http.get<any[]>(`${this.baseUrl}/branches`);
  }

  getNewMembersCount(startDate?: Date, endDate?: Date) {
    let params = {};
    if (startDate && endDate) {
      params = {
        params: {
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10)
        }
      };
    }
    return this.http.get<{ count: number }>(`${this.baseUrl}/users/new-members`, params);
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

