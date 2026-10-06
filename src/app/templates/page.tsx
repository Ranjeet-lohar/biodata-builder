"use client";

import Link from "next/link";
import { templates } from "@/components/templates";
import Accordion from "@/components/Accordion";
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

            {/* One accordion per template */}
            <div className="mx-auto max-w-4xl space-y-4">
              {templates.map((template) => {
                return (
                  <Accordion key={template.id} title={template.name}>
                    <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      {/* Template Preview — swatch strip stands in for a live render */}
                      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-stone-50 to-stone-100">
                        <div className="text-center p-4">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            {template.swatch.map((color) => (
                              <span
                                key={color}
                                className="w-8 h-8 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-stone-600">Preview</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-stone-600 mb-6">
                          {template.description}
                        </p>

                        <Link
                          href={`/?template=${template.id}`}
                          className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-[#1e98d7] hover:bg-[#1787c3] text-white font-medium rounded-lg transition-all group/btn"
                        >
                          Use This Template
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </Accordion>
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