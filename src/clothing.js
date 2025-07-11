/**
 * Provide clothing recommendations based on weather conditions and temperature.
 */
export async function clothingRecommendations(payload, requestContext) {
  const { temperature, description, rain, snow } = payload;
  
  console.log(`Generating clothing recommendations for: ${temperature}°C, ${description}, rain: ${JSON.stringify(rain)}, snow: ${JSON.stringify(snow)}`);
  
  const recommendations = generateOutfitSuggestions(temperature, description, rain, snow);
  
  console.log(`Clothing recommendations: ${JSON.stringify(recommendations)}`);
  return recommendations;
}

/**
 * Generate specific outfit suggestions based on weather conditions.
 */
function generateOutfitSuggestions(temperature, description, rain, snow) {
  const hasRain = rain && (rain['3h'] > 0 || rain['1h'] > 0);
  const hasSnow = snow && (snow['3h'] > 0 || snow['1h'] > 0);
  const isWindy = description.toLowerCase().includes('wind');
  const isSunny = description.toLowerCase().includes('clear') || description.toLowerCase().includes('sun');
  
  let baseOutfit = getBaseOutfitForTemperature(temperature);
  let accessories = getAccessoriesForWeather(temperature, description, hasRain, hasSnow, isWindy);
  let footwear = getFootwearForWeather(temperature, hasRain, hasSnow);
  let outerwear = getOuterwearForWeather(temperature, hasRain, hasSnow, isWindy);
  
  return {
    temperature: `${Math.round(temperature)}°C`,
    conditions: description,
    outfit: {
      base: baseOutfit,
      outerwear: outerwear,
      footwear: footwear,
      accessories: accessories
    },
    summary: generateOutfitSummary(baseOutfit, outerwear, footwear, accessories, temperature, description)
  };
}

/**
 * Get base clothing recommendations based on temperature.
 */
function getBaseOutfitForTemperature(temp) {
  if (temp < -10) {
    return {
      top: "Thermal underwear + heavy sweater or fleece",
      bottom: "Thermal leggings + insulated pants",
      description: "Multiple layers for extreme cold"
    };
  } else if (temp < 0) {
    return {
      top: "Long-sleeve thermal shirt + warm sweater",
      bottom: "Thermal underwear + warm pants or jeans",
      description: "Warm layers for freezing temperatures"
    };
  } else if (temp < 10) {
    return {
      top: "Long-sleeve shirt + sweater or light jacket",
      bottom: "Jeans or warm pants",
      description: "Layered clothing for cold weather"
    };
  } else if (temp < 15) {
    return {
      top: "Long-sleeve shirt or light sweater",
      bottom: "Jeans or pants",
      description: "Light layers for cool weather"
    };
  } else if (temp < 20) {
    return {
      top: "Light long-sleeve shirt or t-shirt + cardigan",
      bottom: "Jeans, chinos, or light pants",
      description: "Comfortable layers for mild weather"
    };
  } else if (temp < 25) {
    return {
      top: "T-shirt or light blouse",
      bottom: "Jeans, chinos, or light pants",
      description: "Comfortable clothing for pleasant weather"
    };
  } else if (temp < 30) {
    return {
      top: "Light t-shirt or tank top",
      bottom: "Shorts, light pants, or skirt",
      description: "Light, breathable clothing for warm weather"
    };
  } else {
    return {
      top: "Lightweight, breathable shirt or tank top",
      bottom: "Shorts or light, airy clothing",
      description: "Minimal, breathable clothing for hot weather"
    };
  }
}

/**
 * Get outerwear recommendations based on weather conditions.
 */
function getOuterwearForWeather(temp, hasRain, hasSnow, isWindy) {
  let outerwear = [];
  
  if (hasSnow || temp < -5) {
    outerwear.push("Heavy winter coat or parka");
    if (hasSnow) {
      outerwear.push("Waterproof outer layer");
    }
  } else if (hasRain) {
    if (temp < 10) {
      outerwear.push("Waterproof jacket with warm lining");
    } else {
      outerwear.push("Rain jacket or waterproof coat");
    }
  } else if (isWindy) {
    if (temp < 15) {
      outerwear.push("Windbreaker or wind-resistant jacket");
    } else {
      outerwear.push("Light windbreaker");
    }
  } else if (temp < 5) {
    outerwear.push("Heavy coat or winter jacket");
  } else if (temp < 15) {
    outerwear.push("Jacket or coat");
  }
  
  return outerwear.length > 0 ? outerwear : ["No additional outerwear needed"];
}

/**
 * Get footwear recommendations based on weather conditions.
 */
function getFootwearForWeather(temp, hasRain, hasSnow) {
  if (hasSnow || temp < -5) {
    return ["Insulated, waterproof boots", "Warm socks or wool socks"];
  } else if (hasRain) {
    return ["Waterproof shoes or rain boots", "Water-resistant socks"];
  } else if (temp < 10) {
    return ["Closed-toe shoes or boots", "Warm socks"];
  } else if (temp < 20) {
    return ["Comfortable shoes or sneakers", "Regular socks"];
  } else {
    return ["Breathable shoes, sandals, or sneakers", "Light socks or no socks"];
  }
}

/**
 * Get accessories recommendations based on weather conditions.
 */
function getAccessoriesForWeather(temp, description, hasRain, hasSnow, isWindy) {
  let accessories = [];
  
  // Head protection
  if (hasSnow || temp < 0) {
    accessories.push("Warm hat or beanie");
  } else if (hasRain) {
    accessories.push("Hood or hat");
  } else if (description.toLowerCase().includes('clear') || description.toLowerCase().includes('sun')) {
    if (temp > 20) {
      accessories.push("Sun hat or cap");
    }
  }
  
  // Hand protection
  if (hasSnow || temp < 5) {
    accessories.push("Insulated gloves or mittens");
  } else if (temp < 10) {
    accessories.push("Light gloves");
  }
  
  // Neck protection
  if (hasSnow || temp < 0) {
    accessories.push("Scarf or neck warmer");
  } else if (temp < 10 && isWindy) {
    accessories.push("Light scarf");
  }
  
  // Eye protection
  if (description.toLowerCase().includes('clear') || description.toLowerCase().includes('sun')) {
    accessories.push("Sunglasses");
  }
  
  // Rain protection
  if (hasRain) {
    accessories.push("Umbrella");
  }
  
  return accessories.length > 0 ? accessories : ["No additional accessories needed"];
}

/**
 * Generate a concise outfit summary.
 */
function generateOutfitSummary(baseOutfit, outerwear, footwear, accessories, temp, description) {
  let summary = `For ${Math.round(temp)}°C and ${description}, wear: `;
  
  // Add base outfit
  summary += baseOutfit.top.toLowerCase();
  if (baseOutfit.bottom) {
    summary += ` with ${baseOutfit.bottom.toLowerCase()}`;
  }
  
  // Add outerwear if needed
  if (outerwear[0] !== "No additional outerwear needed") {
    summary += `, ${outerwear[0].toLowerCase()}`;
  }
  
  // Add footwear
  summary += `, and ${footwear[0].toLowerCase()}`;
  
  // Add key accessories
  const keyAccessories = accessories.filter(acc => 
    acc.includes('umbrella') || acc.includes('hat') || acc.includes('gloves') || acc.includes('sunglasses')
  );
  if (keyAccessories.length > 0 && accessories[0] !== "No additional accessories needed") {
    summary += `. Don't forget: ${keyAccessories.join(', ').toLowerCase()}`;
  }
  
  return summary + ".";
}