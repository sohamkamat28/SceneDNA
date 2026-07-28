import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to={ROUTES.home} className="font-mono text-sm font-medium tracking-tight">
          {BRAND.wordmark}
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to={ROUTES.example} className="transition-colors hover:text-foreground">
            Example
          </Link>
          <Link to={ROUTES.pricing} className="transition-colors hover:text-foreground">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to={ROUTES.app}
              className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open workspace
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.login}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to={ROUTES.signup}
                className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
