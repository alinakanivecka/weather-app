import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  temperatureUnit = signal<'celsius' | 'fahrenheit'>('celsius');
  windSpeedUnit = signal<'kmh' | 'mph'>('kmh');
  precipitationUnit = signal<'mm' | 'inch'>('mm');

  constructor() {
    this.loadData();
  }

  saveData() {
    localStorage.setItem(
      'units',
      JSON.stringify({
        temperature: this.temperatureUnit(),
        wind: this.windSpeedUnit(),
        precipitation: this.precipitationUnit(),
      }),
    );
  }

  loadData() {
    const item = localStorage.getItem('units');
    if (!item) {
      return;
    }

    const data = JSON.parse(item);

    this.temperatureUnit.set(data.temperature);
    this.windSpeedUnit.set(data.wind);
    this.precipitationUnit.set(data.precipitation);
  }

  setTemperatureUnit(unit: 'celsius' | 'fahrenheit') {
    this.temperatureUnit.set(unit);
    this.saveData();
  }

  setWindSpeedUnit(unit: 'kmh' | 'mph') {
    this.windSpeedUnit.set(unit);
    this.saveData();
  }

  setPrecipitationUnit(unit: 'mm' | 'inch') {
    this.precipitationUnit.set(unit);
    this.saveData();
  }

  setMetric() {
    this.temperatureUnit.set('celsius');
    this.windSpeedUnit.set('kmh');
    this.precipitationUnit.set('mm');
    this.saveData();
  }

  setImperial() {
    this.temperatureUnit.set('fahrenheit');
    this.windSpeedUnit.set('mph');
    this.precipitationUnit.set('inch');
    this.saveData();
  }
}
