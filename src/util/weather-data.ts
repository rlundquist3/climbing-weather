import { DateTime } from "luxon";

export type Coordinates = {
  lat: number;
  lng: number;
};

const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";
const appid = import.meta.env.WEATHER_API_KEY;

const transformQueryParams = (params: {
  [key: string]: number | string;
}): string =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export const getForecast = async ({ lat, lng }: Coordinates) => {
  const response = await fetch(
    `${WEATHER_API_URL}?${transformQueryParams({
      appid,
      lat,
      lon: lng,
      units: "imperial",
    })}`
  );
  return response.json();
};

export const getPastWeather = async (
  { lat, lng }: Coordinates,
  days: number = 3
) => {
  const pastNDays = [...Array(3)]
    .map((_, i) =>
      DateTime.now()
        .minus({ days: i + 1 })
        .toISODate()
    )
    .reverse();

  const responses = await Promise.all(
    pastNDays.map((date) =>
      fetch(
        `${WEATHER_API_URL}/day_summary?${transformQueryParams({
          appid,
          lat,
          lon: lng,
          date,
          units: "imperial",
        })}`
      )
    )
  );
  return Promise.all(responses.map((r) => r.json()));
};
