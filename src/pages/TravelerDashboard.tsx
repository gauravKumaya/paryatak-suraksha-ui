import { useState } from "react";
import { Menu, User, Settings, LogOut, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import SOSButton from "@/components/SOSButton";
import GoogleMap from "@/components/GoogleMap";
import { useNavigate } from "react-router-dom";

const TravelerDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Map Container */}
      <GoogleMap className="absolute inset-0" userLocation={{ lat: 28.6139, lng: 77.2090 }} />
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="flex items-center justify-between p-4">
          <Logo size="sm" />
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-background/80 px-4 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">Red Fort, Delhi</span>
            </div>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Hello, John Doe!</p>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Navigation className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <User className="w-4 h-4" />
                    My Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <hr className="my-4" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Emergency Helpline</p>
                    <p className="font-bold text-lg">100 / 1091</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Note: Search bar and legend are now integrated within the GoogleMap component */}
      
      {/* SOS Button */}
      <SOSButton />
    </div>
  );
};

export default TravelerDashboard;