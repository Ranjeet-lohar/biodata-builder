import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Check,
  Sparkles,
  Palette,
  Download,
  FileText,
  Heart,
  Image as ImageIcon,
  Languages,
  LayoutTemplate,
  WandSparkles,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Crown,
} from "lucide-react";

const features = [
  {
    icon: LayoutTemplate,
    title: "Beautiful Templates",
    text: "Choose from elegant, modern, floral, traditional, and royal biodata designs made specifically for marriage profiles.",
    tag: "Design",
  },
  {
    icon: Palette,
    title: "Customize Every Detail",
    text: "Personalize colors, typography, spacing, sections, borders, and decorative elements to match your style.",
    tag: "Customize",
  },
  {
    icon: FileText,
    title: "Smart Biodata Sections",
    text: "Organize personal, family, education, career, contact, lifestyle, and horoscope details with ease.",
    tag: "Editor",
  },
  {
    icon: ImageIcon,
    title: "Beautiful Photo Layouts",
    text: "Upload your profile photo and create a polished photo presentation that looks great on screen and paper.",
    tag: "Photos",
  },
  {
    icon: Languages,
    title: "English & Hindi",
    text: "Create biodatas using English, Hindi, or a combination of both for family-friendly sharing.",
    tag: "Language",
  },
  {
    icon: Download,
    title: "Print-Ready Export",
    text: "Download your completed biodata as a high-quality PDF that is ready to print or share digitally.",
    tag: "Export",
  },
  {
    icon: Smartphone,
    title: "Works on Every Device",
    text: "Create and edit your biodata comfortably on desktop, tablet, or mobile.",
    tag: "Responsive",
  },
  {
    icon: ShieldCheck,
    title: "Your Profile, Your Control",
    text: "Keep your biodata information organized and give yourself complete control over what you share.",
    tag: "Privacy",
  },
];

const workflow = [
  {
    number: "01",
    title: "Choose a template",
    text: "Start with a design that matches your personality and family style.",
  },
  {
    number: "02",
    title: "Add your details",
    text: "Fill in your personal, family, education, career, and contact information.",
  },
  {
    number: "03",
    title: "Make it yours",
    text: "Add your photo, choose colors, adjust sections, and personalize the design.",
  },
  {
    number: "04",
    title: "Download & share",
    text: "Export a polished PDF and share your biodata with family and relatives.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7]">
      <AppHeader />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[800px] -translate-x-1/2 bg-pink-200/30 blur-[120px]" />
        <div className="absolute right-[-180px] top-[35%] h-[400px] w-[400px] bg-amber-100/40 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-150px] h-[450px] w-[450px] bg-purple-100/30 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Hero */}
        <section className="relative overflow-hidden border border-white/80 bg-white/75 px-6 py-12 shadow-xl shadow-stone-900/5 backdrop-blur-xl sm:px-10 sm:py-16 lg:px-16">
          <div className="absolute right-[-80px] top-[-100px] h-[300px] w-[300px] bg-pink-100/70 blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-80px] h-[250px] w-[250px] bg-amber-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" />
              Designed for beautiful beginnings
            </div>

            <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Everything you need to create a
              <span className="block bg-gradient-to-r leading-normal from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                beautiful marriage biodata
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              Create a professional, elegant, and family-ready biodata in
              minutes. Choose a template, add your details, customize the
              design, and download it ready to share.
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
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-stone-200 bg-white px-6 py-3.5 text-sm font-bold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              value: "14+",
              label: "Beautiful Templates",
              icon: LayoutTemplate,
            },
            {
              value: "2",
              label: "Languages Supported",
              icon: Languages,
            },
            {
              value: "1 Click",
              label: "PDF Export",
              icon: Download,
            },
          ].map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-pink-50 text-pink-600">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <div className="text-xl font-black text-stone-900">
                  {value}
                </div>
                <div className="text-xs font-medium text-stone-500">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Features */}
        <section className="mt-16">
          <div className="mb-8 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-pink-600">
              Powerful & simple
            </p>

            <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
              Everything is designed around your biodata
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
              No complicated design software. Just enter your information and
              let the builder handle the presentation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(
              ({ icon: Icon, title, text, tag }, index) => (
                <div
                  key={title}
                  className="group relative overflow-hidden border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5"
                >
                  <div className="absolute right-[-35px] top-[-35px] h-24 w-24 bg-pink-50 opacity-0 blur-2xl transition group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center bg-pink-50 text-pink-600 transition group-hover:bg-pink-100">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="bg-stone-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        {tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      {text}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-16 border border-white/80 bg-white/70 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-xl sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-pink-50 text-pink-600">
              <WandSparkles className="h-5 w-5" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-stone-900">
              Create your biodata in 4 simple steps
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500">
              From a blank page to a beautiful, share-ready biodata without
              spending hours designing.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step) => (
              <div
                key={step.number}
                className="relative border border-stone-200 bg-white/80 p-5"
              >
                <div className="mb-5 text-3xl font-black text-pink-200">
                  {step.number}
                </div>

                <h3 className="font-bold text-stone-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Section */}
        <section className="relative mt-8 overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-[#3b1528] p-7 text-white shadow-2xl sm:p-10 lg:p-12">
          <div className="absolute right-[-100px] top-[-120px] h-[350px] w-[350px] bg-pink-500/20 blur-[100px]" />
          <div className="absolute bottom-[-150px] left-[30%] h-[300px] w-[300px] bg-amber-400/10 blur-[100px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-200">
                <Crown className="h-3.5 w-3.5" />
                Premium Experience
              </div>

              <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Make your biodata as special as the occasion.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
                Unlock premium templates, advanced customization, high-quality
                exports, elegant fonts, and more ways to create a biodata your
                family will be proud to share.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Premium templates",
                  "HD PDF export",
                  "Premium fonts",
                  "Advanced customization",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-stone-200"
                  >
                    <Check className="h-4 w-4 text-pink-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/pricing"
              className="group inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-sm font-bold text-stone-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-pink-50"
            >
              Explore Premium
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-8 border border-pink-100 bg-gradient-to-r from-pink-50 via-white to-amber-50 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-white text-pink-600 shadow-sm">
            <Heart className="h-5 w-5 fill-pink-500" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-stone-900 sm:text-3xl">
            Ready to create your biodata?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">
            Start with a beautiful template and create a professional marriage
            biodata in just a few minutes.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-stone-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-stone-800"
          >
            Start Creating
            <ArrowRight className="h-4 w-4" />
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