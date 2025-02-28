const BASE_URL = 'https://api.mapbox.com';

export async function getDirections(from, to) {
  const response = await fetch(
    `${BASE_URL}/directions/v5/mapbox/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`
  );
  const json = await response.json();
  return json;
}

export async function fetchDirectionBasedOnCoords(coordinates:[]) {
  const coordinatesString = coordinates.map((coord) => `${coord[0]},${coord[1]}`).join(';');
  const response = await fetch(
    `${BASE_URL}/matching/v5/mapbox/cycling/${coordinatesString}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`
  );
  const json = await response.json();
  return json;
}

export async function getCoordinates(address:string, setCoordinates ) {
  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(
    `${BASE_URL}/search/geocode/v6/forward?q=${encodedAddress}&proximity=-73.990593%2C40.740121&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`
  );
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    const coordinates = data.features[0].geometry.coordinates; // Access its coordinates (longitude, latitude)
    console.log(coordinates)
    setCoordinates(coordinates);
  } else {
    console.log('No results found.');
  }
  return data.features[0].geometry.coordinates;
}