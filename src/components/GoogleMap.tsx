import { useEffect, useRef, useState, useCallback } from "react";
import { Loader, Search, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoogleMapProps {
  className?: string;
  userLocation?: { lat: number; lng: number };
  onRouteSearch?: (destination: string) => void;
}

const GoogleMap = ({ className = "", userLocation }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dataLayerRef = useRef<google.maps.Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const { toast } = useToast();

  // Fetch safety grid data from edge function
  const fetchSafetyGrid = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('safety-grid');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching safety grid:', error);
      toast({
        title: "Error loading safety data",
        description: "Using fallback safety zones",
        variant: "destructive",
      });
      return null;
    }
  };

  // Calculate safest route via edge function
  const calculateSafestRoute = useCallback(async (destination: google.maps.LatLng | google.maps.LatLngLiteral) => {
    if (!googleMapRef.current || !userLocation) return;
    
    setIsCalculatingRoute(true);
    
    // Clear previous route
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    try {
      const destLat = typeof destination.lat === 'function' ? destination.lat() : destination.lat;
      const destLng = typeof destination.lng === 'function' ? destination.lng() : destination.lng;
      
      const { data, error } = await supabase.functions.invoke('get-safest-route', {
        body: {
          origin: userLocation,
          destination: { lat: destLat, lng: destLng }
        }
      });

      if (error) throw error;

      // Decode the polyline if it's provided as an encoded string
      if (data.overview_polyline) {
        const decodedPath = google.maps.geometry.encoding.decodePath(data.overview_polyline);
        
        // Draw route on map
        routePolylineRef.current = new google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: "#00C49F",
          strokeOpacity: 1.0,
          strokeWeight: 6,
          map: googleMapRef.current,
        });

        // Fit map to show entire route
        const bounds = new google.maps.LatLngBounds();
        decodedPath.forEach((point) => {
          bounds.extend(point);
        });
        googleMapRef.current.fitBounds(bounds);
        
        // Show route info
        toast({
          title: "Safest Route Found",
          description: `Distance: ${data.distance} | Duration: ${data.duration} | Safety Score: ${data.safetyScore}/100`,
        });
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({
        title: "Route calculation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [userLocation, toast]);

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Get API key from environment (in production, this would be from your backend)
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAiTikQi7lJlyly4nOxB0slMnwOtYG7h5s';

      // Load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      script.onerror = () => {
        toast({
          title: "Failed to load Google Maps",
          description: "Please check your API key configuration",
          variant: "destructive",
        });
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = async () => {
      if (!mapRef.current) return;

      // Initialize map centered on Delhi
      const map = new google.maps.Map(mapRef.current, {
        center: userLocation || { lat: 28.6139, lng: 77.2090 },
        zoom: 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      googleMapRef.current = map;

      // Initialize data layer for safety grid
      dataLayerRef.current = new google.maps.Data({ map });
      
      // Load and display safety grid
      const safetyGridData = await fetchSafetyGrid();
      if (safetyGridData) {
        dataLayerRef.current.addGeoJson(safetyGridData);
        
        // Style the safety grid
        dataLayerRef.current.setStyle((feature) => {
          const safetyScore = feature.getProperty('safetyScore') as number;
          let fillColor = '#2ECC71'; // Green (safe)
          
          if (safetyScore <= 40) {
            fillColor = '#E74C3C'; // Red (danger)
          } else if (safetyScore <= 70) {
            fillColor = '#F1C40F'; // Yellow (caution)
          }
          
          return {
            fillColor,
            fillOpacity: 0.4,
            strokeColor: '#ffffff',
            strokeWeight: 0.5,
            strokeOpacity: 0.3,
          };
        });
      }

      // Add user location marker using AdvancedMarkerElement
      if (userLocation && google.maps.marker) {
        const userPin = document.createElement('div');
        userPin.innerHTML = `
          <div class="relative">
            <div class="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
          </div>
        `;
        
        userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: userLocation,
          content: userPin,
          title: "Your Location",
        });
      }

      // Initialize Places Autocomplete
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: "in" },
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(28.4, 76.84),
            new google.maps.LatLng(28.88, 77.35)
          ),
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
  }, [userLocation, toast, calculateSafestRoute]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Search Bar */}
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
            disabled={isCalculatingRoute}
          />
          {isCalculatingRoute && (
            <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Safety Legend */}
      <div className="absolute bottom-8 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-40">
        <p className="text-xs font-semibold mb-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Safety Zones
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
            <span className="text-xs">Safe (70+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F1C40F" }} />
            <span className="text-xs">Caution (40-70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E74C3C" }} />
            <span className="text-xs">Alert (Below 40)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;