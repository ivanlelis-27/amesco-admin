import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Dashboard } from './dashboard';

@NgModule({
    declarations: [Dashboard],
    imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, IonicModule],
    providers: [DatePipe]
})
export class DashboardModule { }