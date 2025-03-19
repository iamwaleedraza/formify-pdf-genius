
import { jsPDF } from "jspdf";

/**
 * Draws the DNA Health & Wellness logo on the PDF
 * 
 * @param doc The jsPDF document to draw on
 * @param x X position for the logo
 * @param y Y position for the logo
 * @param scale Scale factor for the logo
 */
export const drawDNALogo = (doc: jsPDF, x: number, y: number, scale: number = 1) => {
  const originalX = x;
  const originalY = y;
  
  // Save the current graphics state
  doc.saveGraphicsState();
  
  // Use matrix transformation to position and scale the logo
  // Works with jsPDF 3.0.0
  const scaledX = originalX;
  const scaledY = originalY;
  
  // Use alternative approach without transform methods
  const matrix = [scale, 0, 0, scale, scaledX, scaledY];
  // @ts-ignore - Using internal API as a workaround since transform methods aren't available
  doc.internal.write("q");
  // @ts-ignore - Apply matrix transformation manually
  doc.internal.write(matrix[0] + " " + matrix[1] + " " + matrix[2] + " " + matrix[3] + " " + matrix[4] + " " + matrix[5] + " cm");
  
  // Grey "d" part
  doc.setFillColor(164, 165, 165); // #a4a5a5
  doc.roundedRect(-10, -35, 40, 70, 5, 5, 'F');
  
  // Green leaf parts
  doc.setFillColor(153, 188, 68); // #99bc44
  
  // First leaf
  doc.circle(50, -15, 10, 'F');
  doc.circle(65, -15, 10, 'F');
  
  // Second leaf
  doc.circle(35, 10, 8, 'F');
  doc.circle(45, 10, 8, 'F');
  
  // HEALTH & WELLNESS text
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text("HEALTH & WELLNESS", 60, 15, { align: "center" });
  
  // @ts-ignore - Restore graphics state manually
  doc.internal.write("Q");
  doc.restoreGraphicsState();
};

/**
 * Adds the DNA logo to the current page
 */
export const addLogoToPage = (doc: jsPDF) => {
  // Draw logo at the top right corner
  drawDNALogo(doc, 170, 20, 0.18);
};
