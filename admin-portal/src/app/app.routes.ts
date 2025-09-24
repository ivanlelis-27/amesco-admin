import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { MerchantMgmt } from './pages/merchant-mgmt/merchant-mgmt';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'merchant-mgmt',
    loadChildren: () =>
      import('./pages/merchant-mgmt/merchant-mgmt.module')
        .then(m => m.MerchantMgmtModule)
  },
  { path: '**', redirectTo: '/dashboard' }
];
