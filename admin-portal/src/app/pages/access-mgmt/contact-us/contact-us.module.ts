import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContactUs } from './contact-us';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
    declarations: [ContactUs],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        FontAwesomeModule,
        NgIf,
        NgFor,
        RouterModule.forChild([
            { path: '', component: ContactUs }
        ])
    ],
    exports: [ContactUs]
})
export class ContactUsModule { }