import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 relative bg-[#0a0912]/30 backdrop-blur-md">
      {/* Scanline texture, kept faint since bg is already transparent */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
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

      <div className="relative border-b border-white/5">
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background: "linear-gradient(90deg, #4fd8ff, transparent 30%, transparent 70%, #ff5fae)",
            opacity: 0.6,
          }}
        />

        <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-3 px-3 py-2 sm:px-6">
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
            <span className="hidden lg:inline-block text-[10px] tracking-[0.25em] uppercase text-stone-400">
              Beta
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 text-sm font-medium text-stone-300 md:flex">
            {[
              { href: "/", label: "Home" },
              { href: "/features", label: "Features" },
              { href: "/about", label: "About" },
              { href: "/pricing", label: "Pricing" },
              { href: "/contact", label: "Contact" },
            ].map((item, i) => (
              <div key={item.href} className="flex items-center">
                {i > 0 && <span className="text-white/15 text-xs px-1">/</span>}
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
            <Link
              href="/login"
              className="hidden items-center rounded border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-stone-200 backdrop-blur-sm transition hover:border-[#4fd8ff]/50 hover:text-white sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/"
              className="relative inline-flex items-center gap-1.5 rounded border px-3 py-2 text-sm font-semibold transition"
              style={{
                background: "rgba(79,216,255,0.15)",
                borderColor: "rgba(79,216,255,0.5)",
                color: "#4fd8ff",
                backdropFilter: "blur(8px)",
              }}
            >
              Get Started
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}