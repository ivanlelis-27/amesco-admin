import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { NotificationsModule } from './notifications/notifications.module';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Announcements } from './announcements';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [Announcements],
    imports: [
        CommonModule,
        FormsModule,
        SidebarComponent,
        HeaderComponent,
        IonicModule,
        NgIf,
        NgFor,
        NotificationsModule, // <-- Import the module here
        RouterModule.forChild([
            { path: '', component: Announcements }
        ])
    ],
    providers: [DatePipe]
})
export class AnnouncementsModule { }