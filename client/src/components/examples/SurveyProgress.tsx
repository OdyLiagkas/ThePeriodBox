import { SurveyProgress } from '../SurveyProgress'

export default function SurveyProgressExample() {
  return (
    <div className="p-8 max-w-2xl">
      <SurveyProgress currentStep={3} totalSteps={7} />
    </div>
  )
}
