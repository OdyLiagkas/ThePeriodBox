interface SurveyAnswersProps {
  answers: Record<string, any>;
  className?: string; // optional
}

export function SurveyAnswers({ answers, className }: SurveyAnswersProps) {
  return (
    <div className={className}>
      {Object.entries(answers).map(([key, value]) => (
        <div key={key} className="flex gap-2 items-start">
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
            {key.replace(/-/g, " ")}:
          </span>
          <span className="font-semibold text-red-600 capitalize">
            {Array.isArray(value) ? value.join(", ") : value}
          </span>
        </div>
      ))}
    </div>
  );
}
