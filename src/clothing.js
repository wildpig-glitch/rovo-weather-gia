/**
 * Provide clothing recommendations based on weather conditions and temperature.
 */
export async function clothingRecommendations(payload, requestContext) {
  const { temperature, description, rain, snow } = payload;
  
  console.log(`Generating clothing recommendations for temp: ${temperature}°C, conditions: ${description}, rain: ${JSON.stringify(rain)}, snow: ${JSON.stringify(snow)}`);
  
  const recommendations = generateClothingRecommendations(temperature, description, rain, snow);
  
  console.log(`Clothing recommendations: ${JSON.stringify(recommendations)}`);
  return recommendations;
}

/**
 * Generate specific clothing recommendations based on weather conditions.
 */
function generateClothingRecommendations(temperature, description, rain, snow) {
  const recommendations = {
    outfit: [],
    accessories: [],
    footwear: [],
    notes: []
  };
  
  // Temperature-based clothing recommendations
  if (temperature <= -10) {
    recommendations.outfit.push("Heavy winter coat or parka");
    recommendations.outfit.push("Thermal underwear");
    recommendations.outfit.push("Wool sweater or fleece");
    recommendations.outfit.push("Insulated pants");
    recommendations.accessories.push("Warm hat covering ears");
    recommendations.accessories.push("Insulated gloves or mittens");
    recommendations.accessories.push("Scarf or neck warmer");
    recommendations.footwear.push("Insulated winter boots");
    recommendations.notes.push("Dress in layers to trap warm air");
  } else if (temperature <= 0) {
    recommendations.outfit.push("Winter coat");
    recommendations.outfit.push("Warm sweater or hoodie");
    recommendations.outfit.push("Long pants");
    recommendations.accessories.push("Warm hat");
    recommendations.accessories.push("Gloves");
    recommendations.footwear.push("Warm boots or sturdy shoes");
    recommendations.notes.push("Layer clothing for warmth");
  } else if (temperature <= 10) {
    recommendations.outfit.push("Light jacket or coat");
    recommendations.outfit.push("Long-sleeve shirt or sweater");
    recommendations.outfit.push("Long pants");
    recommendations.accessories.push("Light scarf (optional)");
    recommendations.footwear.push("Closed-toe shoes");
    recommendations.notes.push("Perfect weather for layering");
  } else if (temperature <= 20) {
    recommendations.outfit.push("Light sweater or cardigan");
    recommendations.outfit.push("Long-sleeve shirt or light jacket");
    recommendations.outfit.push("Long pants or jeans");
    recommendations.footwear.push("Comfortable shoes or sneakers");
    recommendations.notes.push("Mild weather - light layers recommended");
  } else if (temperature <= 25) {
    recommendations.outfit.push("Light long-sleeve shirt or t-shirt");
    recommendations.outfit.push("Light pants or jeans");
    recommendations.footwear.push("Comfortable shoes or sneakers");
    recommendations.notes.push("Pleasant weather for most activities");
  } else if (temperature <= 30) {
    recommendations.outfit.push("T-shirt or light blouse");
    recommendations.outfit.push("Shorts or light pants");
    recommendations.footwear.push("Breathable shoes or sandals");
    recommendations.accessories.push("Sunglasses");
    recommendations.notes.push("Warm weather - stay cool and comfortable");
  } else {
    recommendations.outfit.push("Light, breathable clothing");
    recommendations.outfit.push("Shorts and tank top or t-shirt");
    recommendations.footwear.push("Sandals or breathable shoes");
    recommendations.accessories.push("Sunglasses");
    recommendations.accessories.push("Sun hat");
    recommendations.notes.push("Very hot weather - prioritize staying cool");
    recommendations.notes.push("Seek shade and stay hydrated");
  }
  
  // Weather condition-specific recommendations
  const lowerDescription = description.toLowerCase();
  
  // Rain-specific recommendations
  if (rain && rain['3h'] > 0) {
    recommendations.accessories.push("Umbrella");
    recommendations.outfit.push("Waterproof jacket or raincoat");
    recommendations.footwear = ["Waterproof shoes or rain boots"];
    recommendations.notes.push("Rain expected - stay dry!");
    
    if (rain['3h'] > 5) {
      recommendations.notes.push("Heavy rain expected - consider waterproof pants");
    }
  } else if (lowerDescription.includes('rain') || lowerDescription.includes('drizzle') || lowerDescription.includes('shower')) {
    recommendations.accessories.push("Umbrella (just in case)");
    recommendations.notes.push("Possible rain - be prepared");
  }
  
  // Snow-specific recommendations
  if (snow && snow['3h'] > 0) {
    recommendations.accessories.push("Warm hat and gloves");
    recommendations.footwear = ["Waterproof winter boots with good traction"];
    recommendations.notes.push("Snow expected - dress warmly and wear appropriate footwear");
    
    if (snow['3h'] > 5) {
      recommendations.notes.push("Heavy snow expected - consider staying indoors if possible");
    }
  } else if (lowerDescription.includes('snow')) {
    recommendations.notes.push("Snow possible - be prepared for winter conditions");
  }
  
  // Wind-specific recommendations
  if (lowerDescription.includes('wind')) {
    recommendations.accessories.push("Secure hat or avoid loose accessories");
    recommendations.notes.push("Windy conditions - secure loose items");
  }
  
  // Sun-specific recommendations
  if (lowerDescription.includes('clear') || lowerDescription.includes('sunny')) {
    recommendations.accessories.push("Sunglasses");
    if (temperature > 20) {
      recommendations.accessories.push("Sunscreen");
      recommendations.accessories.push("Sun hat");
    }
  }
  
  // Fog/mist recommendations
  if (lowerDescription.includes('fog') || lowerDescription.includes('mist')) {
    recommendations.notes.push("Reduced visibility - be extra cautious when traveling");
  }
  
  return recommendations;
}