import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<"traveler" | "authority">("traveler");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (formData.email && formData.password) {
      toast.success(`Logged in as ${loginType}`);
      navigate(loginType === "traveler" ? "/traveler-dashboard" : "/authority-dashboard");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <Logo className="mx-auto mb-4" />
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Paryatak Suraksha account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "traveler" | "authority")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="traveler" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Traveler
                </TabsTrigger>
                <TabsTrigger value="authority" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authority
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="traveler" className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="traveler-email">Email</Label>
                      <Input
                        id="traveler-email"
                        name="email"
                        type="email"
                        placeholder="traveler@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="traveler-password">Password</Label>
                      <Input
                        id="traveler-password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-primary">
                      Sign In as Traveler
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="authority" className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="authority-email">Official Email</Label>
                      <Input
                        id="authority-email"
                        name="email"
                        type="email"
                        placeholder="authority@gov.in"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="authority-password">Password</Label>
                      <Input
                        id="authority-password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-accent to-secondary">
                      Sign In as Authority
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;