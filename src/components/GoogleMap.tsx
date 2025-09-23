import { useEffect, useRef, useState, useCallback } from "react";
import { Loader, Search } from "lucide-react";

interface GoogleMapProps {
  className?: string;
  userLocation?: { lat: number; lng: number };
  onRouteSearch?: (destination: string) => void;
}

// Mock safety grid data - replace with actual API call
const mockSafetyGrid = [
  { lat: 28.6139, lng: 77.2090, safetyScore: 85 },
  { lat: 28.6150, lng: 77.2100, safetyScore: 65 },
  { lat: 28.6130, lng: 77.2080, safetyScore: 45 },
  { lat: 28.6160, lng: 77.2110, safetyScore: 35 },
  { lat: 28.6120, lng: 77.2070, safetyScore: 75 },
  { lat: 28.6170, lng: 77.2120, safetyScore: 55 },
];

const GoogleMap = ({ className = "", userLocation }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        center: userLocation || { lat: 28.6139, lng: 77.2090 },
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      googleMapRef.current = map;

      // Add safety grid overlay
      addSafetyGrid(map);

      // Add user location marker
      if (userLocation) {
        addUserMarker(map, userLocation);
      }

      // Initialize Places Autocomplete
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: "in" },
          fields: ["place_id", "geometry", "name"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            calculateSafestRoute(place.geometry.location);
          }
        });
      }

      setIsLoading(false);
    };

    loadGoogleMaps();
  }, [userLocation]);

  // Add safety grid overlay
  const addSafetyGrid = (map: google.maps.Map) => {
    mockSafetyGrid.forEach((cell) => {
      const gridSize = 0.002; // Approximately 200m
      const rectangle = new google.maps.Rectangle({
        bounds: {
          north: cell.lat + gridSize / 2,
          south: cell.lat - gridSize / 2,
          east: cell.lng + gridSize / 2,
          west: cell.lng - gridSize / 2,
        },
        fillColor: getSafetyColor(cell.safetyScore),
        fillOpacity: 0.5,
        strokeColor: "#ffffff",
        strokeOpacity: 0.3,
        strokeWeight: 0.5,
        map: map,
      });
    });
  };

  // Get color based on safety score
  const getSafetyColor = (score: number): string => {
    if (score > 70) return "#2ECC71"; // Green
    if (score > 40) return "#F1C40F"; // Yellow
    return "#E74C3C"; // Red
  };

  // Add user location marker
  const addUserMarker = (map: google.maps.Map, location: { lat: number; lng: number }) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    userMarkerRef.current = new google.maps.Marker({
      position: location,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
      animation: google.maps.Animation.DROP,
    });

    // Add pulsing effect
    const pulsingCircle = new google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.35,
      map,
      center: location,
      radius: 50,
    });

    // Animate pulsing
    let opacity = 0.35;
    let increasing = false;
    setInterval(() => {
      if (increasing) {
        opacity += 0.01;
        if (opacity >= 0.35) increasing = false;
      } else {
        opacity -= 0.01;
        if (opacity <= 0.1) increasing = true;
      }
      pulsingCircle.setOptions({ fillOpacity: opacity });
    }, 50);
  };

  // Calculate safest route
  const calculateSafestRoute = useCallback((destination: google.maps.LatLng) => {
    if (!googleMapRef.current || !userLocation) return;

    // Clear previous route
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    // Mock route - in production, this would call your backend API
    const mockRoute = [
      userLocation,
      { lat: userLocation.lat + 0.005, lng: userLocation.lng + 0.005 },
      { lat: userLocation.lat + 0.010, lng: userLocation.lng + 0.008 },
      { lat: destination.lat(), lng: destination.lng() },
    ];

    // Draw route on map
    routePolylineRef.current = new google.maps.Polyline({
      path: mockRoute,
      geodesic: true,
      strokeColor: "#00C49F",
      strokeOpacity: 1.0,
      strokeWeight: 6,
      map: googleMapRef.current,
    });

    // Fit map to show entire route
    const bounds = new google.maps.LatLngBounds();
    mockRoute.forEach((point) => {
      bounds.extend(point);
    });
    googleMapRef.current.fitBounds(bounds);
  }, [userLocation]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Search Bar - Moved inside map component for autocomplete */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Find the Safest Route to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-4 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Safety Legend */}
      <div className="absolute bottom-8 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-40">
        <p className="text-xs font-semibold mb-2">Safety Zones</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
            <span className="text-xs">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F1C40F" }} />
            <span className="text-xs">Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E74C3C" }} />
            <span className="text-xs">Danger</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;