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
  ancestors: string[];
  children?: GqlArea[];
  metadata?: Coordinates;
};

const areasQuery = gql<{ areas: GqlArea[] }, { input: string }>`
  query FindAreas($input: String!) {
    areas(filter: { area_name: { match: $input } }) {
      area_name
      ancestors
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

const ancestorNameQuery = gql<{ area: GqlArea }, { uuid: string }>`
  query Area($uuid: ID) {
    area(uuid: $uuid) {
      area_name
    }
  }
`;

const hasCoordinatesInTree = ({ children, metadata }: GqlArea): boolean =>
  !!(metadata?.lat && metadata?.lng) ||
  !!(children && children?.some(hasCoordinatesInTree));

const formatAncestorNames = (
  ancestorAreas: { data?: { area: GqlArea } }[]
): string =>
  ancestorAreas
    .filter((d): d is { data: { area: GqlArea } } => !!d.data)
    .reverse()
    .slice(1)
    .map(({ data }) => data.area.area_name)
    .join(" | ");

// this assumption of the first coordinates should be fine for now; maybe improve later
const formatAreaSuggestion = async ({
  area_name,
  ancestors,
  children,
  metadata,
}: GqlArea): Promise<Area | undefined> => {
  const coordinates = !!(metadata?.lat && metadata?.lng)
    ? metadata
    : children?.find(({ metadata }) => !!(metadata?.lat && metadata?.lng))
        ?.metadata;

  if (coordinates) {
    const ancestorNames = await Promise.all(
      ancestors.map((uuid) => client.query(ancestorNameQuery, { uuid }))
    );

    return {
      name: area_name,
      slug: getAreaSlug(area_name),
      ancestors: formatAncestorNames(ancestorNames),
      ...coordinates,
    };
  }
  return undefined;
};

export const GET: APIRoute = async ({ request }) => {
  const { input } = parseQueryParams(request.url.split("?")[1]);

  if (input) {
    const { data } = await client.query(areasQuery, { input });
    const areas: Area[] = (
      await Promise.all(
        (data?.areas ?? [])
          .filter(hasCoordinatesInTree)
          .map(formatAreaSuggestion)
      )
    ).filter((a): a is Area => !!a);

    const responseHtml = areas.length
      ? `
        <ul>${areas
          .map(
            ({ name, slug, ancestors, lat, lng }) =>
              `<li><a href="/area/${slug}?lat=${lat}&lng=${lng}">${name}</a>${
                ancestors ? ` (${ancestors})` : ""
              }</li>`
          )
          .join("\n")}</ul>
    `
      : `<span class="no-results">no results: try a more general search</span>`;

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
