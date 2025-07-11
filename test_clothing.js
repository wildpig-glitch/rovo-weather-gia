// Simple test script to verify clothing recommendations functionality
import { clothingRecommendations } from './src/clothing.js';

// Test scenarios
const testScenarios = [
  {
    name: "Hot sunny day",
    payload: {
      temperature: 32,
      description: "clear sky",
      rain: null,
      snow: null
    }
  },
  {
    name: "Cold rainy day",
    payload: {
      temperature: 8,
      description: "light rain",
      rain: { "3h": 2.5 },
      snow: null
    }
  },
  {
    name: "Freezing with snow",
    payload: {
      temperature: -5,
      description: "snow",
      rain: null,
      snow: { "3h": 5.0 }
    }
  },
  {
    name: "Mild spring day",
    payload: {
      temperature: 18,
      description: "partly cloudy",
      rain: null,
      snow: null
    }
  },
  {
    name: "Windy autumn day",
    payload: {
      temperature: 12,
      description: "windy",
      rain: null,
      snow: null
    }
  }
];

// Run tests
async function runTests() {
  console.log("Testing Clothing Recommendations...\n");
  
  for (const scenario of testScenarios) {
    console.log(`=== ${scenario.name} ===`);
    try {
      const result = await clothingRecommendations(scenario.payload, {});
      console.log("Recommendations:", JSON.stringify(result, null, 2));
      console.log("Summary:", result.summary);
    } catch (error) {
      console.error("Error:", error.message);
    }
    console.log("\n");
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}