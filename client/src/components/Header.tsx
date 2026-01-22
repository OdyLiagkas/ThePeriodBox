import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/Full_Page_1766110908945.png";
import { RefreshLink } from "@/components/RefreshLink";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    //{ label: "Survey", path: "/survey" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between gap-4">
          <RefreshLink href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1 transition-all">
              <img src={logoImage} alt="The Period Box" className="h-24 w-auto" />
            </div>
          </RefreshLink>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <RefreshLink key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="font-medium"
                >
                  {item.label}
                </Button>
              </RefreshLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
              <RefreshLink href="/account" data-testid="link-account">
    <Button variant="outline" size="default" className="font-semibold">
      Account
    </Button>
  </RefreshLink>
            <RefreshLink href="/survey" data-testid="link-start-survey">
              <Button variant="default" size="default" className="font-semibold">
                Take Survey
              </Button>
            </RefreshLink>
            
          </div>

          <button
            className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            {navItems.map((item) => (
              <RefreshLink key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </Button>
              </RefreshLink>
            ))}
      <RefreshLink href="/account" data-testid="link-account">
    <Button variant="outline" size="default" className="font-semibold">
      Account
    </Button>
  </RefreshLink>
            <RefreshLink href="/survey">
              <Button
                variant="default"
                className="w-full font-semibold"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="button-mobile-start-survey"
              >
                Start Survey
              </Button>
            </RefreshLink>
          </div>
        )}
      </div>
    </header>
  );
}
