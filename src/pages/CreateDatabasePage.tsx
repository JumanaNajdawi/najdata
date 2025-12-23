import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  FileSpreadsheet,
  Server,
  Plug,
  Upload,
  Database,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Table,
  X,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type FlowType = "file" | "database" | "connector" | null;
type DatabaseType = "postgres" | "mysql" | "mongodb" | "snowflake" | null;
type ConnectorType = "salesforce" | "hubspot" | "stripe" | "shopify" | null;

interface FlowOption {
  id: FlowType;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface SubOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const flowOptions: FlowOption[] = [
  {
    id: "file",
    title: "Upload Files",
    description: "Import CSV, Excel, or JSON files",
    icon: FileSpreadsheet,
  },
  {
    id: "database",
    title: "Connect Database",
    description: "PostgreSQL, MySQL, MongoDB, and more",
    icon: Server,
  },
  {
    id: "connector",
    title: "3rd Party Connectors",
    description: "Salesforce, HubSpot, Stripe, and more",
    icon: Plug,
  },
];

const databaseOptions: SubOption[] = [
  { id: "postgres", title: "PostgreSQL", description: "Open-source relational database", icon: Database },
  { id: "mysql", title: "MySQL", description: "Popular SQL database", icon: Database },
  { id: "mongodb", title: "MongoDB", description: "NoSQL document database", icon: Database },
  { id: "snowflake", title: "Snowflake", description: "Cloud data warehouse", icon: Database },
];

const connectorOptions: SubOption[] = [
  { id: "salesforce", title: "Salesforce", description: "CRM & sales data", icon: Plug },
  { id: "hubspot", title: "HubSpot", description: "Marketing & CRM platform", icon: Plug },
  { id: "stripe", title: "Stripe", description: "Payment processing data", icon: Plug },
  { id: "shopify", title: "Shopify", description: "E-commerce platform", icon: Plug },
];

const sampleSchema = [
  { name: "id", type: "integer", sample: "1, 2, 3..." },
  { name: "product_name", type: "string", sample: "Widget A, Gadget B..." },
  { name: "price", type: "decimal", sample: "29.99, 49.99..." },
  { name: "created_at", type: "timestamp", sample: "2024-01-15 10:30:00" },
  { name: "category", type: "string", sample: "Electronics, Clothing..." },
];

export const CreateDatabasePage = () => {
  const [activeFlow, setActiveFlow] = useState<FlowType>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>(null);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [dbName, setDbName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dialogStep, setDialogStep] = useState<"select" | "configure" | "confirm">("select");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const resetState = () => {
    setActiveFlow(null);
    setSelectedDatabase(null);
    setSelectedConnector(null);
    setConnectionSuccess(false);
    setDbName("");
    setUploadedFiles([]);
    setDialogStep("select");
    setIsConnecting(false);
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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      if (!dbName && newFiles.length > 0) {
        setDbName(newFiles[0].name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    toast({
      title: "Database created",
      description: `${dbName || "New Database"} has been added`,
    });
    setShowSuccessDialog(true);
    resetState();
  };

  const canProceedToConfirm = () => {
    if (activeFlow === "file") return uploadedFiles.length > 0;
    if (activeFlow === "database") return connectionSuccess;
    if (activeFlow === "connector") return connectionSuccess;
    return false;
  };

  const getDialogTitle = () => {
    if (activeFlow === "file") return "Upload Files";
    if (activeFlow === "database") {
      if (dialogStep === "select") return "Select Database Type";
      return `Connect ${databaseOptions.find((d) => d.id === selectedDatabase)?.title || "Database"}`;
    }
    if (activeFlow === "connector") {
      if (dialogStep === "select") return "Select Connector";
      return `Connect ${connectorOptions.find((c) => c.id === selectedConnector)?.title || "Connector"}`;
    }
    return "";
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
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Choose Connection Method
        </h2>
        <p className="text-muted-foreground mb-8">
          Select how you want to add your data
        </p>

        {/* Main Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flowOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setActiveFlow(option.id);
                setDialogStep(option.id === "file" ? "configure" : "select");
              }}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-border/60 bg-card hover:border-primary/60 hover:bg-accent/30 transition-all text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <option.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{option.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Dialog */}
      <Dialog open={activeFlow === "file"} onOpenChange={(open) => !open && resetState()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogStep === "confirm" ? "Confirm Database" : "Upload Files"}</DialogTitle>
            <DialogDescription>
              {dialogStep === "confirm"
                ? "Review and name your database"
                : "Drag and drop your files or click to browse"}
            </DialogDescription>
          </DialogHeader>

          {dialogStep === "configure" && (
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
                  isDragging && "upload-zone-active"
                )}
              >
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground mb-1">Drop your files here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  CSV, Excel, or JSON files (multiple allowed)
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files ({uploadedFiles.length})</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schema Preview */}
              {uploadedFiles.length > 0 && (
                <div className="bg-card rounded-xl border border-border/60 p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                    <Table className="w-4 h-4" />
                    Detected Schema (Preview)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Column</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Sample</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleSchema.slice(0, 3).map((col) => (
                          <tr key={col.name} className="border-b border-border/40">
                            <td className="py-2 px-3 font-mono text-foreground">{col.name}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 bg-muted rounded text-xs">{col.type}</span>
                            </td>
                            <td className="py-2 px-3 text-muted-foreground truncate max-w-[150px]">
                              {col.sample}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={resetState}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setDialogStep("confirm")}
                  disabled={uploadedFiles.length === 0}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {dialogStep === "confirm" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Database Name</Label>
                <Input
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="My Database"
                />
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Files</span>
                    <span className="font-medium text-foreground">{uploadedFiles.length} file(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Size</span>
                    <span className="font-medium text-foreground">
                      {(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogStep("configure")}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={!dbName.trim()}>
                  Create Database
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Database Connection Dialog */}
      <Dialog open={activeFlow === "database"} onOpenChange={(open) => !open && resetState()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {dialogStep === "select"
                ? "Choose your database type"
                : dialogStep === "confirm"
                ? "Review and name your database"
                : "Enter your connection details"}
            </DialogDescription>
          </DialogHeader>

          {dialogStep === "select" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {databaseOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedDatabase(option.id as DatabaseType);
                      setDialogStep("configure");
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-border/60 hover:border-primary/60 hover:bg-accent/30 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <option.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetState}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {dialogStep === "configure" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input placeholder="localhost" />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input placeholder={selectedDatabase === "postgres" ? "5432" : "3306"} />
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
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

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

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogStep("select")}>
                  Back
                </Button>
                <Button onClick={() => setDialogStep("confirm")} disabled={!connectionSuccess}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {dialogStep === "confirm" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Database Name</Label>
                <Input
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="My Database"
                />
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground">
                      {databaseOptions.find((d) => d.id === selectedDatabase)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-secondary">Connected</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogStep("configure")}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={!dbName.trim()}>
                  Create Database
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Connector Dialog */}
      <Dialog open={activeFlow === "connector"} onOpenChange={(open) => !open && resetState()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {dialogStep === "select"
                ? "Choose your connector"
                : dialogStep === "confirm"
                ? "Review and name your database"
                : "Enter your API credentials"}
            </DialogDescription>
          </DialogHeader>

          {dialogStep === "select" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {connectorOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedConnector(option.id as ConnectorType);
                      setDialogStep("configure");
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-border/60 hover:border-primary/60 hover:bg-accent/30 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <option.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetState}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {dialogStep === "configure" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your API key" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {selectedConnector === "salesforce" && (
                <>
                  <div className="space-y-2">
                    <Label>Instance URL</Label>
                    <Input placeholder="https://yourcompany.salesforce.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Secret</Label>
                    <Input type="password" placeholder="Enter client secret" />
                  </div>
                </>
              )}

              {selectedConnector === "stripe" && (
                <div className="space-y-2">
                  <Label>Account ID (optional)</Label>
                  <Input placeholder="acct_xxxxx" />
                </div>
              )}

              <Button
                onClick={handleTestConnection}
                disabled={isConnecting || connectionSuccess}
                variant={connectionSuccess ? "secondary" : "outline"}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : connectionSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogStep("select")}>
                  Back
                </Button>
                <Button onClick={() => setDialogStep("confirm")} disabled={!connectionSuccess}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {dialogStep === "confirm" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Database Name</Label>
                <Input
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="My Database"
                />
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connector</span>
                    <span className="font-medium text-foreground">
                      {connectorOptions.find((c) => c.id === selectedConnector)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-secondary">Connected</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogStep("configure")}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={!dbName.trim()}>
                  Create Database
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <DialogTitle>Database Created Successfully!</DialogTitle>
            <DialogDescription>
              Your new database has been added and is ready to use.
            </DialogDescription>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate("/databases");
                }}
              >
                Go to Databases
              </Button>
              <Button
                onClick={() => setShowSuccessDialog(false)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateDatabasePage;
