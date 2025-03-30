export type Area = {
  slug: string;
  name: string;
  parent?: string;
  ancestors?: string;
  lat: number;
  lng: number;
};

export const areas: Area[] = [
  {
    slug: "kraft",
    name: "Kraft Boulders",
    parent: "Red Rocks",
    lat: 36.15912,
    lng: -115.41769,
  },
  {
    slug: "black-velvet",
    name: "Black Velvet Canyon",
    parent: "Red Rocks",
    lat: 36.0358,
    lng: -115.46348,
  },
  {
    slug: "keyhole",
    name: "Keyhole Canyon",
    lat: 35.7056,
    lng: -114.92892,
  },
  {
    slug: "moes",
    name: "Moe's Valley",
    lat: 37.07115,
    lng: -113.6355,
  },
  {
    slug: "secret-garden",
    name: "Secret Garden",
    parent: "Little Cottonwood",
    lat: 40.57264,
    lng: -111.77308,
  },
  {
    slug: "riverside",
    name: "Riverside",
    parent: "Little Cottonwood",
    lat: 40.57072,
    lng: -111.75464,
  },
  {
    slug: "white-pine",
    name: "White Pine",
    parent: "Little Cottonwood",
    lat: 40.5723,
    lng: -111.68503,
  },
  {
    slug: "joes-right-fork",
    name: "Right Fork",
    parent: "Joe's Valley",
    lat: 39.29029,
    lng: -111.17818,
  },
  {
    slug: "joes-left-fork",
    name: "Left Fork",
    parent: "Joe's Valley",
    lat: 39.27315,
    lng: -111.20032,
  },
  {
    slug: "new-joes",
    name: "New Joe's",
    parent: "Joe's Valley",
    lat: 39.30702,
    lng: -111.11605,
  },
];
