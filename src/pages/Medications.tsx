import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { Medication } from "@/types";
import { Copy, FilePlus, Pill, Plus, Trash2, Flask } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as databaseService from "@/services/databaseService";

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentUser, setCurrentUser] = useState<{role: string} | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: '',
    notes: '',
    type: 'medication',
    link: ''
  });

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

  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Missing information",
        description: "Please enter a name and dosage for the medication",
        variant: "destructive"
      });
      return;
    }

    try {
      const medicationToAdd: Medication = {
        ...newMedication,
        id: `med${Date.now()}`
      };
      
      await databaseService.addMedication(medicationToAdd);
      
      setMedications(prev => [...prev, medicationToAdd]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        notes: '',
        type: 'medication',
        link: ''
      });
      
      toast({
        title: "Medication added",
        description: `${medicationToAdd.name} has been added successfully`
      });
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Error",
        description: "Could not add medication",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMedication = async () => {
    if (!selectedMedication) return;
    
    try {
      await databaseService.updateMedication(selectedMedication);
      
      setMedications(prev => 
        prev.map(med => med.id === selectedMedication.id ? selectedMedication : med)
      );
      
      toast({
        title: "Medication updated",
        description: `${selectedMedication.name} has been updated successfully`
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
    
    setNewMedication(duplicated);
  };

  const renderMedicationList = (type: 'medication' | 'supplement') => {
    const filteredMeds = medications.filter(med => med.type === type);
    
    if (filteredMeds.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {type === 'medication' ? 'medications' : 'supplements'} found
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredMeds.map(med => (
          <Card key={med.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start p-4">
                <div className="flex-1">
                  <h3 className="font-medium">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">Dosage: {med.dosage}</p>
                  {med.frequency && <p className="text-sm text-muted-foreground">Frequency: {med.frequency}</p>}
                  {med.notes && <p className="text-sm text-muted-foreground mt-1">Notes: {med.notes}</p>}
                  {med.link && (
                    <a 
                      href={med.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary hover:underline mt-1 inline-block"
                    >
                      More information
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  {isAdmin && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedMedication(med)}
                      >
                        <FilePlus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDuplicateMedication(med)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteMedication(med.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
              <Flask className="h-4 w-4 mr-2" />
              Supplements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-6">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Medication</CardTitle>
                  <CardDescription>
                    Fill in the details to add a new medication to the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="med-name">Medication Name</Label>
                        <Input 
                          id="med-name" 
                          value={newMedication.name}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter medication name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="med-dosage">Dosage</Label>
                        <Input 
                          id="med-dosage" 
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="med-frequency">Frequency</Label>
                        <Input 
                          id="med-frequency" 
                          value={newMedication.frequency}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <Label htmlFor="med-link">Information Link (Optional)</Label>
                        <Input 
                          id="med-link" 
                          value={newMedication.link || ''}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, link: e.target.value }))}
                          placeholder="URL to more information"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="med-notes">Notes (Optional)</Label>
                      <Input 
                        id="med-notes" 
                        value={newMedication.notes || ''}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes"
                      />
                    </div>
                    <Button onClick={handleAddMedication} className="w-full md:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {renderMedicationList('medication')}
          </TabsContent>

          <TabsContent value="supplements" className="space-y-6">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Supplement</CardTitle>
                  <CardDescription>
                    Fill in the details to add a new supplement to the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="supp-name">Supplement Name</Label>
                        <Input 
                          id="supp-name" 
                          value={newMedication.name}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value, type: 'supplement' }))}
                          placeholder="Enter supplement name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="supp-dosage">Dosage</Label>
                        <Input 
                          id="supp-dosage" 
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                          placeholder="e.g., 1000mg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="supp-frequency">Frequency</Label>
                        <Input 
                          id="supp-frequency" 
                          value={newMedication.frequency}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                          placeholder="e.g., Once daily"
                        />
                      </div>
                      <div>
                        <Label htmlFor="supp-link">Information Link (Optional)</Label>
                        <Input 
                          id="supp-link" 
                          value={newMedication.link || ''}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, link: e.target.value }))}
                          placeholder="URL to more information"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="supp-notes">Notes (Optional)</Label>
                      <Input 
                        id="supp-notes" 
                        value={newMedication.notes || ''}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes"
                      />
                    </div>
                    <Button onClick={handleAddMedication} className="w-full md:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Supplement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {renderMedicationList('supplement')}
          </TabsContent>
        </Tabs>

        {selectedMedication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Edit {selectedMedication.type === 'medication' ? 'Medication' : 'Supplement'}</CardTitle>
                <CardDescription>
                  Update the details for {selectedMedication.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input 
                      id="edit-name" 
                      value={selectedMedication.name}
                      onChange={(e) => setSelectedMedication(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-dosage">Dosage</Label>
                    <Input 
                      id="edit-dosage" 
                      value={selectedMedication.dosage}
                      onChange={(e) => setSelectedMedication(prev => prev ? { ...prev, dosage: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-frequency">Frequency</Label>
                    <Input 
                      id="edit-frequency" 
                      value={selectedMedication.frequency}
                      onChange={(e) => setSelectedMedication(prev => prev ? { ...prev, frequency: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-type">Type</Label>
                    <Select 
                      value={selectedMedication.type}
                      onValueChange={(value: 'medication' | 'supplement') => 
                        setSelectedMedication(prev => prev ? { ...prev, type: value } : null)
                      }
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="supplement">Supplement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Input 
                      id="edit-notes" 
                      value={selectedMedication.notes || ''}
                      onChange={(e) => setSelectedMedication(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-link">Information Link</Label>
                    <Input 
                      id="edit-link" 
                      value={selectedMedication.link || ''}
                      onChange={(e) => setSelectedMedication(prev => prev ? { ...prev, link: e.target.value } : null)}
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button variant="outline" onClick={() => setSelectedMedication(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateMedication}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {!isAdmin && (
          <div className="bg-muted mt-4 p-4 rounded-md">
            <p className="text-sm text-muted-foreground">
              Note: Only administrators can add, edit, or delete medications and supplements. 
              If you need to make changes, please contact an administrator.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medications;
