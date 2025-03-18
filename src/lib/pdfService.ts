
import { PatientFormData } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (formData: PatientFormData, medications: any[]): void => {
  const { patientInfo, vitals, medications: patientMeds } = formData;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.text("Patient Medical Report", 105, 15, { align: "center" });
  
  // Add patient information
  doc.setFontSize(12);
  doc.text(`Patient: ${patientInfo.name}`, 20, 30);
  doc.text(`Medical Record #: ${patientInfo.medicalRecordNumber}`, 20, 37);
  doc.text(`DOB: ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}`, 20, 44);
  doc.text(`Gender: ${patientInfo.gender}`, 20, 51);
  
  // Add vitals information
  doc.setFontSize(16);
  doc.text("Vital Signs", 20, 65);
  doc.setFontSize(12);
  doc.text(`Blood Pressure: ${vitals.bloodPressure}`, 25, 72);
  doc.text(`Heart Rate: ${vitals.heartRate} bpm`, 25, 79);
  doc.text(`Temperature: ${vitals.temperature}°F`, 25, 86);
  doc.text(`Respiratory Rate: ${vitals.respiratoryRate} breaths/min`, 25, 93);
  doc.text(`Oxygen Saturation: ${vitals.oxygenSaturation}%`, 25, 100);
  doc.text(`Height: ${vitals.height}`, 25, 107);
  doc.text(`Weight: ${vitals.weight} lbs`, 25, 114);
  
  // Add medications
  doc.setFontSize(16);
  doc.text("Medications", 20, 130);
  
  // Map medication IDs to names
  const medicationData = patientMeds.map(med => {
    const medication = medications.find(m => m.id === med.medicationId);
    return [
      medication?.name || "Unknown",
      med.dosage,
      med.frequency,
      med.notes || ""
    ];
  });
  
  // Generate medication table
  autoTable(doc, {
    startY: 135,
    head: [['Medication', 'Dosage', 'Frequency', 'Notes']],
    body: medicationData,
    theme: 'striped',
    headStyles: { fillColor: [66, 135, 245] }
  });
  
  // Add exercise recommendations
  const tableEndY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(16);
  doc.text("Exercise Recommendations", 20, tableEndY);
  doc.setFontSize(12);
  
  const exerciseLines = doc.splitTextToSize(formData.exerciseRecommendations, 170);
  doc.text(exerciseLines, 25, tableEndY + 7);
  
  // Add notes
  let currentY = tableEndY + 7 + (exerciseLines.length * 7);
  
  doc.setFontSize(16);
  doc.text("Nurse Notes", 20, currentY + 10);
  doc.setFontSize(12);
  const nurseLines = doc.splitTextToSize(formData.nurseNotes, 170);
  doc.text(nurseLines, 25, currentY + 17);
  
  currentY += 17 + (nurseLines.length * 7);
  
  if (formData.doctorNotes) {
    doc.setFontSize(16);
    doc.text("Doctor Notes", 20, currentY + 10);
    doc.setFontSize(12);
    const doctorLines = doc.splitTextToSize(formData.doctorNotes, 170);
    doc.text(doctorLines, 25, currentY + 17);
    
    currentY += 17 + (doctorLines.length * 7);
  }
  
  if (formData.diagnosis) {
    doc.setFontSize(16);
    doc.text("Diagnosis", 20, currentY + 10);
    doc.setFontSize(12);
    const diagnosisLines = doc.splitTextToSize(formData.diagnosis, 170);
    doc.text(diagnosisLines, 25, currentY + 17);
    
    currentY += 17 + (diagnosisLines.length * 7);
  }
  
  if (formData.treatmentPlan) {
    doc.setFontSize(16);
    doc.text("Treatment Plan", 20, currentY + 10);
    doc.setFontSize(12);
    const treatmentLines = doc.splitTextToSize(formData.treatmentPlan, 170);
    doc.text(treatmentLines, 25, currentY + 17);
  }
  
  // Save the PDF
  doc.save(`${patientInfo.name.replace(/\s+/g, '_')}_Medical_Report.pdf`);
};
