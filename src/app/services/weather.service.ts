import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CityResult, GeocodingResponse, WeatherResponse } from '../weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);

  searchCity(city: string): Observable<CityResult[]> {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(city)}` +
      `&count=5` +
      `&language=en` +
      `&format=json`;

    return this.http.get<GeocodingResponse>(url).pipe(map((response) => response.results ?? []));
  }

  getWeather(
    lat: number,
    lon: number,
    tempParams: 'celsius' | 'fahrenheit',
    windParams: 'kmh' | 'mph',
    precipParams: 'mm' | 'inch',
  ): Observable<WeatherResponse> {
    const url = `https://api.open-meteo.com/v1/forecast`;

    const params = new HttpParams().appendAll({
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation',
        'wind_speed_10m',
        'weather_code',
      ],
      hourly: ['temperature_2m', 'weather_code'],
      daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
      temperature_unit: tempParams,
      wind_speed_unit: windParams,
      precipitation_unit: precipParams,
      timezone: 'auto',
    });

    return this.http.get<WeatherResponse>(url, { params });
  }

  sunnyCode = [0];
  partlycloudyCodes = [1, 2];
  overcastCode = [3];
  rainCodes = [61, 63, 65, 80, 81, 82];
  snowCodes = [71, 73, 75];
  fogCodes = [45, 48];
  drizzleCodes = [51, 53, 55];
  stormCodes = [95, 96, 99];

  getWeatherIcon(code: number): string {
    if (this.sunnyCode.includes(code)) {
      return '/assets/images/icon-sunny.webp';
    }

    if (this.partlycloudyCodes.includes(code)) {
      return '/assets/images/icon-partly-cloudy.webp';
    }

    if (this.overcastCode.includes(code)) {
      return '/assets/images/icon-overcast.webp';
    }

    if (this.rainCodes.includes(code)) {
      return '/assets/images/icon-rain.webp';
    }

    if (this.snowCodes.includes(code)) {
      return '/assets/images/icon-snow.webp';
    }

    if (this.fogCodes.includes(code)) {
      return '/assets/images/icon-fog.webp';
    }

    if (this.drizzleCodes.includes(code)) {
      return '/assets/images/icon-drizzle.webp';
    }

    if (this.stormCodes.includes(code)) {
      return '/assets/images/icon-storm.webp';
    }

    return '/assets/images/icon-partly-cloudy.webp';
  }
}
