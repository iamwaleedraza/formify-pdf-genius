
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PatientFormData, Medication } from "@/types";
import { calculateAge, convertToKg, calculateBMI, drawStatBox, addPageNumber } from "./pdfUtilities";
import { addLogoToPage } from "./logoRenderer";

/**
 * Generates the first page of the PDF with health statistics
 */
const generateFirstPage = (doc: jsPDF, pageWidth: number, contentMargin: number, contentWidth: number) => {
  addLogoToPage(doc);
  
  // Key statistics boxes
  drawStatBox(doc, "6 out of 10 causes\nof death are\npreventable", 60, contentMargin, contentWidth, pageWidth);
  drawStatBox(doc, "We only spend 3%\nof our health care\nexpenditure on\nprevention", 110, contentMargin, contentWidth, pageWidth);
  drawStatBox(doc, "90% of our health\ncare expenditure\noccurs in the last 3\nyears of our lives", 160, contentMargin, contentWidth, pageWidth);
  
  // Add page number
  addPageNumber(doc, 1, pageWidth);
};

/**
 * Generates the second page with introduction and vital signs
 */
const generateSecondPage = (doc: jsPDF, formData: PatientFormData, pageWidth: number, contentMargin: number, contentWidth: number) => {
  const { patientInfo, vitals } = formData;
  
  doc.addPage();
  addLogoToPage(doc);
  
  // Title and introduction
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(14);
  doc.setFont("Montserrat", "normal");
  doc.text("Your step towards ", 70, 70);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "bold");
  doc.text("optimal health", 125, 70);
  doc.setTextColor(100, 100, 100);
  doc.setFont("Montserrat", "normal");
  doc.text(".", 164, 70);
  
  doc.setFontSize(12);
  doc.text("Our approach is proactive, rather than reactive,", contentMargin, 85);
  doc.text("giving you ", contentMargin, 92);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("control of your health", 45, 92);
  doc.setTextColor(100, 100, 100);
  doc.setFont("Montserrat", "normal");
  doc.text(" throughout your life.", 95, 92);
  
  // Greeting
  doc.setFontSize(10);
  doc.text("Dear", contentMargin, 105);
  doc.text(`${patientInfo.name},`, 35, 105);
  
  doc.text("It has been a pleasure to welcome you to our Clinic. The entire DNA Health team feels", contentMargin, 115);
  doc.text("privileged to be a part of your journey to wellness and longevity.", contentMargin, 122);
  
  // Key vital signs table
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Key vital signs", contentMargin, 140);
  
  // Vital signs table with proper width
  autoTable(doc, {
    startY: 145,
    head: [
      [
        { content: 'Vitals', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Value', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Target Range', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Date of Birth', patientInfo.dateOfBirth ? new Date(patientInfo.dateOfBirth).toLocaleDateString() : '-', '-'],
      ['Age (years)', calculateAge(patientInfo.dateOfBirth), '-'],
      ['Blood Pressure', vitals.bloodPressure || '-', '120/60-140/85'],
      ['Height (cm)', vitals.height || '-', '-'],
      ['Weight (Kg)', convertToKg(vitals.weight) || '-', '-'],
      ['Body Mass Index', calculateBMI(vitals.height, vitals.weight), '18.5 – 25.9']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: 50 },
      2: { cellWidth: 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  addPageNumber(doc, 2, pageWidth);
};

/**
 * Generates the third page with summary findings
 */
const generateThirdPage = (doc: jsPDF, formData: PatientFormData, pageWidth: number, contentMargin: number, contentWidth: number) => {
  const { summaryFindings } = formData;
  
  doc.addPage();
  addLogoToPage(doc);
  
  // Summary of findings
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Summary of findings", contentMargin, 70);
  
  // Summary findings table with proper width
  autoTable(doc, {
    startY: 75,
    head: [
      [
        { content: 'Parameters', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Key findings and next steps', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Glucose Metabolism', summaryFindings?.glucoseMetabolism || ''],
      ['Lipid Profile', summaryFindings?.lipidProfile || ''],
      ['Inflammation', summaryFindings?.inflammation || ''],
      ['Uric Acid', summaryFindings?.uricAcid || ''],
      ['Vitamins', summaryFindings?.vitamins || ''],
      ['Minerals', summaryFindings?.minerals || ''],
      ['Sex Hormones', summaryFindings?.sexHormones || ''],
      ['Renal & Liver Function', summaryFindings?.renalLiverFunction || ''],
      ['Cancer markers', summaryFindings?.cancerMarkers || '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      font: 'Montserrat',
      overflow: 'linebreak',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  addPageNumber(doc, 3, pageWidth);
};

/**
 * Generates the fourth page with Insulin Resistance and Cardiovascular risk
 */
const generateFourthPage = (doc: jsPDF, formData: PatientFormData, pageWidth: number, contentMargin: number, contentWidth: number) => {
  const showInsulinResistance = formData.showInsulinResistance === true;
  
  doc.addPage();
  addLogoToPage(doc);
  
  let startY = 70;
  
  // Only add Insulin Resistance section if enabled
  if (showInsulinResistance) {
    // Insulin Resistance section
    doc.setFontSize(12);
    doc.setTextColor(153, 188, 68); // #99bc44
    doc.setFont("Montserrat", "medium");
    doc.text("Insulin Resistance (Metabolic Syndrome)", contentMargin, startY);
    
    // Add the specified insulin resistance image
    doc.addImage("/assets/insulin resistance.jpg", "JPEG", contentMargin, startY + 10, contentWidth, 60);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Figure 1: Insulin resistance and resulting metabolic disturbance", pageWidth / 2, startY + 75, { align: "center" });
    
    startY = startY + 85; // Adjust start position for next section
  }
  
  // Cardiovascular risk table
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Cardiovascular risk (*Apo B : Apo A1 ratio)", contentMargin, startY);
  
  // Determine which row to highlight based on gender
  const isMale = formData.patientInfo.gender === 'Male';
  
  autoTable(doc, {
    startY: startY + 5,
    head: [
      [
        { content: '', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Low risk', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Moderate risk', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'High risk', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Men', '0.30-to-0.69', '0.70-to-0.89', '0.90-to-1.2'],
      ['Women', '0.30-to-0.59', '0.60-to-0.79', '0.80-to-1.00']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 40, fillColor: [240, 250, 230] },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 }
    },
    didDrawCell: (data) => {
      // Highlight the row based on gender
      if (data.section === 'body') {
        const rowIndex = data.row.index;
        if ((isMale && rowIndex === 0) || (!isMale && rowIndex === 1)) {
          doc.setFillColor(255, 255, 200); // Light yellow highlight
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          
          // Re-draw text since we covered it with the highlight
          doc.setTextColor(60, 60, 60);
          doc.text(
            data.cell.text,
            data.cell.x + data.cell.padding('left'),
            data.cell.y + data.cell.padding('top') + data.cell.contentHeight / 2 + 1
          );
        }
      }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  addPageNumber(doc, 4, pageWidth);
};

/**
 * Generates the fifth page with Doctor's Recommendations (Nutrition)
 */
const generateFifthPage = (doc: jsPDF, formData: PatientFormData, pageWidth: number, contentMargin: number, contentWidth: number) => {
  doc.addPage();
  addLogoToPage(doc);
  
  // Doctor's Recommendations
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Doctors Recommendations", contentMargin, 70);
  
  // Nutrition recommendations table
  autoTable(doc, {
    startY: 80,
    head: [
      [
        { content: 'Nutrition', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Recommendations', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Style (nutritional plan)', formData.nurseNotes || ''],
      ['Protein Consumption', formData.doctorNotes || ''],
      ['Omissions', ''],
      ['Additional Considerations', formData.treatmentPlan || '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      minCellHeight: 20,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  addPageNumber(doc, 5, pageWidth);
};

/**
 * Generates the sixth page with Exercise and Sleep/Stress recommendations
 */
const generateSixthPage = (doc: jsPDF, formData: PatientFormData, pageWidth: number, contentMargin: number, contentWidth: number) => {
  doc.addPage();
  addLogoToPage(doc);
  
  // Exercise recommendations table
  autoTable(doc, {
    startY: 70,
    head: [
      [
        { content: 'Exercise', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Recommendations', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Focus on', formData.exerciseRecommendations || ''],
      ['Walking', ''],
      ['Avoid', ''],
      ['Tracking', '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      minCellHeight: 20,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Sleep and stress recommendations table with improved spacing
  autoTable(doc, {
    startY: 170,
    head: [
      [
        { content: 'Sleep and Stress', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Recommendations', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Sleep', ''],
      ['Stress', '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      minCellHeight: 20,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  addPageNumber(doc, 6, pageWidth);
};

/**
 * Generates the seventh page with Medications and Supplements
 */
const generateSeventhPage = (doc: jsPDF, formData: PatientFormData, medications: Medication[], pageWidth: number, contentMargin: number, contentWidth: number) => {
  doc.addPage();
  addLogoToPage(doc);
  
  // Medications title
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Medications", contentMargin, 70);
  
  // Medications table with actual patient medications
  const medicationRows = formData.medications.map(med => {
    const medication = medications.find(m => m.id === med.medicationId);
    return [
      medication?.name || '',
      med.dosage || '',
      'Prescription'
    ];
  });
  
  // If no medications, add example rows
  if (medicationRows.length === 0) {
    medicationRows.push(
      ['Jardiance', '25mg Once daily with food (am)', 'Prescription'],
      ['Crestor', '20mg at night', 'Prescription']
    );
  }
  
  // Limit to 5 medications to save space
  const displayedMedications = medicationRows.slice(0, 5);
  
  // Add empty rows to match the design
  while (displayedMedications.length < 5) {
    displayedMedications.push(['', '', '']);
  }
  
  autoTable(doc, {
    startY: 80,
    head: [
      [
        { content: 'Medications', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Dosage', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Type', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: displayedMedications,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: 90 },
      2: { cellWidth: 30 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Supplements title with improved spacing
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Supplements", contentMargin, 160);
  
  // Supplements table with specific dosages
  autoTable(doc, {
    startY: 170,
    head: [
      [
        { content: 'Supplements', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Dosage', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Source', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Biogena Multispektrum', '2 capsules once daily in the morning (am)', 'Clinic'],
      ['Biogena Omni Lactis', '2 capsules once daily with food (any time)', 'Clinic'],
      ['', '', ''],
      ['', '', '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: 90 },
      2: { cellWidth: 30 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  addPageNumber(doc, 7, pageWidth);
};

/**
 * Generates the eighth page with Follow-ups
 */
const generateEighthPage = (doc: jsPDF, pageWidth: number, contentMargin: number, contentWidth: number) => {
  doc.addPage();
  addLogoToPage(doc);
  
  // Follow-ups and referrals
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Follow-ups and referrals", contentMargin, 70);
  
  autoTable(doc, {
    startY: 80,
    head: [
      [
        { content: 'With', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'For', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } },
        { content: 'Date', styles: { fillColor: [153, 188, 68], textColor: [255, 255, 255], fontStyle: 'bold' } }
      ]
    ],
    body: [
      ['Dr Nas', 'Follow up', '23/10/2025'],
      ['Dr Ismail', 'Consultation', '25/10/2025'],
      ['', '', ''],
      ['', '', '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      font: 'Montserrat',
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: 90 },
      2: { cellWidth: 30 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Closing and signature
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("Montserrat", "normal");
  doc.text("Kind Regards,", contentMargin, 160);
  doc.setFont("Montserrat", "bold");
  doc.text("Dr Eslam Yakout", contentMargin, 170);
  
  // Add page number
  addPageNumber(doc, 8, pageWidth);
};

/**
 * Generate a complete PDF report for a patient
 */
export const generatePDF = (formData: PatientFormData, medications: Medication[]): void => {
  const { patientInfo } = formData;
  
  // Create a new PDF document - using A4 size with mm units
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // A4 dimensions: 210mm x 297mm
  const pageWidth = 210;
  const contentMargin = 20; // Margin on both sides
  const contentWidth = pageWidth - (contentMargin * 2);
  
  // Generate each page of the report
  generateFirstPage(doc, pageWidth, contentMargin, contentWidth);
  generateSecondPage(doc, formData, pageWidth, contentMargin, contentWidth);
  generateThirdPage(doc, formData, pageWidth, contentMargin, contentWidth);
  generateFourthPage(doc, formData, pageWidth, contentMargin, contentWidth);
  generateFifthPage(doc, formData, pageWidth, contentMargin, contentWidth);
  generateSixthPage(doc, formData, pageWidth, contentMargin, contentWidth);
  generateSeventhPage(doc, formData, medications, pageWidth, contentMargin, contentWidth);
  generateEighthPage(doc, pageWidth, contentMargin, contentWidth);
  
  // Save the PDF
  doc.save(`${patientInfo.name.replace(/\s+/g, '_')}_Medical_Report.pdf`);
};
