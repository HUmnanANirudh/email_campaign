import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function SendButton({ onClick, disabled }: SendButtonProps) {
  return (
    <Button
      size="lg"
      className={cn(
        "w-full text-lg font-semibold h-14 transition-all duration-200",
        !disabled && "hover:scale-[1.02] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      Launch Campaign
      <Rocket className={cn("ml-2 h-5 w-5", !disabled && "animate-pulse")} />
    </Button>
  );
}
