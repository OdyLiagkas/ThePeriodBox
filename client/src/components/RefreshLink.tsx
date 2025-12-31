import { Link, useLocation } from "wouter";
import { forwardRef, type ReactElement } from "react";

type RefreshLinkProps = {
  href: string;
  children: ReactElement;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const RefreshLink = forwardRef<
  HTMLAnchorElement,
  RefreshLinkProps
>(({ href, children, ...props }, ref) => {
  const [current] = useLocation();
  const [path, hash] = href.split('#');
  const [currPath] = current.split('#');

  const isSamePath = currPath === path; // ignore hash for path comparison

const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (!isSamePath) 
    return;

  if (hash) {
    // same page hash navigation
    e.preventDefault();

    const id = hash;
    history.replaceState(null, "", `${path}#${id}`);

    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return;
  }

  if (window.location.hash) {
    // same page, remove existing hash
    e.preventDefault();
    history.replaceState(null, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // same page, no hash → scroll top
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};



  return (
    <Link {...props} href={href} ref={ref} onClick={handleClick}>
      {children}
    </Link>
  );
});

RefreshLink.displayName = "RefreshLink";
