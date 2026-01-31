import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorsProps {
  isCsvUploaded: boolean;
  isApiValid: boolean;
}

export function StatusIndicators({ isCsvUploaded, isApiValid }: StatusIndicatorsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
        isCsvUploaded ? "text-primary" : "text-muted-foreground"
      )}>
        <CheckCircle2 className={cn("h-4 w-4", isCsvUploaded ? "text-primary" : "text-muted-foreground/50")} />
        CSV Uploaded
      </div>
      <div className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
        isApiValid ? "text-primary" : "text-muted-foreground"
      )}>
        <CheckCircle2 className={cn("h-4 w-4", isApiValid ? "text-primary" : "text-muted-foreground/50")} />
        API Key Valid
      </div>
    </div>
  );
}
