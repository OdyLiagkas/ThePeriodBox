import { TeamMemberCard } from '../TeamMemberCard'
import teamImage from "@assets/generated_images/Team_member_portrait_Asian_woman_d6471c16.png";

export default function TeamMemberCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <TeamMemberCard
        name="Sarah Chen"
        role="Co-Founder & CEO"
        bio="Sarah's mission is to break period stigma and empower women with personalized care solutions."
        image={teamImage}
      />
    </div>
  )
}
