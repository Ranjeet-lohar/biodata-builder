import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-6">
        <Link href="/" className="flex items-center shrink-0">
          <img
              src="/logo.png"
              alt="Biodata Builder"
              className="h-16 w-auto object-contain object-left"
            />
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium text-stone-700 md:flex">
          <Link href="/" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Home</Link>
          <Link href="/features" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Features</Link>
          <Link href="/about" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">About</Link>
          <Link href="/pricing" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Pricing</Link>
          <Link href="/contact" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/login" className="hidden rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300 sm:inline-flex">Login</Link>
          <Link href="/" className="inline-flex rounded-full bg-[#1e98d7] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-[#1787c3]">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
