import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marriage Biodata Builder",
  description:
    "Create a beautiful marriage biodata in minutes. Fill your details, upload a photo, pick a design, and download as PDF or image.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,500&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,500&family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Tiro+Devanagari+Hindi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col ">
        {children}</body>
    </html>
  );
}
