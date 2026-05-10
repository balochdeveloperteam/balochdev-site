import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type StudioLayoutProps = {
  children: ReactNode;
  /** Extra bottom padding for long pages */
  padBottom?: boolean;
};

/**
 * Theme-aware shell: follows html[data-theme] via CSS variables (dark / light / dusk).
 */
export function StudioLayout({ children, padBottom = true }: StudioLayoutProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative box-border min-h-0 w-full min-w-0 overflow-x-hidden bg-[var(--ndx-bg)] text-[var(--ndx-text)] antialiased ${padBottom ? "pb-16 sm:pb-20" : ""}`}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background: [
            "radial-gradient(ellipse 100% 70% at 85% -15%, color-mix(in srgb, var(--ndx-accent) 22%, transparent), transparent 55%)",
            "radial-gradient(ellipse 80% 50% at 0% 10%, color-mix(in srgb, var(--ndx-accent-2) 14%, transparent), transparent 50%)",
            "var(--ndx-bg)",
          ].join(", "),
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.28] sm:opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(var(--ndx-border) 1px, transparent 1px), linear-gradient(90deg, var(--ndx-border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute -right-24 top-0 -z-10 h-72 w-72 rounded-full opacity-40 blur-3xl sm:h-96 sm:w-96"
          style={{ background: "color-mix(in srgb, var(--ndx-accent) 35%, transparent)" }}
          animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className="relative z-0 mx-auto box-border w-full min-w-0 px-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
        style={{ maxWidth: "var(--ndx-max)" }}
      >
        {children}
      </div>
    </div>
  );
}

export function studioPrimaryLinkClass() {
  return "inline-flex min-h-12 min-w-[10rem] items-center justify-center rounded-full bg-[var(--ndx-accent)] px-6 py-3 text-center text-sm font-semibold text-[var(--ndx-accent-ink)] shadow-[0_12px_40px_color-mix(in_srgb,var(--ndx-accent)_35%,transparent)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ndx-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ndx-bg)] active:scale-[0.98]";
}

export function studioGhostLinkClass() {
  return "inline-flex min-h-12 min-w-[10rem] items-center justify-center rounded-full border border-[var(--ndx-border-strong)] bg-[color-mix(in_srgb,var(--ndx-bg-elev)_88%,var(--ndx-surface))] px-6 py-3 text-center text-sm font-semibold text-[var(--ndx-text)] backdrop-blur-md transition hover:border-[var(--ndx-accent)] hover:text-[var(--ndx-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ndx-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ndx-bg)] active:scale-[0.98]";
}

/** Solid-tinted cards — dusk `surface` is too transparent to mix with transparent for fills. */
export function studioCardClass() {
  return "rounded-2xl border border-[var(--ndx-border)] bg-[color-mix(in_srgb,var(--ndx-bg-elev)_92%,var(--ndx-surface))] shadow-[0_8px_32px_var(--ndx-shadow-card)] backdrop-blur-md sm:rounded-3xl";
}

/** Lighter panels (badges, pills, dense tables) — same readable fill as cards, less shadow. */
export function studioPanelClass() {
  return "border border-[var(--ndx-border-strong)] bg-[color-mix(in_srgb,var(--ndx-bg-elev)_90%,var(--ndx-surface))] backdrop-blur-md";
}
