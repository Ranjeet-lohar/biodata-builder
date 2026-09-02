












































































































































































































































































































































































































































































































































































































































import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  MessageCircle,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email us",
    value: "ranjeet@drupaltechie.com",
    href: "mailto:ranjeet@drupaltechie.com",
    description: "For general questions and support",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+91 92599 03000",
    href: "tel:+919259903000",
    description: "Available during business hours",
  },
  {
    icon: MapPin,
    label: "Our location",
    value: "India",
    description: "Serving families across India",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7]">
      <AppHeader />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[450px] w-[750px] -translate-x-1/2 bg-pink-200/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-[35%] h-[350px] w-[350px] bg-amber-100/50 blur-[110px]" />
        <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] bg-purple-100/30 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Hero */}
        <section className="relative overflow-hidden border border-white/80 bg-white/75 p-7 shadow-xl shadow-stone-900/5 backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="absolute right-[-80px] top-[-100px] h-[280px] w-[280px] bg-pink-100/70 blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-80px] h-[240px] w-[240px] bg-amber-100/60 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Hero content */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
                <MessageCircle className="h-4 w-4" />
                We are here to help
              </div>

              <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                Let&apos;s talk about your
                <span className="block bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  beautiful biodata
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Have a question about templates, customization, PDF exports,
                or your account? We&apos;re happy to help you create the
                perfect marriage biodata.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-stone-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-500" />
                  Friendly support
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 bg-pink-500" />
                  Product assistance
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 bg-amber-500" />
                  Template help
                </span>
              </div>
            </div>

            {/* Decorative card */}
            <div className="relative hidden lg:block">
              <div className="mx-auto max-w-sm rotate-2 border border-pink-100 bg-white p-6 shadow-2xl shadow-pink-900/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center bg-pink-50 text-pink-600">
                    <Heart className="h-6 w-6 fill-pink-500" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                      Marriage Biodata
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-stone-900">
                      Made with care
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-3 w-3/4 bg-stone-100" />
                  <div className="h-3 w-full bg-stone-100" />
                  <div className="h-3 w-2/3 bg-stone-100" />
                </div>

                <div className="mt-6 flex items-center gap-2 bg-pink-50 p-3 text-xs font-medium text-pink-700">
                  <Sparkles className="h-4 w-4" />
                  We&apos;re happy to help
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {contactItems.map(
            ({ icon: Icon, label, value, href, description }) => {
              const Card = href ? "a" : "div";

              return (
                <Card
                  key={label}
                  {...(href ? { href } : {})}
                  className="group border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center bg-pink-50 text-pink-600 transition group-hover:bg-pink-100">
                      <Icon className="h-5 w-5" />
                    </div>

                    {href && (
                      <ArrowRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-1 group-hover:text-pink-500" />
                    )}
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-stone-400">
                    {label}
                  </p>

                  <p className="mt-1 break-words text-base font-bold text-stone-900">
                    {value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {description}
                  </p>
                </Card>
              );
            },
          )}
        </section>

        {/* Contact Form + Info */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Form */}
          <div className="border border-white/80 bg-white/75 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
                Send us a message
              </p>

              <h2 className="mt-2 text-2xl font-black text-stone-900">
                How can we help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Tell us what you need and we&apos;ll get back to you as soon as
                possible.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Your name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="h-12 w-full border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 w-full border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  className="h-12 w-full border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  defaultValue=""
                >
                  <option value="" disabled>
                    What can we help with?
                  </option>
                  <option value="template">Template question</option>
                  <option value="export">PDF / Export issue</option>
                  <option value="account">Account / Profile</option>
                  <option value="pricing">Pricing</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:from-pink-700 hover:to-rose-600 sm:w-auto sm:px-7"
              >
                Send Message
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>

          {/* Side information */}
          <div className="flex flex-col gap-5">
            <div className="border border-stone-200 bg-stone-900 p-7 text-white shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center bg-white/10 text-pink-300">
                <Clock className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Support hours
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-400">
                We&apos;re available to help with your biodata, templates,
                exports, and other product questions.
              </p>

              <div className="mt-6 border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Monday – Saturday
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  10:00 AM – 7:00 PM
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  India Standard Time
                </p>
              </div>
            </div>

            <div className="border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-amber-50 p-7">
              <div className="flex h-11 w-11 items-center justify-center bg-white text-pink-600 shadow-sm">
                <Heart className="h-5 w-5 fill-pink-500" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-stone-900">
                Ready to create your biodata?
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Start with a beautiful template and create your marriage
                biodata in just a few minutes.
              </p>

              <Link
                href="/"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-pink-600"
              >
                Start Creating
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
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
