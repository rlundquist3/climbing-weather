import { APIRoute } from "astro";
import { Client, cacheExchange, fetchExchange, gql } from "@urql/core";
import type { Coordinates } from "../../util/weather-data";
import { parseQueryParams } from "../../util/mappers";

export const prerender = false;

const client = new Client({
  url: "https://api.openbeta.io/",
  exchanges: [cacheExchange, fetchExchange],
});

export type GqlArea = {
  area_name: string;
  children?: GqlArea[];
  metadata?: Coordinates;
};

const query = gql<{ areas: GqlArea[] }, { input: string }>`
  query FindAreas($input: String!) {
    areas(filter: { area_name: { match: $input } }) {
      area_name
      children {
        area_name
        metadata {
          lat
          lng
        }
      }
    }
  }
`;

export const GET: APIRoute = async ({ params, request }) => {
  const { input } = parseQueryParams(request.url.split("?")[1]);

  console.log("INPUT:", input);

  if (input) {
    const q = client.query(query, { input });
    console.log(q);
    const { data } = await q;
    const areas = data?.areas ?? [];
    console.log(areas);

    return new Response(JSON.stringify(areas));
  }

  return new Response(
    JSON.stringify({
      error: `Input not valid`,
    }),
    {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
