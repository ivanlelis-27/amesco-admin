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
  activeTab: 'users' | 'contact' = 'users';
  roles = ['All', 'Super Admin', 'Admin', 'Clerk', 'Cashier'];
  selectedRole = 'All';
  showRoleDropdown = false;
  showAddUserModal = false;
  newUser = {
    firstName: '',
    lastName: '',
    role: 'All',
    branch: '',
    branchObj: null as any,
    email: '',
    password: ''
  };
  branches: any[] = [];
  filteredBranches: any[] = [];
  showBranchSuggestions = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getAccessUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
      }
    });
    this.api.getBranches().subscribe({
      next: (res) => {
        this.branches = res;
        this.filteredBranches = res;
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'users' | 'contact') {
    this.activeTab = tab;
  }

  toggleRoleDropdown() {
    this.showRoleDropdown = !this.showRoleDropdown;
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.showRoleDropdown = false;
  }

  openAddUserModal() {
    this.showAddUserModal = true;
    this.newUser = {
      firstName: '',
      lastName: '',
      role: 'All',
      branch: '',
      branchObj: null,
      email: '',
      password: ''
    };
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  onBranchInput(value: string) {
    const val = value.toLowerCase();
    this.filteredBranches = this.branches.filter(b =>
      b.branchName.toLowerCase().includes(val)
    );
    this.showBranchSuggestions = true;
  }

  selectBranch(branch: any) {
    this.newUser.branch = branch.branchName;
    this.newUser.branchObj = branch;
    this.showBranchSuggestions = false;
  }

  hideBranchSuggestions() {
    setTimeout(() => {
      this.showBranchSuggestions = false;
    }, 150);
  }

  submitAddUser() {
    const payload = {
      FirstName: this.newUser.firstName,
      LastName: this.newUser.lastName,
      Email: this.newUser.email,
      PasswordHash: this.newUser.password,
      Role: this.newUser.role,
      BranchID: this.newUser.branchObj ? this.newUser.branchObj.branchID : null
    };

    this.api.addAccessUser(payload).subscribe({
      next: (user) => {
        this.closeAddUserModal();
        // Optionally refresh users list here
      },
      error: () => {
        this.closeAddUserModal(); // Optionally close modal on error
        alert('Failed to add user.');
      }
    });
  }
}
