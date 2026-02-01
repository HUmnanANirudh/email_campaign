import { useState } from "react";
import { Header } from "./Header";
import { CsvUploadSection } from "./CsvUploadSection";
import { ApiKeySection } from "./ApiKeySection";
import { EmailTemplateEditor } from "./EmailTemplateEditor";
import { StatusIndicators } from "./StatusIndicators";
import { SendButton } from "./SendButton";
import { ProgressModal, type CampaignStats } from "./ProgressModal";
import type { CsvRow } from "@/lib/csvParser";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export function CampaignPage() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [csvFilename, setCsvFilename] = useState("");
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState<CampaignStats>({
    sent: 0,
    failed: 0,
    pending: 0,
    total: 0,
  });
  const [isSending, setIsSending] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleUpload = (data: CsvRow[], filename: string) => {
    setCsvData(data);
    setCsvFilename(filename);
  };

  const handleClearCsv = () => {
    setCsvData([]);
    setCsvFilename("");
  };

  const handleApiValidate = (key: string) => {
    setIsApiKeyValid(true);
    setApiKey(key);
  };

  const startCampaign = async () => {
    if (csvData.length === 0 || !apiKey) return;

    setShowModal(true);
    setIsSending(true);
    setStats({
      sent: 0,
      failed: 0,
      pending: csvData.length,
      total: csvData.length,
    });
    setErrorMessages([]);
    
    try {
      // Prepare data for backend
      const recipients = csvData.map(row => ({
        Name: row.Name || row.name || '',
        Email: row.Email || row.email || '',
      }));

      const response = await fetch(`${BACKEND_URL}/api/campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          subject,
          body,
          apiKey,
          fromEmail,
          fromName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json();
      
      setStats({
        sent: result.sent || 0,
        failed: result.failed || 0,
        pending: 0,
        total: result.total || csvData.length,
      });
      
      if (result.errors && result.errors.length > 0) {
        setErrorMessages(result.errors);
      }
    } catch (error) {
      console.error('Campaign failed:', error);
      setStats(prev => ({
        ...prev,
        failed: prev.total,
        pending: 0,
      }));
      setErrorMessages([`Failed to send campaign: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsSending(false);
    }
  };

  const resetCampaign = () => {
    setShowModal(false);
    setErrorMessages([]);
  };

  const downloadErrorLog = () => {
    const content = errorMessages.length > 0 
      ? errorMessages.join('\n') 
      : "No errors recorded";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "error_log.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isFormValid = 
    csvData.length > 0 && 
    isApiKeyValid && 
    fromEmail.trim().length > 0 &&
    subject.trim().length > 0 && 
    body.trim().length > 0;

  return (
    <div className="min-h-screen bg-muted/40 font-sans">
      <Header />
      
      <main className="container max-w-screen-2xl mx-auto px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Campaign</h1>
          <p className="text-xl text-muted-foreground">Upload your audience, configure your credentials, and blast personalized messages in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">1. Add Recipients</h2>
              <CsvUploadSection 
                onUpload={handleUpload}
                onClear={handleClearCsv}
                isUploaded={csvData.length > 0}
                filename={csvFilename}
                rowCount={csvData.length}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">2. Configure Sender</h2>
              <ApiKeySection 
                onValidate={handleApiValidate}
                isValid={isApiKeyValid}
                fromEmail={fromEmail}
                setFromEmail={setFromEmail}
                fromName={fromName}
                setFromName={setFromName}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:col-span-7 flex flex-col">
            <div className="space-y-4 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">3. Create Template</h2>
              <EmailTemplateEditor 
                subject={subject}
                setSubject={setSubject}
                body={body}
                setBody={setBody}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-12">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">4. Launch</h2>
                <p className="text-sm text-muted-foreground">Ready for takeoff?</p>
              </div>
              <StatusIndicators 
                isCsvUploaded={csvData.length > 0}
                isApiValid={isApiKeyValid}
              />
            </div>
            <div className="w-full sm:w-auto sm:min-w-50">
              <SendButton 
                onClick={startCampaign}
                disabled={!isFormValid || isSending}
              />
            </div>
          </div>
          </div>
        </div>
        <div className="pt-4 border-t border-border/60 flex items-center justify-center mt-8">
        </div>
      </main>

      <ProgressModal 
        open={showModal}
        stats={stats}
        onDownloadLogs={downloadErrorLog}
        onReset={resetCampaign}
      />
    </div>
  );
}
