import { fetch } from '@forge/api';
import { DateTime } from 'luxon';

/**
 * Return a five-day forecast for a specified latitude and longitude.
 */
export async function forecast(payload, requestContext) {
  const { latitude, longitude } = payload;
  const { OPEN_WEATHER_KEY } = process.env;

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}`);
  const body = await response.json();

  if (body.cod !== "200") {
    console.log(`Could not fetch weather data for ${latitude}, ${longitude}: ${JSON.stringify(body)}`);
    return "Could not fetch weather data.";
  }

  // Convert the forecast data into a more readable format for the LLM, minimising the need for further time or temperature conversions.
  const forecast = body.list.map(({ dt, main, weather, rain, snow }) => {
    return {
      localTime: formatTimestamp(dt, body.city.timezone), // convert to local time
      temperature: main.temp - 273.15, // convert Kelvin to Celsius
      description: weather[0].description,
      rain,
      snow
    };
  });
  console.log(`Forecast for ${latitude}, ${longitude}: ${JSON.stringify(forecast)}`);
  return forecast;
}

/**
 * Convert a unix timestamp to a formatted date and time string in the specified timezone.
 */
function formatTimestamp(unixTimestamp, timezoneOffsetSeconds) {
  const dateTime = DateTime.fromMillis(unixTimestamp * 1000, { zone: 'utc' }).plus({ seconds: timezoneOffsetSeconds });
  return dateTime.toFormat('ccc LLL dd, yyyy HH:mm');
}
