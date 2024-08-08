import { fetch } from '@forge/api';

export async function geocode(payload, requestContext) {
  let { city, state, country } = payload;
  state = state || '';
  const { OPEN_WEATHER_KEY } = process.env;
    
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${OPEN_WEATHER_KEY}`);
  const body = await response.json();

  if (body.length > 0) {
    const { lat, lon } = body[0];
    return { latitude: lat, longitude: lon };
  }

  return "Could not geocode location.";
}
