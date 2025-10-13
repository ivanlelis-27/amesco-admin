import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-create-announcements',
  standalone: false,
  templateUrl: './create-announcements.html',
  styleUrls: ['./create-announcements.scss']
})
export class CreateAnnouncements implements AfterViewInit, OnDestroy {
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
  editingIndexId: number | null = null;
  editingIndexValue: number | null = null;
  previewIndex = 0;
  autoPreviewInterval: any;
  previewScrolling = false;
  newSortIndex: number | null = null;
  sortIndexError: string = '';
  showPromoModal = false;
  promos: any[] = [];
  addedPromoIds: number[] = [];
  showDeleteModal = false;
  announcementToDelete: any = null;
  promoGroupsLoading = false;

  ngOnInit() {
    this.loadAnnouncements();
    this.startAutoPreviewScroll();
  }

  ngOnDestroy() {
    if (this.autoPreviewInterval) {
      clearInterval(this.autoPreviewInterval);
    }
  }

  openPromoModal() {
    this.showPromoModal = true;
    this.api.getPromos().subscribe((data: any[]) => {
      this.promos = data;
      this.cdr.detectChanges();
    });
  }

  closePromoModal() {
    this.showPromoModal = false;
  }

  addPromoToAnnouncement(promo: any) {
    if (!this.addedPromoIds.includes(promo.promoId)) {
      this.addedPromoIds.push(promo.promoId);
    }
  }

  removePromoFromAnnouncement(promo: any) {
    this.addedPromoIds = this.addedPromoIds.filter(id => id !== promo.promoId);
  }


  openDeleteModal(announcement: any) {
    this.announcementToDelete = announcement;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.announcementToDelete = null;
  }

  confirmDeleteAnnouncement() {
    if (!this.announcementToDelete) return;
    this.api.deleteAnnouncement(this.announcementToDelete.announcementId).subscribe({
      next: () => {
        this.loadAnnouncements();
        this.closeDeleteModal();
      },
      error: err => {
        alert('Failed to delete: ' + (err.error?.message || 'Unknown error'));
        this.closeDeleteModal();
      }
    });
  }

  loadAnnouncements() {
    this.api.getAllAnnouncements().subscribe((data: any[]) => {
      this.announcements = data;
      if (this.previewIndex >= this.sortedAnnouncements.length) {
        this.previewIndex = 0;
      }
      this.startAutoPreviewScroll();
      this.cdr.detectChanges();
    });
  }

  startAutoPreviewScroll() {
    if (this.autoPreviewInterval) {
      clearInterval(this.autoPreviewInterval);
    }
    this.autoPreviewInterval = setInterval(() => {
      if (this.sortedAnnouncements.length === 0) return;
      if (this.previewIndex < this.sortedAnnouncements.length - 1) {
        this.previewIndex++;
      } else {
        this.previewIndex = 0;
      }
      this.cdr.detectChanges();
    }, 10000);
  }

  prevPreviewSlide() {
    if (this.previewIndex > 0) {
      this.previewIndex--;
      this.cdr.detectChanges();
    }
  }

  nextPreviewSlide() {
    if (this.previewIndex < this.sortedAnnouncements.length - 1) {
      this.previewIndex++;
      this.cdr.detectChanges();
    }
  }

  get previewTrackTransform() {
    return `translateX(-${this.previewIndex * 100}%)`;
  }

  get sortedAnnouncements() {
    // Sort by sortIndex ascending
    return this.announcements
      .filter(a => a.imageBase64)
      .sort((a, b) => {
        if (a.sortIndex != null && b.sortIndex != null) {
          return a.sortIndex - b.sortIndex;
        }
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      });
  }

  get previewAnnouncement() {
    return this.sortedAnnouncements[this.previewIndex] || null;
  }

  startEditIndex(announcement: any) {
    this.editingIndexId = announcement.announcementId;
    this.editingIndexValue = announcement.sortIndex ?? '';
  }

  onEditIndexInput(event: KeyboardEvent, announcement: any) {
    if (event.key === 'Enter') {
      const value = this.editingIndexValue ?? '';
      this.saveSortIndex(announcement.announcementId, value);
    }
  }

  saveSortIndex(announcementId: number, sortIndex: number | string) {
    const indexValue = sortIndex === '' ? null : Number(sortIndex);
    this.api.editAnnouncementIndex(announcementId, indexValue).subscribe({
      next: () => {
        this.editingIndexId = null;
        this.editingIndexValue = null;
        this.loadAnnouncements();
      },
      error: err => alert('Failed to update index: ' + (err.error?.message || 'Unknown error'))
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
    if (this.promoGroups.length === 0 && !this.promoGroupsLoading) {
      this.promoGroupsLoading = true;
      this.api.getPromoGroups().subscribe(groups => {
        this.promoGroups = groups.map(g => ({
          promoGroupId: g.promoGroupId,
          name: g.name
        }));
        this.promoGroupsLoading = false;
        this.showPromoDropdown = true;
        this.cdr.detectChanges();
      });
    } else {
      this.showPromoDropdown = !this.showPromoDropdown;
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

    // Checks for duplicate sortIndex if not null
    if (this.newSortIndex !== null && this.sortedAnnouncements.some(a => a.sortIndex === this.newSortIndex)) {
      alert('Existing index. Please choose another number.');
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
    if (this.newSortIndex !== null && this.newSortIndex !== undefined) {
      formData.append('sortIndex', this.newSortIndex.toString());
    }
    // Append each promoId as promoIds
    this.addedPromoIds.forEach(id => formData.append('promoIds', id.toString()));

    this.api.createAnnouncement(formData).subscribe({
      next: (res: any) => {
        alert('Announcement created!');
        this.resetForm();
        this.newSortIndex = null;
        this.addedPromoIds = []; // Clear selected promos after save
        this.loadAnnouncements();
        this.cdr.detectChanges();
      },
      error: err => alert('Failed: ' + (err.error?.message || 'Unknown error'))
    });
  }
}