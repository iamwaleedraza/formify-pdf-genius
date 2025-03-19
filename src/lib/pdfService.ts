
import { PatientFormData, Medication } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Define DNA logo (SVG path converted to PDF drawing)
const drawDNALogo = (doc: jsPDF, x: number, y: number, scale: number = 1) => {
  const originalX = x;
  const originalY = y;
  
  // Scale - using matrix transformation instead of translate/scale
  doc.saveGraphicsState();
  // Apply transformation matrix for translation and scaling
  // Parameters: a, b, c, d, e, f (where e,f are translation x,y and a,d are scaling x,y)
  doc.setCurrentTransformationMatrix([scale, 0, 0, scale, originalX, originalY]);
  
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
  
  doc.restoreGraphicsState();
};

export const generatePDF = (formData: PatientFormData, medications: any[]): void => {
  const { patientInfo, vitals, summaryFindings } = formData;
  
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
    // Draw logo
    drawDNALogo(doc, 170, 20, 0.18);
  };
  
  // Create first page with health statistics
  addLogoToPage();
  
  // Add key statistics in rounded green boxes
  const drawStatBox = (text: string, y: number) => {
    // Draw rounded rectangle
    doc.setDrawColor(153, 188, 68); // #99bc44
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(1);
    doc.roundedRect(contentMargin, y, contentWidth, 40, 5, 5, 'FD');
    
    // Add text
    doc.setTextColor(153, 188, 68); // #99bc44
    doc.setFontSize(14);
    doc.setFont("Montserrat", "bold");
    
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
  doc.text("Key vital signs", contentMargin, 135);
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): string => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };
  
  // Convert weight to kg if needed
  const convertToKg = (weight: string): string => {
    if (!weight) return '-';
    
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight)) return '-';
    
    if (weight.toLowerCase().includes('lb')) {
      return (numWeight * 0.45359237).toFixed(1);
    }
    
    return numWeight.toFixed(1);
  };
  
  // Calculate BMI
  const calculateBMI = (height: string, weight: string): string => {
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
    const weightInKg = parseFloat(convertToKg(weight));
    
    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters === 0) return '-';
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  // Vital signs table with proper width
  autoTable(doc, {
    startY: 140,
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
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("2", pageWidth / 2, 280, { align: "center" });
  
  // Third page - Summary findings
  doc.addPage();
  addLogoToPage();
  
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
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("3", pageWidth / 2, 280, { align: "center" });
  
  // Fourth page - Insulin Resistance and Cardiovascular risk
  doc.addPage();
  addLogoToPage();
  
  // Insulin Resistance section
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Insulin Resistance (Metabolic Syndrome)", contentMargin, 70);
  
  // Note: In an actual implementation, we would insert the diagram image here
  // For now, we'll add a placeholder text
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 150);
  doc.text("[Insulin Resistance Diagram would be placed here]", pageWidth / 2, 100, { align: "center" });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Figure 1: Insulin resistance and resulting metabolic disturbance", pageWidth / 2, 110, { align: "center" });
  
  // Cardiovascular risk table
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Cardiovascular risk (*Apo B : Apo A1 ratio)", contentMargin, 130);
  
  autoTable(doc, {
    startY: 135,
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
    margin: { left: contentMargin, right: contentMargin }
  });
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("4", pageWidth / 2, 280, { align: "center" });
  
  // Fifth page - Doctor's Recommendations (Nutrition)
  doc.addPage();
  addLogoToPage();
  
  // Doctor's Recommendations
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Doctors Recommendations", contentMargin, 70);
  
  // Nutrition recommendations table
  autoTable(doc, {
    startY: 75,
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
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("5", pageWidth / 2, 280, { align: "center" });
  
  // Sixth page - Exercise and Sleep/Stress recommendations
  doc.addPage();
  addLogoToPage();
  
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
  
  // Sleep and stress recommendations table
  autoTable(doc, {
    startY: 160,
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
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("6", pageWidth / 2, 280, { align: "center" });
  
  // Seventh page - Medications and Supplements
  doc.addPage();
  addLogoToPage();
  
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
    startY: 75,
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
  
  // Supplements title
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Supplements", contentMargin, 150);
  
  // Supplements table with specific dosages
  autoTable(doc, {
    startY: 155,
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
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("7", pageWidth / 2, 280, { align: "center" });
  
  // Eighth page - Follow-ups
  doc.addPage();
  addLogoToPage();
  
  // Follow-ups and referrals
  doc.setFontSize(12);
  doc.setTextColor(153, 188, 68); // #99bc44
  doc.setFont("Montserrat", "medium");
  doc.text("Follow-ups and referrals", contentMargin, 70);
  
  autoTable(doc, {
    startY: 75,
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
  doc.text("Kind Regards,", contentMargin, 150);
  doc.setFont("Montserrat", "bold");
  doc.text("Dr Eslam Yakout", contentMargin, 160);
  
  // Add page number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("Montserrat", "normal");
  doc.text("8", pageWidth / 2, 280, { align: "center" });
  
  // Save the PDF
  doc.save(`${patientInfo.name.replace(/\s+/g, '_')}_Medical_Report.pdf`);
};
