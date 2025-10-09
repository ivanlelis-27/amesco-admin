import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Transactions } from './transactions';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
    declarations: [Transactions],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        FontAwesomeModule,
        NgIf,
        NgFor,
        RouterModule.forChild([
            { path: '', component: Transactions }
        ])
    ],
    exports: [Transactions]
})
export class TransactionsModule { }