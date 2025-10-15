import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AccessMgmt } from './access-mgmt';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactUsModule } from './contact-us/contact-us.module';
import { CdkAutofill } from "@angular/cdk/text-field";

@NgModule({
    declarations: [AccessMgmt],
    imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    ContactUsModule,
    IonicModule,
    NgIf,
    NgFor,
    RouterModule.forChild([
        { path: '', component: AccessMgmt }
    ]),
    CdkAutofill
],
    providers: [DatePipe]
})
export class AccessMgmtModule { }