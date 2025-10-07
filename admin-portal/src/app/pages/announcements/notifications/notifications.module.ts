import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { HeaderComponent } from '../../../components/header/header';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Notifications } from './notifications';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    declarations: [Notifications],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SidebarComponent,
        HeaderComponent,
        IonicModule,
        FontAwesomeModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        NgIf,
        NgFor,
        RouterModule.forChild([
            { path: '', component: Notifications }
        ])
    ],
    providers: [DatePipe],
    exports: [Notifications]
})
export class NotificationsModule { }