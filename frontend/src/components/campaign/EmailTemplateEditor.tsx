import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { renderEmailPreview } from "@/lib/emailRenderer";

interface EmailTemplateEditorProps {
  subject: string;
  setSubject: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
}

export function EmailTemplateEditor({
  subject,
  setSubject,
  body,
  setBody,
}: EmailTemplateEditorProps) {
  const mockData = {
    name: "Alex Johnson",
    email: "alex@example.com",
  };

  const previewHtml = renderEmailPreview(body, mockData);

  return (
    <Card className="flex flex-col h-full min-h-">
      <Tabs defaultValue="write" className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 border-b border-border/50">
          <div className="font-semibold">Email Template</div>
          <TabsList className="grid w-50 grid-cols-2">
            <TabsTrigger 
                value="write" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
                Write
            </TabsTrigger>
            <TabsTrigger 
                value="preview"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
                Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</Label>
            <div className="relative">
              <Input
                id="subject"
                placeholder="E.g. Your Weekly Digest"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-medium"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">{"{{name}}"}</span> and <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">{"{{email}}"}</span> variables
            </p>
          </div>

          <TabsContent value="write" className="flex-1 mt-0 h-full">
            <Textarea
              placeholder="Hello {{name}}, welcome..."
              className="min-h-75 font-mono text-sm leading-relaxed resize-none h-full"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 mt-0 h-full">
            <div className="w-full h-full min-h-75 rounded-xl bg-slate-100 p-8 overflow-y-auto border border-slate-200 shadow-inner">
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b px-6 py-4">
                    <div className="text-sm text-slate-500 mb-1">To: <span className="text-slate-900 font-medium">Alex Johnson &lt;alex@example.com&gt;</span></div>
                    <div className="text-sm text-slate-500">Subject: <span className="text-slate-900 font-medium">{subject || "(No Subject)"}</span></div>
                </div>
                <div 
                    className="p-8 prose prose-slate max-w-none text-slate-800"
                    dangerouslySetInnerHTML={{ __html: previewHtml || "<span class='text-slate-400 italic'>Start typing to preview content...</span>" }}
                />
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
