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
  BarChart3,
  Table2,
  Calendar,
  Hash,
  Type,
  Cloud
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type SourceType = "file" | "database";

interface DetectedColumn {
  name: string;
  type: "text" | "number" | "date" | "category";
  icon: typeof Type;
}

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

  const detectedColumns: DetectedColumn[] = [
    { name: "Product Name", type: "text", icon: Type },
    { name: "Category", type: "category", icon: Table2 },
    { name: "Sales Amount", type: "number", icon: Hash },
    { name: "Order Date", type: "date", icon: Calendar },
    { name: "Region", type: "text", icon: Type },
  ];

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
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    
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
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">DataPulse</span>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-4">
            <div className="step-indicator">
              <div className="step-dot step-dot-active">1</div>
              <span className="font-medium text-foreground">Data Source</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="step-indicator">
              <div className="step-dot step-dot-pending">2</div>
              <span className="text-muted-foreground">Analyze</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Connect Your Data
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Upload a file or connect to your database. We'll automatically detect columns and data types.
          </p>
        </div>

        {/* Source Type Selector */}
        <div className="flex gap-4 mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => setSourceType("file")}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
              sourceType === "file"
                ? "border-primary bg-accent/60 shadow-glow"
                : "border-border/60 hover:border-primary/40 bg-card hover:bg-accent/30"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
              sourceType === "file" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}>
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Upload File</h3>
            <p className="text-muted-foreground">CSV or Excel spreadsheet</p>
          </button>

          <button
            onClick={() => setSourceType("database")}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
              sourceType === "database"
                ? "border-primary bg-accent/60 shadow-glow"
                : "border-border/60 hover:border-primary/40 bg-card hover:bg-accent/30"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
              sourceType === "database" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}>
              <Database className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Connect Database</h3>
            <p className="text-muted-foreground">PostgreSQL connection</p>
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
                className={`upload-zone p-16 text-center transition-all duration-300 ${
                  isDragging ? "upload-zone-active scale-[1.02]" : ""
                } ${uploadedFile ? "border-ai bg-ai-light/30" : ""}`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-ai rounded-2xl flex items-center justify-center shadow-glow-ai animate-scale-in">
                        <CheckCircle2 className="w-10 h-10 text-ai-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-foreground">{uploadedFile.name}</p>
                        <p className="text-muted-foreground mt-1">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • Click to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-muted rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Cloud className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-foreground">
                          Drop your file here, or <span className="text-primary">browse</span>
                        </p>
                        <p className="text-muted-foreground mt-1">
                          Supports CSV and Excel files up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Auto-detection preview */}
              {uploadedFile && (
                <div className="bg-card border border-border/60 rounded-2xl p-6 animate-slide-up shadow-soft">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-ai-light rounded-xl flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-ai" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Auto-detected Schema</h3>
                      <p className="text-sm text-muted-foreground">5 columns • 1,247 rows</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detectedColumns.map((col, i) => (
                      <div
                        key={col.name}
                        className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border/40 animate-scale-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <col.icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{col.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{col.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-soft">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">PostgreSQL Connection</h3>
                  <p className="text-muted-foreground">Enter your database credentials securely</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="host" className="text-sm font-medium">Host</Label>
                  <Input
                    id="host"
                    placeholder="localhost or IP address"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port" className="text-sm font-medium">Port</Label>
                  <Input
                    id="port"
                    placeholder="5432"
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="database" className="text-sm font-medium">Database Name</Label>
                  <Input
                    id="database"
                    placeholder="my_database"
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    placeholder="postgres"
                    value={dbConfig.username}
                    onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isConnecting}
                  className="h-11"
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Connection
                </Button>
                
                {connectionStatus === "success" && (
                  <div className="flex items-center gap-2 text-sm text-ai font-medium animate-scale-in">
                    <CheckCircle2 className="w-5 h-5" />
                    Connected successfully
                  </div>
                )}
                
                {connectionStatus === "error" && (
                  <div className="flex items-center gap-2 text-sm text-destructive font-medium animate-scale-in">
                    <AlertCircle className="w-5 h-5" />
                    Connection failed. Check credentials.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-10 flex justify-end animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!isReadyToContinue}
            className={`px-10 h-13 text-base font-semibold transition-all ${
              isReadyToContinue 
                ? "bg-gradient-primary shadow-glow hover:opacity-90" 
                : ""
            }`}
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};
