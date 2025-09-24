import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-merchant-mgmt',
  standalone: false,
  templateUrl: './merchant-mgmt.html',
  styleUrls: ['./merchant-mgmt.scss']
})
export class MerchantMgmt {
  branches: any[] = [];
  filteredBranches: any[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.apiService.getBranches().subscribe({
      next: (res) => {
        this.branches = res;
        this.filteredBranches = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.branches = [];
        this.filteredBranches = [];
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    const normalized = term.trim().toLowerCase();

    if (!normalized) {
      this.filteredBranches = this.branches;
      return;
    }

    this.filteredBranches = this.branches.filter(branch =>
      branch.branchName.toLowerCase().startsWith(normalized)
    );
  }

}
