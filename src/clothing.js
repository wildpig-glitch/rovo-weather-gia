/**
 * Provide clothing recommendations based on weather conditions.
 */
export async function clothingRecommendations(payload, requestContext) {
  const { temperature, description, rain, snow } = payload;
  
  console.log(`Generating clothing recommendations for: temp=${temperature}°C, conditions=${description}, rain=${rain}, snow=${snow}`);
  
  const recommendations = generateOutfitSuggestions(temperature, description, rain, snow);
  
  console.log(`Clothing recommendations: ${JSON.stringify(recommendations)}`);
  return recommendations;
}

/**
 * Generate specific outfit suggestions based on weather conditions.
 */
function generateOutfitSuggestions(temperature, description, rain, snow) {
  const outfit = {
    layers: [],
    footwear: [],
    accessories: [],
    notes: []
  };
  
  // Temperature-based base layers
  if (temperature < -10) {
    outfit.layers.push("thermal underwear", "heavy wool sweater", "insulated winter coat");
    outfit.footwear.push("insulated winter boots");
    outfit.accessories.push("warm hat", "insulated gloves", "scarf");
    outfit.notes.push("Dress in multiple layers for extreme cold");
  } else if (temperature < 0) {
    outfit.layers.push("long-sleeve base layer", "warm sweater", "winter coat");
    outfit.footwear.push("warm boots");
    outfit.accessories.push("warm hat", "gloves", "scarf");
    outfit.notes.push("Layer up to stay warm in freezing temperatures");
  } else if (temperature < 10) {
    outfit.layers.push("long-sleeve shirt", "light jacket or cardigan");
    outfit.footwear.push("closed-toe shoes", "boots");
    outfit.accessories.push("light scarf or hat");
    outfit.notes.push("Cool weather - light layers recommended");
  } else if (temperature < 20) {
    outfit.layers.push("long-sleeve shirt or light sweater");
    outfit.footwear.push("comfortable shoes", "sneakers");
    outfit.accessories.push("light jacket (optional)");
    outfit.notes.push("Mild weather - comfortable casual wear");
  } else if (temperature < 25) {
    outfit.layers.push("t-shirt or short-sleeve shirt");
    outfit.footwear.push("sneakers", "casual shoes");
    outfit.notes.push("Pleasant weather - light clothing");
  } else if (temperature < 30) {
    outfit.layers.push("light t-shirt", "shorts or light pants");
    outfit.footwear.push("breathable sneakers", "sandals");
    outfit.accessories.push("sunglasses", "sun hat");
    outfit.notes.push("Warm weather - stay cool and comfortable");
  } else {
    outfit.layers.push("lightweight, breathable clothing", "shorts", "tank top or light t-shirt");
    outfit.footwear.push("breathable shoes", "sandals");
    outfit.accessories.push("sunglasses", "wide-brimmed hat", "sunscreen");
    outfit.notes.push("Hot weather - prioritize cooling and sun protection");
  }
  
  // Rain adjustments
  if (rain && rain["3h"] > 0) {
    const rainAmount = rain["3h"];
    if (rainAmount > 5) {
      outfit.layers.push("waterproof rain jacket");
      outfit.footwear = ["waterproof boots"];
      outfit.accessories.push("umbrella");
      outfit.notes.push("Heavy rain expected - waterproof gear essential");
    } else if (rainAmount > 1) {
      outfit.layers.push("water-resistant jacket");
      outfit.accessories.push("umbrella");
      outfit.notes.push("Moderate rain - bring rain protection");
    } else {
      outfit.accessories.push("light rain jacket or umbrella");
      outfit.notes.push("Light rain possible - bring backup protection");
    }
  }
  
  // Snow adjustments
  if (snow && snow["3h"] > 0) {
    const snowAmount = snow["3h"];
    if (snowAmount > 5) {
      outfit.footwear = ["insulated waterproof boots"];
      outfit.accessories.push("warm waterproof gloves", "snow goggles or sunglasses");
      outfit.notes.push("Heavy snow - wear waterproof and insulated gear");
    } else {
      outfit.footwear.push("waterproof boots");
      outfit.accessories.push("waterproof gloves");
      outfit.notes.push("Snow expected - waterproof footwear recommended");
    }
  }
  
  // Weather condition specific adjustments
  const lowerDescription = description.toLowerCase();
  
  if (lowerDescription.includes("wind")) {
    outfit.layers.push("windbreaker or wind-resistant jacket");
    outfit.notes.push("Windy conditions - wear wind-resistant clothing");
  }
  
  if (lowerDescription.includes("sun") || lowerDescription.includes("clear")) {
    outfit.accessories.push("sunglasses", "sunscreen");
    if (temperature > 20) {
      outfit.accessories.push("sun hat");
    }
  }
  
  if (lowerDescription.includes("storm") || lowerDescription.includes("thunder")) {
    outfit.layers.push("waterproof jacket");
    outfit.accessories.push("umbrella");
    outfit.notes.push("Stormy weather - stay dry and avoid metal accessories");
  }
  
  if (lowerDescription.includes("fog") || lowerDescription.includes("mist")) {
    outfit.accessories.push("light jacket");
    outfit.notes.push("Foggy conditions - visibility may be reduced");
  }
  
  // Remove duplicates and format
  outfit.layers = [...new Set(outfit.layers)];
  outfit.footwear = [...new Set(outfit.footwear)];
  outfit.accessories = [...new Set(outfit.accessories)];
  outfit.notes = [...new Set(outfit.notes)];
  
  return {
    temperature: `${Math.round(temperature)}°C`,
    conditions: description,
    outfit: outfit,
    summary: generateOutfitSummary(outfit, temperature)
  };
}

/**
 * Generate a concise outfit summary.
 */
function generateOutfitSummary(outfit, temperature) {
  let summary = "";
  
  if (temperature < 0) {
    summary = "Bundle up with warm layers, winter coat, and insulated accessories.";
  } else if (temperature < 10) {
    summary = "Dress in layers with a jacket and closed-toe shoes.";
  } else if (temperature < 20) {
    summary = "Comfortable casual wear with optional light jacket.";
  } else if (temperature < 30) {
    summary = "Light, breathable clothing with sun protection.";
  } else {
    summary = "Minimal, cooling clothing with maximum sun protection.";
  }
  
  if (outfit.accessories.includes("umbrella")) {
    summary += " Don't forget rain protection.";
  }
  
  if (outfit.accessories.includes("waterproof gloves")) {
    summary += " Waterproof gear recommended for snow.";
  }
  
  return summary;
}