import html2canvas from "html2canvas";
import jsPDF from "jspdf";

async function renderCanvas(node: HTMLElement) {
  node.classList.add("pdf-export");
  try {
    const canvas = await html2canvas(node, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      // Cap the capture to the node's actual laid-out box (clientWidth/
      // clientHeight), not its scrollWidth/scrollHeight. scrollHeight
      // reports full content height even under overflow:hidden — that's
      // what was letting html2canvas grab extra height beyond one A4 page
      // and hand jsPDF a tall image it then sliced into a second page.
      width: node.clientWidth,
      height: node.clientHeight,
      windowWidth: node.clientWidth,
      windowHeight: node.clientHeight,
    });
    return canvas;
  } finally {
    node.classList.remove("pdf-export");
  }
}

export async function exportAsImage(node: HTMLElement, filename: string) {
  const canvas = await renderCanvas(node);
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

export async function exportAsPdf(node: HTMLElement, filename: string) {
  const canvas = await renderCanvas(node);
  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  } else {
    // Kept as a safety net for future multi-page templates — with the
    // capped capture above, single-page templates like BannerLayout should
    // never hit this branch anymore.
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  }

  pdf.save(`${filename}.pdf`);
}