import { motion } from "framer-motion";
import { Activity, Users, CheckCircle, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    icon: Activity,
    value: "1,875+",
    label: "Active Tourists",
    color: "text-safety-green",
    bgColor: "bg-safety-green/10",
    delay: 0,
  },
  {
    icon: Users,
    value: "25,400+",
    label: "Users Protected",
    color: "text-primary",
    bgColor: "bg-primary/10",
    delay: 0.1,
  },
  {
    icon: CheckCircle,
    value: "5,230+",
    label: "Incidents Resolved",
    color: "text-safety-green",
    bgColor: "bg-safety-green/10",
    delay: 0.2,
  },
  {
    icon: Shield,
    value: "1,250+",
    label: "Safe Zones",
    color: "text-safety-red",
    bgColor: "bg-safety-red/10",
    delay: 0.3,
  },
];

const PlatformStats = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Platform at a Glance
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time insights into our safety network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.delay }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;