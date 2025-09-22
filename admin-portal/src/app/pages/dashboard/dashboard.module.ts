import { NgModule, } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { Dashboard } from './dashboard';

@NgModule({
    declarations: [Dashboard],
    imports: [SidebarComponent, HeaderComponent
    ]
})
export class DashboardModule { }