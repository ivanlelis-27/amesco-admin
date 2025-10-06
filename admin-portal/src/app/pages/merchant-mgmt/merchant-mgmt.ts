declare var google: any;
import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-merchant-mgmt',
  standalone: false,
  templateUrl: './merchant-mgmt.html',
  styleUrls: ['./merchant-mgmt.scss']
})
export class MerchantMgmt {
  branches: any[] = [];
  filteredBranches: any[] = [];
  searchTerm: string = '';
  showAddBranchModal = false;
  newBranch: any = {
    branchName: '',
    address: '',
    contact: '',
    startDay: '',
    endDay: '',
    openTime: '',
    closeTime: '',
    email: ''
  };
  showMapModal = false;
  map: any;
  marker: any;
  showViewMapModal = false;
  selectedBranch: any = null;
  showEditBranchModal = false;
  editBranch: any = {};
  editBranchId: number | null = null;
  showEditMapModal = false;
  editMap: any;
  editMarker: any;
  showDeleteModal = false;
  branchToDelete: any = null;
  daysOpen: string = 'Mon-Fri';

  openMapModal() {
    this.showMapModal = true;
    setTimeout(() => this.initMap(), 100);
  }

  closeMapModal() {
    this.showMapModal = false;
  }

  openViewMapModal(branch: any) {
    this.selectedBranch = branch;
    this.showViewMapModal = true;
    setTimeout(() => this.initViewMap(), 100);
  }

  closeViewMapModal() {
    this.showViewMapModal = false;
    this.selectedBranch = null;
  }

  // Open Edit Modal and prefill fields
  openEditBranchModal(branch: any) {
    this.editBranchId = branch.branchID;
    // Normalize openTime and closeTime to match dropdown values
    this.editBranch = {
      ...branch,
      openTime: branch.openTime ? branch.openTime.slice(0, 5) : '',
      closeTime: branch.closeTime ? branch.closeTime.slice(0, 5) : ''
    };
    this.showEditBranchModal = true;
  }

  // Close Edit Modal
  closeEditBranchModal() {
    this.showEditBranchModal = false;
    this.editBranch = {};
    this.editBranchId = null;
  }

  // Submit Edit
  submitEditBranch() {
    console.log('Edit Branch Body:', this.editBranch);
    if (typeof this.editBranchId === 'number') {
      this.apiService.updateBranch(this.editBranchId, this.editBranch).subscribe({
        next: () => {
          this.closeEditBranchModal();
          this.ngOnInit(); // Refresh branch list
        }
      });
    } else {
      console.error('Invalid branch ID for update:', this.editBranchId);
    }
  }

  // Edit Map Modal logic
  openEditMapModal() {
    this.showEditMapModal = true;
    setTimeout(() => this.initEditMap(), 100);
  }

  closeEditMapModal() {
    this.showEditMapModal = false;
  }

  openDeleteModal(branch: any) {
    this.branchToDelete = branch;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.branchToDelete = null;
  }

