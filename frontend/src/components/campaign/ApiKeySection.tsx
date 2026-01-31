import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, ShieldCheck, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeySectionProps {
  onValidate: (key: string) => void;
  isValid: boolean;
}

export function ApiKeySection({ onValidate, isValid }: ApiKeySectionProps) {
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    if (!apiKey) return;
    
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTesting(false);
    onValidate(apiKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Key className="h-5 w-5 text-indigo-600" />
          SendGrid Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="SG.xxxxxxxxxxxx"
              className={cn("pl-9", isValid && "border-emerald-500 text-emerald-700")}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isValid}
            />
          </div>
          <Button
            variant={isValid ? "outline" : "secondary"}
            onClick={handleTest}
            disabled={!apiKey || isTesting || isValid}
            className={cn(
                "min-w-25", 
                isValid && "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
            )}
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isValid ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Valid
              </>
            ) : (
              "Test API"
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 p-2 rounded-md border border-slate-100">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
          Keys are processed locally and never stored on our servers.
        </div>
      </CardContent>
    </Card>
  );
}
