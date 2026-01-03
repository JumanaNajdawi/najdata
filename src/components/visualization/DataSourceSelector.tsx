import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Table2,
  FileOutput,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DataSourceType = "source" | "results";

interface DataSourceOption {
  type: DataSourceType;
  title: string;
  description: string;
  icon: React.ElementType;
  rowCount?: number;
  columns?: string[];
  recommended?: boolean;
}

interface DataSourceSelectorProps {
  selectedSource: DataSourceType | null;
  onSelectSource: (source: DataSourceType) => void;
  onContinue: () => void;
  sourceRowCount?: number;
  resultsRowCount?: number;
  sourceColumns?: string[];
  resultsColumns?: string[];
}

export const DataSourceSelector = ({
  selectedSource,
  onSelectSource,
  onContinue,
  sourceRowCount = 10000,
  resultsRowCount = 6,
  sourceColumns = ["id", "user_id", "amount", "status", "created_at"],
  resultsColumns = ["month", "revenue"],
}: DataSourceSelectorProps) => {
  const options: DataSourceOption[] = [
    {
      type: "source",
      title: "Source Data",
      description: "Use the original dataset from your database or workflow input",
      icon: Database,
      rowCount: sourceRowCount,
      columns: sourceColumns,
    },
    {
      type: "results",
      title: "Results Data",
      description: "Use the transformed/aggregated data from your query or workflow",
      icon: FileOutput,
      rowCount: resultsRowCount,
      columns: resultsColumns,
      recommended: true,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Table2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Select Data Source
          </h2>
          <p className="text-muted-foreground">
            Choose which dataset to use for your visualization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <Card
              key={option.type}
              className={cn(
                "relative p-5 cursor-pointer transition-all duration-200 hover:shadow-lg",
                selectedSource === option.type
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelectSource(option.type)}
            >
              {option.recommended && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2.5 left-4 text-xs bg-secondary text-secondary-foreground"
                >
                  Recommended
                </Badge>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    selectedSource === option.type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <option.icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {option.title}
                    </h3>
                    {selectedSource === option.type && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {option.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md">
                      <Table2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {option.rowCount?.toLocaleString()} rows
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md">
                      <Info className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {option.columns?.length} columns
                      </span>
                    </div>
                  </div>

                  {option.columns && option.columns.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {option.columns.slice(0, 4).map((col) => (
                        <Badge
                          key={col}
                          variant="outline"
                          className="text-xs font-mono"
                        >
                          {col}
                        </Badge>
                      ))}
                      {option.columns.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{option.columns.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedSource}
            onClick={onContinue}
            className="min-w-[200px]"
          >
            Continue to Visualization
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
