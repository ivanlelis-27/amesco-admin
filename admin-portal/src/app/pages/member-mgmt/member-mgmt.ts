import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-member-mgmt',
  standalone: false,
  templateUrl: './member-mgmt.html',
  styleUrls: ['./member-mgmt.scss']
})
export class MemberMgmt implements OnInit {
  members: any[] = [];
  searchText: string = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getAllMembers().subscribe({
      next: (res) => {
        this.members = res;
        this.cdr.detectChanges();
      }
    })
  }

  get filteredMembers() {
    if (!this.searchText) return this.members;
    const letter = this.searchText.trim().toLowerCase();
    return this.members.filter(m =>
      m.lastName && m.lastName[0].toLowerCase() === letter
    );
  }
}
