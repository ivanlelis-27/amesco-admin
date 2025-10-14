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
    // Map frontend fields to backend expected fields
    const payload = {
      BranchName: this.editModel.branchName || this.headOffice.branchName,
      Address: this.editModel.address,
      Contact: this.editModel.contact,
      Latitude: this.editModel.latitude,
      Longitude: this.editModel.longitude,
      StartDay: this.formatDay(this.editModel.startDay),
      EndDay: this.formatDay(this.editModel.endDay),
      OpenTime: this.formatTime(this.editModel.openTime),
      CloseTime: this.formatTime(this.editModel.closeTime),
      Email: this.editModel.email
    };

    this.api.updateHeadOffice(payload).subscribe({
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

  // Helper to format time as "HH:mm"
  formatTime(time: string): string {
    if (!time) return '';
    // If time is already "HH:mm", return as is
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    // If time is "HH:mm:ss", trim to "HH:mm"
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time.slice(0, 5);
    return time;
  }

  // Helper to format day as full day name
  formatDay(day: string): string {
    if (!day) return '';
    const daysMap: any = {
      Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
      Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday'
    };
    return daysMap[day] || day;
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
    const latlng = { lat: this.mapMarker.getPosition().lat(), lng: this.mapMarker.getPosition().lng() };

    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      // Always update lat/lng from marker position
      this.editModel.latitude = latlng.lat;
      this.editModel.longitude = latlng.lng;

      if (status === 'OK' && results[0]) {
        this.editModel.address = results[0].formatted_address;
      }
      // Instantly close modal and update fields
      this.cdr.detectChanges();
      this.closeMapModal();
    });
  }
}