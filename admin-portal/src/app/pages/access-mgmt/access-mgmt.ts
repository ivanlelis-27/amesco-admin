import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';


@Component({
  selector: 'app-access-mgmt',
  standalone: false,
  templateUrl: './access-mgmt.html',
  styleUrl: './access-mgmt.scss'
})
export class AccessMgmt implements OnInit {
  users: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getAccessUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
      }
    });
  }
}
