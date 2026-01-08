import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-google-maps-dialog',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './google-maps-dialog.component.html',
  styleUrl: './google-maps-dialog.component.scss'
})
export class GoogleMapsDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild('searchField') searchField!: ElementRef;

  // Default coordinates (used only if GPS fails)
  center: google.maps.LatLngLiteral = { lat: 41.7151, lng: 44.8271 };
  zoom = 12;
  selectedPosition: google.maps.LatLngLiteral | null = null;
  shareableLink: string = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCurrentLocation();
  }
  getCurrentLocation() {
    const options = {
      enableHighAccuracy: true, // This tells the browser to use GPS if available
      timeout: 5000,            // Don't wait longer than 5 seconds
      maximumAge: 0             // Don't use a cached location
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log(`Accuracy: ${position.coords.accuracy} meters`);

          this.center = { lat, lng };
          this.selectedPosition = { lat, lng };
          this.updateShareableLink(lat, lng);
          this.cdr.detectChanges();
        },
        (error) => {
          console.warn('Location error:', error.message);
        },
        options // Pass the high accuracy options here
      );
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initSearchBox();
    }, 500);
  }

  initSearchBox() {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const pos = { lat, lng };

      this.selectedPosition = pos;
      this.center = pos;
      this.zoom = 15;
      this.updateShareableLink(lat, lng);

      if (this.map.googleMap) {
        this.map.googleMap.panTo(pos);
      }
      this.cdr.detectChanges();
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.selectedPosition = { lat, lng };
      this.updateShareableLink(lat, lng);
    }
  }

  updateShareableLink(lat: number, lng: number) {
    this.shareableLink = `https://www.google.com/maps?q=${lat},${lng}`;
    this.cdr.detectChanges();
  }

  copyLink() {
    if (this.shareableLink) {
      navigator.clipboard.writeText(this.shareableLink).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }
}