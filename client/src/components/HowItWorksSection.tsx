import { ClipboardList, Sparkles, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksSection() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Take the Survey",
      description: "Answer questions about your flow, lifestyle, and preferences in just 3 minutes.",
      color: "from-primary to-primary/80",
    },
    {
      icon: Sparkles,
      title: "Get Personalized Results",
      description: "Our algorithm matches you with products that fit your unique needs perfectly.",
      color: "from-chart-2 to-chart-2/80",
    },
    {
      icon: Package,
      title: "Discover Your Products",
      description: "Explore curated recommendations with detailed info to help you choose confidently.",
      color: "from-chart-3 to-chart-3/80",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to finding period products you'll actually love
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-visible hover-elevate transition-all" data-testid={`card-step-${index + 1}`}>
              <div className="absolute -top-6 left-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardContent className="pt-10 pb-6 px-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground">STEP {index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold font-accent">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
