
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { Medication } from "@/types";
import { Pill, Beaker } from "lucide-react";
import * as databaseService from "@/services/databaseService";
import { MedicationForm } from "@/components/medications/MedicationForm";
import { MedicationList } from "@/components/medications/MedicationList";
import { MedicationEditModal } from "@/components/medications/MedicationEditModal";
import AdminNote from "@/components/medications/AdminNote";

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentUser, setCurrentUser] = useState<{role: string} | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medsData = await databaseService.getMedications();
        const user = await databaseService.getCurrentUser();
        
        setMedications(medsData);
        setCurrentUser(user);
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        console.error("Error fetching medications data:", error);
        toast({
          title: "Error",
          description: "Could not load medications data",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, [toast]);

  const handleAddMedication = async (newMedicationData: Omit<Medication, 'id'>) => {
    try {
      const medicationToAdd: Medication = {
        ...newMedicationData,
        id: `med${Date.now()}`
      };
      
      await databaseService.addMedication(medicationToAdd);
      
      setMedications(prev => [...prev, medicationToAdd]);
      
      toast({
        title: `${newMedicationData.type === 'medication' ? 'Medication' : 'Supplement'} added`,
        description: `${medicationToAdd.name} has been added successfully`
      });
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Error",
        description: "Could not add medication",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleUpdateMedication = async (updatedMedication: Medication) => {
    try {
      await databaseService.updateMedication(updatedMedication);
      
      setMedications(prev => 
        prev.map(med => med.id === updatedMedication.id ? updatedMedication : med)
      );
      
      toast({
        title: "Medication updated",
        description: `${updatedMedication.name} has been updated successfully`
      });
      
      setSelectedMedication(null);
    } catch (error) {
      console.error("Error updating medication:", error);
      toast({
        title: "Error",
        description: "Could not update medication",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      await databaseService.deleteMedication(id);
      
      setMedications(prev => prev.filter(med => med.id !== id));
      
      if (selectedMedication?.id === id) {
        setSelectedMedication(null);
      }
      
      toast({
        title: "Medication deleted",
        description: "The medication has been deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Could not delete medication",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateMedication = (medication: Medication) => {
    const duplicated: Omit<Medication, 'id'> = {
      name: `${medication.name} (Copy)`,
      dosage: medication.dosage,
      frequency: medication.frequency,
      notes: medication.notes,
      type: medication.type,
      link: medication.link
    };
    
    handleAddMedication(duplicated);
  };

  const handleMedicationChange = (field: keyof Medication, value: string) => {
    if (!selectedMedication) return;
    
    setSelectedMedication(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Medications & Supplements</h1>

        <Tabs defaultValue="medications">
          <TabsList className="mb-4">
            <TabsTrigger value="medications" className="flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center">
              <Beaker className="h-4 w-4 mr-2" />
              Supplements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-6">
            {isAdmin && (
              <MedicationForm 
                type="medication" 
                onAddMedication={handleAddMedication} 
              />
            )}
            <MedicationList 
              medications={medications} 
              type="medication"
              isAdmin={isAdmin}
              onEdit={setSelectedMedication}
              onDuplicate={handleDuplicateMedication}
              onDelete={handleDeleteMedication}
            />
          </TabsContent>

          <TabsContent value="supplements" className="space-y-6">
            {isAdmin && (
              <MedicationForm 
                type="supplement" 
                onAddMedication={handleAddMedication} 
              />
            )}
            <MedicationList 
              medications={medications} 
              type="supplement"
              isAdmin={isAdmin}
              onEdit={setSelectedMedication}
              onDuplicate={handleDuplicateMedication}
              onDelete={handleDeleteMedication}
            />
          </TabsContent>
        </Tabs>

        {selectedMedication && (
          <MedicationEditModal
            medication={selectedMedication}
            onClose={() => setSelectedMedication(null)}
            onUpdate={handleUpdateMedication}
            onChange={handleMedicationChange}
          />
        )}
        
        {!isAdmin && <AdminNote />}
      </div>
    </Layout>
  );
};

export default Medications;
