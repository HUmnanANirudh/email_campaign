import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Send, PartyPopper, Download, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CampaignStats {
  sent: number;
  failed: number;
  pending: number;
  total: number;
}

interface ProgressModalProps {
  open: boolean;
  stats: CampaignStats;
  onDownloadLogs: () => void;
  onReset: () => void;
}

export function ProgressModal({ open, stats, onDownloadLogs, onReset }: ProgressModalProps) {
  const isFinished = stats.pending === 0 && stats.total > 0;
  const progress = stats.total > 0 ? ((stats.sent + stats.failed) / stats.total) * 100 : 0;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500",
            isFinished ? "bg-primary/20 text-primary" : "bg-primary/20 text-primary"
          )}>
            {isFinished ? (
              <PartyPopper className="h-8 w-8 animate-bounce" />
            ) : (
              <Send className="h-8 w-8 animate-pulse" />
            )}
          </div>
          
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">
              {isFinished ? "Campaign Finished!" : "Sending Campaign..."}
            </DialogTitle>
            <DialogDescription className="text-base">
              {isFinished 
                ? "All recipients have been processed successfully." 
                : "Hold tight, we're warming up the engines."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isFinished && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(progress)}% Complete</span>
                <span>{stats.sent + stats.failed} / {stats.total}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-muted/50 p-3 rounded-lg border border-border">
              <div className="text-2xl font-bold text-foreground">{stats.sent}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sent</div>
            </div>
            <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              <div className="text-xs font-medium text-destructive uppercase tracking-wide">Failed</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg border border-border">
              <div className="text-2xl font-bold text-muted-foreground">{stats.pending}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending</div>
            </div>
          </div>
        </div>

        {isFinished && (
          <div className="flex flex-col gap-3 pt-2">
            <Button size="lg" className="w-full" onClick={onReset}>
              <RotateCw className="mr-2 h-4 w-4" />
              Start New Campaign
            </Button>
            {stats.failed > 0 && (
              <Button variant="outline" size="lg" className="w-full" onClick={onDownloadLogs}>
                <Download className="mr-2 h-4 w-4" />
                Download Error Log ({stats.failed})
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
