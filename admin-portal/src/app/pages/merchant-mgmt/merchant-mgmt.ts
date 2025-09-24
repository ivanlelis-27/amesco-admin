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

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.apiService.getBranches().subscribe({
      next: (res) => {
        console.log('Branches received:', res);
        this.branches = res;
        this.cdr.detectChanges();
      },
      error: () => this.branches = []
    });
  }

}
