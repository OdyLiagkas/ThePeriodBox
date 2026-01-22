import { useLocation } from "wouter";
import { useEffect } from "react";

export function ScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    // Split path and hash
    const [path, hash] = location.split("#");

    // Wait for DOM to paint (important for route changes)
    requestAnimationFrame(() => {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, [location]);

  return null;
}
