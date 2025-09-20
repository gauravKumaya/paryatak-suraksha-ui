import { useEffect, useRef } from "react";

interface SafetyHeatmapProps {
  className?: string;
  interactive?: boolean;
}

const SafetyHeatmap = ({ className = "", interactive = false }: SafetyHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create gradient heatmap effect
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(46, 204, 113, 0.6)'); // Green (safe)
    gradient.addColorStop(0.5, 'rgba(241, 196, 15, 0.6)'); // Yellow (caution)
    gradient.addColorStop(1, 'rgba(231, 76, 60, 0.6)'); // Red (danger)

    // Draw heatmap zones
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some sample zones
    const drawZone = (x: number, y: number, radius: number, color: string) => {
      const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radialGradient.addColorStop(0, color);
      radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    // Safe zones
    drawZone(100, 150, 80, 'rgba(46, 204, 113, 0.8)');
    drawZone(300, 200, 60, 'rgba(46, 204, 113, 0.7)');
    
    // Warning zones
    drawZone(200, 100, 70, 'rgba(241, 196, 15, 0.7)');
    drawZone(400, 150, 50, 'rgba(241, 196, 15, 0.6)');
    
    // Danger zones
    drawZone(350, 300, 90, 'rgba(231, 76, 60, 0.8)');
    drawZone(150, 280, 60, 'rgba(231, 76, 60, 0.6)');
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${interactive ? 'cursor-pointer' : ''}`}
        style={{ filter: 'blur(20px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 mix-blend-overlay" />
      {!interactive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Live Safety Heatmap</h3>
            <p className="text-white/80">Real-time safety zones across the city</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyHeatmap;