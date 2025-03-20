
import { jsPDF } from "jspdf";

/**
 * Adds the DNA Health logo to the PDF page
 */
export const addLogoToPage = (doc: jsPDF): void => {
  // Use a PNG logo instead of SVG
  doc.addImage("/assets/dna-logo.png", "PNG", 20, 20, 60, 20);
};
