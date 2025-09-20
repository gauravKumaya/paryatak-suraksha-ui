import { Shield, MapPin } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  };
  
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-primary fill-primary/10`} />
        <MapPin className={`${sizeClasses[size]} absolute inset-0 scale-50 text-accent`} />
      </div>
      <span className={`font-bold ${textSizes[size]} bg-gradient-primary bg-clip-text text-transparent`}>
        Paryatak Suraksha
      </span>
    </div>
  );
};

export default Logo;