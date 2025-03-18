
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormTemplate } from "@/types";
import { PlusCircle, Trash2, MoveVertical, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FormBuilderProps {
  onSave: (template: FormTemplate) => void;
}

const FormBuilder = ({ onSave }: FormBuilderProps) => {
  const { toast } = useToast();
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<FormField | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleAddField = (section: FormField["section"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      section
    };
    
    setCurrentField(newField);
    setCurrentIndex(null);
    setEditDialogOpen(true);
  };

  const handleEditField = (index: number) => {
    setCurrentField({ ...fields[index] });
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    toast({
      title: "Field removed",
      description: "The field has been removed from the form",
    });
  };

  const handleSaveField = () => {
    if (!currentField || !currentField.label) {
      toast({
        title: "Missing information",
        description: "Please provide a label for the field",
        variant: "destructive"
      });
      return;
    }

    if (currentIndex !== null) {
      // Edit existing field
      const updatedFields = [...fields];
      updatedFields[currentIndex] = currentField;
      setFields(updatedFields);
    } else {
      // Add new field
      setFields([...fields, currentField]);
    }

    setEditDialogOpen(false);
    setCurrentField(null);
    setCurrentIndex(null);
  };

  const handleSaveTemplate = () => {
    if (!formName) {
      toast({
        title: "Missing information",
        description: "Please provide a name for the form template",
        variant: "destructive"
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: "No fields added",
        description: "Please add at least one field to the form",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: FormTemplate = {
      id: `template-${Date.now()}`,
      name: formName,
      description: formDescription,
      fields
    };

    onSave(newTemplate);

    // Reset form
    setFormName("");
    setFormDescription("");
    setFields([]);

    toast({
      title: "Template saved",
      description: `Form template "${formName}" has been saved successfully`,
    });
  };

  const fieldTypeOptions = [
    { value: "text", label: "Text Field" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "medication", label: "Medication Selection" }
  ];

  const sectionMapping = {
    "patient": "Patient Information",
    "vitals": "Vital Signs",
    "medications": "Medications",
    "nurse": "Nurse Section",
    "doctor": "Doctor Section"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formName">Template Name</Label>
            <Input 
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formDescription">Description</Label>
            <Textarea 
              id="formDescription"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Describe the purpose of this form template"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        {Object.entries(sectionMapping).map(([key, label]) => (
          <Button 
            key={key} 
            variant="outline" 
            onClick={() => handleAddField(key as FormField["section"])}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add {label} Field
          </Button>
        ))}
      </div>

      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div 
                  key={field.id}
                  className="flex items-center gap-4 p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 cursor-move">
                    <MoveVertical size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{field.label || "Unnamed Field"}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {sectionMapping[field.section]}
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {fieldTypeOptions.find(option => option.value === field.type)?.label}
                      </span>
                      {field.required && (
                        <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditField(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveField(index)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveTemplate} className="flex items-center gap-2">
              <Save size={16} />
              Save Template
            </Button>
          </CardFooter>
        </Card>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentIndex !== null ? "Edit Field" : "Add Field"}</DialogTitle>
            <DialogDescription>
              Configure the field properties
            </DialogDescription>
          </DialogHeader>
          {currentField && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fieldLabel">Field Label</Label>
                <Input 
                  id="fieldLabel" 
                  value={currentField.label}
                  onChange={(e) => setCurrentField({...currentField, label: e.target.value})}
                  placeholder="Enter field label"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fieldType">Field Type</Label>
                <Select 
                  value={currentField.type}
                  onValueChange={(value: FormField["type"]) => setCurrentField({...currentField, type: value})}
                >
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fieldPlaceholder">Placeholder Text</Label>
                <Input 
                  id="fieldPlaceholder" 
                  value={currentField.placeholder || ""}
                  onChange={(e) => setCurrentField({...currentField, placeholder: e.target.value})}
                  placeholder="Enter placeholder text"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fieldRequired"
                  checked={currentField.required}
                  onChange={(e) => setCurrentField({...currentField, required: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="fieldRequired" className="text-sm">
                  Required Field
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveField}>
              Save Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormBuilder;
