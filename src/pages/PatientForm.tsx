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

  const handleInputChange = (section: keyof PatientFormData, field: string, value: string) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return prev;
      
      if (section === "patientInfo" || section === "vitals") {
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

  // Determine which sections user can edit based on role
  const canEditNurseSection = currentUser?.role === "nurse" && 
    (patient?.status === "nurse-pending" || patient?.status === "completed");
  
  const canEditDoctorSection = currentUser?.role === "doctor" && 
    (patient?.status === "doctor-pending" || patient?.status === "completed");

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
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="notes">Notes & Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vitals" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>
                  Record patient's vital signs and measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                    <Input 
                      id="bloodPressure"
                      value={formData.vitals.bloodPressure}
                      onChange={(e) => handleInputChange("vitals", "bloodPressure", e.target.value)}
                      disabled={!canEditNurseSection}
                      placeholder="e.g. 120/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input 
                      id="heartRate"
                      value={formData.vitals.heartRate}
                      onChange={(e) => handleInputChange("vitals", "heartRate", e.target.value)}
                      disabled={!canEditNurseSection}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input 
                      id="temperature"
                      value={formData.vitals.temperature}
                      onChange={(e) => handleInputChange("vitals", "temperature", e.target.value)}
                      disabled={!canEditNurseSection}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                    <Input 
                      id="respiratoryRate"
                      value={formData.vitals.respiratoryRate}
                      onChange={(e) => handleInputChange("vitals", "respiratoryRate", e.target.value)}
                      disabled={!canEditNurseSection}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                    <Input 
                      id="oxygenSaturation"
                      value={formData.vitals.oxygenSaturation}
                      onChange={(e) => handleInputChange("vitals", "oxygenSaturation", e.target.value)}
                      disabled={!canEditNurseSection}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height"
                      value={formData.vitals.height}
                      onChange={(e) => handleInputChange("vitals", "height", e.target.value)}
                      disabled={!canEditNurseSection}
                      placeholder="e.g. 5'10&quot;"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input 
                      id="weight"
                      value={formData.vitals.weight}
                      onChange={(e) => handleInputChange("vitals", "weight", e.target.value)}
                      disabled={!canEditNurseSection}
                    />
                  </div>
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
                      onChange={(e) => handleInputChange("", "exerciseRecommendations", e.target.value)}
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
                      onChange={(e) => handleInputChange("", "nurseNotes", e.target.value)}
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
                      onChange={(e) => handleInputChange("", "doctorNotes", e.target.value)}
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
                      onChange={(e) => handleInputChange("", "diagnosis", e.target.value)}
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
                      onChange={(e) => handleInputChange("", "treatmentPlan", e.target.value)}
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
