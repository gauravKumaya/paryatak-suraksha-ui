import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { origin, destination } = await req.json();
    
    if (!origin || !destination) {
      throw new Error("Origin and destination are required");
    }

    // In a real implementation, this would:
    // 1. Call Google Directions API with alternatives=true
    // 2. Score each route based on safety grid data
    // 3. Return the safest route
    
    // For now, return a mock safe route through Delhi
    const mockSafeRoute = {
      overview_polyline: "qzxmDqfduMlB{AnA_BfAaBpAqBbAyA~@uAz@qAx@mAv@kAt@iAr@gAp@eAn@cAl@aAj@_Ah@}@f@{@d@y@b@w@`@u@^s@\\q@Zo@Xm@Vk@Ti@Rg@Pe@Nc@La@J_@H]FWD[BYBWB[?]?_@A]C[E[GYIYKYMY",
      waypoints: [
        { lat: origin.lat, lng: origin.lng, name: "Start" },
        { lat: 28.6200, lng: 77.2100, name: "Via Connaught Place (Safe)" },
        { lat: 28.6280, lng: 77.2200, name: "Via Rajpath (Safe)" },
        { lat: destination.lat, lng: destination.lng, name: "Destination" }
      ],
      distance: "12.5 km",
      duration: "25 mins",
      safetyScore: 82,
      alternativeRoutes: [
        {
          overview_polyline: "alternate_route_polyline_here",
          distance: "10.2 km",
          duration: "30 mins",
          safetyScore: 65,
          reason_not_selected: "Passes through Paharganj (crowded area)"
        },
        {
          overview_polyline: "another_alternate_route",
          distance: "11.8 km",
          duration: "22 mins",
          safetyScore: 70,
          reason_not_selected: "Passes through Old Delhi (congested)"
        }
      ],
      safetyAnalysis: {
        safeSections: [
          "Connaught Place area (Well-lit, Police presence)",
          "India Gate vicinity (Tourist area, Security)",
          "Rajpath (Government area, High security)"
        ],
        cautionPoints: [
          "Traffic congestion near ITO",
          "Crowded market area near destination"
        ]
      }
    };

    return new Response(
      JSON.stringify(mockSafeRoute),
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