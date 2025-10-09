import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';
import { isValidEmail, isMatchingPasswords, hasEmptyFields } from '../../validations/add-member';

type MemberForm = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobile: string;
  memberId: string;
  [key: string]: string;
};

@Component({
  selector: 'app-member-mgmt',
  standalone: false,
  templateUrl: './member-mgmt.html',
  styleUrls: ['./member-mgmt.scss']
})
export class MemberMgmt implements OnInit {
  activeTab: 'members' | 'transactions' | 'upload' = 'members';

  setTab(tab: 'members' | 'transactions' | 'upload') {
    this.activeTab = tab;
  }
  members: any[] = [];
  searchText: string = '';
  showAddMemberModal = false;
  newMember: MemberForm = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mobile: '',
    memberId: ''
  };
  showErrors = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getAllMembers().subscribe({
      next: (res) => {
        this.members = res;
        this.cdr.detectChanges();
      }
    })
  }

  get emailError() {
    return this.newMember.email && !isValidEmail(this.newMember.email);
  }

  get passwordMismatch() {
    return this.newMember.password && this.newMember.confirmPassword &&
      !isMatchingPasswords(this.newMember.password, this.newMember.confirmPassword);
  }

  get hasEmpty() {
    return hasEmptyFields(this.newMember);
  }

  get canSave() {
    return isValidEmail(this.newMember.email)
      && isMatchingPasswords(this.newMember.password, this.newMember.confirmPassword)
      && !this.hasEmpty;
  }

  openAddMemberModal() {
    // Reset all fields first
    this.newMember = {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      mobile: '',
      memberId: ''
    };
    this.showErrors = false;
    this.showAddMemberModal = true;
    // Now generate memberId and assign it
    this.api.generateMemberId().subscribe({
      next: (res) => {
        this.newMember['memberId'] = res.memberId;
      }
    });
  }

  addMember() {
    this.showErrors = true;
    if (!this.canSave) return;
    this.api.registerMember(this.newMember).subscribe({
      next: (res) => {
        // Optionally refresh member list here
        this.newMember = {
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          mobile: '',
          memberId: ''
        };
        this.showErrors = false;
        this.showAddMemberModal = false; // <-- Move this after resetting form
      },
      error: (err) => {
        // Optionally show error message
      }
    });
  }
  fieldError(field: string): boolean {
    if (!this.showErrors) return false;

    // Empty field check
    if (!this.newMember[field] || (typeof this.newMember[field] === 'string' && this.newMember[field].trim() === '')) {
      return true;
    }

    // Email format
    if (field === 'email') return !isValidEmail(this.newMember.email);

    // Password mismatch: border both fields if either is empty or they don't match
    if (field === 'password' || field === 'confirmPassword') {
      return (
        !this.newMember.password ||
        !this.newMember.confirmPassword ||
        !isMatchingPasswords(this.newMember.password, this.newMember.confirmPassword)
      );
    }

    return false;
  }

  get filteredMembers() {
    if (!this.searchText) return this.members;
    const search = this.searchText.trim().toLowerCase();
    return this.members.filter(m =>
      m.lastName && m.lastName.toLowerCase().startsWith(search)
    );
  }
}