import { Component, inject, Input } from '@angular/core';
import { CityResult, DailyWeatherItem } from '../../weather.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-daily-weather',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './daily-weather.html',
  styleUrl: './daily-weather.scss',
})
export class DailyWeatherComponent {
  @Input() city: CityResult | null = null;
  @Input() dailyItems: DailyWeatherItem[] = [];
  @Input() isLoading = false;

  weatherService = inject(WeatherService);
  getWeatherIcon(code: number) {
    return this.weatherService.getWeatherIcon(code);
  }
}
