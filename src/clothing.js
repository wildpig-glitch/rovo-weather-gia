/**
 * Generate personalized clothing suggestions based on weather conditions, season, and region.
 */
export async function clothingSuggestions(payload, requestContext) {
  const { temperature, description, rain, snow, season, region } = payload;
  
  console.log(`Generating clothing suggestions for: temp=${temperature}°C, weather=${description}, season=${season}, region=${region}`);
  
  const suggestions = {
    layers: [],
    accessories: [],
    footwear: [],
    special_considerations: []
  };
  
  // Base layer recommendations based on temperature
  if (temperature <= 0) {
    suggestions.layers.push("thermal underwear", "heavy winter coat", "warm sweater or fleece");
    suggestions.accessories.push("winter hat", "insulated gloves", "warm scarf");
    suggestions.footwear.push("insulated winter boots");
  } else if (temperature <= 10) {
    suggestions.layers.push("warm jacket or coat", "long-sleeve shirt", "light sweater");
    suggestions.accessories.push("light gloves", "beanie or hat");
    suggestions.footwear.push("closed-toe shoes", "warm socks");
  } else if (temperature <= 20) {
    suggestions.layers.push("light jacket or cardigan", "long-sleeve shirt or light sweater");
    suggestions.footwear.push("comfortable walking shoes");
  } else if (temperature <= 25) {
    suggestions.layers.push("t-shirt or light blouse", "light cardigan (optional)");
    suggestions.footwear.push("sneakers", "light shoes");
  } else {
    suggestions.layers.push("breathable t-shirt", "light cotton clothing");
    suggestions.accessories.push("sunhat", "sunglasses");
    suggestions.footwear.push("breathable shoes", "sandals (if appropriate)");
  }
  
  // Weather-specific modifications
  if (rain && rain["3h"] > 0) {
    suggestions.accessories.push("umbrella", "rain hat");
    suggestions.layers.push("waterproof jacket or rain coat");
    suggestions.footwear = suggestions.footwear.map(item => item.includes("sandals") ? "waterproof shoes" : item);
    suggestions.special_considerations.push("Bring waterproof gear - rain expected");
  }
  
  if (snow && snow["3h"] > 0) {
    suggestions.accessories.push("winter gloves", "warm hat", "scarf");
    suggestions.footwear = ["waterproof winter boots"];
    suggestions.special_considerations.push("Snow expected - wear non-slip footwear");
  }
  
  if (description.includes("wind")) {
    suggestions.layers.push("windproof jacket");
    suggestions.special_considerations.push("Windy conditions - secure loose clothing");
  }
  
  if (description.includes("sunny") || description.includes("clear")) {
    suggestions.accessories.push("sunglasses", "sunscreen");
    if (temperature > 20) {
      suggestions.special_considerations.push("Sunny day - protect from UV rays");
    }
  }
  
  // Regional and seasonal adjustments
  if (region && region.toLowerCase().includes("tropical")) {
    suggestions.layers = suggestions.layers.filter(item => !item.includes("heavy") && !item.includes("winter"));
    suggestions.layers.push("light, breathable fabrics");
    suggestions.special_considerations.push("Tropical climate - prioritize breathable materials");
  }
  
  if (season) {
    switch (season.toLowerCase()) {
      case "winter":
        if (!suggestions.layers.some(item => item.includes("winter"))) {
          suggestions.layers.push("warm winter clothing");
        }
        break;
      case "summer":
        suggestions.layers = suggestions.layers.filter(item => !item.includes("heavy") && !item.includes("winter"));
        suggestions.special_considerations.push("Summer season - stay cool and hydrated");
        break;
      case "spring":
      case "autumn":
      case "fall":
        suggestions.special_considerations.push("Transitional season - consider layering for temperature changes");
        break;
    }
  }
  
  // Remove duplicates and clean up
  suggestions.layers = [...new Set(suggestions.layers)];
  suggestions.accessories = [...new Set(suggestions.accessories)];
  suggestions.footwear = [...new Set(suggestions.footwear)];
  suggestions.special_considerations = [...new Set(suggestions.special_considerations)];
  
  console.log(`Clothing suggestions generated: ${JSON.stringify(suggestions)}`);
  return suggestions;
}