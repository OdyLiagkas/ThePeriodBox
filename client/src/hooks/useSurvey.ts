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
    const fetchSurvey = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/survey-responses", {
          credentials: "include", // important to send cookies/session
        });

        // Read response as text first to debug non-JSON responses
        const text = await res.text();
        console.log("Raw survey response:", text);

        if (!res.ok) {
          throw new Error(`Failed to fetch survey: ${res.status} ${res.statusText}`);
        }

        // Attempt to parse JSON safely
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Survey response was not JSON:", text);
        }

        // Update survey state if valid, otherwise null
        setSurvey(
          data
            ? {
                id: data.id,
                completedAt: data.created_at,
                answers: data.answers,
              }
            : null
        );
      } catch (err: any) {
        console.error("Error fetching survey:", err);
        setError(err.message);
        setSurvey(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  return { survey, isLoading, error };
}
