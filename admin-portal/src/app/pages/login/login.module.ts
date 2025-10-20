import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Login } from './login';

@NgModule({
    declarations: [Login],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ],
})
export class LoginModule { }
