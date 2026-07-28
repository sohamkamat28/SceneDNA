import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({
  value,
  label,
  buttonText = "Copy",
  prominent = false,
}: {
  value: string;
  label: string;
  buttonText?: string;
  prominent?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success(`${label} copied.`);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          toast.error(`Could not copy ${label}. Please try again.`);
        }
      }}
      className={
        prominent
          ? "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          : "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-surface"
      }
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="h-3 w-3" aria-hidden />
      ) : (
        <Copy className="h-3 w-3" aria-hidden />
      )}
      {copied ? "Copied" : buttonText}
    </button>
  );
}
