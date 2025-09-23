import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Generate safety grid data for Delhi area
const generateDelhiSafetyGrid = () => {
  const grid = {
    type: "FeatureCollection",
    features: [] as any[]
  };

  // Delhi boundaries approximately
  const minLat = 28.4;
  const maxLat = 28.88;
  const minLng = 76.84;
  const maxLng = 77.35;
  
  // Grid cell size (approximately 1km)
  const gridSize = 0.01;
  
  // Popular Delhi areas with their approximate safety scores
  const safetyZones = [
    { lat: 28.6139, lng: 77.2090, score: 85, name: "Central Delhi" }, // Connaught Place
    { lat: 28.5244, lng: 77.2066, score: 80, name: "South Delhi" }, // Hauz Khas
    { lat: 28.6129, lng: 77.2295, score: 75, name: "India Gate" },
    { lat: 28.6562, lng: 77.2410, score: 45, name: "Old Delhi" }, // Chandni Chowk - crowded
    { lat: 28.5505, lng: 77.2689, score: 70, name: "Noida Border" },
    { lat: 28.6692, lng: 77.4538, score: 65, name: "East Delhi" },
    { lat: 28.7041, lng: 77.1025, score: 90, name: "North Delhi" }, // Civil Lines
    { lat: 28.5921, lng: 77.0460, score: 75, name: "Dwarka" },
    { lat: 28.6304, lng: 77.2177, score: 35, name: "Paharganj" }, // Near railway station - caution
    { lat: 28.5645, lng: 77.1545, score: 85, name: "Vasant Kunj" },
    { lat: 28.5434, lng: 77.2483, score: 80, name: "Lotus Temple Area" },
    { lat: 28.6258, lng: 77.2150, score: 40, name: "Karol Bagh" }, // Busy market area
    { lat: 28.4595, lng: 77.0266, score: 75, name: "Gurgaon Border" },
    { lat: 28.6862, lng: 77.2217, score: 60, name: "North Campus" },
    { lat: 28.5355, lng: 77.2410, score: 55, name: "Nehru Place" },
  ];

  // Generate grid cells
  for (let lat = minLat; lat < maxLat; lat += gridSize) {
    for (let lng = minLng; lng < maxLng; lng += gridSize) {
      let safetyScore = 60; // Default moderate safety
      
      // Calculate safety score based on proximity to known zones
      for (const zone of safetyZones) {
        const distance = Math.sqrt(
          Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)
        );
        
        // Influence radius (approximately 3km)
        if (distance < 0.03) {
          // Weight the influence by distance
          const influence = 1 - (distance / 0.03);
          safetyScore = Math.round(
            safetyScore * (1 - influence) + zone.score * influence
          );
        }
      }
      
      // Add some randomness for realism
      safetyScore += Math.floor(Math.random() * 10 - 5);
      safetyScore = Math.max(0, Math.min(100, safetyScore));
      
      const feature = {
        type: "Feature",
        properties: {
          safetyScore,
          gridId: `${lat.toFixed(3)}_${lng.toFixed(3)}`
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lng, lat],
            [lng + gridSize, lat],
            [lng + gridSize, lat + gridSize],
            [lng, lat + gridSize],
            [lng, lat]
          ]]
        }
      };
      
      grid.features.push(feature);
    }
  }
  
  return grid;
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const safetyGrid = generateDelhiSafetyGrid();
    
    return new Response(
      JSON.stringify(safetyGrid),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});