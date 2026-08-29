import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Heart,
  Sparkles,
  Palette,
  FileText,
  Download,
  Languages,
  ArrowRight,
  Check,
  Users,
  WandSparkles,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Made for families",
    text: "Built around the way marriage biodatas are actually created, reviewed, printed, and shared with family.",
  },
  {
    icon: Palette,
    title: "Beautiful by default",
    text: "Elegant layouts, thoughtful typography, colors, spacing, and decorative details are already designed for you.",
  },
  {
    icon: Sparkles,
    title: "Simple to customize",
    text: "No graphic design experience required. Add your information, choose your style, and make it personal.",
  },
  {
    icon: Download,
    title: "Ready to share",
    text: "Create a polished document that looks great whether you share it digitally or print it for family.",
  },
];

const steps = [
  {
    number: "01",
    icon: Palette,
    title: "Choose your design",
    text: "Select from elegant templates designed specifically for marriage biodatas.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Add your details",
    text: "Enter your personal, family, education, career, lifestyle, and contact information.",
  },
  {
    number: "03",
    icon: WandSparkles,
    title: "Make it personal",
    text: "Upload your photo and customize the look to create something that feels uniquely yours.",
  },
  {
    number: "04",
    icon: Download,
    title: "Download & share",
    text: "Export your finished biodata and share it with family, friends, or prospective matches.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7]">
      <AppHeader />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[800px] -translate-x-1/2 bg-pink-200/30 blur-[120px]" />
        <div className="absolute right-[-150px] top-[40%] h-[400px] w-[400px] bg-amber-100/40 blur-[120px]" />
        <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] bg-purple-100/30 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Hero */}
        <section className="relative overflow-hidden border border-white/80 bg-white/75 px-6 py-12 shadow-xl shadow-stone-900/5 backdrop-blur-xl sm:px-10 sm:py-16 lg:px-16">
          <div className="absolute right-[-100px] top-[-120px] h-[350px] w-[350px] bg-pink-100/70 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[-100px] h-[300px] w-[300px] bg-amber-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" />
              Beautiful beginnings start here
            </div>

            <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Your story deserves a
              <span className="block bg-gradient-to-r leading-normal from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                beautiful introduction
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              Marriage Biodata Builder makes it simple to turn your personal
              story into a beautiful, professional, and family-ready biodata.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Create My Biodata
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 border border-stone-200 bg-white px-6 py-3.5 text-sm font-bold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-white/80 bg-white/75 p-7 shadow-lg shadow-stone-900/5 backdrop-blur-xl sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
              Why we built it
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
              Creating a marriage biodata should be simple.
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-stone-600 sm:text-base">
              <p>
                A marriage biodata is more than a document. It is often the
                first introduction between families and a simple way to share
                important details about a person.
              </p>

              <p>
                We created Biodata Builder to remove the difficult parts of
                formatting, designing, and preparing that document. Instead of
                spending hours working with complicated design tools, you can
                focus on the information that matters.
              </p>

              <p>
                Choose a template, add your details, upload your photo,
                personalize the design, and create a polished biodata ready to
                share.
              </p>
            </div>
          </div>

          {/* Highlight Card */}
          <div className="relative overflow-hidden bg-stone-900 p-7 text-white shadow-xl sm:p-9">
            <div className="absolute right-[-70px] top-[-70px] h-48 w-48 bg-pink-500/20 blur-3xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center bg-white/10 text-pink-300">
                <Users className="h-5 w-5" />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Built for real families
              </h3>

              <p className="mt-3 text-sm leading-7 text-stone-300">
                Whether you are creating your own biodata, helping a sibling,
                or preparing one for a family member, the builder keeps the
                process straightforward.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Easy for first-time users",
                  "Professional presentation",
                  "English & Hindi content",
                  "Digital & print-friendly",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-stone-200"
                  >
                    <span className="flex h-5 w-5 items-center justify-center bg-pink-500/20">
                      <Check className="h-3 w-3 text-pink-300" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mt-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
              What matters to us
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
              Designed with simplicity in mind
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
              Every part of the builder is focused on making your biodata
              easier to create and better to present.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center bg-pink-50 text-pink-600 transition group-hover:bg-pink-100">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-stone-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-16 border border-white/80 bg-white/70 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-xl sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-pink-50 text-pink-600">
              <WandSparkles className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-3xl font-black text-stone-900">
              From details to biodata in minutes
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500">
              A simple four-step process designed for anyone to use.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <div
                key={number}
                className="relative border border-stone-200 bg-white/80 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-pink-200">
                    {number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center bg-stone-100 text-stone-700">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-5 font-bold text-stone-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="mt-8 overflow-hidden border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-amber-50 p-7 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-white text-pink-600 shadow-sm">
            <Heart className="h-6 w-6 fill-pink-500" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-pink-600">
            Our mission
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
            Make every first impression beautiful, simple, and meaningful.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            We believe creating a marriage biodata shouldn&apos;t require
            design skills or complicated software. It should be an easy,
            enjoyable way to present who you are and what matters to you.
          </p>

          <Link
            href="/"
            className="group mt-7 inline-flex items-center gap-2 bg-stone-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-stone-800"
          >
            Create Your Biodata
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Footer */}
        <div className="py-8 text-center text-xs text-stone-400">
          Create beautifully • Customize freely • Share confidently
        </div>
      </div>
      </div>
      <AppFooter />
    </main>
  );
}