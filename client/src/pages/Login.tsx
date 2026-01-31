import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [redirectUrl, setRedirectUrl] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, []);

  const handleGoogleLogin = () => {
    // This sends the user to the backend route we'll create in Step 7
    window.location.href = '/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}';
    
  };
  const handleBack = () => {
    setLocation("/");
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Sign in to The Period Box</h1>
      <Button size="lg" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
      <Button variant="outline" onClick={handleBack}>
        Back to Home
      </Button>
      
    </div>
  );
}