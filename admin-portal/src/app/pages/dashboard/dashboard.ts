import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';

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
  memberCount: number | null = null;
  voucherCount: number | null = null;
  voucherTotal: number = 0;
  voucherUsed: number = 0;
  voucherUnused: number = 0;
  barTotalFill: number = 0;
  barUsedFill: number = 0;
  barUnusedFill: number = 0;
  dateAgo: string = '';
  dateNow: string = '';
  dateAgoMonthYear: string = '';
  dateNowMonthYear: string = '';
  voucherBreakdown: { total: number, used: number, unused: number } | null = null;
  pointsRedeemers: number | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    this.dateNow = this.formatDate(today);
    this.dateAgo = this.formatDate(monthAgo);

    this.dateNowMonthYear = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.dateAgoMonthYear = monthAgo.toLocaleString('default', { month: 'long', year: 'numeric' });

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
    this.api.getVoucherCountDetails().subscribe({
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
    this.api.getPointsRedeemersCount().subscribe({
      next: (res) => {
        this.pointsRedeemers = res.pointsRedeemers ?? null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.pointsRedeemers = null;
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
