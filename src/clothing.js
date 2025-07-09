/**
 * Generate clothing recommendations based on weather conditions.
 */
export async function clothingRecommendations(payload, requestContext) {
  const { temperature, description, rain, snow } = payload;
  
  console.log(`Generating clothing recommendations for: temp=${temperature}°C, conditions=${description}, rain=${rain || 0}mm, snow=${snow || 0}mm`);
  
  const recommendations = generateOutfitSuggestions(temperature, description, rain, snow);
  
  console.log(`Clothing recommendations: ${JSON.stringify(recommendations)}`);
  return recommendations;
}

/**
 * Generate specific outfit suggestions based on temperature and weather conditions.
 */
function generateOutfitSuggestions(temperature, description, rain = 0, snow = 0) {
  const recommendations = {
    temperature: temperature,
    conditions: description,
    outfit: [],
    accessories: [],
    footwear: [],
    notes: []
  };

  // Temperature-based clothing recommendations
  if (temperature < -10) {
    // Extremely cold
    recommendations.outfit.push("Heavy winter coat or parka");
    recommendations.outfit.push("Thermal underwear");
    recommendations.outfit.push("Wool sweater or fleece");
    recommendations.outfit.push("Insulated pants or snow pants");
    recommendations.accessories.push("Winter hat and gloves");
    recommendations.accessories.push("Scarf");
    recommendations.footwear.push("Insulated winter boots");
    recommendations.notes.push("Layer up to stay warm in extreme cold");
  } else if (temperature < 0) {
    // Very cold
    recommendations.outfit.push("Winter coat");
    recommendations.outfit.push("Warm sweater or hoodie");
    recommendations.outfit.push("Long pants");
    recommendations.accessories.push("Hat and gloves");
    recommendations.footwear.push("Winter boots");
    recommendations.notes.push("Dress in layers for warmth");
  } else if (temperature < 10) {
    // Cold
    recommendations.outfit.push("Jacket or coat");
    recommendations.outfit.push("Long-sleeve shirt or sweater");
    recommendations.outfit.push("Long pants");
    recommendations.accessories.push("Light gloves (optional)");
    recommendations.footwear.push("Closed-toe shoes or boots");
    recommendations.notes.push("A light jacket should be sufficient");
  } else if (temperature < 20) {
    // Cool/Mild
    recommendations.outfit.push("Light jacket or cardigan");
    recommendations.outfit.push("Long-sleeve shirt or light sweater");
    recommendations.outfit.push("Long pants or jeans");
    recommendations.footwear.push("Sneakers or casual shoes");
    recommendations.notes.push("Perfect weather for layering");
  } else if (temperature < 25) {
    // Comfortable/Warm
    recommendations.outfit.push("T-shirt or light blouse");
    recommendations.outfit.push("Light pants or jeans");
    recommendations.footwear.push("Sneakers or casual shoes");
    recommendations.notes.push("Comfortable temperature for most activities");
  } else if (temperature < 30) {
    // Warm
    recommendations.outfit.push("T-shirt or tank top");
    recommendations.outfit.push("Shorts or light pants");
    recommendations.footwear.push("Sandals or breathable shoes");
    recommendations.accessories.push("Sunglasses");
    recommendations.notes.push("Stay cool with light, breathable fabrics");
  } else {
    // Hot
    recommendations.outfit.push("Light, breathable clothing");
    recommendations.outfit.push("Shorts or light dress");
    recommendations.outfit.push("Tank top or light t-shirt");
    recommendations.footwear.push("Sandals or ventilated shoes");
    recommendations.accessories.push("Sunglasses and hat");
    recommendations.notes.push("Stay hydrated and seek shade when possible");
  }

  // Weather condition adjustments
  if (rain > 0 || description.toLowerCase().includes('rain')) {
    recommendations.accessories.push("Umbrella");
    recommendations.outfit.push("Waterproof jacket or raincoat");
    recommendations.footwear = ["Waterproof shoes or rain boots"];
    recommendations.notes.push("Stay dry with waterproof gear");
  }

  if (snow > 0 || description.toLowerCase().includes('snow')) {
    recommendations.accessories.push("Waterproof gloves");
    recommendations.footwear = ["Waterproof winter boots with good traction"];
    recommendations.notes.push("Be careful of slippery conditions");
  }

  if (description.toLowerCase().includes('wind')) {
    recommendations.outfit.push("Windbreaker or wind-resistant jacket");
    recommendations.notes.push("Protect against wind chill");
  }

  if (description.toLowerCase().includes('sun') || description.toLowerCase().includes('clear')) {
    recommendations.accessories.push("Sunglasses");
    if (temperature > 20) {
      recommendations.accessories.push("Sunscreen");
      recommendations.accessories.push("Hat for sun protection");
    }
  }

  // Remove duplicates and clean up recommendations
  recommendations.outfit = [...new Set(recommendations.outfit)];
  recommendations.accessories = [...new Set(recommendations.accessories)];
  recommendations.footwear = [...new Set(recommendations.footwear)];
  recommendations.notes = [...new Set(recommendations.notes)];

  return recommendations;
}