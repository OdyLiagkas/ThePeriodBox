import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SurveyProgress } from "@/components/SurveyProgress";
import { SurveyQuestion } from "@/components/SurveyQuestion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface Question {
  id: string;
  question: string;
  description?: string;
  type: "single" | "multiple" | "text" | "select-multiple";
  options?: { value: string; label: string }[];
}

const surveyQuestions: Question[] = [
  {
    id: "flow",
    question: "How would you describe your flow?",
    type: "single",
    options: [
      { value: "light", label: "Light – minimal flow 1-2 days" },
      { value: "moderate", label: "Moderate – regular flow 3-5 days" },
      { value: "heavy", label: "Heavy – significant flow, 5+ days" },
      { value: "heavy-then-moderate", label: "Heavy the first ~2 days, moderate days 3/4, light last part of period" },
      { value: "varies", label: "Varies – changes month to month" },
    ],
  },
  {
    id: "spotting",
    question: "Do you experience spotting before/after your main flow?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "past-products",
    question: "Which products have you used in the past?",
    description: "Check all that apply.",
    type: "multiple",
    options: [
      { value: "tampons", label: "Tampons" },
      { value: "pads", label: "Pads" },
      { value: "cups", label: "Menstrual cups" },
      { value: "discs", label: "Menstrual discs" },
      { value: "underwear", label: "Period underwear" },
      { value: "liners", label: "Panty liners" },
    ],
  },
  {
    id: "organic-preference",
    question: "Do you prefer organic / natural materials?",
    type: "single",
    options: [
      { value: "always", label: "Yes, always" },
      { value: "sometimes", label: "Sometimes / open to trying" },
      { value: "not-important", label: "Not important to me" },
    ],
  },
  {
    id: "tampon-applicator",
    question: "For tampons, do you prefer:",
    type: "single",
    options: [
      { value: "plastic", label: "Plastic applicators" },
      { value: "cardboard", label: "Cardboard" },
      { value: "no-applicator", label: "No applicator (digital)" },
      { value: "no-preference", label: "Does not matter" },
    ],
  },
  {
    id: "leaks",
    question: "Have you ever had leaks with your current products?",
    type: "single",
    options: [
      { value: "often", label: "Often" },
      { value: "sometimes", label: "Sometimes" },
      { value: "rarely", label: "Rarely / never" },
    ],
  },
  {
    id: "sensitivities",
    question: "Do you have any sensitivities?",
    description: "We'll filter out products that may not work for you.",
    type: "multiple",
    options: [
      { value: "fragrance", label: "Fragrance sensitivity" },
      { value: "latex", label: "Latex allergy" },
      { value: "hypoallergenic", label: "Prefer hypoallergenic materials" },
      { value: "none", label: "No known sensitivities" },
    ],
  },
  {
    id: "comfort",
    question: "Do you feel your current products are comfortable?",
    type: "single",
    options: [
      { value: "very", label: "Yes, very" },
      { value: "sometimes", label: "Sometimes" },
      { value: "struggle", label: "No, I struggle with comfort" },
    ],
  },
  {
    id: "current-brand",
    question: "Which brand are you currently using?",
    description: "Select all that apply.",
    type: "select-multiple",
    options: [
      { value: "always", label: "Always" },
      { value: "august", label: "August" },
      { value: "cora", label: "Cora" },
      { value: "daye", label: "Daye" },
      { value: "generic", label: "Generic Store Brands" },
      { value: "here-we-flo", label: "Here We Flo" },
      { value: "honey-pot", label: "Honey Pot" },
      { value: "kind-cup", label: "Kind Cup" },
      { value: "kotex", label: "Kotex" },
      { value: "lola", label: "LOLA" },
      { value: "marlow", label: "Marlow" },
      { value: "natracare", label: "Natracare" },
      { value: "ob", label: "OB" },
      { value: "organyc", label: "Organyc" },
      { value: "playtex", label: "Playtex" },
      { value: "rael", label: "Rael" },
      { value: "seventh-generation", label: "Seventh Generation" },
      { value: "stayfree", label: "Stayfree" },
      { value: "tampax", label: "Tampax" },
      { value: "this-is-l", label: "This is L." },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "lifestyle",
    question: "What's your typical daily routine?",
    type: "single",
    options: [
      { value: "sedentary", label: "Mostly sitting - Office work, studying" },
      { value: "moderate", label: "Moderate activity - Walking, light exercise" },
      { value: "active", label: "Very active - Running, sports, gym workouts" },
      { value: "mixed", label: "Mixed - Varies day to day" },
    ],
  },
  {
    id: "priorities",
    question: "What matters most to you?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "organic", label: "Organic & natural materials" },
      { value: "eco", label: "Eco-friendly & sustainable" },
      { value: "comfort", label: "Maximum comfort" },
      { value: "protection", label: "Leak-proof protection" },
      { value: "discreet", label: "Discreet & portable" },
      { value: "budget", label: "Budget-friendly" },
    ],
  },
  {
    id: "interested-products",
    question: "Which products are you interested in trying or exploring new brands?",
    description: "We'll focus on these in your recommendations.",
    type: "multiple",
    options: [
      { value: "tampons", label: "Tampons" },
      { value: "pads", label: "Pads" },
      { value: "cups", label: "Menstrual cups" },
      { value: "discs", label: "Menstrual discs" },
      { value: "underwear", label: "Period underwear" },
      { value: "liners", label: "Panty liners" },
    ],
  },
  {
    id: "most-important",
    question: "What's most important to you when trying a new product?",
    description: "Select your top 2.",
    type: "multiple",
    options: [
      { value: "comfort", label: "Comfort" },
      { value: "price", label: "Price" },
      { value: "sustainability", label: "Sustainability" },
      { value: "brand-reputation", label: "Brand reputation" },
      { value: "organic", label: "Organic/natural ingredients" },
      { value: "leak-protection", label: "Leak protection" },
    ],
  },
];

