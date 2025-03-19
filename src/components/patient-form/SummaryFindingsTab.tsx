
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PatientFormData } from "@/types";

interface SummaryFindingsTabProps {
  formData: PatientFormData;
  handleInputChange: (section: keyof PatientFormData | "", field: string, value: string) => void;
  canEditDoctorSection: boolean;
}

export const SummaryFindingsTab = ({
  formData,
  handleInputChange,
  canEditDoctorSection
}: SummaryFindingsTabProps) => {
  return (
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
  );
};
