
import { jsPDF } from "jspdf";

/**
 * Adds the DNA Health logo to the PDF page
 */
export const addLogoToPage = (doc: jsPDF): void => {
  try {
    // Use a PNG logo for better compatibility
    doc.addImage("/assets/dna-logo.png", "PNG", 20, 20, 60, 20);
    console.log("Logo added to PDF successfully");
  } catch (error) {
    console.error("Error adding logo to PDF:", error);
    // Continue without the logo if there's an error
  }
};
