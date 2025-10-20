import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string | null = null;
  showPassword: boolean = false;
  showInvalidModal: boolean = false;
  invalidModalMessage: string = 'Invalid email or password';

  constructor(private router: Router, private api: ApiService, private cdr: ChangeDetectorRef) { }

  onLogin() {
    this.error = null;
    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    this.loading = true;
    this.api.login(this.email, this.password).subscribe({
      next: (httpResp) => {
        // httpResp is HttpResponse<T>
        console.log('login http response:', httpResp);

        const body = (httpResp as any)?.body;
        const headers = (httpResp as any)?.headers;

        // defensive: some APIs return 200 with an error message in the body
        const bodyMsg = (body && (body.error || body.message || body?.detail || '')).toString();
        if (/invalid credential|invalid email|invalid password/i.test(bodyMsg)) {
          console.warn('login response contains error message:', bodyMsg);
          this.loading = false;
          this.error = 'Invalid credentials.';
          this.invalidModalMessage = 'Invalid email or password';
          this.showInvalidModal = true;
          this.cdr.detectChanges();
          return;
        }

        if (/user not found|not found/i.test(bodyMsg)) {
          console.warn('login response contains user-not-found message:', bodyMsg);
          this.loading = false;
          this.error = 'User not found.';
          this.invalidModalMessage = 'User not found.';
          this.showInvalidModal = true;
          this.cdr.detectChanges();
          return;
        }

        // try body-based token fields first
        const possibleToken =
          body?.token ||
          body?.Token ||
          body?.accessToken ||
          body?.access_token ||
          body?.data?.token ||
          body?.result?.token ||
          body?.tokenValue ||
          body?.value;

        // try headers (Authorization or X-Auth-Token)
        let finalToken = possibleToken;
        try {
          const authHdr = headers?.get?.('authorization') || headers?.get?.('Authorization') || headers?.get?.('x-auth-token') || headers?.get?.('X-Auth-Token');
          if (authHdr && !finalToken) {
            finalToken = (authHdr as string).replace(/^Bearer\s+/i, '');
          }
        } catch (e) { }

        // store token/session and navigate
        try {
          if (finalToken) {
            localStorage.setItem('ac_token', finalToken);
          } else if (body && body.token) {
            localStorage.setItem('ac_token', body.token);
          } else {
            console.warn('No token found in login response body or headers');
          }

          const sessionId = body?.sessionId || body?.sessionid || body?.session || body?.session_id;
          if (sessionId) {
            localStorage.setItem('ac_session', sessionId);
          }
        } catch (e) {
          // ignore storage errors
        }

        // ensure loading is cleared before navigation so UI updates immediately
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // debug log the error so we can inspect shapes returned by the API
        console.warn('login request error:', err);

        this.loading = false;

        // robust invalid-credentials detection: status OR server message
        const msg = (err && (err.error || err.message || err.statusText || '')).toString();
        if (err?.status === 401 || /invalid credential|invalid email|invalid password/i.test(msg)) {
          this.error = 'Invalid credentials.';
          // show popup modal immediately for invalid creds
          this.invalidModalMessage = 'Invalid email or password';
          this.showInvalidModal = true;
          this.cdr.detectChanges();
        } else if (err?.status === 404 || /user not found|not found/i.test(msg)) {
          this.error = 'User not found.';
          this.invalidModalMessage = 'User not found.';
          this.showInvalidModal = true;
          this.cdr.detectChanges();
        } else if (err?.error) {
          this.error = err.error;
        } else {
          this.error = 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  closeInvalidModal() {
    this.showInvalidModal = false;
    // clear error if desired
    // this.error = null;
    try { this.cdr.detectChanges(); } catch (e) { }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    // small timeout to move focus back into the input for better UX
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('input[name="password"]');
      if (input) input.focus();
    }, 0);
  }
}
