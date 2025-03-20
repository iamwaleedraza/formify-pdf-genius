
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medication } from "@/types";
import { Copy, FilePlus, Trash2 } from "lucide-react";

interface MedicationListProps {
  medications: Medication[];
  type: 'medication' | 'supplement';
  isAdmin: boolean;
  onEdit: (medication: Medication) => void;
  onDuplicate: (medication: Medication) => void;
  onDelete: (id: string) => Promise<void>;
}

export const MedicationList = ({ 
  medications, 
  type, 
  isAdmin, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: MedicationListProps) => {
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
                      onClick={() => onEdit(med)}
                    >
                      <FilePlus className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDuplicate(med)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(med.id)}
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
