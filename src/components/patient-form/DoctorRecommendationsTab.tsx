
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PatientFormData } from "@/types";
import { ClipboardCheck } from "lucide-react";

interface DoctorRecommendationsTabProps {
  formData: PatientFormData;
  handleInputChange: (section: keyof PatientFormData | "", field: string, value: string | boolean) => void;
  canEditDoctorSection: boolean;
}

export const DoctorRecommendationsTab = ({
  formData,
  handleInputChange,
  canEditDoctorSection
}: DoctorRecommendationsTabProps) => {
  return (
    <div className="grid gap-6">
      {/* Nutrition Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <ClipboardCheck className="h-5 w-5 text-primary mr-2" />
            Nutrition Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nutritionalPlan">Style (nutritional plan)</Label>
              <Textarea
                id="nutritionalPlan"
                value={formData.nutritionRecommendations.nutritionalPlan}
                onChange={(e) => handleInputChange("nutritionRecommendations", "nutritionalPlan", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="proteinConsumption">Protein Consumption</Label>
              <Textarea
                id="proteinConsumption"
                value={formData.nutritionRecommendations.proteinConsumption}
                onChange={(e) => handleInputChange("nutritionRecommendations", "proteinConsumption", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="omissions">Omissions</Label>
              <Textarea
                id="omissions"
                value={formData.nutritionRecommendations.omissions}
                onChange={(e) => handleInputChange("nutritionRecommendations", "omissions", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="additionalConsiderations">Additional Considerations</Label>
              <Textarea
                id="additionalConsiderations"
                value={formData.nutritionRecommendations.additionalConsiderations}
                onChange={(e) => handleInputChange("nutritionRecommendations", "additionalConsiderations", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <ClipboardCheck className="h-5 w-5 text-primary mr-2" />
            Exercise Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="focusOn">Focus On</Label>
              <Textarea
                id="focusOn"
                value={formData.exerciseDetail.focusOn}
                onChange={(e) => handleInputChange("exerciseDetail", "focusOn", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="walking">Walking</Label>
              <Textarea
                id="walking"
                value={formData.exerciseDetail.walking}
                onChange={(e) => handleInputChange("exerciseDetail", "walking", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="avoid">Avoid</Label>
              <Textarea
                id="avoid"
                value={formData.exerciseDetail.avoid}
                onChange={(e) => handleInputChange("exerciseDetail", "avoid", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="tracking">Tracking</Label>
              <Textarea
                id="tracking"
                value={formData.exerciseDetail.tracking}
                onChange={(e) => handleInputChange("exerciseDetail", "tracking", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep and Stress Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <ClipboardCheck className="h-5 w-5 text-primary mr-2" />
            Sleep and Stress Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="sleep">Sleep</Label>
              <Textarea
                id="sleep"
                value={formData.sleepStressRecommendations.sleep}
                onChange={(e) => handleInputChange("sleepStressRecommendations", "sleep", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="stress">Stress</Label>
              <Textarea
                id="stress"
                value={formData.sleepStressRecommendations.stress}
                onChange={(e) => handleInputChange("sleepStressRecommendations", "stress", e.target.value)}
                disabled={!canEditDoctorSection}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
