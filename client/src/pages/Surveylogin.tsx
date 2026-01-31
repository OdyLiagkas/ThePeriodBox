import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";


export default function Surveylogin() {
  const [, setLocation] = useLocation();
  const handleGoogleLogin = () => {
    // This sends the user to the backend route we'll create in Step 7
    window.location.href = "/api/auth/google-survey";
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
        Back to Hom
      </Button>
      
    </div>
  );
}