
import { PatientFormData } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Add DNA Health & Vitality logo
const DNA_LOGO_POSITION = { x: 703, y: 40 };

export const generatePDF = (formData: PatientFormData, medications: any[]): void => {
  const { patientInfo, vitals } = formData;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
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
    doc.roundedRect(120, y, 240, 70, 10, 10);
    
    // Add text
    doc.setTextColor(100, 180, 60);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    
    // Split text into lines and center
    const lines = doc.splitTextToSize(text, 220);
    const lineHeight = 18;
    const totalTextHeight = lines.length * lineHeight;
    const startY = y + (70 - totalTextHeight) / 2;
    
    lines.forEach((line: string, index: number) => {
      doc.text(line, 240, startY + (index * lineHeight), { align: "center" });
    });
  };
  
  // Key statistics boxes
  drawStatBox("6 out of 10 causes\nof death are\npreventable", 100);
  drawStatBox("We only spend 3%\nof our health care\nexpenditure on\nprevention", 190);
  drawStatBox("90% of our health\ncare expenditure\noccurs in the last 3\nyears of our lives", 280);
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("1", 300, 580, { align: "center" });
  
  // Second page - Introduction and vital signs
  doc.addPage();
  addLogoToPage();
  
  // Title and introduction
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(14);
  doc.text("Your step towards ", 140, 100);
  doc.setTextColor(100, 180, 60);
  doc.text("optimal health", 250, 100);
  doc.setTextColor(100, 100, 100);
  doc.text(".", 310, 100);
  
  doc.setFontSize(12);
  doc.text("Our approach is proactive, rather than reactive,", 140, 120);
  doc.text("giving you ", 62, 135);
  doc.setTextColor(100, 180, 60);
  doc.text("control of your health", 110, 135);
  doc.setTextColor(100, 100, 100);
  doc.text(" throughout your life.", 230, 135);
  
  // Greeting
  doc.setFontSize(10);
  doc.text("Dear", 60, 160);
  doc.text(`${patientInfo.name},`, 80, 160);
  
  doc.text("It has been a pleasure to welcome you to our Clinic. The entire DNA Health team feels", 60, 175);
  doc.text("privileged to be a part of your journey to wellness and longevity.", 60, 185);
  
  // Key vital signs table
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Key vital signs", 60, 210);
  
  // Vital signs table
  autoTable(doc, {
    startY: 215,
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
      0: { cellWidth: 100, fillColor: [240, 250, 230] },
      1: { cellWidth: 100 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Summary of findings
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Summary of findings", 60, 350);
  
  // Findings table
  autoTable(doc, {
    startY: 355,
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
      0: { cellWidth: 100, fillColor: [240, 250, 230] },
      1: { cellWidth: 330 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("2", 300, 580, { align: "center" });
  
  // Third page - Additional tests and risk factors
  doc.addPage();
  addLogoToPage();
  
  // Additional tests table
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
      0: { cellWidth: 100, fillColor: [240, 250, 230] },
      1: { cellWidth: 330 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Insulin Resistance section
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Insulin Resistance (Metabolic Syndrome)", 60, 180);
  
  // Note: In an actual implementation, we would insert the diagram image here
  // For now, we'll add a placeholder text
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 150);
  doc.text("[Insulin Resistance Diagram would be placed here]", 300, 230, { align: "center" });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Figure 1 Insulin resistance and resulting metabolic disturbance", 300, 310, { align: "center" });
  
  // Cardiovascular risk table
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Cardiovascular risk (*Apo B : Apo A1 ratio)", 60, 340);
  
  autoTable(doc, {
    startY: 345,
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
      0: { cellWidth: 70, fillColor: [240, 250, 230] },
      1: { cellWidth: 70 },
      2: { cellWidth: 70 },
      3: { cellWidth: 70 }
    },
    margin: { left: 120, right: 60 }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("3", 300, 580, { align: "center" });
  
  // Fourth page - Doctor's Recommendations (Nutrition)
  doc.addPage();
  addLogoToPage();
  
  // Doctor's Recommendations
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Doctors Recommendations", 60, 70);
  
  // Nutrition recommendations table
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
      minCellHeight: 40
    },
    columnStyles: {
      0: { cellWidth: 120, fillColor: [240, 250, 230] },
      1: { cellWidth: 310 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("4", 300, 580, { align: "center" });
  
  // Fifth page - Exercise and Sleep/Stress recommendations
  doc.addPage();
  addLogoToPage();
  
  // Exercise recommendations table
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
      minCellHeight: 40
    },
    columnStyles: {
      0: { cellWidth: 120, fillColor: [240, 250, 230] },
      1: { cellWidth: 310 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Sleep and stress recommendations table
  autoTable(doc, {
    startY: 250,
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
      minCellHeight: 60
    },
    columnStyles: {
      0: { cellWidth: 120, fillColor: [240, 250, 230] },
      1: { cellWidth: 310 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("5", 300, 580, { align: "center" });
  
  // Sixth page - Medications
  doc.addPage();
  addLogoToPage();
  
  // Supplements table
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
      minCellHeight: 80
    },
    columnStyles: {
      0: { cellWidth: 120, fillColor: [240, 250, 230] },
      1: { cellWidth: 310 }
    },
    margin: { left: 60, right: 60 }
  });
  
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
  
  // Add empty rows to match the design
  while (medicationRows.length < 10) {
    medicationRows.push(['', '', '']);
  }
  
  autoTable(doc, {
    startY: 170,
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
      0: { cellWidth: 100, fillColor: [240, 250, 230] },
      1: { cellWidth: 220 },
      2: { cellWidth: 100 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("6", 300, 580, { align: "center" });
  
  // Seventh page - Supplements and Follow-ups
  doc.addPage();
  addLogoToPage();
  
  // Supplements table with specific dosages
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
      0: { cellWidth: 100, fillColor: [240, 250, 230] },
      1: { cellWidth: 220 },
      2: { cellWidth: 100 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Follow-ups and referrals
  doc.setFontSize(12);
  doc.setTextColor(100, 180, 60);
  doc.text("Follow-ups and referrals", 60, 280);
  
  autoTable(doc, {
    startY: 285,
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
      0: { cellWidth: 100, fillColor: [240, 250, 230] },
      1: { cellWidth: 220 },
      2: { cellWidth: 100 }
    },
    margin: { left: 60, right: 60 }
  });
  
  // Closing and signature
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Kind Regard,", 60, 400);
  doc.text("Dr Eslam Yakout", 60, 420);
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("7", 300, 580, { align: "center" });
  
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
