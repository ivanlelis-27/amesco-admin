import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-create-announcements',
  standalone: false,
  templateUrl: './create-announcements.html',
  styleUrls: ['./create-announcements.scss']
})
export class CreateAnnouncements implements AfterViewInit {
  cards = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
  imagePreviewUrl: string | null = null;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  onImageContainerClick() {
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
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
}