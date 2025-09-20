import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface SafetyMapProps {
  className?: string;
  userLocation?: { lat: number; lng: number };
  showUsers?: boolean;
}

const SafetyMap = ({ className = "", userLocation, showUsers = false }: SafetyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5">
        {/* Mock map with safety zones */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="safe-zone">
              <stop offset="0%" stopColor="hsl(145, 63%, 49%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(145, 63%, 49%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="warning-zone">
              <stop offset="0%" stopColor="hsl(48, 89%, 60%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(48, 89%, 60%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="danger-zone">
              <stop offset="0%" stopColor="hsl(6, 78%, 57%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(6, 78%, 57%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          <circle cx="30%" cy="40%" r="100" fill="url(#safe-zone)" />
          <circle cx="60%" cy="30%" r="80" fill="url(#safe-zone)" />
          <circle cx="45%" cy="60%" r="90" fill="url(#warning-zone)" />
          <circle cx="70%" cy="70%" r="110" fill="url(#danger-zone)" />
          <circle cx="20%" cy="70%" r="75" fill="url(#warning-zone)" />
        </svg>
        
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping" />
              <MapPin className="w-8 h-8 text-primary fill-primary/20 relative z-10" />
            </div>
          </div>
        )}
        
        {showUsers && (
          <>
            <div className="absolute top-[25%] left-[35%] w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute top-[45%] left-[55%] w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute top-[65%] left-[25%] w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <div className="absolute top-[70%] left-[70%] w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute top-[35%] left-[65%] w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </>
        )}
      </div>
    </div>
  );
};

export default SafetyMap;