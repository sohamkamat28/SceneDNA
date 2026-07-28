import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
        <Link to={ROUTES.home} className="font-mono text-sm font-medium tracking-tight">
          {BRAND.wordmark}
        </Link>

        <h1 className="mt-10 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>

        <div className="mt-8">{children}</div>

        {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
      </div>
    </div>
  );
}
