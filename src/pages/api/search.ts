import { APIRoute } from "astro";
import { Client, cacheExchange, fetchExchange, gql } from "@urql/core";
import type { Coordinates } from "../../util/weather-data";
import type { Area } from "../../util/areas";
import { getAreaSlug, parseQueryParams } from "../../util/mappers";

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

const hasCoordinatesInTree = ({ children, metadata }: GqlArea): boolean =>
  !!(metadata?.lat && metadata?.lng) ||
  !!(children && children?.some(hasCoordinatesInTree));

// his assumption of the first coordinates should be fine for now; maybe improve later
const formatAreaSuggestion = ({
  area_name,
  children,
  metadata,
}: GqlArea): Area | undefined => {
  const coordinates = !!(metadata?.lat && metadata?.lng)
    ? metadata
    : children?.find(({ metadata }) => !!(metadata?.lat && metadata?.lng))
        ?.metadata;

  if (coordinates) {
    return {
      name: area_name,
      slug: getAreaSlug(area_name),
      ...coordinates,
    };
  }
  return undefined;
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
    const { data } = await client.query(query, { input });
    const areas: Area[] = (data?.areas ?? [])
      .filter(hasCoordinatesInTree)
      .map(formatAreaSuggestion)
      .filter((a): a is Area => !!a);

    const responseHtml = `
        ${areas
          .map(
            ({ name, slug, lat, lng }) =>
              `<li><a href="/area/${slug}?lat=${lat}&lng=${lng}">${name}</a></li>`
          )
          .join("\n")}
    `;

    return new Response(responseHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return new Response("Input not valid", {
    status: 400,
    headers: {
      "Content-Type": "text/html",
    },
  });
};
