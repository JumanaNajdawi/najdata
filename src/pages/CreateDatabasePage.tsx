import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  Server,
  Plug,
  Upload,
  Check,
  Database,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Table,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type SourceType = "file" | "postgres" | "mysql" | "api";
type Step = 1 | 2 | 3;

interface SourceOption {
  id: SourceType;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

const sourceOptions: SourceOption[] = [
  {
    id: "file",
    title: "File Upload",
    description: "CSV, Excel, or JSON files",
    icon: FileSpreadsheet,
    category: "Files",
  },
  {
    id: "postgres",
    title: "PostgreSQL",
    description: "Connect to PostgreSQL database",
    icon: Server,
    category: "Databases",
  },
  {
    id: "mysql",
    title: "MySQL",
    description: "Connect to MySQL database",
    icon: Server,
    category: "Databases",
  },
  {
    id: "api",
    title: "REST API",
    description: "Connect via API endpoint",
    icon: Plug,
    category: "APIs",
  },
];

const sampleSchema = [
  { name: "id", type: "integer", sample: "1, 2, 3..." },
  { name: "product_name", type: "string", sample: "Widget A, Gadget B..." },
  { name: "price", type: "decimal", sample: "29.99, 49.99..." },
  { name: "created_at", type: "timestamp", sample: "2024-01-15 10:30:00" },
  { name: "category", type: "string", sample: "Electronics, Clothing..." },
];

export const CreateDatabasePage = () => {
  const [step, setStep] = useState<Step>(1);
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [dbName, setDbName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      if (step === 2) {
        setConnectionSuccess(false);
      }
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConnecting(false);
    setConnectionSuccess(true);
    toast({
      title: "Connection successful",
      description: "Database connection verified",
    });
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setDbName(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleCreate = () => {
    toast({
      title: "Database created",
      description: `${dbName || "New Database"} has been added`,
    });
    navigate("/databases");
  };

  const canProceed = () => {
    if (step === 1) return sourceType !== null;
    if (step === 2) {
      if (sourceType === "file") return uploadedFile !== null;
      return connectionSuccess;
    }
    return dbName.trim() !== "";
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center px-6 sticky top-0 z-40">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/databases">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Create Database</h1>
          <p className="text-sm text-muted-foreground">Connect a new data source</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "step-dot",
                  s < step
                    ? "step-dot-completed"
                    : s === step
                    ? "step-dot-active"
                    : "step-dot-pending"
                )}
              >
                {s < step ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-8 h-0.5 rounded-full",
                    s < step ? "bg-secondary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        {/* Step 1: Choose Source Type */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Choose Source Type
            </h2>
            <p className="text-muted-foreground mb-6">
              Select how you want to connect your data
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sourceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSourceType(option.id)}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all",
                    sourceType === option.id
                      ? "border-primary bg-accent/50"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      sourceType === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {sourceType === option.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Configure Source */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Configure {sourceOptions.find((s) => s.id === sourceType)?.title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {sourceType === "file"
                ? "Upload your data file"
                : "Enter your connection details"}
            </p>

            {sourceType === "file" ? (
              <div className="space-y-6">
                {/* File Upload Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={cn(
                    "upload-zone p-8 text-center",
                    isDragging && "upload-zone-active",
                    uploadedFile && "border-secondary bg-secondary/5"
                  )}
                >
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <FileSpreadsheet className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                      >
                        Replace File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <p className="font-semibold text-foreground mb-1">
                        Drop your file here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse (CSV, Excel, JSON)
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button variant="outline" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Browse Files
                        </label>
                      </Button>
                    </>
                  )}
                </div>

                {/* Schema Preview */}
                {uploadedFile && (
                  <div className="bg-card rounded-xl border border-border/60 p-5 animate-fade-in">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Table className="w-4 h-4" />
                      Detected Schema
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/60">
                            <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                              Column
                            </th>
                            <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                              Type
                            </th>
                            <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                              Sample
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleSchema.map((col) => (
                            <tr key={col.name} className="border-b border-border/40">
                              <td className="py-2 px-3 font-mono text-foreground">
                                {col.name}
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                  {col.type}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-muted-foreground truncate max-w-[200px]">
                                {col.sample}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Database Connection Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Host</Label>
                    <Input placeholder="localhost" />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input placeholder={sourceType === "postgres" ? "5432" : "3306"} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Database Name</Label>
                  <Input placeholder="my_database" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="db_user" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleTestConnection}
                    disabled={isConnecting || connectionSuccess}
                    variant={connectionSuccess ? "secondary" : "outline"}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : connectionSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Connection Verified
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Confirm Database
            </h2>
            <p className="text-muted-foreground mb-6">
              Review and name your database
            </p>

            <div className="space-y-6">
              {/* Database Name */}
              <div className="space-y-2">
                <Label>Database Name</Label>
                <Input
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="My Database"
                />
              </div>

              {/* Summary Card */}
              <div className="bg-card rounded-xl border border-border/60 p-5">
                <h3 className="font-semibold text-foreground mb-4">Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source Type</span>
                    <span className="font-medium text-foreground">
                      {sourceOptions.find((s) => s.id === sourceType)?.title}
                    </span>
                  </div>
                  {sourceType === "file" && uploadedFile && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File</span>
                      <span className="font-medium text-foreground">
                        {uploadedFile.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tables</span>
                    <span className="font-medium text-foreground">
                      {sourceType === "file" ? "1" : "Auto-detected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sync</span>
                    <span className="font-medium text-foreground">On demand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={!canProceed()}>
              <Database className="w-4 h-4 mr-2" />
              Create Database
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
