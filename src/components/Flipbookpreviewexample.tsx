// "use client";

// /**
//  * Example: hook PdfFlipbookViewer up to a PDF you already generate
//  * (e.g. your existing html2canvas + jsPDF export, or an <object> blob URL).
//  *
//  * Drop this pattern into wherever your "Preview" / "Download" step lives.
//  */

// import { useState, type ComponentType } from "react";
// import dynamic from "next/dynamic";

// type PdfFlipbookViewerProps = {
//   pdfUrl: string;
//   title?: string;
// };

// // react-pdf / react-pageflip touch the DOM directly, so load client-only.
// const PdfFlipbookViewer = dynamic(
//   () =>
//     import("./PdfFlipbookViewer").then(
//       (mod) => mod.default as unknown as ComponentType<PdfFlipbookViewerProps>
//     ),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="w-full py-24 flex items-center justify-center text-[#7a1f2b] font-serif text-sm">
//         Preparing the flipbook…
//       </div>
//     ),
//   }
// );

// export default function FlipbookPreviewExample() {
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   // Wherever your existing export logic produces a Blob, just do:
//   //   const blob = await generateBiodataPdfBlob(formData, selectedTemplate);
//   //   setPdfUrl(URL.createObjectURL(blob));
//   async function handleGenerateAndPreview() {
//     // Replace with your real jsPDF/html2canvas export call.
//     const blob = await window.fetch("/api/generate-biodata-pdf").then((r) =>
//       r.blob()
//     );
//     setPdfUrl(URL.createObjectURL(blob));
//   }

//   return (
//     <div className="min-h-screen bg-[#fbf5e9] flex flex-col items-center py-12 px-4">
//       {!pdfUrl ? (
//         <button
//           onClick={handleGenerateAndPreview}
//           className="px-6 py-3 rounded-sm bg-[#7a1f2b] text-[#fbf5e9] font-serif tracking-wide hover:bg-[#5c1620] transition-colors"
//         >
//           Preview as Flipbook
//         </button>
//       ) : (
//         <PdfFlipbookViewer pdfUrl={pdfUrl} title="Your Biodata" />
//       )}
//     </div>
//   );
// }