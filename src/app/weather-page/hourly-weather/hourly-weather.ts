import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CityResult, DayOption, HourlyWeatherItem } from '../../weather.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-hourly-weather',
  imports: [DatePipe, DecimalPipe, ClickOutsideDirective],
  templateUrl: './hourly-weather.html',
  styleUrl: './hourly-weather.scss',
})
export class HourlyWeatherComponent {
  @Input() city: CityResult | null = null;
  @Input() hourlyItems: HourlyWeatherItem[] = [];
  @Input() availableDays: DayOption[] = [];
  @Input() currentSelectedDay: DayOption | null = null;
  @Input() isLoading = false;

  @Output() daySelected = new EventEmitter<string>();

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  selectDay(dayValue: string) {
    this.daySelected.emit(dayValue);
    this.isOpen.set(false);
  }

  weatherService = inject(WeatherService);
  getWeatherIcon(code: number) {
    return this.weatherService.getWeatherIcon(code);
  }
}
