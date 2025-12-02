import { translateTerm, translateMessage, isValidLanguage } from './i18n.js';

/**
 * Generate personalized clothing suggestions based on weather conditions, season, region, and language preference.
 */
export async function clothingSuggestions(payload, requestContext) {
  const { temperature, description, rain, snow, season, region, language = 'en' } = payload;
  
  // Validate language
  if (!isValidLanguage(language)) {
    console.warn(`Invalid language '${language}', defaulting to English`);
  }

  console.log(`Generating clothing suggestions for: temp=${temperature}°C, weather=${description}, season=${season}, region=${region}, language=${language}`);
  
  const suggestions = {
    language: language,
    layers: [],
    accessories: [],
    footwear: [],
    special_considerations: []
  };
  
  // Base layer recommendations based on temperature - using translated terms
  if (temperature <= 0) {
    suggestions.layers.push(
      translateTerm('thermal_underwear', language),
      translateTerm('heavy_winter_coat', language),
      translateTerm('warm_sweater', language)
    );
    suggestions.accessories.push(
      translateTerm('winter_hat', language),
      translateTerm('insulated_gloves', language),
      translateTerm('warm_scarf', language)
    );
    suggestions.footwear.push(translateTerm('insulated_winter_boots', language));
  } else if (temperature <= 10) {
    suggestions.layers.push(
      translateTerm('warm_jacket', language),
      translateTerm('long_sleeve_shirt', language),
      translateTerm('light_sweater', language)
    );
    suggestions.accessories.push(
      translateTerm('light_gloves', language),
      translateTerm('beanie', language)
    );
    suggestions.footwear.push(
      translateTerm('closed_toe_shoes', language),
      translateTerm('warm_socks', language)
    );
  } else if (temperature <= 20) {
    suggestions.layers.push(
      translateTerm('light_jacket', language),
      translateTerm('long_sleeve_shirt', language)
    );
    suggestions.footwear.push(translateTerm('comfortable_shoes', language));
  } else if (temperature <= 25) {
    suggestions.layers.push(
      translateTerm('t_shirt', language),
      translateTerm('cardigan', language)
    );
    suggestions.footwear.push(
      translateTerm('sneakers', language),
      translateTerm('light_shoes', language)
    );
  } else {
    suggestions.layers.push(
      translateTerm('breathable_shirt', language),
      translateTerm('cotton_clothing', language)
    );
    suggestions.accessories.push(
      translateTerm('sunhat', language),
      translateTerm('sunglasses', language)
    );
    suggestions.footwear.push(
      translateTerm('breathable_shoes', language),
      translateTerm('sandals', language)
    );
  }
  
  // Weather-specific modifications
  if (rain && rain["3h"] > 0) {
    suggestions.accessories.push(
      translateTerm('umbrella', language),
      translateTerm('rain_hat', language)
    );
    suggestions.layers.push(translateTerm('waterproof_jacket', language));
    suggestions.footwear = suggestions.footwear.map(item => 
      item.includes(translateTerm('sandals', language)) ? 
      translateTerm('waterproof_shoes', language) : item
    );
    suggestions.special_considerations.push(translateMessage('rain_warning', language));
  }
  
  if (snow && snow["3h"] > 0) {
    suggestions.accessories.push(
      translateTerm('insulated_gloves', language),
      translateTerm('winter_hat', language),
      translateTerm('warm_scarf', language)
    );
    suggestions.footwear = [translateTerm('waterproof_boots', language)];
    suggestions.special_considerations.push(translateMessage('snow_warning', language));
  }
  
  if (description.includes("wind")) {
    suggestions.layers.push(translateTerm('windproof_jacket', language));
    suggestions.special_considerations.push(translateMessage('wind_warning', language));
  }
  
  if (description.includes("sunny") || description.includes("clear")) {
    suggestions.accessories.push(
      translateTerm('sunglasses', language),
      translateTerm('sunscreen', language)
    );
    if (temperature > 20) {
      suggestions.special_considerations.push(translateMessage('sunny_warning', language));
    }
  }
  
  // Regional and seasonal adjustments
  if (region && region.toLowerCase().includes("tropical")) {
    suggestions.layers = suggestions.layers.filter(item => 
      !item.toLowerCase().includes("heavy") && !item.toLowerCase().includes("winter")
    );
    suggestions.layers.push(translateTerm('light_breathable_fabrics', language));
    suggestions.special_considerations.push(translateMessage('tropical_note', language));
  }
  
  if (season) {
    switch (season.toLowerCase()) {
      case "winter":
        if (!suggestions.layers.some(item => item.toLowerCase().includes("winter"))) {
          suggestions.layers.push(translateTerm('heavy_winter_coat', language));
        }
        break;
      case "summer":
        suggestions.layers = suggestions.layers.filter(item => 
          !item.toLowerCase().includes("heavy") && !item.toLowerCase().includes("winter")
        );
        suggestions.special_considerations.push(translateMessage('summer_note', language));
        break;
      case "spring":
      case "autumn":
      case "fall":
        suggestions.special_considerations.push(translateMessage('transitional_note', language));
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
