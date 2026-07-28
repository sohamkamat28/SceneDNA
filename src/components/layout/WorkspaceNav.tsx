import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { to: ROUTES.app, label: "Overview" },
  { to: ROUTES.newAnalysis, label: "New analysis" },
  { to: ROUTES.history, label: "History" },
  { to: ROUTES.settings, label: "Settings" },
] as const;

export function WorkspaceNav() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: ROUTES.login, replace: true });
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5">
        <nav className="flex items-center gap-5 overflow-x-auto py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === ROUTES.app }}
              activeProps={{ className: "text-foreground" }}
              className="whitespace-nowrap transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleSignOut}
          className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
