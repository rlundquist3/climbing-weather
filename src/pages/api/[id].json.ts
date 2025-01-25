import { APIRoute } from "astro";
import { areas } from "../../util/areas";
import { getForecast, getPastWeather } from "../../util/weather-data";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const area = areas.find(({ id }) => id === params.id);

  if (!area) {
    return new Response(
      JSON.stringify({
        error: `Area ${params.id} not yet supported`,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const [forecast, pastWeather] = await Promise.all([
      getForecast(area),
      getPastWeather(area),
    ]);

    return new Response(
      JSON.stringify({
        area,
        forecast,
        pastWeather,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
