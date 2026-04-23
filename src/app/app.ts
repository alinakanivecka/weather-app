import { Component, inject, signal } from '@angular/core';
import { WeatherPage } from './weather-page/weather-page';
import { UnitsService } from './services/units.service';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@Component({
  selector: 'app-root',
  imports: [WeatherPage, ClickOutsideDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  unitsService = inject(UnitsService);

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

  setImperial() {
    this.unitsService.setImperial();
    this.isUnitDropdownOpen.set(false);
  }

  setMetric() {
    this.unitsService.setMetric();
    this.isUnitDropdownOpen.set(false);
  }
}
