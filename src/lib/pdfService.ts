
// Entry point for PDF service - redirects to the new modular implementation
import { PatientFormData, Medication } from "@/types";
import { generatePDF as generatePDFImpl } from "./pdf/pdfGenerator";

export const generatePDF = (formData: PatientFormData, medications: Medication[]): void => {
  generatePDFImpl(formData, medications);
};
