import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { validatePromoFields, PromoValidationResult } from '../../../validations/promos';

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
  validationErrors: { [key: string]: string } = {};
  invalidFields: string[] = [];

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
    const validation: PromoValidationResult = validatePromoFields(
      this.brandItemName,
      this.price,
      this.unit,
      this.selectedImage
    );
    this.validationErrors = validation.errors;
    this.invalidFields = validation.invalidFields;

    if (this.invalidFields.length > 0) {
      alert(Object.values(this.validationErrors).join('\n'));
      return;
    }

    const imageFile = this.selectedImage!;
    const formData = new FormData();
    formData.append('Image', imageFile);
    formData.append('BrandItemName', this.brandItemName);
    formData.append('Price', this.price!.toString());
    formData.append('Unit', this.unit);

    this.api.uploadPromo(formData).subscribe({
      next: () => {
        alert('Promo uploaded!');
        this.ngOnInit(); // reload promos
        this.validationErrors = {};
        this.invalidFields = [];
      },
      error: err => alert('Upload failed: ' + err.error)
    });

    this.imagePreviewUrl = null;
  }

  onFieldChange(field: string) {
    if (this.invalidFields.includes(field)) {
      this.invalidFields = this.invalidFields.filter(f => f !== field);
      delete this.validationErrors[field];
    }
  }

  confirmDeletePromo(promoId: number) {
    if (confirm('Are you sure you want to delete this promo?')) {
      this.api.deletePromo(promoId).subscribe({
        next: () => {
          alert('Promo deleted successfully.');
          this.ngOnInit(); // reload promos
        },
        error: err => alert('Delete failed: ' + err.error)
      });
    }
  }
}