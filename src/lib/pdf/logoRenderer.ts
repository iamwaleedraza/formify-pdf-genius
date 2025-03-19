
import { jsPDF } from "jspdf";

/**
 * Adds the DNA logo to the current page
 */
export const addLogoToPage = (doc: jsPDF) => {
  // Add logo using the uploaded image
  doc.addImage("public/lovable-uploads/590a0f18-78d7-430b-8fad-8482b627e08e.png", "PNG", 150, 10, 40, 20);
};

/**
 * Helper function to draw the logo is kept for legacy purposes
 * Now we're using the image directly
 */
export const drawDNALogo = (doc: jsPDF, x: number, y: number, scale: number = 1) => {
  // This is now just a wrapper for the addImage method
  doc.addImage("public/lovable-uploads/590a0f18-78d7-430b-8fad-8482b627e08e.png", "PNG", x, y, 40 * scale, 20 * scale);
};
