import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const NAVY_BG = "#0A1929";

async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    backgroundColor: NAVY_BG,
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
  });
}

/** Export a DOM element to a downloadable PNG file. */
export async function exportToPNG(el: HTMLElement, fileName: string): Promise<void> {
  const canvas = await captureElement(el);
  const dataUrl = canvas.toDataURL("image/png", 1.0);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Export a DOM element to a multi-page A4 PDF (portrait). */
export async function exportToPDF(el: HTMLElement, fileName: string): Promise<void> {
  const canvas = await captureElement(el);
  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale image to fit page width
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Fill background on first page
  pdf.setFillColor(10, 25, 41);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
  heightLeft -= pageHeight;

  // Add additional pages if content is taller than one page
  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.setFillColor(10, 25, 41);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);
}
