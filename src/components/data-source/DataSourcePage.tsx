import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Database, 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type SourceType = "file" | "database";

export const DataSourcePage = () => {
  const [sourceType, setSourceType] = useState<SourceType>("file");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [dbConfig, setDbConfig] = useState({
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    
    // Simulate success for demo
    if (dbConfig.host && dbConfig.database && dbConfig.username) {
      setConnectionStatus("success");
      toast({
        title: "Connection successful",
        description: "Your PostgreSQL database is connected",
      });
    } else {
      setConnectionStatus("error");
      toast({
        title: "Connection failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const isReadyToContinue = sourceType === "file" ? uploadedFile !== null : connectionStatus === "success";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">DataPulse</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">1</span>
            <span className="font-medium text-foreground">Choose Data Source</span>
            <span className="mx-2">→</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">2</span>
            <span>Analyze</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Connect Your Data
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload a file or connect to your database to get started
          </p>
        </div>

        {/* Source Type Selector */}
        <div className="flex gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => setSourceType("file")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              sourceType === "file"
                ? "border-primary bg-accent/50"
                : "border-border hover:border-primary/30 bg-card"
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              sourceType === "file" ? "bg-primary/10" : "bg-muted"
            }`}>
              <Upload className={`w-6 h-6 ${sourceType === "file" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Upload File</h3>
            <p className="text-sm text-muted-foreground">CSV or Excel spreadsheet</p>
          </button>

          <button
            onClick={() => setSourceType("database")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              sourceType === "database"
                ? "border-primary bg-accent/50"
                : "border-border hover:border-primary/30 bg-card"
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              sourceType === "database" ? "bg-primary/10" : "bg-muted"
            }`}>
              <Database className={`w-6 h-6 ${sourceType === "database" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Connect Database</h3>
            <p className="text-sm text-muted-foreground">PostgreSQL connection</p>
          </button>
        </div>

        {/* Content based on source type */}
        <div className="animate-fade-in">
          {sourceType === "file" ? (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`upload-zone p-12 text-center ${isDragging ? "upload-zone-active" : ""}`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploadedFile ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-ai/10 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-ai" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • Click to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center">
                        <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Drop your file here, or <span className="text-primary">browse</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports CSV and Excel files up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Auto-detection preview */}
              {uploadedFile && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-medium text-foreground mb-4">Detected Columns</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Product Name", "Category", "Sales Amount", "Date", "Region"].map((col) => (
                      <span
                        key={col}
                        className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">PostgreSQL Connection</h3>
                  <p className="text-sm text-muted-foreground">Enter your database credentials</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    placeholder="localhost or IP address"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    placeholder="5432"
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input
                    id="database"
                    placeholder="my_database"
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="postgres"
                    value={dbConfig.username}
                    onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Connection
                </Button>
                
                {connectionStatus === "success" && (
                  <span className="flex items-center gap-2 text-sm text-ai">
                    <CheckCircle2 className="w-4 h-4" />
                    Connected successfully
                  </span>
                )}
                
                {connectionStatus === "error" && (
                  <span className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    Connection failed. Check credentials.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!isReadyToContinue}
            className="px-8"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};
