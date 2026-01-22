import { Link } from "wouter";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import logoImage from "@assets/Full_Page_1766110908945.png";
import { RefreshLink } from "@/components/RefreshLink";


export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
              <RefreshLink
  href="/"
  data-testid="link-home"
  className="inline-block"
>
  <img
    src={logoImage}
    alt="The Period Box"
    className="h-14 w-auto block"
  />
</RefreshLink>

            <p className="text-sm text-muted-foreground">
              Helping women discover their perfect period products through personalized recommendations.
            </p>
            <div className="flex gap-2">
                <a
    href="https://www.instagram.com/"        
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 hover-elevate active-elevate-2 rounded-md"
    data-testid="link-instagram"
  >
                <Instagram className="h-5 w-5" />
              </a>
              <a
    href="https://www.linkedin.com/"        
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 hover-elevate active-elevate-2 rounded-md"
    data-testid="link-linkedin"
  >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
    href="https://www.facebook.com/"        
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 hover-elevate active-elevate-2 rounded-md"
    data-testid="link-facebook"
  >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold font-accent mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <RefreshLink href="/" data-testid="link-footer-home">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">Home</span>
                </RefreshLink>
              </li>
              <li>
                <RefreshLink href="/products" data-testid="link-footer-products">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">Products</span>
                </RefreshLink>
              </li>
              <li>
                <RefreshLink href="/about" data-testid="link-footer-about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">About Us</span>
                </RefreshLink>
              </li>
                <li>
                <RefreshLink href="/survey" data-testid="link-footer-survey">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">Take Survey</span>
                </RefreshLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-accent mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
  <RefreshLink href="/about#faq" data-testid="link-footer-faq">
    <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
      FAQ
    </span>
  </RefreshLink>
</li>
              <li>
                <RefreshLink href="/contact" data-testid="link-footer-contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</span>
                </RefreshLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-accent mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Our Mission</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Sustainability</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 PeriodBox. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full font-medium">Women-owned</span>
            <span className="px-3 py-1 bg-chart-3/20 text-chart-3 rounded-full font-medium">Eco-friendly</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