  confirmDeleteBranch() {
    if (this.branchToDelete && this.branchToDelete.branchID) {
      this.apiService.deleteBranch(this.branchToDelete.branchID).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.ngOnInit(); // Refresh branch list
        }
      });
    }
  }

  days = [
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' },
    { short: 'Sun', full: 'Sunday' }
  ];

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.apiService.getBranches().subscribe({
      next: (res) => {
        // Sort branches alphabetically by branchName
        this.branches = res.sort((a, b) =>
          a.branchName.localeCompare(b.branchName)
        );
        this.filteredBranches = this.branches;
        this.cdr.detectChanges();
      },
      error: () => {
        this.branches = [];
        this.filteredBranches = [];
      }
    });
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0);
    let formatted = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    // Remove space between number and AM/PM
    formatted = formatted.replace(' ', '');
    return formatted;
  }

  onSearch(term: string) {
    this.searchTerm = term;
    const normalized = term.trim().toLowerCase();

    if (!normalized) {
      this.filteredBranches = this.branches;
      return;
    }

    // Filter and sort alphabetically
    this.filteredBranches = this.branches
      .filter(branch =>
        branch.branchName.toLowerCase().startsWith(normalized)
      )
      .sort((a, b) => a.branchName.localeCompare(b.branchName));
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredBranches = this.branches;
  }

  // Generates times in 12-hour format for dropdowns
  times = Array.from({ length: 24 }, (_, h) => {
    const hour = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return {
      value: `${h.toString().padStart(2, '0')}:00`,
      label: `${hour}${ampm}`
    };
  });

  openAddBranchModal() {
    this.showAddBranchModal = true;
  }

  closeAddBranchModal() {
    this.showAddBranchModal = false;
    this.newBranch = {
      branchName: '',
      address: '',
      contact: '',
      startDay: '',
      endDay: '',
      openTime: '',
      closeTime: '',
      email: ''
    };
    this.daysOpen = 'Mon-Fri';
  }


  submitBranch() {
    // Split daysOpen into startDay and endDay
    if (this.daysOpen) {
      const [startDay, endDay] = this.daysOpen.split('-');
      this.newBranch.startDay = startDay;
      this.newBranch.endDay = endDay;
    }
    // logs full body for debugging purposes
    console.log('Add Branch Body:', this.newBranch);

    this.apiService.addBranch(this.newBranch).subscribe({
      next: () => {
        this.closeAddBranchModal();
        this.ngOnInit(); // Refresh branch list
      }
    });
  }

  initMap() {
    const defaultLat = this.newBranch.latitude || 7.0731;
    const defaultLng = this.newBranch.longitude || 125.6128;
    const mapOptions = {
      center: { lat: defaultLat, lng: defaultLng },
      zoom: 14
    };
    this.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

    this.marker = new google.maps.Marker({
      position: { lat: defaultLat, lng: defaultLng },
      map: this.map,
      draggable: true
    });

    this.map.addListener('click', (e: any) => {
      this.marker.setPosition(e.latLng);
    });
  }

  onMapSearch(query: string) {
    if (!query) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.map.setCenter(results[0].geometry.location);
        this.marker.setPosition(results[0].geometry.location);
      }
    });
  }

  confirmLocation() {
    const pos = this.marker.getPosition();
    this.newBranch.latitude = pos.lat();
    this.newBranch.longitude = pos.lng();

    this.closeMapModal();

    // Use Google Maps Geocoder to get the address from lat/lng
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: pos.lat(), lng: pos.lng() } }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.newBranch.address = results[0].formatted_address;
        this.cdr.detectChanges();
      }
    });
  }


  initViewMap() {
    if (!this.selectedBranch) return;
    const lat = this.selectedBranch.latitude || 7.0731;
    const lng = this.selectedBranch.longitude || 125.6128;
    const mapOptions = {
      center: { lat, lng },
      zoom: 16
    };
    const map = new google.maps.Map(document.getElementById('viewGoogleMap'), mapOptions);

    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: this.selectedBranch.branchName
    });
  }

  initEditMap() {
    const lat = this.editBranch.latitude || 7.0731;
    const lng = this.editBranch.longitude || 125.6128;
    const mapOptions = {
      center: { lat, lng },
      zoom: 14
    };
    this.editMap = new google.maps.Map(document.getElementById('editGoogleMap'), mapOptions);

    this.editMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.editMap,
      draggable: true
    });

    this.editMap.addListener('click', (e: any) => {
      this.editMarker.setPosition(e.latLng);
    });
  }

  onEditMapSearch(query: string) {
    if (!query) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.editMap.setCenter(results[0].geometry.location);
        this.editMarker.setPosition(results[0].geometry.location);
      }
    });
  }

  confirmEditLocation() {
    const pos = this.editMarker.getPosition();
    this.editBranch.latitude = pos.lat();
    this.editBranch.longitude = pos.lng();

    this.closeEditMapModal();

    // Autofill address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: pos.lat(), lng: pos.lng() } }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.editBranch.address = results[0].formatted_address;
        this.cdr.detectChanges();
      }
    });
  }

}
