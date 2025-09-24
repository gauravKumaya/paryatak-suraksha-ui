import { motion } from "framer-motion";
import { Shield, Brain, Route, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ValueCard from "@/components/ValueCard";
import SafetyHeatmap from "@/components/SafetyHeatmap";
import PlatformStats from "@/components/PlatformStats";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Travel with Confidence.<br />
              Your Safety, Secured.
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Paryatak Suraksha uses blockchain and AI to ensure a secure and worry-free journey across India.
            </p>
            <Link to="/signup">
              <Button className="btn-hero group">
                Create Your Safe Profile
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <PlatformStats />

      {/* Value Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Why Trust Paryatak Suraksha?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={Shield}
              title="Blockchain-Verified Identity"
              description="Your identity is secured using blockchain technology, ensuring complete data protection and privacy."
              delay={0.1}
            />
            <ValueCard
              icon={Brain}
              title="Real-time Anomaly Detection"
              description="Advanced ML algorithms monitor your journey 24/7, detecting and alerting you to potential safety concerns."
              delay={0.2}
            />
            <ValueCard
              icon={Route}
              title="AI-Powered Safe Routes"
              description="Navigate confidently with intelligent route suggestions that prioritize your safety at every turn."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Heatmap Preview Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Live Safety Heatmap
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our advanced AI constantly analyzes safety data to create real-time heatmaps of tourist areas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-safety-green" />
                  <span>Green Zones - Safe areas with high tourist activity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-safety-yellow" />
                  <span>Yellow Zones - Exercise caution, moderate safety levels</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-safety-red" />
                  <span>Red Zones - High-risk areas, avoid if possible</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-96"
            >
              <SafetyHeatmap className="w-full h-full shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Safe Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust Paryatak Suraksha for their safety across India.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;