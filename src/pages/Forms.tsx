
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, FileUp, FileDown, FilePlus2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Forms = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    // Check if file is a Word document
    const isWordDoc = selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc');
    if (!isWordDoc) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word document (.docx or .doc)",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      
      toast({
        title: "Template uploaded",
        description: "Your form template has been uploaded successfully"
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Form Templates</h1>
            <p className="text-muted-foreground mt-1">
              Manage and customize your form templates
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <FilePlus2 size={16} />
            <span>Create New Template</span>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="lg:col-span-2 animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Upload Template</CardTitle>
                <CardDescription>
                  Upload a Word document to use as a template for PDF generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-10 text-center">
                  <FileUp className="h-10 w-10 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="font-medium text-lg mb-2">Upload Word Template</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Drag and drop a Word document, or click to browse. The system will map form fields to the document structure.
                  </p>
                  <div className="flex flex-col items-center">
                    <Label htmlFor="file-upload" className="w-full max-w-xs">
                      <div className="bg-primary text-primary-foreground rounded-md py-2 px-4 text-center cursor-pointer hover:bg-primary/90 transition-colors">
                        Browse files
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".doc,.docx"
                        onChange={handleFileChange}
                      />
                    </Label>
                    {selectedFile && (
                      <div className="mt-4 text-sm">
                        Selected: <span className="font-medium">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  disabled={!selectedFile || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Template
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sample Templates */}
          <Card className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>General Medical Exam</CardTitle>
              <CardDescription>
                Standard template for general medical examinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Last updated: August 15, 2023
                </p>
                <div className="flex flex-wrap mt-2 gap-2">
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Nurse Section
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Doctor Section
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Medications
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Vitals
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button>
                Use Template
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle>Specialist Referral</CardTitle>
              <CardDescription>
                Template for specialist referrals and consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Last updated: September 3, 2023
                </p>
                <div className="flex flex-wrap mt-2 gap-2">
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Referral Reason
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Medical History
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Specialist Details
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Forms;
