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
