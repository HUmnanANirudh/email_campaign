import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, ShieldCheck, Check, Loader2, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeySectionProps {
  onValidate: (key: string) => void;
  isValid: boolean;
  fromEmail: string;
  setFromEmail: (email: string) => void;
  fromName: string;
  setFromName: (name: string) => void;
}

export function ApiKeySection({ onValidate, isValid, fromEmail, setFromEmail, fromName, setFromName }: ApiKeySectionProps) {
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
          <Key className="h-5 w-5 text-primary" />
          SendGrid Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-sm font-medium">SendGrid API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="apiKey"
                type="password"
                placeholder="SG.xxxxxxxxxxxx"
                className={cn("pl-9", isValid && "border-primary text-primary")}
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
                  isValid && "border-primary/20 text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromEmail" className="text-sm font-medium">Sender Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fromEmail"
              type="email"
              placeholder="noreply@yourdomain.com"
              className="pl-9"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">Must be verified in your SendGrid account</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromName" className="text-sm font-medium">Sender Name (Optional)</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fromName"
              type="text"
              placeholder="Campaign Sender"
              className="pl-9"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md border border-border">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Keys are processed locally and never stored on our servers.
        </div>
      </CardContent>
    </Card>
  );
}
