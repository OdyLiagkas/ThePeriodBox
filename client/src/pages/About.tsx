import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Sparkles, Heart, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        {/* Single consistent background for entire page */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 -z-10" />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mx-auto">
                <Sparkles className="h-4 w-4" />
                Our Mission
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight">
                Redefining{" "}
                <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                  Period Care
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The Period Box was born from a simple truth, every woman's period is different, yet most of us are stuck guessing which products work best. <br className="hidden md:block" />We're changing that.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-2/10 rounded-full text-sm font-medium text-chart-2 mb-6 mx-auto md:mx-0">
                <Heart className="h-4 w-4" />
                Our Story
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-lg md:text-xl text-center md:text-left">
                    The Period Box started with a question I kept asking myself in the drugstore aisle,<br className="hidden md:block" />
                    <span className="font-semibold text-foreground block mt-2 text-xl md:text-2xl">Why is this so hard?</span>
                  </p>
                  
                  <div className="my-8 space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                      Every month, women spend time guessing, grabbing what we've always used, what a friend recommended, or whatever looks familiar. We deal with leaks, discomfort, waste, and frustration, and somehow, we're told that's just part of the experience.
                    </p>
                    
                    <p className="text-foreground font-medium text-xl">
                      But it doesn't have to be.
                    </p>
                    
                    <p>
                      I created The Period Box because our bodies aren't one-size-fits-all and our period care shouldn't be either. Through personalized surveys and thoughtfully curated products, we help women discover what actually works for their body, their flow, and their life.
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-border/50">
                    <p className="text-center md:text-left font-semibold text-foreground text-xl md:text-2xl leading-relaxed">
                      No more settling. No more trial and error.<br />
                      <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                        Just period care designed around you.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-3/10 rounded-full text-sm font-medium text-chart-3 mx-auto">
                  <Lightbulb className="h-4 w-4" />
                  Common Questions
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading">
                  Frequently Asked{" "}
                  <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Questions
                  </span>
                </h2>
              </div>

              {/* 3-column cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow duration-300 hover:border-primary/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-lg">
                      When will my box be ready?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      After you take the survey be sure to select joining the waitlist. We are currently working on building your box based on your survey results. We will send you an email once it is ready to be viewed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow duration-300 hover:border-chart-2/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
                      <span className="text-chart-2 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-lg">
                      How long does the quiz take?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our quiz takes about 3 minutes to complete. We ask questions
                      about your flow, lifestyle, comfort preferences, and values to
                      ensure we recommend the best products for your unique needs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow duration-300 hover:border-chart-3/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
                      <span className="text-chart-3 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-lg">
                      Can I choose specific products?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your box is curated based on your quiz responses, but you can
                      customize preferences like organic-only, or
                      specific product types. We'll always include a variety to help
                      you discover new favorites.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* wide card */}
              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 overflow-hidden">
                <CardContent className="p-8 md:p-12 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white font-bold text-xl">?</span>
                  </div>
                  <h3 className="font-semibold text-xl md:text-2xl">
                    What if I don't like something?
                  </h3>
                  <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg">
                    That's totally okay! Discovery is part of the process. Each box
                    includes detailed product information and usage tips. You'll learn
                    what works and what doesn't, helping you make smarter full-size
                    purchases later.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mx-auto">
                  <Mail className="h-4 w-4" />
                  Contact
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading">
                  Get in{" "}
                  <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Touch
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Have questions? We'd love to hear from you!
                </p>
              </div>

              <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold font-accent">Email Us</h3>
                      <a 
                        href="mailto:info@yourperiodbox.com" 
                        className="text-primary hover:underline"
                        data-testid="link-email"
                      >
                        info@yourperiodbox.com
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href="/contact">
                      <Button size="lg" className="w-full font-semibold" data-testid="button-contact-form">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Send Us a Message
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}