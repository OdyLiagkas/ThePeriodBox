import { Button } from "@/components/ui/button";

export default function Login() {
  const handleGoogleLogin = () => {
    // This sends the user to the backend route we'll create in Step 7
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Sign in to The Period Box</h1>
      <Button size="lg" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
}