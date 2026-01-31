import { useState, useEffect } from "react";

export interface SurveyResult {
  id: string;
  completedAt: string;
  answers: Record<string, any>;
}

export function useSurvey() {
  const [survey, setSurvey] = useState<SurveyResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch survey from backend for the logged-in user
    const fetchSurvey = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/survey-responses", {
          credentials: "include", // important to send cookies/session
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch survey: ${res.statusText}`);
        }

        const data = await res.json();

        if (data) {
          setSurvey({
            id: data.id,
            completedAt: data.created_at,
            answers: data.answers,
          });
        } else {
          setSurvey(null);
        }
      } catch (err: any) {
        console.error("Error fetching survey:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  return { survey, isLoading, error };
}
