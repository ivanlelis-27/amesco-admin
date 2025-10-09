import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { MemberMgmt } from './member-mgmt';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionsModule } from '../transactions/transactions.module';

@NgModule({
    declarations: [MemberMgmt],
    imports: [
        CommonModule,
        TransactionsModule,
        FormsModule,
        SidebarComponent,
        HeaderComponent,
        IonicModule,
        NgIf,
        NgFor,
        RouterModule.forChild([
            { path: '', component: MemberMgmt }
        ])
    ],
    providers: [DatePipe]
})
export class MemberMgmtModule { }