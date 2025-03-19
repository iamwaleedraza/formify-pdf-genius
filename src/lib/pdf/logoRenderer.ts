
import { jsPDF } from "jspdf";

/**
 * Adds the DNA logo to the current page
 */
export const addLogoToPage = (doc: jsPDF) => {
  // Add logo using the specified SVG path
  doc.addImage("/assets/DNA Logo - Grey.svg", "SVG", 150, 10, 40, 20);
};

/**
 * Helper function to draw the logo is kept for legacy purposes
 * Now we're using the image directly
 */
export const drawDNALogo = (doc: jsPDF, x: number, y: number, scale: number = 1) => {
  // This is now just a wrapper for the addImage method
  doc.addImage("/assets/DNA Logo - Grey.svg", "SVG", x, y, 40 * scale, 20 * scale);
};
