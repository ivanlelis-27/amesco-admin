import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api';
import { faImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class Notifications {
  title = '';
  description = '';
  messageBody = '';
  scheduledAt: Date | null = null;
  includeImage = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  faImage = faImage;
  scheduledNotifications: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    this.loadScheduledNotifications();
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedImage as File);
    }
  }

  loadScheduledNotifications() {
    this.api.getScheduledNotifications().subscribe({
      next: (data: any[]) => {
        this.scheduledNotifications = data;
        this.cdr.detectChanges();
      }
    });
  }

  get scheduledPaddingBottom(): string {
    const extra = Math.ceil(this.scheduledNotifications.length / 5) * 2;
    return `${4 + extra}rem`;
  }

  createNotification() {
    if (!this.title) {
      alert('Title is required.');
      return;
    }
    if (this.includeImage && !this.selectedImage) {
      alert('Image is required when "Include Image" is checked.');
      return;
    }
    const formData = new FormData();
    formData.append('Title', this.title);
    formData.append('Description', this.description);
    formData.append('MessageBody', this.messageBody);
    formData.append('ScheduledAt', this.scheduledAt ? this.scheduledAt.toLocaleString('sv-SE') : '');
    formData.append('IncludeImage', this.includeImage ? 'true' : 'false');
    if (this.includeImage && this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.api.createNotification(formData).subscribe({
      next: () => {
        alert('Notification created!');
        this.loadScheduledNotifications();
      },
      error: err => alert('Failed: ' + (err.error?.message || 'Unknown error'))
    });
    this.cdr.detectChanges();
  }
}