
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientFormData } from "@/types";
import { CalendarClock, Plus, Trash2 } from "lucide-react";

interface FollowUpTabProps {
  formData: PatientFormData;
  handleFollowUpChange: (index: number, field: string, value: string) => void;
  handleAddFollowUp: () => void;
  handleRemoveFollowUp: (index: number) => void;
  canEditDoctorSection: boolean;
}

export const FollowUpTab = ({
  formData,
  handleFollowUpChange,
  handleAddFollowUp,
  handleRemoveFollowUp,
  canEditDoctorSection
}: FollowUpTabProps) => {
  const followUps = formData.followUps || [];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <CalendarClock className="h-5 w-5 text-primary mr-2" />
          Follow-ups and Referrals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {followUps.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center">No follow-ups scheduled yet.</p>
        ) : (
          <div className="space-y-4">
            {followUps.map((followUp, index) => (
              <div key={index} className="border rounded-md p-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`followUp-with-${index}`}>With</Label>
                    <Input
                      id={`followUp-with-${index}`}
                      value={followUp.withDoctor}
                      onChange={(e) => handleFollowUpChange(index, "withDoctor", e.target.value)}
                      disabled={!canEditDoctorSection}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`followUp-for-${index}`}>For</Label>
                    <Input
                      id={`followUp-for-${index}`}
                      value={followUp.forReason}
                      onChange={(e) => handleFollowUpChange(index, "forReason", e.target.value)}
                      disabled={!canEditDoctorSection}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`followUp-date-${index}`}>Date</Label>
                    <Input
                      id={`followUp-date-${index}`}
                      value={followUp.date}
                      onChange={(e) => handleFollowUpChange(index, "date", e.target.value)}
                      disabled={!canEditDoctorSection}
                    />
                  </div>
                </div>
                {canEditDoctorSection && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-destructive"
                    onClick={() => handleRemoveFollowUp(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {canEditDoctorSection && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handleAddFollowUp}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Follow-up
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
