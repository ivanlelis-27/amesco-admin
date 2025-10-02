import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  barTotalHeight: number = 130;
  barUsedHeight: number = 80;
  barUnusedHeight: number = 80;
  showCalendar = false;
  selectedDateAgo: string = '';
  dateAgo: Date = new Date();
  dateNow: Date = new Date();
  memberCount: number | null = null;
  voucherCount: number | null = null;
  voucherTotal: number = 0;
  voucherUsed: number = 0;
  voucherUnused: number = 0;
  barTotalFill: number = 0;
  barUsedFill: number = 0;
  barUnusedFill: number = 0;
  dateAgoMonthYear: string = '';
  dateNowMonthYear: string = '';
  voucherBreakdown: { total: number, used: number, unused: number } | null = null;
  pointsRedeemers: number | null = null;
  top10Ranking: any[] = [];
  totalEarnedPoints: number | null = null;
  latestTransactions: any[] = [];
  newMembersCount: number | null = null;
  pointsGiven: number | null = null;
  pointsRedeemed: number | null = null;
  highestRedemptionPercent: number = 0; // e.g. 0 for 0%
  highestRedemptionValue: number = 836.5; // e.g. 836.5
  highestRedemptionDay: string = 'Wednesday'; // e.g. 'Wednesday'
  topBranches: { branchId: number, branchName: string, pointsGiven: number }[] = [];

  calendarYear: number = new Date().getFullYear();
  calendarMonth: number = new Date().getMonth(); // 0-based
  calendarDays: number[] = [];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  yearOptions: number[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    this.dateNow = today;
    this.dateAgo = monthAgo;

    this.dateNowMonthYear = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.dateAgoMonthYear = monthAgo.toLocaleString('default', { month: 'long', year: 'numeric' });

    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    this.generateCalendarDays();

    this.api.getMemberCount().subscribe({
      next: (res) => {
        this.memberCount = res.count;
        this.cdr.markForCheck();
      },
      error: () => {
        this.memberCount = null;
        this.cdr.markForCheck();
      }
    });

    this.api.getTop10Ranking().subscribe({
      next: (res) => {
        this.top10Ranking = res;
        this.cdr.markForCheck();
      },
      error: () => {
        this.top10Ranking = [];
        this.cdr.markForCheck();
      }
    });

    this.api.getTotalEarnedPoints().subscribe({
      next: (res) => {
        this.totalEarnedPoints = res.totalEarnedPoints ?? null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.totalEarnedPoints = null;
        this.cdr.markForCheck();
      }
    });

    this.api.getLatestTransactions().subscribe({
      next: (res) => {
        this.latestTransactions = res;
        this.cdr.markForCheck();
      },
      error: () => {
        this.latestTransactions = [];
        this.cdr.markForCheck();
      }
    });

    this.api.getNewMembersCountThisMonth().subscribe({
      next: (res) => {
        this.newMembersCount = res.count ?? null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.newMembersCount = null;
        this.cdr.markForCheck();
      }
    });



    this.fetchDashboardDataForRange(this.dateAgo, this.dateNow);
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.calendarYear = new Date().getFullYear();
      this.calendarMonth = new Date().getMonth();
      this.generateCalendarDays();
    }
  }

  generateCalendarDays() {
    const year = this.calendarYear;
    const month = this.calendarMonth;
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.calendarDays = Array(firstDay).fill(0).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }

  prevMonth() {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
    this.generateCalendarDays();
  }

  nextMonth() {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
    this.generateCalendarDays();
  }


  selectCalendarDay(day: number) {
    if (day === 0) return;

    const selectedLocal = new Date(this.calendarYear, this.calendarMonth, day, 0, 0, 0);
    this.selectedDateAgo = `${this.calendarYear}-${(this.calendarMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    this.dateAgo = selectedLocal; // Keep as Date object
    this.showCalendar = false;

    // For the API, create a UTC midnight date
    const selectedUTC = new Date(Date.UTC(this.calendarYear, this.calendarMonth, day, 0, 0, 0));

    this.updateBranchRanking(selectedUTC, new Date());

    // Fetch dashboard data for the selected range
    this.fetchDashboardDataForRange(selectedUTC, new Date());
  }

  fetchDashboardDataForRange(startDate: Date, endDate: Date) {
    // Voucher breakdown
    this.api.getVoucherCountDetails(startDate, endDate).subscribe({
      next: (res) => {
        this.voucherTotal = res.count;
        this.voucherUsed = res.used;
        this.voucherUnused = res.unused;
        this.voucherCount = res.count;
        this.voucherBreakdown = {
          total: res.count ?? 0,
          used: res.used ?? 0,
          unused: res.unused ?? 0
        };
        this.animateBars();
        this.cdr.markForCheck();
      },
      error: () => {
        this.voucherTotal = 0;
        this.voucherUsed = 0;
        this.voucherUnused = 0;
        this.voucherCount = null;
        this.voucherBreakdown = null;
        this.cdr.markForCheck();
      }
    });

    // Points redeemers
    this.api.getPointsRedeemersCount(startDate, endDate).subscribe({
      next: (res) => {
        this.pointsRedeemers = res.pointsRedeemers ?? null;
        this.memberCount = res.memberCount ?? null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.pointsRedeemers = null;
        this.memberCount = null;
        this.cdr.markForCheck();
      }
    });

    // Points given (earned)
    this.api.getEarnedPoints(startDate, endDate).subscribe({
      next: (res) => {
        this.pointsGiven = res.earnedPoints ?? null;
        this.updateRedemptionPercent();
        this.cdr.markForCheck();
      },
      error: () => {
        this.pointsGiven = null;
        this.updateRedemptionPercent();
        this.cdr.markForCheck();
      }
    });

    // Points redeemed
    this.api.getRedeemedPoints(startDate, endDate).subscribe({
      next: (res) => {
        this.pointsRedeemed = res.redeemedPoints ?? null;
        this.updateRedemptionPercent();
        this.cdr.markForCheck();
      },
      error: () => {
        this.pointsRedeemed = null;
        this.updateRedemptionPercent();
        this.cdr.markForCheck();
      }
    });

    this.api.getTopBranchesRanking(startDate, endDate).subscribe({
      next: (res) => {
        this.topBranches = res;
        this.cdr.markForCheck();
      },
      error: () => {
        this.topBranches = [];
        this.cdr.markForCheck();
      }
    });

  }

  updateRedemptionPercent() {
    if (this.pointsGiven && this.pointsGiven > 0 && this.pointsRedeemed !== null) {
      this.highestRedemptionPercent = Math.round((this.pointsRedeemed / this.pointsGiven) * 100);
    } else {
      this.highestRedemptionPercent = 0;
    }
  }

  updateBranchRanking(startDate: Date, endDate: Date) {
    this.api.getTopBranchesRanking(startDate, endDate).subscribe({
      next: (res) => {
        this.topBranches = res;
        this.cdr.markForCheck();
      },
      error: () => {
        this.topBranches = [];
        this.cdr.markForCheck();
      }
    });
  }

  formatDate(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[date.getDay()];
    const month = date.toLocaleString('default', { month: 'long' });
    const dayNum = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${month} ${dayNum}, ${year}`;
  }
  animateBars() {
    // If there are no vouchers, set all fills to zero and return
    if (!this.voucherTotal || this.voucherTotal === 0) {
      this.barTotalFill = 0;
      this.barUsedFill = 0;
      this.barUnusedFill = 0;
      this.cdr.markForCheck();
      return;
    }

    // Animate fill for each bar (0 to percent)
    const total = this.voucherTotal || 1;
    const usedPercent = this.voucherUsed / total;
    const unusedPercent = this.voucherUnused / total;
    this.barTotalFill = 0;
    this.barUsedFill = 0;
    this.barUnusedFill = 0;
    const duration = 800;
    const steps = 40;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      this.barTotalFill = Math.min(step / steps, 1);
      this.barUsedFill = Math.min((step / steps) * usedPercent, usedPercent);
      this.barUnusedFill = Math.min((step / steps) * unusedPercent, unusedPercent);
      this.cdr.markForCheck();
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
  }
}
