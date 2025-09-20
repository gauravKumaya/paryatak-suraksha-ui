import { useState } from "react";
import { Users, AlertTriangle, MapPin, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/Logo";
import SafetyMap from "@/components/SafetyMap";
import { useNavigate } from "react-router-dom";

const AlertCard = ({ type, userId, location, time }: any) => {
  const isUrgent = type === "SOS TRIGGERED";
  return (
    <div className={`alert-card ${isUrgent ? 'alert-card-critical' : 'alert-card-warning'} mb-3 cursor-pointer hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold ${isUrgent ? 'text-destructive' : 'text-yellow-600'}`}>{type}</span>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm font-medium">User ID: {userId}</p>
      <p className="text-xs text-muted-foreground">Location: {location}</p>
    </div>
  );
};

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [activeAlerts] = useState([
    { type: "SOS TRIGGERED", userId: "USR-2847", location: "Jama Masjid", time: "2 mins ago" },
    { type: "RISK ZONE ENTRY", userId: "USR-9183", location: "Chandni Chowk", time: "5 mins ago" },
    { type: "SOS TRIGGERED", userId: "USR-3924", location: "Connaught Place", time: "8 mins ago" },
  ]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Data Cards */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <div className="data-card">
          <Users className="w-8 h-8 text-primary mb-2" />
          <p className="data-card-value">347</p>
          <p className="text-sm text-muted-foreground">Active Travelers</p>
        </div>
        <div className="data-card bg-destructive/5 border-destructive">
          <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
          <p className="text-3xl font-bold text-destructive">3</p>
          <p className="text-sm text-muted-foreground">Active SOS Alerts</p>
        </div>
        <div className="data-card bg-yellow-500/5 border-yellow-500">
          <MapPin className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-3xl font-bold text-yellow-600">12</p>
          <p className="text-sm text-muted-foreground">High-Risk Zone Users</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Map */}
        <div className="flex-1">
          <Card className="h-full p-4">
            <SafetyMap className="w-full h-full rounded-lg" showUsers={true} />
          </Card>
        </div>

        {/* Alerts Panel */}
        <div className="w-80">
          <Card className="h-full p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-destructive" />
              Live Alerts
            </h3>
            <ScrollArea className="h-[calc(100%-2rem)]">
              {activeAlerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;