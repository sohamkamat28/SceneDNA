import { Link } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-mono text-sm font-medium">{BRAND.wordmark}</p>
          <p className="mt-2 text-sm text-muted-foreground">{BRAND.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Product
            </span>
            <Link to={ROUTES.example} className="text-muted-foreground hover:text-foreground">
              Example
            </Link>
            <Link to={ROUTES.pricing} className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Legal
            </span>
            <Link to={ROUTES.privacy} className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to={ROUTES.terms} className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. Analysis only — {BRAND.name} does not
            generate images.
          </p>
          <p className="font-mono">{BRAND.contactEmail}</p>
        </div>
      </div>
    </footer>
  );
}
