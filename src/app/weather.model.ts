export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface GeocodingResponse {
  results?: CityResult[];
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

export interface HourlyWeatherItem {
  time: string;
  temp: number;
  code: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface DailyWeatherItem {
  date: string;
  max: number;
  min: number;
  code: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface DayOption {
  value: string;
  label: string;
}

