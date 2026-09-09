"use client";

import Link from "next/link";
import { templates, getTemplate } from "@/components/templates";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { ArrowRight } from "lucide-react";

export default function AllTemplatesPage() {
  return (
    <div className="min-h-screen bg-ambient flex flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 px-3 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                All Templates
              </h1>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                Choose from our collection of beautifully designed biodata templates. Each template is fully customizable and exports cleanly to PDF and Word.
              </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const meta = getTemplate(template.id);
                return (
                  <div
                    key={template.id}
                    className="group rounded-2xl overflow-hidden bg-white border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-white/80"
                  >
                    {/* Template Preview */}
                    <div className="relative h-80 bg-white/50 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
                        <div className="text-center p-4">
                          <div className="text-5xl mb-2">{template.emoji}</div>
                          <p className="text-sm text-stone-600">Preview</p>
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-5 sm:p-6">
                      <h3 className="text-xl font-semibold text-stone-900 mb-2">
                        {template.label}
                      </h3>
                      <p className="text-sm text-stone-600 mb-4 min-h-10">
                        {template.description}
                      </p>

                      {/* Features/Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {meta.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Use This Template Button */}
                      <Link
                        href={`/?template=${template.id}`}
                        className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-[#1e98d7] hover:bg-[#1787c3] text-white font-medium rounded-lg transition-all group/btn"
                      >
                        Use This Template
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features Section */}
            <div className="mt-16 pt-12 border-t border-white/60">
              <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
                Why Choose Our Templates?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <span className="text-xl">✨</span>
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-2">
                    Fully Customizable
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Edit every detail of your biodata with our intuitive editor
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <span className="text-xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-2">
                    Print Ready
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Export to PDF or Word format optimized for printing
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                    <span className="text-xl">🎨</span>
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-2">
                    Modern Designs
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Choose from a variety of contemporary and elegant styles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
