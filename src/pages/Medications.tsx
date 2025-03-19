
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Medication } from "@/types";
import { getMedications, getCurrentUser } from "@/lib/mockData";

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("medications");
  const [editItem, setEditItem] = useState<Medication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medsData = await getMedications();
        setMedications(medsData);
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast({
          title: "Error",
          description: "Could not load medications data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Check if user is admin, if not redirect
    const checkUserRole = async () => {
      const user = await getCurrentUser();
      if (user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "Only administrators can access this page",
          variant: "destructive"
        });
        // Implement redirect logic here if needed
      }
    };
    
    checkUserRole();
  }, [toast]);

  const handleAddItem = () => {
    setEditItem({
      id: "",
      name: "",
      dosage: "",
      frequency: "",
      type: currentTab === "medications" ? "medication" : "supplement",
      link: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: Medication) => {
    setEditItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    toast({
      title: "Item Deleted",
      description: "The item has been deleted successfully"
    });
  };

  const handleSaveItem = () => {
    if (!editItem) return;
    
    if (!editItem.name || !editItem.dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editItem.id) {
      // Update existing item
      setMedications(prev => 
        prev.map(item => item.id === editItem.id ? editItem : item)
      );
      toast({
        title: "Item Updated",
        description: "The item has been updated successfully"
      });
    } else {
      // Add new item
      const newItem = {
        ...editItem,
        id: `med-${Date.now()}`
      };
      setMedications(prev => [...prev, newItem]);
      toast({
        title: "Item Added",
        description: "The new item has been added successfully"
      });
    }
    
    setIsDialogOpen(false);
    setEditItem(null);
  };

  const handleInputChange = (field: keyof Medication, value: string) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  const filteredItems = medications.filter(med => 
    med.type === (currentTab === "medications" ? "medication" : "supplement")
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Medications & Supplements</h1>
            <p className="text-muted-foreground mt-1">
              Manage medications and supplements for patient forms
            </p>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add {currentTab === "medications" ? "Medication" : "Supplement"}
          </Button>
        </div>

        <Tabs defaultValue="medications" onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Medications List</CardTitle>
                <CardDescription>
                  Manage medications that will be available for selection in patient forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-primary/10 text-primary">
                          <th className="text-left px-4 py-2 border">Name</th>
                          <th className="text-left px-4 py-2 border">Dosage</th>
                          <th className="text-left px-4 py-2 border">Frequency</th>
                          <th className="text-left px-4 py-2 border">Notes</th>
                          <th className="text-center px-4 py-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map(med => (
                          <tr key={med.id} className="hover:bg-muted/50">
                            <td className="px-4 py-2 border">{med.name}</td>
                            <td className="px-4 py-2 border">{med.dosage}</td>
                            <td className="px-4 py-2 border">{med.frequency}</td>
                            <td className="px-4 py-2 border">{med.notes || "-"}</td>
                            <td className="px-4 py-2 border">
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(med)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                  onClick={() => handleDeleteItem(med.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No medications added yet. Click the "Add Medication" button to add one.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplements" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Supplements List</CardTitle>
                <CardDescription>
                  Manage supplements that will be available for selection in patient forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-primary/10 text-primary">
                          <th className="text-left px-4 py-2 border">Name</th>
                          <th className="text-left px-4 py-2 border">Dosage</th>
                          <th className="text-left px-4 py-2 border">Frequency</th>
                          <th className="text-left px-4 py-2 border">Notes</th>
                          <th className="text-center px-4 py-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map(med => (
                          <tr key={med.id} className="hover:bg-muted/50">
                            <td className="px-4 py-2 border">{med.name}</td>
                            <td className="px-4 py-2 border">{med.dosage}</td>
                            <td className="px-4 py-2 border">{med.frequency}</td>
                            <td className="px-4 py-2 border">{med.notes || "-"}</td>
                            <td className="px-4 py-2 border">
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(med)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                  onClick={() => handleDeleteItem(med.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No supplements added yet. Click the "Add Supplement" button to add one.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editItem?.id ? "Edit" : "Add"} {currentTab === "medications" ? "Medication" : "Supplement"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for this {currentTab === "medications" ? "medication" : "supplement"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={editItem?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input 
                  id="dosage" 
                  value={editItem?.dosage || ""}
                  onChange={(e) => handleInputChange("dosage", e.target.value)}
                  placeholder="Enter dosage"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input 
                  id="frequency" 
                  value={editItem?.frequency || ""}
                  onChange={(e) => handleInputChange("frequency", e.target.value)}
                  placeholder="Enter frequency"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={editItem?.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter additional notes"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="link">External Link (optional)</Label>
                <Input 
                  id="link" 
                  value={editItem?.link || ""}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  placeholder="Enter reference link"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveItem}>
                Save {currentTab === "medications" ? "Medication" : "Supplement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medications;
