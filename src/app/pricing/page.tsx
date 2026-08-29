import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Check, Crown, Heart, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for creating a simple marriage biodata.",
    price: "₹0",
    period: "forever",
    icon: Heart,
    features: [
      "Basic biodata templates",
      "1 biodata profile",
      "Photo upload",
      "Standard PDF export",
      "Basic fonts & colors",
    ],
    button: "Start for Free",
    href: "/",
    featured: false,
  },
  {
    name: "Premium",
    description: "Everything you need for a beautiful, professional biodata.",
    price: "₹199",
    period: "/ month",
    icon: Sparkles,
    features: [
      "All premium templates",
      "Unlimited biodata profiles",
      "HD PDF export",
      "Premium fonts & colors",
      "Custom sections",
      "Save & edit drafts",
      "Remove branding",
    ],
    button: "Create Premium Biodata",
    href: "/",
    featured: true,
  },
  {
    name: "Family",
    description: "Best for families creating biodatas for multiple profiles.",
    price: "₹499",
    period: "/ month",
    icon: Crown,
    features: [
      "Everything in Premium",
      "Multiple family profiles",
      "Unlimited biodata designs",
      "Priority support",
      "Premium template collection",
      "High-quality printing export",
      "Early access to new templates",
    ],
    button: "Choose Family",
    href: "/",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7]">
      <AppHeader />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 bg-pink-200/30 blur-[100px]" />
        <div className="absolute right-[-150px] top-[35%] h-[350px] w-[350px] bg-amber-100/40 blur-[100px]" />
        <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] bg-purple-100/30 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Hero */}
        <section className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <Sparkles className="h-4 w-4" />
            Create your perfect biodata
          </div>

          <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Choose a plan that
            <span className="block bg-gradient-to-r leading-normal from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              fits your journey
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Create a beautiful marriage biodata in minutes. Choose a template,
            add your details, customize the design, and download a
            print-ready PDF.
          </p>

          {/* Trust */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-stone-500">
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              No design skills needed
            </span>

            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              Beautiful templates
            </span>

            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              Print-ready PDF
            </span>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col p-[1px] transition duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "bg-gradient-to-b from-pink-500 via-rose-500 to-amber-400 shadow-2xl shadow-pink-500/20"
                    : "border border-stone-200 bg-white/80 shadow-xl shadow-stone-900/5"
                }`}
              >
                {plan.featured && (
                  <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-pink-500/30">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div
                  className={`flex h-full flex-col p-6 sm:p-7 ${
                    plan.featured
                      ? "bg-white"
                      : "bg-white/90"
                  }`}
                >
                  {/* Icon + Name */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={`mb-4 flex h-11 w-11 items-center justify-center ${
                          plan.featured
                            ? "bg-pink-50 text-pink-600"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            plan.name === "Free" ? "" : "fill-current"
                          }`}
                        />
                      </div>

                      <h2 className="text-xl font-bold text-stone-900">
                        {plan.name}
                      </h2>

                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-stone-500">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-7 flex items-end gap-2 border-b border-stone-100 pb-6">
                    <span className="text-4xl font-black tracking-tight text-stone-900">
                      {plan.price}
                    </span>

                    <span className="pb-1 text-sm text-stone-500">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 flex-1 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-stone-600"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center ${
                            plan.featured
                              ? "bg-pink-100 text-pink-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.href}
                    className={`group mt-8 flex h-12 items-center justify-center gap-2 text-sm font-bold transition ${
                      plan.featured
                        ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/20 hover:from-pink-700 hover:to-rose-600"
                        : "border border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300 hover:bg-stone-100"
                    }`}
                  >
                    {plan.button}

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* Bottom CTA */}
        <section className="relative mt-12 overflow-hidden border border-pink-100 bg-gradient-to-r from-pink-50 via-white to-amber-50 p-7 text-center sm:p-10">
          <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-pink-200/30 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-white text-pink-600 shadow-sm">
              <Heart className="h-5 w-5 fill-pink-500" />
            </div>

            <h3 className="text-2xl font-bold text-stone-900">
              Start creating your biodata today
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-500">
              Turn your personal details into a beautiful marriage biodata
              that you can proudly share with family and loved ones.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-stone-800"
            >
              Create My Biodata
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Footer Note */}
        <p className="py-8 text-center text-xs text-stone-400">
          Create beautiful biodatas • Customize your style • Download anytime
        </p>
      </div>
      </div>
      <AppFooter />
    </main>
  );
}