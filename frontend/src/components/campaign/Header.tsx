import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-backdrop-filter:bg-background/6">
      <div className="flex h-14 w-full items-center justify-between px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </div>
          <span>MailFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Draft Mode
          </Badge>
        </div>
      </div>
    </header>
  );
}
