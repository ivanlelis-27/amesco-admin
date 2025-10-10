import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-transactions',
  standalone: false,
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})

export class Transactions implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  pagedTransactions: any[] = [];
  searchText: string = '';
  loading = true;
  loaded = false;
  page = 1;
  pageSize = 10;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.loaded) return;
    this.loading = true;
    this.api.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = (transactions || []).sort(
          (a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        );
        this.filteredTransactions = this.transactions;
        this.page = 1;
        this.updatePagedTransactions();
        this.loading = false;
        this.loaded = true;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.transactions = [];
        this.filteredTransactions = [];
        this.pagedTransactions = [];
        this.loading = false;
        this.loaded = true;
        this.cdr.markForCheck();
      }
    });
  }

  searchTransactions() {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      this.filteredTransactions = this.transactions;
    } else {
      this.filteredTransactions = this.transactions.filter(tx => {
        const [firstName] = tx.userName.split(' ');
        return firstName && firstName.toLowerCase().startsWith(search);
      });
    }
    this.page = 1;
    this.updatePagedTransactions();
  }

  updatePagedTransactions() {
    const start = (this.page - 1) * this.pageSize;
    this.pagedTransactions = this.filteredTransactions.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.updatePagedTransactions();
  }
}