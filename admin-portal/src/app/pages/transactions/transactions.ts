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
  searchText: string = '';
  loading = true;
  loaded = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.loaded) return;
    this.loading = true;
    this.api.getAllTransactions().subscribe({
      next: (transactions) => {
        // Sort by dateIssued descending
        this.transactions = (transactions || []).sort(
          (a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        );
        this.filteredTransactions = this.transactions;
        this.loading = false;
        this.loaded = true;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.transactions = [];
        this.filteredTransactions = [];
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
      return;
    }
    this.filteredTransactions = this.transactions.filter(tx => {
      // Split the userName into first and last name
      const [firstName] = tx.userName.split(' ');
      return firstName && firstName.toLowerCase().startsWith(search);
    });
  }
}