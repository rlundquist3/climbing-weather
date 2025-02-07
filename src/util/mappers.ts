const directionRanges = {
  N: [-15, 15],
  NNE: [15, 35],
  NE: [35, 55],
  ENE: [55, 75],
  E: [75, 105],
  ESE: [105, 125],
  SE: [125, 145],
  SSE: [145, 165],
  S: [165, 195],
  SSW: [195, 215],
  SW: [215, 235],
  WSW: [235, 255],
  W: [255, 285],
  WNW: [285, 305],
  NW: [305, 325],
  NNW: [325, 345],
};

export const getCardinalDirectionFromDegrees = (
  _degrees: number
): string | undefined => {
  const degrees =
    345 <= _degrees && _degrees <= 360 ? _degrees - 360 : _degrees;

  return Object.entries(directionRanges).find(
    ([_, range]) => range[0] <= degrees && degrees < range[1]
  )?.[0];
};

export const mmToIn = (mm: number) => (mm * 0.03937007874).toFixed(2);
