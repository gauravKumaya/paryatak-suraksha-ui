import { useState } from "react";
import { AlertTriangle, Phone } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const SOSButton = () => {
  const [isActivated, setIsActivated] = useState(false);

  const handleSOSActivation = () => {
    setIsActivated(true);
    toast.error("SOS Alert Activated!", {
      description: "Emergency services have been notified. Help is on the way.",
      duration: 10000,
    });
    
    // In a real app, this would trigger emergency protocols
    setTimeout(() => {
      setIsActivated(false);
    }, 10000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={`fixed bottom-8 right-8 z-50 btn-sos ${
            isActivated ? "bg-red-600 animate-none" : ""
          }`}
          disabled={isActivated}
        >
          {isActivated ? (
            <Phone className="w-10 h-10 animate-bounce" />
          ) : (
            "SOS"
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-6 h-6" />
            Activate Emergency SOS?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            This will immediately alert emergency services and share your location.
            Use only in genuine emergencies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSOSActivation}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm SOS
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SOSButton;