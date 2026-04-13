import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { CityResult, DailyWeatherItem, HourlyWeatherItem, WeatherResponse } from '../weather.model';
import { CurrentWeatherComponent } from './current-weather/current-weather';
import { DailyWeatherComponent } from './daily-weather/daily-weather';
import { HourlyWeatherComponent } from './hourly-weather/hourly-weather';
import { UnitsService } from '../services/units.service';

@Component({
  selector: 'app-weather-page',
  imports: [CurrentWeatherComponent, DailyWeatherComponent, HourlyWeatherComponent],
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.scss',
})
export class WeatherPage {
  private weatherService = inject(WeatherService);
  private unitsService = inject(UnitsService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  cities = signal<CityResult[]>([]);
  selectedCity = signal<CityResult | null>(null);
  weather = signal<WeatherResponse | null>(null);

  isLoading = signal(false);
  isSearchLoading = signal(false);
  errorMessage = signal('');
  search = signal('');
  isOpenDropdown = signal(false);
  selectedDay = signal<string | null>(null);
  noResults = signal(false);

  currentWeather = computed(() => this.weather()?.current ?? null);
  dailyWeather = computed(() => this.weather()?.daily ?? null);
  hourlyWeather = computed(() => this.weather()?.hourly ?? null);

  @ViewChild('searchContainer') container!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.container) {
      return;
    }

    const clickedInside = this.container.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isOpenDropdown.set(false);
    }
  }

  dailyWeatherItems = computed<DailyWeatherItem[]>(() => {
    const daily = this.dailyWeather();

    if (!daily) {
      return [];
    }

    return daily.time.map((date, index) => {
      return {
        date,
        max: daily.temperature_2m_max[index],
        min: daily.temperature_2m_min[index],
        code: daily.weather_code[index],
      };
    });
  });

  hourlyWeatherItems = computed<HourlyWeatherItem[]>(() => {
    const hourly = this.hourlyWeather();
    const current = this.currentSelectedDay();

    if (!hourly || !current) {
      return [];
    }

    const selectedDay = current.value;

    return hourly.time
      .map((time, index) => ({
        time,
        temp: hourly.temperature_2m[index],
        code: hourly.weather_code[index],
      }))
      .filter((item) => item.time.split('T')[0] === selectedDay);
  });

  availableDays = computed(() => {
    const hourly = this.hourlyWeather();

    if (!hourly) {
      return [];
    }

    const dateItems = hourly.time.map((item) => item.split('T')[0]);

    return Array.from(new Set(dateItems)).map((date) => {
      return {
        value: date,
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      };
    });
  });

  currentSelectedDay = computed(() => {
    const days = this.availableDays();
    const selected = this.selectedDay();

    if (!days.length) {
      return null;
    }

    if (!selected) {
      return days[0];
    }

    return days.find((day) => day.value === selected) ?? days[0];
  });

  onDaySelected(dayValue: string) {
    this.selectedDay.set(dayValue);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    const q = value.trim().toLowerCase();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!q) {
      this.cities.set([]);
      this.noResults.set(false);
      this.isOpenDropdown.set(false);
      this.isSearchLoading.set(false);
      return;
    }

    this.noResults.set(false);

    this.searchTimeout = setTimeout(() => {
      this.isSearchLoading.set(true);

      const start = Date.now();

      this.weatherService.searchCity(q).subscribe({
        next: (data) => {
          const elapsed = Date.now() - start;
          const delay = Math.max(500 - elapsed, 0);

          setTimeout(() => {
            this.isSearchLoading.set(false);

            if (data.length > 0) {
              this.cities.set(data);
              this.isOpenDropdown.set(true);
            } else {
              this.cities.set([]);
              this.isOpenDropdown.set(false);
            }
          }, delay);
        },
        error: () => {
          this.isSearchLoading.set(false);
          this.cities.set([]);
          this.isOpenDropdown.set(false);
        },
      });
    }, 400);
  }

  selectCity(city: CityResult) {
    this.selectedCity.set(city);
    this.search.set('');
    this.isOpenDropdown.set(false);
    this.cities.set([]);
    (document.activeElement as HTMLElement)?.blur();
  }

  loadWeather(city: CityResult) {
    this.isLoading.set(true);

    const lat = city.latitude;
    const lon = city.longitude;
    const temp = this.unitsService.temperatureUnit();
    const wind = this.unitsService.windSpeedUnit();
    const precip = this.unitsService.precipitationUnit();

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.weatherService.getWeather(lat, lon, temp, wind, precip).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error');
        this.weather.set(null);
        this.isLoading.set(false);
      },
    });
  }

  onSearch() {
    const q = this.search().trim().toLowerCase();

    if (!q) {
      return;
    }

    if (this.cities().length > 0) {
      this.selectCity(this.cities()[0]);
      return;
    }

    this.errorMessage.set('');
    this.noResults.set(false);

    this.weatherService.searchCity(q).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.selectCity(data[0]);
          this.isLoading.set(false);
        } else {
          this.noResults.set(true);
          this.isLoading.set(false);
          this.cities.set([]);
          this.isOpenDropdown.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('Error');
        this.isLoading.set(false);
        this.cities.set([]);
        this.isOpenDropdown.set(false);
      },
    });
  }

  clearSearch() {
    this.search.set('');
    this.isOpenDropdown.set(false);
    this.cities.set([]);
    this.noResults.set(false);
  }

  retry() {
    const city = this.selectedCity();

    if (!city) {
      return;
    }
    this.errorMessage.set('');
    this.loadWeather(city);
  }

  constructor() {
    effect(() => {
      const city = this.selectedCity();

      this.unitsService.temperatureUnit();
      this.unitsService.windSpeedUnit();
      this.unitsService.precipitationUnit();

      if (!city) {
        return;
      }
      this.loadWeather(city);
    });
  }
}
