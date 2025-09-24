import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { MerchantMgmt } from './merchant-mgmt';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MerchantMgmt],
    imports: [
        CommonModule,
        FormsModule,
        SidebarComponent,
        HeaderComponent,
        IonicModule,
        NgIf,
        NgFor,
        RouterModule.forChild([
            { path: '', component: MerchantMgmt }
        ])
    ],
    providers: [DatePipe]
})
export class MerchantMgmtModule { }