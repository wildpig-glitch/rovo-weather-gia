import { fetch } from '@forge/api';
import { DateTime } from 'luxon';

export async function forecast(payload, requestContext) {
  const { latitude, longitude } = payload;
  const { OPEN_WEATHER_KEY } = process.env;

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}`);
  const body = await response.json();

  console.log("weather data", JSON.stringify(body));

  if (body.cod !== "200") {
    return "Could not fetch weather data.";
  }

  const tzOffset = body.city.timezone;

  let forecast = [];
  for (let i = 0; i < body.list.length; i += 1) {
    const { dt, main, weather, rain, snow } = body.list[i];
    forecast.push({
      localTime: convertTimestampToHumanReadable(dt, tzOffset),
      temperature: main.temp - 273.15, // convert to Celsius
      description: weather[0].description,
      rain,
      snow
    });
  }
  return forecast;
}

function convertTimestampToHumanReadable(unixTimestamp, timezoneOffsetSeconds) {
    // Luxon uses milliseconds for timestamps, so multiply by 1000
    const timestampInMilliseconds = unixTimestamp * 1000;
    // Calculate the timezone offset in minutes
    const timezoneOffsetMinutes = timezoneOffsetSeconds / 60;
    // Create a DateTime object with the specified offset
    const dateTime = DateTime.fromMillis(timestampInMilliseconds, { zone: 'utc' }).plus({ minutes: timezoneOffsetMinutes });
    // Return the human-readable format
    return dateTime.toFormat('yyyy-LL-dd HH:mm');
  }
