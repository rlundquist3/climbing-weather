export type Area = {
  id: string;
  name: string;
  parent?: string;
  lat: number;
  lng: number;
};

export const areas: Area[] = [
  {
    id: "kraft",
    name: "Kraft Boulders",
    parent: "Red Rocks",
    lat: 36.15912,
    lng: -115.41769,
  },
  {
    id: "black-velvet",
    name: "Black Velvet Canyon",
    parent: "Red Rocks",
    lat: 36.0358,
    lng: -115.46348,
  },
  {
    id: "keyhole",
    name: "Keyhole Canyon",
    lat: 35.7056,
    lng: -114.92892,
  },
  {
    id: "moes",
    name: "Moe's Valley",
    lat: 37.07115,
    lng: -113.6355,
  },
  {
    id: "secret-garden",
    name: "Secret Garden",
    parent: "Little Cottonwood",
    lat: 40.57264,
    lng: -111.77308,
  },
  {
    id: "riverside",
    name: "Riverside",
    parent: "Little Cottonwood",
    lat: 40.57072,
    lng: -111.75464,
  },
  {
    id: "white-pine",
    name: "White Pine",
    parent: "Little Cottonwood",
    lat: 40.5723,
    lng: -111.68503,
  },
  {
    id: "joes-right-fork",
    name: "Right Fork",
    parent: "Joe's Valley",
    lat: 39.29029,
    lng: -111.17818,
  },
  {
    id: "joes-left-fork",
    name: "Left Fork",
    parent: "Joe's Valley",
    lat: 39.27315,
    lng: -111.20032,
  },
  {
    id: "new-joes",
    name: "New Joe's",
    parent: "Joe's Valley",
    lat: 39.30702,
    lng: -111.11605,
  },
];
