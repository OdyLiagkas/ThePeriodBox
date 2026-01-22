import { SurveyQuestion } from '../SurveyQuestion'
import { useState } from 'react'

export default function SurveyQuestionExample() {
  const [value, setValue] = useState('')

  return (
    <div className="p-8 max-w-2xl">
      <SurveyQuestion
        question="How would you describe your flow?"
        description="This helps us recommend the right absorbency level for you."
        type="single"
        options={[
          { value: "light", label: "Light - Minimal flow, 1-2 days" },
          { value: "moderate", label: "Moderate - Regular flow, 3-5 days" },
          { value: "heavy", label: "Heavy - Significant flow, 5+ days" },
        ]}
        value={value}
        onChange={(newValue) => setValue(newValue as string)}
      />
    </div>
  )
}
