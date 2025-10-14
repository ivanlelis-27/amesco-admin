import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api';
declare var google: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.html',
  standalone: false,
  styleUrl: './contact-us.scss'
})
export class ContactUs implements OnInit {
  headOffice: any = null;
  loading = true;
  error = '';
  showMapModal = false;
  editing = false;
  editModel: any = {};
  mapMarker: any = null;
  mapEdit: any = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getHeadOffice().subscribe({
      next: (data) => {
        this.headOffice = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Unable to load head office details.';
        this.loading = false;
      }
    });
  }

  startEdit() {
    this.editing = true;
    this.editModel = { ...this.headOffice };
  }

  cancelEdit() {
    this.editing = false;
    this.editModel = {};
  }

  saveEdit() {
    this.api.updateHeadOffice(this.editModel).subscribe({
      next: (data) => {
        this.headOffice = data;
        this.editing = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Failed to update head office.');
      }
    });
  }

  openMapModal() {
    this.showMapModal = true;
    setTimeout(() => {
      if (this.editing) {
        this.loadGoogleMapEdit();
      } else {
        this.loadGoogleMap();
      }
    }, 100);
  }

  closeMapModal() {
    this.showMapModal = false;
  }

  loadGoogleMap() {
    if (!this.headOffice) return;
    const lat = this.headOffice.latitude;
    const lng = this.headOffice.longitude;
    const mapElem = document.getElementById('googleMap');
    if (mapElem) {
      const map = new google.maps.Map(mapElem, {
        center: { lat, lng },
        zoom: 16,
        disableDefaultUI: false
      });
      new google.maps.Marker({
        position: { lat, lng },
        map,
        title: this.headOffice.branchName,
        draggable: false
      });
    }
  }

  // Editable map with search and draggable marker
  loadGoogleMapEdit() {
    if (!this.editModel) return;
    const lat = this.editModel.latitude || 12.8797; // Default PH lat
    const lng = this.editModel.longitude || 121.7740; // Default PH lng
    const mapElem = document.getElementById('googleMapEdit');
    if (mapElem) {
      this.mapEdit = new google.maps.Map(mapElem, {
        center: { lat, lng },
        zoom: 16,
        disableDefaultUI: false
      });
      this.mapMarker = new google.maps.Marker({
        position: { lat, lng },
        map: this.mapEdit,
        draggable: true
      });
      // Update lat/lng on drag
      google.maps.event.addListener(this.mapMarker, 'dragend', (event: any) => {
        this.editModel.latitude = event.latLng.lat();
        this.editModel.longitude = event.latLng.lng();
      });
    }
  }

  // Search for location in Philippines
  onMapSearch(query: string) {
    if (!this.mapEdit || !query) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: query + ', Philippines', region: 'PH' },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          this.mapEdit.setCenter(loc);
          this.mapMarker.setPosition(loc);
          this.editModel.latitude = loc.lat();
          this.editModel.longitude = loc.lng();
        }
      }
    );
  }

  // Save location to address field (not DB)
  saveMapLocation() {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: this.editModel.latitude, lng: this.editModel.longitude };
    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.editModel.address = results[0].formatted_address;
      }
      this.closeMapModal();
    });
  }
}