import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  onLogin() {
    // Placeholder logic – replace with actual authentication
    if (this.email && this.password) {
      console.log('Logging in with:', this.email);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please enter valid credentials.');
    }
  }
}
