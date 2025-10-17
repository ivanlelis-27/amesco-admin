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
  filteredUsers: any[] = [];
  tableEditMode = false;
  editingUserIndex: number | null = null;
  editUser: any = null;
  showEditBranchSuggestions = false;
  editFilteredBranches: any[] = [];
  showResetPasswordModal = false;
  resetSearch = '';
  filteredResetUsers: any[] = [];
  showResetUserSuggestions = false;
  selectedResetUser: any = null;
  resetLoading = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getAccessUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filterUsers();
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

  getBranchName(branchID: number): string {
    const branch = this.branches.find(b => b.branchID === branchID);
    return branch ? branch.branchName : '';
  }

  toggleRoleDropdown() {
    this.showRoleDropdown = !this.showRoleDropdown;
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.showRoleDropdown = false;
    this.filterUsers();
  }

  filterUsers() {
    if (this.selectedRole === 'All') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(u => u.role === this.selectedRole);
    }
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
        this.api.getAccessUsers().subscribe({
          next: (res) => {
            this.users = res;
            this.filterUsers();
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.closeAddUserModal();
        alert('Failed to add user.');
        this.api.getAccessUsers().subscribe({
          next: (res) => {
            this.users = res;
            this.filterUsers();
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  toggleTableEditMode() {
    this.tableEditMode = !this.tableEditMode;
    this.cancelEditUser(); 
  }

  startEditUser(index: number) {
    this.editingUserIndex = index;
    const user = this.filteredUsers[index];
    // Split fullName into first and last name
    const [firstName, ...lastNameArr] = user.fullName.split(' ');
    this.editUser = {
      firstName: firstName,
      lastName: lastNameArr.join(' '),
      role: user.role,
      branch: this.getBranchName(user.branchID),
      branchObj: this.branches.find(b => b.branchID === user.branchID),
      email: user.email,
      userID: user.userID
    };
    this.editFilteredBranches = this.branches;
  }

  cancelEditUser() {
    this.editingUserIndex = null;
    this.editUser = null;
    this.showEditBranchSuggestions = false;
  }

  onEditBranchInput(value: string) {
    const val = value.toLowerCase();
    this.editFilteredBranches = this.branches.filter(b =>
      b.branchName.toLowerCase().includes(val)
    );
    this.showEditBranchSuggestions = true;
  }

  selectEditBranch(branch: any) {
    this.editUser.branch = branch.branchName;
    this.editUser.branchObj = branch;
    this.showEditBranchSuggestions = false;
  }

  hideEditBranchSuggestions() {
    setTimeout(() => {
      this.showEditBranchSuggestions = false;
    }, 150);
  }

  saveEditUser(index: number) {
    const payload = {
      FirstName: this.editUser.firstName,
      LastName: this.editUser.lastName,
      Email: this.editUser.email,
      Role: this.editUser.role,
      BranchID: this.editUser.branchObj ? this.editUser.branchObj.branchID : null,
      UserID: this.editUser.userID
    };
    this.api.updateAccessUser(payload).subscribe({
      next: () => {
        this.api.getAccessUsers().subscribe({
          next: (res) => {
            this.users = res;
            this.filterUsers();
            this.cdr.detectChanges();
            this.cancelEditUser();
          }
        });
      },
      error: () => {
        alert('Failed to update user.');
      }
    });
  }

  openResetPasswordModal() {
    this.showResetPasswordModal = true;
    this.resetSearch = '';
    this.filteredResetUsers = this.users;
    this.selectedResetUser = null;
  }

  closeResetPasswordModal() {
    this.showResetPasswordModal = false;
    this.resetSearch = '';
    this.filteredResetUsers = [];
    this.selectedResetUser = null;
  }

  onResetUserInput(value: string) {
    const val = value.toLowerCase();
    this.filteredResetUsers = this.users.filter(u =>
      u.fullName.toLowerCase().includes(val)
    );
    this.showResetUserSuggestions = true;
  }

  selectResetUser(user: any) {
    this.resetSearch = user.fullName;
    this.selectedResetUser = user;
    this.showResetUserSuggestions = false;
  }

  hideResetUserSuggestions() {
    setTimeout(() => {
      this.showResetUserSuggestions = false;
    }, 150);
  }

  resetPassword() {
    if (!this.selectedResetUser || this.resetLoading) return;
    this.resetLoading = true;
    this.api.resetUserPassword(this.selectedResetUser.email).subscribe({
      next: (res: any) => {
        this.resetLoading = false;
        setTimeout(() => {
          if (window.confirm(res.message || 'Temporary password sent to user\'s email.')) {
            this.closeResetPasswordModal();
            this.cdr.detectChanges();
          }
        }, 100);
      },
      error: (err) => {
        this.resetLoading = false;
        alert(err.error?.message || 'Failed to reset password.');
      }
    });
  }
}
