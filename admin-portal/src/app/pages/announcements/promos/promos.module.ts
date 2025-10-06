import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { HeaderComponent } from '../../../components/header/header';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Promos } from './promos';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [Promos],
    imports: [
        CommonModule,
        FormsModule,
        SidebarComponent,
        HeaderComponent,
        IonicModule,
        FontAwesomeModule,
        NgIf,
        NgFor,
        RouterModule.forChild([
            { path: '', component: Promos }
        ])
    ],
    providers: [DatePipe],
    exports: [Promos]
})
export class PromosModule { }