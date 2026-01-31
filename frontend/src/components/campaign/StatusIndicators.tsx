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
        isCsvUploaded ? "text-emerald-600" : "text-slate-400"
      )}>
        <CheckCircle2 className={cn("h-4 w-4", isCsvUploaded ? "text-emerald-500" : "text-slate-300")} />
        CSV Uploaded
      </div>
      <div className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
        isApiValid ? "text-emerald-600" : "text-slate-400"
      )}>
        <CheckCircle2 className={cn("h-4 w-4", isApiValid ? "text-emerald-500" : "text-slate-300")} />
        API Key Valid
      </div>
    </div>
  );
}
