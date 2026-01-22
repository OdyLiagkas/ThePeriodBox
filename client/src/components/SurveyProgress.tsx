import { Progress } from "@/components/ui/progress";

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function SurveyProgress({ currentStep, totalSteps }: SurveyProgressProps) {
  const percentage = (currentStep / totalSteps) * 100 - 100 / totalSteps;
  
  return (
    <div className="space-y-2" data-testid="survey-progress">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Question {currentStep} of {totalSteps}</span>
        <span className="font-medium text-primary">{Math.round(percentage)}% Complete</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
