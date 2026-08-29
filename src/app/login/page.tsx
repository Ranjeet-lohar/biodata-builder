"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("demo@biodata-builder.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("demo-auth") === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleSignIn = () => {
    if (
      email === "demo@biodata-builder.com" &&
      password === "demo1234"
    ) {
      localStorage.setItem("demo-auth", "true");
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-ambient text-stone-900">
      <AppHeader />

      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl border border-stone-200 bg-[#fffdf8] shadow-[0_25px_80px_rgba(65,50,35,0.08)]">
          <div className="grid md:grid-cols-[1fr_1.05fr]">

            {/* LEFT — BRAND PANEL */}
            <div className="relative hidden overflow-hidden border-r border-stone-200 bg-[#f3eee5] md:flex">
              {/* Decorative gradients */}
              <div className="absolute -left-24 -top-24 h-72 w-72 bg-rose-200/30 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-80 w-80 bg-amber-200/30 blur-3xl" />

              <div className="relative flex w-full flex-col justify-between p-10 lg:p-14">
                <div>
                  <div className="mb-8 h-px w-16 bg-[#1e98d7]" />

                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500">
                    Marriage Biodata
                  </p>

                  <h2 className="mt-5 max-w-sm text-4xl font-light leading-tight tracking-tight text-stone-900 lg:text-5xl">
                    Create your
                    <span className="block font-serif italic text-[#1e98d7]">
                      perfect biodata.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-stone-600">
                    Design an elegant marriage biodata with beautiful
                    templates, personal details and a professional layout.
                  </p>
                </div>

                <div className="mt-12">
                  <img
                    src="/logo.png"
                    alt="Biodata Builder"
                    className="h-16 w-auto object-contain object-left"
                  />

                  <div className="mt-8 flex items-center gap-3 text-xs text-stone-500">
                    <span className="h-px w-8 bg-stone-300" />
                    Elegant · Simple · Personal
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — LOGIN */}
            <div className="p-6 sm:p-10 lg:p-14">
              {/* Back */}
              <Link
                href="/"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 transition-colors hover:text-[#1e98d7]"
              >
                ← Back to Builder
              </Link>

              {/* Logo mobile */}
              <div className="mt-8 md:hidden">
                <img
                  src="/logo.png"
                  alt="Biodata Builder"
                  className="h-14 w-auto object-contain object-left"
                />
              </div>

              {/* Heading */}
              <div className="mt-8 border-b border-stone-200 pb-7">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1e98d7]">
                  Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                  Sign in
                </h1>

                <p className="mt-2 text-sm text-stone-500">
                  Access your Biodata Builder account.
                </p>
              </div>

              <div className="mt-7 space-y-5">

                {/* Demo credentials */}
                <div className="border-l-2 border-[#1e98d7] bg-sky-50/60 px-4 py-3.5 text-xs text-stone-600">
                  <p className="font-bold uppercase tracking-wider text-stone-800">
                    Demo Account
                  </p>

                  <div className="mt-2 grid grid-cols-[60px_1fr] gap-y-1">
                    <span>Email</span>
                    <span className="font-medium text-stone-800">
                      demo@biodata-builder.com
                    </span>

                    <span>Password</span>
                    <span className="font-medium text-stone-800">
                      demo1234
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-stone-600">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      h-12 w-full
                      border border-stone-300
                      bg-white
                      px-4
                      text-sm text-stone-900
                      outline-none
                      transition-all
                      placeholder:text-stone-400
                      focus:border-[#1e98d7]
                      focus:ring-1
                      focus:ring-[#1e98d7]
                    "
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-stone-600">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      h-12 w-full
                      border border-stone-300
                      bg-white
                      px-4
                      text-sm text-stone-900
                      outline-none
                      transition-all
                      placeholder:text-stone-400
                      focus:border-[#1e98d7]
                      focus:ring-1
                      focus:ring-[#1e98d7]
                    "
                    placeholder="Enter your password"
                  />
                </div>

                {/* Sign in */}
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="
                    group
                    relative
                    flex h-12 w-full
                    items-center justify-center
                    overflow-hidden
                    bg-[#1e98d7]
                    px-4
                    text-sm font-bold
                    uppercase tracking-[0.12em]
                    text-white
                    transition-all
                    hover:bg-[#1787c3]
                    active:translate-y-px
                  "
                >
                  <span className="relative z-10">
                    Sign In
                  </span>

                  <span
                    className="
                      absolute inset-y-0 left-0
                      w-0
                      bg-white/10
                      transition-all
                      duration-500
                      group-hover:w-full
                    "
                  />
                </button>

                {/* Bottom */}
                <div className="flex items-center gap-4 pt-3">
                  <div className="h-px flex-1 bg-stone-200" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Biodata Builder
                  </span>

                  <div className="h-px flex-1 bg-stone-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </main>
  );
}