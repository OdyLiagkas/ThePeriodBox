import { useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PdfViewer() {
  const { filename } = useParams();
  
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="font-semibold capitalize">
          {filename?.replace(/-/g, ' ').replace('.pdf', '')}
        </h1>
      </header>
      
      <div className="flex-1 w-full h-[calc(100vh-65px)]">
        <iframe 
          src={`/${filename}`} 
          className="w-full h-full border-0"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}