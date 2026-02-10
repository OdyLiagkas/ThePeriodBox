
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, ArrowLeft, Heart } from "lucide-react";
import logoImage from "@assets/Full_Page_1766110908945.png";

export default function Surveylogin() {
  const [, setLocation] = useLocation();
  
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google-survey";
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

              {/* Login Button */}
              <div className="space-y-4">
                {/*<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mx-auto w-full justify-center">
                  <Sparkles className="h-4 w-4" />
                  Personalized Period Care
                </div>*/}

                <Button 
                  size="lg" 
                  onClick={handleGoogleLogin}
                  className="w-full h-14 text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
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
              </div>

              {/* Trust indicators */}
              {/*<div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                    Personalized
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-chart-2" />
                    Curated for you
                  </span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Bottom text */}
          {/*<p className="text-center text-sm text-muted-foreground mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>*/}
        </div>
      </main>
    </div>
  );
}