import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CityResult, DayOption, HourlyWeatherItem } from '../../weather.model';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-hourly-weather',
  imports: [DatePipe],
  templateUrl: './hourly-weather.html',
  styleUrl: './hourly-weather.scss',
})
export class HourlyWeatherComponent {
  @Input() city: CityResult | null = null;
  @Input() hourlyItems: HourlyWeatherItem[] = [];
  @Input() availableDays: DayOption[] = [];
  @Input() currentSelectedDay: DayOption | null | undefined = null;
  @Input() isLoading = false;

  @Output() daySelected = new EventEmitter<string>();

  isOpen = signal(false);

  @ViewChild('container') container!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.container) {
      return;
    }

    const clickedInside = this.container.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isOpen.set(false);
    }
  }

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
