import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";


export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight">
                Redefining{" "}
                <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                  Period Care
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                PeriodBox was born from a simple truth: every woman's period is different, yet most of us are stuck guessing which products work best. We're changing that.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl xl:max-w-5xl mx-auto text-center space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-heading">Our Story</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground text-center">
                  We started PeriodBox after realizing how frustrating it was to find the right period products. 
                  The endless trial and error, the waste, the disappointment—it didn't have to be this way. 
                  By combining personalized surveys with carefully curated products, we help women discover what truly works for them on the first try.
                </p>
              </div>
            </div>
          </div>
        </section>
{/* ===== FAQ Section ===== */}
<section id="faq" className="py-16 md:py-24 bg-brandPink scroll-mt-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold font-heading">
          Frequently Asked Questions
        </h2>
      </div>

      {/* 3-column cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-lg">
              How much does The Period Box cost?
            </h3>
            <p className="text-sm text-muted-foreground">
              Your personalized sample box is $29 with free shipping. Each box
              contains 4–6 different product samples worth over $60. There are
              no subscriptions or commitments—just one box tailored to you.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-lg">
              How long does the quiz take?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our quiz takes about 3 minutes to complete. We ask questions
              about your flow, lifestyle, comfort preferences, and values to
              ensure we recommend the best products for your unique needs.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-lg">
              Can I choose specific products?
            </h3>
            <p className="text-sm text-muted-foreground">
              Your box is curated based on your quiz responses, but you can
              customize preferences like organic-only, reusable-only, or
              specific product types. We'll always include a variety to help
              you discover new favorites.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* wide card */}
      <Card className="bg-card">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold text-lg text-center">
            What if I don't like something?
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
            That's totally okay! Discovery is part of the process. Each box
            includes detailed product information and usage tips. You'll learn
            what works and what doesn’t—helping you make smarter full-size
            purchases later.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-heading">Get in Touch</h2>
                <p className="text-lg text-muted-foreground">
                  Have questions? We'd love to hear from you!
                </p>
              </div>

              <Card className="overflow-hidden">
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
