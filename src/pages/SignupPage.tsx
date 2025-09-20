import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Shield, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const SignupPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"traveler" | "authority" | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast.error("Please select user type");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (userType === "traveler" && (!idFile || !photoFile)) {
      toast.error("Please upload required identity documents");
      return;
    }

    toast.success("Account created successfully!");
    navigate("/login");
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
        className="w-full max-w-2xl"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <Logo className="mx-auto mb-4" />
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join Paryatak Suraksha for a safer journey
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!userType ? (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground mb-6">
                  Choose your account type to continue
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserType("traveler")}
                    className="p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <User className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-lg mb-2">I am a Traveler</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a secure profile for safe travel
                    </p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserType("authority")}
                    className="p-6 border-2 border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all group"
                  >
                    <Shield className="w-12 h-12 mx-auto mb-3 text-accent" />
                    <h3 className="font-semibold text-lg mb-2">I am an Authority</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor and respond to traveler safety
                    </p>
                  </motion.button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {userType === "traveler" ? "Traveler Registration" : "Authority Registration"}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserType(null)}
                  >
                    Change
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {userType === "traveler" && (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Identity Verification
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your documents are secured with blockchain technology
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="idUpload">Legal ID (Aadhaar/Passport)</Label>
                        <div className="relative">
                          <Input
                            id="idUpload"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                            className="cursor-pointer"
                          />
                          {idFile && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {idFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="photoUpload">Passport Photo</Label>
                        <div className="relative">
                          <Input
                            id="photoUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                            className="cursor-pointer"
                          />
                          {photoFile && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {photoFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-gradient-primary">
                  Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;