export default function Survey() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Generate a session ID when component mounts
  useEffect(() => {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
  }, []);

const submitSurvey = useMutation({
  mutationFn: async (surveyData: { sessionId: string; answers: Record<string, string | string[]> }) => {
    // OFFLINE: write to localStorage instead of calling API
    localStorage.setItem("demo_survey", JSON.stringify(surveyData.answers));
    localStorage.setItem("demo_survey_date", new Date().toISOString());
    return { ok: true };
  },
  onSuccess: () => setIsComplete(true),
  onError: (error) =>
    toast({ title: "Error", description: error.message, variant: "destructive" }),
});

  /*
  const submitSurvey = useMutation({
    mutationFn: async (surveyData: { sessionId: string; answers: Record<string, string | string[]> }) => {
      return await apiRequest("POST", "/api/survey-responses", surveyData);
    },
    onSuccess: () => {
      setIsComplete(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting survey",
        description: error.message,
        variant: "destructive",
      });
    },
  });
*/
  const currentQuestion = surveyQuestions[currentStep];
  const isLastQuestion = currentStep === surveyQuestions.length - 1;

  const handleAnswer = (value: string | string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitSurvey.mutate({ sessionId, answers });
      console.log("Survey completed with answers:", answers);
    } else {
      setCurrentStep(currentStep + 1);
      console.log(`Moving to question ${currentStep + 2}`);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    console.log(`Going back to question ${currentStep}`);
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "multiple" || currentQuestion.type === "select-multiple") {
      const answerArray = Array.isArray(answer) ? answer : [];
      // For "most-important" question, limit to 2 selections
      if (currentQuestion.id === "most-important") {
        return answerArray.length > 0 && answerArray.length <= 2;
      }
      return answerArray.length > 0;
    }
    return Boolean(answer);
  };

  const handleGetSampleKit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Account Required",
        description: "Please log in or create an account to get your sample kit.",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
    setLocation("/products?fromSurvey=true");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-8">
            <Card className="border-2">
              <CardContent className="p-12 text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold font-heading">
                    Perfect! We Found Your Match
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Based on your answers, we've curated the ideal sample kit just for you.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-2/5">
              <CardContent className="p-8 space-y-4">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    Try the PeriodBox Sample Kit
                  </h2>
                  <p className="text-muted-foreground">
                    Get a curated selection of the brands that fit you best. Try before you commit to full-size products!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm">Personalized samples based on your survey results</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm">Try multiple products to find your perfect match</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm">Risk-free way to discover new brands</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    size="lg" 
                    variant="default"
                    className="w-full text-base font-semibold"
                    data-testid="button-purchase-kit"
                    onClick={handleGetSampleKit}
                  >
                    Get Your Sample Kit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold font-heading">
                Find Your Perfect Match
              </h1>
              <p className="text-muted-foreground">
                Answer a few questions to get personalized recommendations
              </p>
            </div>

            <SurveyProgress 
              currentStep={currentStep + 1} 
              totalSteps={surveyQuestions.length} 
            />

            <SurveyQuestion
              {...currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswer}
            />

            <div className="flex gap-4 justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                data-testid="button-previous"
              >
                Previous
              </Button>
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed() || submitSurvey.isPending}
                data-testid="button-next"
              >
                {submitSurvey.isPending ? "Submitting..." : isLastQuestion ? "Complete Survey" : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
