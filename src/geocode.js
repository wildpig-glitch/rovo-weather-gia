import { fetch } from '@forge/api';

/**
 * Geocode a location and return its latitude and longitude.
 */
export async function geocode(payload, requestContext) {
  let { city, state, country } = payload;
  state = state || '';
  const { OPEN_WEATHER_KEY } = process.env;
    
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${OPEN_WEATHER_KEY}`);
  const body = await response.json();

  if (body.length > 0) {
    const { lat, lon } = body[0];
    console.log(`Geocoded location: ${city}, ${state}, ${country} -> ${lat}, ${lon}`);
    return { latitude: lat, longitude: lon };
  }

  console.log(`Could not geocode location: ${city}, ${state}, ${country}`);
  return "Could not geocode location.";
}
