"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { LoaderCircle } from "lucide-react";

export default function AppHeader() {
  const pathname = usePathname();
  const isResume = pathname.startsWith("/resume");
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSwitchingBuilder =
    loadingTarget !== null && loadingTarget !== pathname;

  useEffect(() => {
    return () => {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    };
  }, []);

  function showBuilderLoader(
    href: string,
    event: MouseEvent<HTMLAnchorElement>
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      href === pathname
    ) {
      return;
    }

    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    setLoadingTarget(href);
    loadingTimeout.current = setTimeout(() => {
      setLoadingTarget(null);
      loadingTimeout.current = null;
    }, 12000);
  }

  return (
    <>
      <header className="sticky top-0 z-30 relative bg-[#0a0912]">
      {/* Scanline texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Corner brackets, HUD style */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M1,12 L1,1 L12,1" stroke="#4fd8ff" strokeWidth="1.5" />
      </svg>
      <svg className="absolute top-0 right-0 pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12,1 L23,1 L23,12" stroke="#ff5fae" strokeWidth="1.5" />
      </svg>

      {/* Base + bottom border with gradient glow */}
      <div className="relative border-b border-white/10">
        <div
          className="absolute inset-x-0 bottom-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, #4fd8ff, transparent 30%, transparent 70%, #ff5fae)",
            boxShadow: "0 0 12px rgba(79,216,255,0.5), 0 0 12px rgba(255,95,174,0.3)",
          }}
        />

        <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-3 px-3 py-1 sm:px-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="Biodata Builder"
              className="h-16 w-auto object-contain object-left"
            />
            <span
              className="hidden lg:inline-block h-4 w-px"
              style={{ background: "linear-gradient(180deg, transparent, #4fd8ff55, transparent)" }}
            />
            <span className="hidden lg:inline-block text-[10px] tracking-[0.25em] uppercase text-stone-500">
              Beta
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 text-sm font-medium text-stone-400 lg:flex">
            {[
              { href: "/features", label: "Features" },
              { href: "/about", label: "About" },
              { href: "/pricing", label: "Pricing" },
              { href: "/contact", label: "Contact" },
            ].map((item, i) => (
              <div key={item.href} className="flex items-center">
                {i > 0 && <span className="text-white/10 text-xs px-1">/</span>}
                <Link
                  href={item.href}
                  className="relative px-2.5 py-1.5 transition hover:text-white"
                >
                  <span className="text-[10px] mr-1 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div
              aria-label="Choose a builder"
              className="flex items-center rounded border border-white/15 bg-white/[0.04] p-1"
            >
              <Link
                href="/"
                onClick={(event) => showBuilderLoader("/", event)}
                aria-current={!isResume ? "page" : undefined}
                className={`rounded px-2.5 py-2 text-xs font-semibold transition sm:px-3 ${
                  !isResume
                    ? "bg-[#4fd8ff] text-[#0a0912]"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                Biodata
              </Link>
              <Link
                href="/resume"
                onClick={(event) => showBuilderLoader("/resume", event)}
                aria-current={isResume ? "page" : undefined}
                className={`rounded px-2.5 py-2 text-xs font-semibold transition sm:px-3 ${
                  isResume
                    ? "bg-[#ff5fae] text-[#0a0912]"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                Resume
              </Link>
            </div>
            <Link
              href="/login"
              className="hidden items-center rounded border border-white/15 px-3 py-2 text-sm font-medium text-stone-300 transition hover:border-[#4fd8ff]/50 hover:text-white lg:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/"
              className="relative inline-flex items-center gap-1.5 rounded border px-3 py-2 text-sm font-semibold text-[#0a0912] transition"
              style={{
                background: "#4fd8ff",
                borderColor: "#4fd8ff",
              }}
            >
              Get Started
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
      </header>
      {isSwitchingBuilder && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0912]/75 px-4 backdrop-blur-sm"
        >
          <div className="flex min-w-56 flex-col items-center rounded-xl border border-white/10 bg-[#11111c] px-8 py-7 text-center shadow-2xl">
            <LoaderCircle
              aria-hidden="true"
              className={`mb-4 h-9 w-9 animate-spin ${
                loadingTarget === "/resume"
                  ? "text-[#ff5fae]"
                  : "text-[#4fd8ff]"
              }`}
            />
            <p className="text-sm font-semibold text-white">
              Opening {loadingTarget === "/resume" ? "Resume" : "Biodata"} Builder…
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Preparing your workspace
            </p>
          </div>
        </div>
      )}
    </>
  );
}