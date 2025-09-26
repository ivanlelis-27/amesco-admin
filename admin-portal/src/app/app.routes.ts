import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { MerchantMgmt } from './pages/merchant-mgmt/merchant-mgmt';
import { MemberMgmt } from './pages/member-mgmt/member-mgmt';
import { AccessMgmt } from './pages/access-mgmt/access-mgmt';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'merchant-mgmt', component: MerchantMgmt },
  { path: 'member-mgmt', component: MemberMgmt },
  { path: 'access-mgmt', component: AccessMgmt },
  { path: '**', redirectTo: '/dashboard' }
];
