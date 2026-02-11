import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import heroImage from "@assets/Woman_with_box_1766110255116.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden flow-root">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-0 pb-4 md:pb-0">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Personalized Period Care
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight">
              Discover Your Perfect{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Period Products
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Take our personalized survey and find period products that match your lifestyle, needs, and value. No more guessing, just take the survey, get the sample box, and feel confident that your products are right for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/survey" data-testid="link-hero-survey">
                <Button size="lg" className="text-base font-semibold group">
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Start Your Journey
                  
                </Button>
              </Link>
              <Link href="/about" data-testid="link-hero-products">
                <Button size="lg" variant="outline" className="text-base font-semibold">
                  About The Perio dBox
                </Button>
              </Link>
            </div>
            

          </div>
          
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Woman holding The Period Box" 
              className="w-full h-auto"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
/*
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 border-2 border-background" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">10,000+</span> women finding their perfect match
              </p>
            </div>
*/