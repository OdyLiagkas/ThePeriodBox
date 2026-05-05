import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; 
import { useLocation } from "wouter";
import { Sparkles, ArrowLeft, Heart } from "lucide-react";
import logoImage from "@assets/Full_Page_1766110908945.png";
import { useState } from "react"; 

export default function Login() {
  const [, setLocation] = useLocation();
  const [acceptedTerms, setAcceptedTerms] = useState(false); 
  
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };
  
  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/10 via-chart-2/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-chart-3/10 via-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 w-full p-6">
        <div className="container mx-auto">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3" />
            
            <div className="p-8 md:p-10 space-y-8">
              {/* Logo Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-2xl">
                  <img 
                    src={logoImage} 
                    alt="The Period Box" 
                    className="h-20 w-auto object-contain"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Welcome to
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold font-heading">
                    <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                      The Period Box
                    </span>
                  </h1>
                  <p className="text-muted-foreground pt-2">
                    Sign in to access your personalized period care 
                  </p>
                </div>
              </div>

              {/* Login Section */}
              <div className="space-y-4">
                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-0.5 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <a 
                      href="/terms-of-use.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Use
                    </a>
                    {" "}and{" "}
                    <a 
                      href="/privacy-policy.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button 
                  size="lg" 
                  onClick={handleGoogleLogin}
                  disabled={!acceptedTerms} // Disabled until checked
                  className="w-full h-14 text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-chart-2/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </span>
                </Button>
                                <Button
                  size="lg"
                  onClick={() => window.location.href = "/api/auth/facebook"}
                  disabled={!acceptedTerms}
                  className="w-full h-14 text-base font-semibold bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                    Continue with Meta
                  </span>
                </Button>
                
                {!acceptedTerms && (
                  <p className="text-xs text-center text-muted-foreground">
                    Please accept the Terms of Use and Privacy Policy to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}