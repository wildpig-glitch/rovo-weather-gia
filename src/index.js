export async function forecast(payload, requestContext) {
    console.log(`payload: ${JSON.stringify(payload)}`);
    console.log(`payload: ${JSON.stringify(requestContext)}`);
    
    const { latitude, longitude } = payload;
    const { OPEN_WEATHER_KEY } = process.env;
    
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}`);
    console.log(`weather: ${JSON.stringify(weather)}`);
    
    return weather;
}
