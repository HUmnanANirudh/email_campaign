import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { parseCsvFile, type CsvRow } from "@/lib/csvParser";
import { cn } from "@/lib/utils";

interface CsvUploadSectionProps {
  onUpload: (data: CsvRow[], filename: string) => void;
  onClear: () => void;
  isUploaded: boolean;
  filename?: string;
  rowCount?: number;
}

export function CsvUploadSection({
  onUpload,
  onClear,
  isUploaded,
  filename,
  rowCount,
}: CsvUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseCsvFile(file);
      if (result.error) {
        setError(result.error);
      } else {
        onUpload(result.data, file.name);
      }
    } catch (err) {
      setError("Failed to parse CSV file.");
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  if (isUploaded) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-emerald-900 flex items-center gap-2">
                {filename}
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Uploaded
                </span>
              </p>
              <p className="text-sm text-emerald-600/80">
                {rowCount?.toLocaleString()} recipients detected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-colors duration-200",
      isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-dashed hover:border-indigo-300 hover:bg-slate-50"
    )}>
      <CardContent className="p-0">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-50"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200",
            isDragging ? "bg-indigo-100 text-indigo-600 scale-110" : "bg-slate-100 text-slate-400"
          )}>
            <UploadCloud className="h-6 w-6" />
          </div>
          
          <h3 className="font-semibold text-lg mb-1">
            Drag & drop your CSV here
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Required columns: <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">name</span>, <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">email</span>
          </p>
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive mt-2 bg-destructive/10 px-3 py-2 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          {isLoading && (
            <p className="text-sm text-indigo-600 animate-pulse mt-2">
              Parsing CSV file...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
