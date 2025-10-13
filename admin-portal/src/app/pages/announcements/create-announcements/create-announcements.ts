import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-create-announcements',
  standalone: false,
  templateUrl: './create-announcements.html',
  styleUrls: ['./create-announcements.scss']
})
export class CreateAnnouncements implements AfterViewInit {
  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }
  cards = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
  imagePreviewUrl: string | null = null;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  promoGroups: { promoGroupId: number, name: string }[] = [];
  showPromoDropdown = false;
  selectedPromoGroup: string = '';
  title: string = '';
  description: string = '';
  selectedPromoGroupId: number | null = null;
  selectedImage: File | null = null;
  announcements: any[] = [];

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.api.getAllAnnouncements().subscribe((data: any[]) => {
      this.announcements = data;
      this.cdr.detectChanges();
    });
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedPromoGroup = '';
    this.selectedPromoGroupId = null;
    this.selectedImage = null;
    this.imagePreviewUrl = null;
    this.showPromoDropdown = false;
  }

  onImageContainerClick() {
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  ngAfterViewInit() {
    const row = document.querySelector('.announcement-cards-row') as HTMLElement;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    if (row) {
      row.addEventListener('mousedown', (e: MouseEvent) => {
        isDown = true;
        row.classList.add('dragging');
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
      });
      row.addEventListener('mouseleave', () => {
        isDown = false;
        row.classList.remove('dragging');
      });
      row.addEventListener('mouseup', () => {
        isDown = false;
        row.classList.remove('dragging');
      });
      row.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - row.offsetLeft;
        const walk = (x - startX) * 1.5;
        row.scrollLeft = scrollLeft - walk;
      });
    }
  }

  togglePromoDropdown() {
    this.showPromoDropdown = !this.showPromoDropdown;
    if (this.showPromoDropdown && this.promoGroups.length === 0) {
      this.api.getPromoGroups().subscribe(groups => {
        this.promoGroups = groups.map(g => ({
          promoGroupId: g.promoGroupId,
          name: g.name
        }));
      });
    }
  }

  selectPromoGroup(name: string) {
    const group = this.promoGroups.find(g => g.name === name);
    this.selectedPromoGroup = name;
    this.selectedPromoGroupId = group ? group.promoGroupId : null;
    this.showPromoDropdown = false;
  }

  saveAnnouncement() {
    if (!this.title || !this.description) {
      alert('Title and description are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    if (this.selectedPromoGroupId) {
      formData.append('promoGroupId', this.selectedPromoGroupId.toString());
    }
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    this.api.createAnnouncement(formData).subscribe({
      next: (res: any) => {
        alert('Announcement created!');
        this.resetForm();
        this.loadAnnouncements(); // <-- Refresh announcements after creation
        this.cdr.detectChanges();
      },
      error: err => alert('Failed: ' + (err.error?.message || 'Unknown error'))
    });
  }
}