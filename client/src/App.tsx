import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Survey from "@/pages/Survey";
import Products from "@/pages/Products";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import Account from "@/pages/Account";
import Login from "@/pages/Login";

import { useLocation, Route, Switch, Redirect } from "wouter";
import { useEffect } from "react";

import {ScrollManager} from "@/components/ScrollManager"; // NOT USED NOW

function useGitHubPagesRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const q = window.location.search;          // "?/survey"
    if (q.startsWith("?/")) {
      const real = q.slice(2) + window.location.hash; // "survey" or "survey#foo"
      window.history.replaceState(
        null,
        "",
        "/ThePeriodBox/" + real
      );
      setLocation("/" + real);                 // tell wouter immediately
    }
  }, []); // run only on mount
}

function Routes() {
  useGitHubPagesRedirect(); 
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/survey" component={Survey} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/account" component={Account} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/survey" component={Survey} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/account" component={Account} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

const ScrollToTop = () => {
  const [location] = useLocation();

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.getElementById(hash.substring(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

useEffect(() => {
  requestAnimationFrame(() => {
    if (window.location.hash) {
      const el = document.getElementById(
        window.location.hash.substring(1)
      );
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0 });
    }
  });
}, [location]);



  useEffect(() => {
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
};



export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Routes />
        <ScrollToTop />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
