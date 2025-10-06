import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api';
import { faImage } from '@fortawesome/free-solid-svg-icons';

interface Promo {
  promoId: number;
  brandItemName: string;
  price: number;
  unit: string;
  createdAt: string;
  imageUrl?: string;
  promoText?: string;
  ImageData?: string;
}

@Component({
  selector: 'app-promos',
  standalone: false,
  templateUrl: './promos.html',
  styleUrls: ['./promos.scss']
})
export class Promos implements OnInit {
  faImage = faImage;
  promos: Promo[] = [];
  selectedImage: File | null = null;
  brandItemName = '';
  price: number | null = null;
  unit = '';
  imagePreviewUrl: string | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getPromos().subscribe((data: any) => {
      this.promos = (Array.isArray(data) ? data : [data]).map(promo => ({
        ...promo,
        promoText: '',
        imageUrl: promo.imageBase64
          ? `data:image/png;base64,${promo.imageBase64}`
          : undefined
      }));
      this.cdr.detectChanges();
    });
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
        this.cdr.detectChanges(); // Force Angular to update the view
      };
      reader.readAsDataURL(this.selectedImage as File);
    }
  }

  addPromo() {
    if (!this.selectedImage || !this.brandItemName || !this.price || !this.unit) {
      alert('All fields are required.');
      return;
    }
    const imageFile = this.selectedImage; // TypeScript now knows this is File, not null
    const formData = new FormData();
    formData.append('Image', imageFile);
    formData.append('BrandItemName', this.brandItemName);
    formData.append('Price', this.price.toString());
    formData.append('Unit', this.unit);

    this.api.uploadPromo(formData).subscribe({
      next: () => {
        alert('Promo uploaded!');
        this.ngOnInit(); // reload promos
      },
      error: err => alert('Upload failed: ' + err.error)
    });

    this.imagePreviewUrl = null;
  }

}