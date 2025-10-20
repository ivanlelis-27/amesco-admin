import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from './header';

@NgModule({
    imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, IonicModule],
    providers: [DatePipe]
})
export class HeaderModule { }