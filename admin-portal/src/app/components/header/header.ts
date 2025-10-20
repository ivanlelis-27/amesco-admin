import { Component, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnDestroy {
  // modal DOM nodes appended to document.body to avoid stacking/context z-index issues
  private _backdropEl: HTMLElement | null = null;
  private _modalEl: HTMLElement | null = null;

  constructor(private api: ApiService, private router: Router) { }

  showLogoutModal() {
    // prevent creating multiple copies
    if (this._backdropEl || this._modalEl) return;

    // backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'logout-modal-backdrop';
    backdrop.tabIndex = -1;
    backdrop.addEventListener('click', () => this.hideLogoutModal());

    // modal container
    const modal = document.createElement('div');
    modal.className = 'logout-modal';

    const content = document.createElement('div');
    content.className = 'logout-modal-content';
    content.innerHTML = `
      <p>Are you sure you want to log out?</p>
      <div class="logout-modal-actions">
        <button class="btn cancel" data-action="cancel">No</button>
        <button class="btn primary" data-action="confirm">Yes</button>
      </div>
    `;

    modal.appendChild(content);

    // attach event delegation for buttons
    content.addEventListener('click', (ev) => {
      const target = ev.target as HTMLElement;
      const action = target.getAttribute('data-action');
      if (action === 'cancel') {
        this.hideLogoutModal();
      } else if (action === 'confirm') {
        this.onLogout();
      }
    });

    // store refs
    this._backdropEl = backdrop;
    this._modalEl = modal;

    // append to body (guarantees it overlays everything)
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // small focus management
    setTimeout(() => {
      (content.querySelector('[data-action="cancel"]') as HTMLElement | null)?.focus();
    }, 10);
  }

  hideLogoutModal() {
    try {
      if (this._backdropEl && this._backdropEl.parentNode) this._backdropEl.parentNode.removeChild(this._backdropEl);
      if (this._modalEl && this._modalEl.parentNode) this._modalEl.parentNode.removeChild(this._modalEl);
    } catch (e) {
      // ignore
    }
    this._backdropEl = null;
    this._modalEl = null;
  }

  onLogout() {
    // call logout endpoint and regardless of result, clear client state and redirect
    this.api.logout().subscribe({
      next: () => {
        try { localStorage.removeItem('ac_token'); localStorage.removeItem('ac_session'); } catch (e) { }
        this.hideLogoutModal();
        this.router.navigate(['/login']);
      },
      error: () => {
        try { localStorage.removeItem('ac_token'); localStorage.removeItem('ac_session'); } catch (e) { }
        this.hideLogoutModal();
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.hideLogoutModal();
  }
}


