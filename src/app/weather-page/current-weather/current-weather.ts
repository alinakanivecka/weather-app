import { Component, inject, Input } from '@angular/core';
import { CityResult, CurrentWeather } from '../../weather.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'app-current-weather',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './current-weather.html',
  styleUrl: './current-weather.scss',
})
export class CurrentWeatherComponent {
  @Input() city: CityResult | null = null;
  @Input() current: CurrentWeather | null = null;
  @Input() isLoading = false;

  unitsService = inject(UnitsService);

  weatherService = inject(WeatherService);
  getWeatherIcon(code: number) {
    return this.weatherService.getWeatherIcon(code);
  }
}
