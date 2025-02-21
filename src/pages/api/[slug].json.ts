import { APIRoute } from "astro";
import { parseAreaSlug, parseQueryParams } from "../../util/mappers";
import { Area, areas } from "../../util/areas";
import {
  Coordinates,
  getForecast,
  getPastWeather,
} from "../../util/weather-data";

export const prerender = false;

const getCoordinatesFromQueryString = (
  queryString: string
): Coordinates | undefined => {
  if (queryString) {
    const queryParams = parseQueryParams(queryString);
    const lat = Number(queryParams.lat);
    const lng = Number(queryParams.lng);
    if (isFinite(lat) && isFinite(lng)) {
      return { lat, lng };
    }
  }

  return undefined;
};

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  const queryString = request.url.split("?")[1];

  let area: Area | undefined = areas.find((area) => slug === area.slug);
  if (slug && !area && queryString) {
    const coordinates = getCoordinatesFromQueryString(queryString);
    if (coordinates) {
      area = {
        slug,
        name: parseAreaSlug(slug),
        ...coordinates,
      };
    }

    if (!area) {
      return new Response(
        JSON.stringify({
          error: `Area ${params.id} not yet supported and coordinates not provided`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  if (area) {
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
  }
  return new Response(JSON.stringify("Error: Area not found"), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
