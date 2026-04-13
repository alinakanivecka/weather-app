import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { WeatherPage } from './weather-page/weather-page';
import { UnitsService } from './services/units.service';

@Component({
  selector: 'app-root',
  imports: [WeatherPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  unitsService = inject(UnitsService);

  @ViewChild('container') container!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.container) {
      return;
    }
    
    const clickedInside = this.container.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isUnitDropdownOpen.set(false);
    }
  }

  isUnitDropdownOpen = signal(false);

  toggleDropdown() {
    this.isUnitDropdownOpen.set(!this.isUnitDropdownOpen());
  }

  changeTemperatureUnit(unit: 'celsius' | 'fahrenheit') {
    this.unitsService.setTemperatureUnit(unit);
  }

  changeWindSpeedUnit(unit: 'kmh' | 'mph') {
    this.unitsService.setWindSpeedUnit(unit);
  }

  changePrecipitationUnit(unit: 'mm' | 'inch') {
    this.unitsService.setPrecipitationUnit(unit);
  }
}
