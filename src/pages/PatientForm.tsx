import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  getPatientById, 
  getMedications, 
  getCurrentUser, 
  getPatientFormData 
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Download, Save, Loader2 } from "lucide-react";
import { 
  Patient, 
  Medication, 
  User, 
  PatientFormData 
} from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "@/lib/pdfService";

const PatientForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<PatientFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [patientData, medsData, userData, formDataResult] = await Promise.all([
          getPatientById(id),
          getMedications(),
          getCurrentUser(),
          getPatientFormData(id)
        ]);
        
        if (!patientData) {
          navigate("/patients");
          return;
        }
        
        setPatient(patientData);
        setMedications(medsData);
        setCurrentUser(userData);
        setFormData(formDataResult);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast({
          title: "Error",
          description: "Could not load patient data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate, toast]);

  const handleSave = () => {
    if (!formData) return;
    
    setIsSaving(true);
    
    // Simulating save operation
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Form saved",
        description: "Patient form has been saved successfully",
      });
      
      // Update status if needed
      if (currentUser?.role === "nurse" && patient?.status === "nurse-pending") {
        setPatient(prev => prev ? { ...prev, status: "doctor-pending" } : null);
      } else if (currentUser?.role === "doctor" && patient?.status === "doctor-pending") {
        setPatient(prev => prev ? { ...prev, status: "completed" } : null);
      }
    }, 1500);
  };

  const handleExportPDF = () => {
    if (!formData || !medications) return;
    
    try {
      generatePDF(formData, medications);
      
      toast({
        title: "PDF Generated",
        description: "Patient report has been downloaded",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Could not generate PDF",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (section: keyof PatientFormData | "", field: string, value: string) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return prev;
      
      if (section === "patientInfo" || section === "vitals" || section === "summaryFindings") {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleAddMedication = () => {
    if (!formData) return;
    
    const newMed = {
      id: `temp-${Date.now()}`,
      medicationId: "",
      dosage: "",
      frequency: "",
    };
    
    setFormData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        medications: [...prev.medications, newMed]
      };
    });
  };

  const handleRemoveMedication = (index: number) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return prev;
      
      const updatedMeds = [...prev.medications];
      updatedMeds.splice(index, 1);
      
      return {
        ...prev,
        medications: updatedMeds
      };
    });
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return prev;
      
      const updatedMeds = [...prev.medications];
      updatedMeds[index] = {
        ...updatedMeds[index],
        [field]: value
      };
      
      return {
        ...prev,
        medications: updatedMeds
      };
    });
  };

  const canEditNurseSection = currentUser?.role === "nurse" && 
    (patient?.status === "nurse-pending" || patient?.status === "completed");
  
  const canEditDoctorSection = currentUser?.role === "doctor" && 
    (patient?.status === "doctor-pending" || patient?.status === "completed");

  const calculateBMI = (height: string, weight: string): string => {
    if (!height || !weight) return '-';
    
    let heightInMeters = 0;
    if (height.includes("'")) {
      const parts = height.replace(/"/g, '').split("'");
      const feet = parseFloat(parts[0]);
      const inches = parseFloat(parts[1] || '0');
      heightInMeters = ((feet * 12) + inches) * 0.0254;
    } else {
      heightInMeters = parseFloat(height) / 100;
    }
    
    let weightInKg = parseFloat(weight);
    if (height.includes('lbs')) {
      weightInKg = weightInKg * 0.45359237;
    }
    
    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters === 0) return '-';
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </Layout>
    );
  }

  if (!patient || !formData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">Patient not found</p>
          <Button variant="outline" onClick={() => navigate("/patients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-3xl font-semibold tracking-tight">{patient.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-muted-foreground">
                MRN: {patient.medicalRecordNumber}
              </p>
              <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
              <p className="text-muted-foreground">
                DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>

        <Card className="animate-fade-in-up mb-6">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Basic patient information and demographics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={formData.patientInfo.name}
                    onChange={(e) => handleInputChange("patientInfo", "name", e.target.value)}
                    disabled={!canEditNurseSection}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob"
                    type="date"
                    value={formData.patientInfo.dateOfBirth}
                    onChange={(e) => handleInputChange("patientInfo", "dateOfBirth", e.target.value)}
                    disabled={!canEditNurseSection}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.patientInfo.gender}
                    onValueChange={(value) => handleInputChange("patientInfo", "gender", value)}
                    disabled={!canEditNurseSection}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mrn">Medical Record Number</Label>
                  <Input 
                    id="mrn"
                    value={formData.patientInfo.medicalRecordNumber}
                    onChange={(e) => handleInputChange("patientInfo", "medicalRecordNumber", e.target.value)}
                    disabled={!canEditNurseSection}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vitals" className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <TabsList className="mb-6">
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="summaryFindings">Summary Findings</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="notes">Notes & Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vitals" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Key Vital Signs</CardTitle>
                <CardDescription>
                  Record patient's vital signs and measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="text-left px-4 py-2 border">Vitals</th>
                        <th className="text-left px-4 py-2 border">Value</th>
                        <th className="text-left px-4 py-2 border">Target Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Date of Birth</td>
                        <td className="px-4 py-2 border">
                          <Input 
                            type="date"
                            value={formData.patientInfo.dateOfBirth}
                            onChange={(e) => handleInputChange("patientInfo", "dateOfBirth", e.target.value)}
                            disabled={!canEditNurseSection}
                            className="border-0 p-0 h-auto"
                          />
                        </td>
                        <td className="px-4 py-2 border">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Age (years)</td>
                        <td className="px-4 py-2 border">{calculateAge(formData.patientInfo.dateOfBirth)}</td>
                        <td className="px-4 py-2 border">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Blood Pressure (mmHg)</td>
                        <td className="px-4 py-2 border">
                          <Input 
                            value={formData.vitals.bloodPressure}
                            onChange={(e) => handleInputChange("vitals", "bloodPressure", e.target.value)}
                            disabled={!canEditNurseSection}
                            placeholder="e.g. 120/80"
                            className="border-0 p-0 h-auto"
                          />
                        </td>
                        <td className="px-4 py-2 border">120/60-140/85</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Height (cm)</td>
                        <td className="px-4 py-2 border">
                          <Input 
                            value={formData.vitals.height}
                            onChange={(e) => handleInputChange("vitals", "height", e.target.value)}
                            disabled={!canEditNurseSection}
                            className="border-0 p-0 h-auto"
                          />
                        </td>
                        <td className="px-4 py-2 border">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Weight (Kg)</td>
                        <td className="px-4 py-2 border">
                          <Input 
                            value={formData.vitals.weight}
                            onChange={(e) => handleInputChange("vitals", "weight", e.target.value)}
                            disabled={!canEditNurseSection}
                            className="border-0 p-0 h-auto"
                          />
                        </td>
                        <td className="px-4 py-2 border">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Body Mass Index</td>
                        <td className="px-4 py-2 border">{calculateBMI(formData.vitals.height, formData.vitals.weight)}</td>
                        <td className="px-4 py-2 border">18.5 – 25.9</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summaryFindings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Summary of Findings</CardTitle>
                <CardDescription>
                  Record patient's health parameters and findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="text-left px-4 py-2 border">Parameters</th>
                        <th className="text-left px-4 py-2 border">Key findings and next steps</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50 w-1/4">Glucose Metabolism</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.glucoseMetabolism || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "glucoseMetabolism", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                            placeholder="What's good – what's not so good and next steps"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Lipid Profile</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.lipidProfile || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "lipidProfile", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Inflammation</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.inflammation || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "inflammation", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Uric Acid</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.uricAcid || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "uricAcid", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Vitamins</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.vitamins || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "vitamins", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Minerals</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.minerals || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "minerals", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Sex Hormones</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.sexHormones || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "sexHormones", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Renal & Liver Function</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.renalLiverFunction || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "renalLiverFunction", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border bg-gray-50">Cancer Markers</td>
                        <td className="px-4 py-2 border">
                          <Textarea 
                            value={formData.summaryFindings?.cancerMarkers || ''}
                            onChange={(e) => handleInputChange("summaryFindings", "cancerMarkers", e.target.value)}
                            disabled={!canEditDoctorSection}
                            className="border-0 p-0 min-h-[60px]"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
                <CardDescription>
                  Manage patient's medications and dosages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.medications.length > 0 ? (
                  <div className="space-y-6">
                    {formData.medications.map((med, index) => (
                      <div key={med.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg relative">
                        <div className="space-y-2">
                          <Label htmlFor={`med-${index}-name`}>Medication</Label>
                          <Select 
                            value={med.medicationId}
                            onValueChange={(value) => handleMedicationChange(index, "medicationId", value)}
                            disabled={!canEditNurseSection}
                          >
                            <SelectTrigger id={`med-${index}-name`}>
                              <SelectValue placeholder="Select medication" />
                            </SelectTrigger>
                            <SelectContent>
                              {medications.map((medication) => (
                                <SelectItem key={medication.id} value={medication.id}>
                                  {medication.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`med-${index}-dosage`}>Dosage</Label>
                          <Input 
                            id={`med-${index}-dosage`}
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                            disabled={!canEditNurseSection}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`med-${index}-frequency`}>Frequency</Label>
                          <Input 
                            id={`med-${index}-frequency`}
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                            disabled={!canEditNurseSection}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`med-${index}-notes`}>Notes</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id={`med-${index}-notes`}
                              value={med.notes || ""}
                              onChange={(e) => handleMedicationChange(index, "notes", e.target.value)}
                              disabled={!canEditNurseSection}
                            />
                            {canEditNurseSection && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveMedication(index)}
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No medications added
                  </div>
                )}
                
                {canEditNurseSection && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddMedication}
                    className="mt-6"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notes & Recommendations</CardTitle>
                <CardDescription>
                  Add notes, exercise recommendations, and treatment plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="exerciseRecommendations">Exercise Recommendations</Label>
                    <Textarea 
                      id="exerciseRecommendations"
                      value={formData.exerciseRecommendations}
                      onChange={(e) => handleInputChange("" as keyof PatientFormData, "exerciseRecommendations", e.target.value)}
                      disabled={!canEditNurseSection}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nurseNotes">
                      Nurse Notes
                      {!canEditNurseSection && <span className="text-muted-foreground ml-2 text-sm">(Read only)</span>}
                    </Label>
                    <Textarea 
                      id="nurseNotes"
                      value={formData.nurseNotes}
                      onChange={(e) => handleInputChange("" as keyof PatientFormData, "nurseNotes", e.target.value)}
                      disabled={!canEditNurseSection}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doctorNotes">
                      Doctor Notes
                      {!canEditDoctorSection && <span className="text-muted-foreground ml-2 text-sm">(Read only)</span>}
                    </Label>
                    <Textarea 
                      id="doctorNotes"
                      value={formData.doctorNotes}
                      onChange={(e) => handleInputChange("" as keyof PatientFormData, "doctorNotes", e.target.value)}
                      disabled={!canEditDoctorSection}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">
                      Diagnosis
                      {!canEditDoctorSection && <span className="text-muted-foreground ml-2 text-sm">(Read only)</span>}
                    </Label>
                    <Textarea 
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange("" as keyof PatientFormData, "diagnosis", e.target.value)}
                      disabled={!canEditDoctorSection}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="treatmentPlan">
                      Treatment Plan
                      {!canEditDoctorSection && <span className="text-muted-foreground ml-2 text-sm">(Read only)</span>}
                    </Label>
                    <Textarea 
                      id="treatmentPlan"
                      value={formData.treatmentPlan}
                      onChange={(e) => handleInputChange("" as keyof PatientFormData, "treatmentPlan", e.target.value)}
                      disabled={!canEditDoctorSection}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button disabled={isSaving} onClick={handleSave}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Form
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatientForm;
