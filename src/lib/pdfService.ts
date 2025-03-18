import { PatientFormData } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Add DNA Health & Vitality logo
const DNA_LOGO_POSITION = { x: 185, y: 40 }; // Adjusted position for A4 size

export const generatePDF = (formData: PatientFormData, medications: any[]): void => {
  const { patientInfo, vitals } = formData;
  
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
  
  // Add DNA logo to all pages
  const addLogoToPage = () => {
    // This would typically be an image, but we'll use text as a placeholder
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(24);
    doc.text("dna", DNA_LOGO_POSITION.x, DNA_LOGO_POSITION.y, { align: "right" });
    doc.setFontSize(8);
    doc.text("HEALTH & VITALITY", DNA_LOGO_POSITION.x, DNA_LOGO_POSITION.y + 10, { align: "right" });
    
    // Add small leaf icon (simplified)
    doc.setFillColor(180, 210, 140);
    doc.circle(DNA_LOGO_POSITION.x - 15, DNA_LOGO_POSITION.y - 5, 5, "F");
  };
  
  // Create first page with health statistics
  addLogoToPage();
  
  // Add key statistics in rounded green boxes
  const drawStatBox = (text: string, y: number) => {
    // Draw rounded rectangle
    doc.setDrawColor(100, 180, 60);
    doc.setLineWidth(1);
    doc.roundedRect(contentMargin, y, contentWidth, 40, 5, 5);
    
    // Add text
    doc.setTextColor(100, 180, 60);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    
    // Split text into lines and center
    const lines = doc.splitTextToSize(text, contentWidth - 20);
    const lineHeight = 7;
    const totalTextHeight = lines.length * lineHeight;
    const startY = y + (40 - totalTextHeight) / 2;
    
    lines.forEach((line: string, index: number) => {
      doc.text(line, pageWidth / 2, startY + (index * lineHeight), { align: "center" });
    });
  };
  
  // Key statistics boxes
  drawStatBox("6 out of 10 causes\nof death are\npreventable", 60);
  drawStatBox("We only spend 3%\nof our health care\nexpenditure on\nprevention", 110);
  drawStatBox("90% of our health\ncare expenditure\noccurs in the last 3\nyears of our lives", 160);
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("1", pageWidth / 2, 280, { align: "center" });
  
  // Second page - Introduction and vital signs
  doc.addPage();
  addLogoToPage();
  
  // Title and introduction
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(14);
  doc.text("Your step towards ", 70, 70);
  doc.setTextColor(100, 180, 60);
  doc.text("optimal health", 125, 70);
  doc.setTextColor(100, 100, 100);
  doc.text(".", 164, 70);
  
  doc.setFontSize(12);
  doc.text("Our approach is proactive, rather than reactive,", contentMargin, 85);
  doc.text("giving you ", contentMargin, 92);
  doc.setTextColor(100, 180, 60);
  doc.text("control of your health", 45, 92);
  doc.setTextColor(100, 100, 100);
  doc.text(" throughout your life.", 95, 92);
  
  // Greeting
  doc.setFontSize(10);
  doc.text("Dear", contentMargin, 105);
  doc.text(`${patientInfo.name},`, 35, 105);
  
  doc.text("It has been a pleasure to welcome you to our Clinic. The entire DNA Health team feels", contentMargin, 115);
  doc.text("privileged to be a part of your journey to wellness and longevity.", contentMargin, 122);
  
  // Key vital signs table
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Key vital signs", contentMargin, 135);
  
  // Vital signs table - with adjusted widths
  autoTable(doc, {
    startY: 140,
    head: [
      [
        { content: 'Vitals', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Target Range', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
      ]
    ],
    body: [
      ['Date', new Date().toLocaleDateString()],
      ['Age (years)', patientInfo.dateOfBirth ? calculateAge(patientInfo.dateOfBirth) : '-'],
      ['Blood Pressure', vitals.bloodPressure || '120/60-140/85'],
      ['Height (cm)', vitals.height || '-'],
      ['Weight (kg)', vitals.weight ? `${convertLbsToKg(vitals.weight)}` : '-'],
      ['Body Mass Index', calculateBMI(vitals.height, vitals.weight) || '18.5 – 25.9']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Summary of findings
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Summary of findings", contentMargin, 210);
  
  // Findings table - with adjusted widths
  autoTable(doc, {
    startY: 215,
    head: [
      [
        { content: 'Parameter', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Key finding and next steps', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
      ]
    ],
    body: [
      ['Glucose Metabolism', "What's good – what's not so good and next steps\nsummary and direct them to recommendations section"],
      ['Lipid Profile', ''],
      ['Inflammation', ''],
      ['Uric Acid', ''],
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("2", pageWidth / 2, 280, { align: "center" });
  
  // Third page - Additional tests and risk factors
  doc.addPage();
  addLogoToPage();
  
  // Additional tests table - with adjusted widths
  autoTable(doc, {
    startY: 70,
    body: [
      ['Vitamins', ''],
      ['Minerals', ''],
      ['Sex Hormones', ''],
      ['Renal & Liver Function', ''],
      ['Cancer markers', '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Insulin Resistance section
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Insulin Resistance (Metabolic Syndrome)", contentMargin, 140);
  
  // Note: In an actual implementation, we would insert the diagram image here
  // For now, we'll add a placeholder text
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 150);
  doc.text("[Insulin Resistance Diagram would be placed here]", pageWidth / 2, 160, { align: "center" });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Figure 1 Insulin resistance and resulting metabolic disturbance", pageWidth / 2, 180, { align: "center" });
  
  // Cardiovascular risk table - with adjusted widths
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Cardiovascular risk (*Apo B : Apo A1 ratio)", contentMargin, 200);
  
  autoTable(doc, {
    startY: 205,
    head: [
      [
        { content: '', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Low risk', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Moderate risk', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'High risk', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
      ]
    ],
    body: [
      ['Men', '0.30-to-0.69', '0.70-to-0.89', '0.90-to-1.2'],
      ['Women', '0.30-to-0.59', '0.60-to-0.79', '0.80-to-1.00']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 30, fillColor: [240, 250, 230] },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 }
    },
    margin: { left: 30, right: 30 }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("3", pageWidth / 2, 280, { align: "center" });
  
  // Fourth page - Doctor's Recommendations (Nutrition)
  doc.addPage();
  addLogoToPage();
  
  // Doctor's Recommendations
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Doctors Recommendations", contentMargin, 70);
  
  // Nutrition recommendations table - with adjusted widths
  autoTable(doc, {
    startY: 75,
    head: [
      [
        { content: 'Nutrition', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Recommendations', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
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
      minCellHeight: 20
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("4", pageWidth / 2, 280, { align: "center" });
  
  // Fifth page - Exercise and Sleep/Stress recommendations
  doc.addPage();
  addLogoToPage();
  
  // Exercise recommendations table - with adjusted widths
  autoTable(doc, {
    startY: 70,
    head: [
      [
        { content: 'Exercise', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Recommendations', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
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
      minCellHeight: 20
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Sleep and stress recommendations table - with adjusted widths
  autoTable(doc, {
    startY: 160,
    head: [
      [
        { content: 'Sleep and Stress', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Recommendations', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
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
      minCellHeight: 30
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("5", pageWidth / 2, 280, { align: "center" });
  
  // Sixth page - Medications
  doc.addPage();
  addLogoToPage();
  
  // Supplements table - with adjusted widths
  autoTable(doc, {
    startY: 70,
    head: [
      [
        { content: 'Supplements', styles: { fillColor: [240, 250, 230] } },
        { content: '', styles: { fillColor: [255, 255, 255] } }
      ]
    ],
    body: [['', '']],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      minCellHeight: 40
    },
    columnStyles: {
      0: { cellWidth: 50, fillColor: [240, 250, 230] },
      1: { cellWidth: contentWidth - 50 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Medications table with actual patient medications - with adjusted widths
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
  
  // Add empty rows to match the design
  while (medicationRows.length < 5) {
    medicationRows.push(['', '', '']);
  }
  
  autoTable(doc, {
    startY: 130,
    head: [
      [
        { content: 'Medications', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Dosage', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Link', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
      ]
    ],
    body: medicationRows,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 40, fillColor: [240, 250, 230] },
      1: { cellWidth: 90 },
      2: { cellWidth: 40 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("6", pageWidth / 2, 280, { align: "center" });
  
  // Seventh page - Supplements and Follow-ups
  doc.addPage();
  addLogoToPage();
  
  // Supplements table with specific dosages - with adjusted widths
  autoTable(doc, {
    startY: 70,
    head: [
      [
        { content: 'Supplements', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Dosage', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Link', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
      ]
    ],
    body: [
      ['Biogena Multispektrum', '2 capsules once daily in the morning (am)', 'Available in clinic'],
      ['Biogena Omni Lactis', '2 capsules once daily with food (any time)', 'Available in clinic'],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 40, fillColor: [240, 250, 230] },
      1: { cellWidth: 90 },
      2: { cellWidth: 40 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Follow-ups and referrals
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Follow-ups and referrals", contentMargin, 150);
  
  autoTable(doc, {
    startY: 155,
    head: [
      [
        { content: 'With', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'For', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } },
        { content: 'Date', styles: { fillColor: [100, 180, 60], textColor: [255, 255, 255] } }
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
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 40, fillColor: [240, 250, 230] },
      1: { cellWidth: 90 },
      2: { cellWidth: 40 }
    },
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Closing and signature
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Kind Regard,", contentMargin, 220);
  doc.text("Dr Eslam Yakout", contentMargin, 230);
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("7", pageWidth / 2, 280, { align: "center" });
  
  // Save the PDF
  doc.save(`${patientInfo.name.replace(/\s+/g, '_')}_Medical_Report.pdf`);
};

// Helper functions
function calculateAge(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
}

function convertLbsToKg(weightInLbs: string): string {
  const lbs = parseFloat(weightInLbs);
  if (isNaN(lbs)) return '-';
  const kg = lbs * 0.45359237;
  return kg.toFixed(1);
}

function calculateBMI(height: string, weight: string): string {
  if (!height || !weight) return '-';
  
  // Handle height in different formats
  let heightInMeters = 0;
  if (height.includes("'")) {
    // Format like 5'10"
    const parts = height.replace(/"/g, '').split("'");
    const feet = parseFloat(parts[0]);
    const inches = parseFloat(parts[1] || '0');
    heightInMeters = ((feet * 12) + inches) * 0.0254;
  } else {
    // Assume height is in cm
    heightInMeters = parseFloat(height) / 100;
  }
  
  // Convert weight to kg if it's in lbs
  const weightInKg = parseFloat(convertLbsToKg(weight));
  
  if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters === 0) return '-';
  
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
}
