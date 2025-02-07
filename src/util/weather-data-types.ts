export type PastWeatherDayData = {
  lat: number;
  lon: number;
  tz: string;
  date: string;
  units: string;
  cloud_cover: { [key: string]: number };
  humidity: { [key: string]: number };
  precipitation: { [key: string]: number; total: number };
  temperature: {
    min: number;
    max: number;
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  pressure: { [key: string]: number };
  wind: { max: { speed: number; direction: number } };
};

export type ForecastData = {
  lat: number;
  lon: number;
  timezone: string;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
};

export type WeatherDescription = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type PrecipEstimate = { [key: string]: number };

export type BaseForecastItem = {
  dt: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  weather: [WeatherDescription];
};

export type HourlyForecastItem = BaseForecastItem & {
  temp: number;
  feels_like: number;
  rain: PrecipEstimate;
  snow: PrecipEstimate;
};

export type CurrentWeatherData = HourlyForecastItem & {
  sunrise: number;
  sunset: number;
};

export type DailyForecastItem = BaseForecastItem & {
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  rain: number;
  snow: number;
};
