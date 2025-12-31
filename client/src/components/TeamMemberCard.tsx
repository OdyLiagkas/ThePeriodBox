import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export function TeamMemberCard({ name, role, bio, image }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid="card-team-member">
      <CardContent className="p-6 space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-chart-2 rounded-full blur-lg opacity-30" />
          <img 
            src={image} 
            alt={name} 
            className="relative w-full h-full object-cover rounded-full border-4 border-background shadow-lg"
            data-testid="img-team-member"
          />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold font-accent" data-testid="text-name">{name}</h3>
          <p className="text-sm font-medium text-primary" data-testid="text-role">{role}</p>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      </CardContent>
    </Card>
  );
}
