import { BarChart2 } from "lucide-react";
import { WorkflowBlock } from "./types";
import { ChartPreview } from "./ChartPreview";

interface PreviewPanelProps {
  workflow: WorkflowBlock[];
  data: any[];
}

export const PreviewPanel = ({ workflow, data }: PreviewPanelProps) => {
  const hasVisualization = workflow.some((b) => b.category === "visualize");
  const vizBlock = workflow.find((b) => b.category === "visualize");

  return (
    <aside className="w-80 border-l border-border/60 bg-card/50 flex flex-col shrink-0">
      <div className="p-4 border-b border-border/60">
        <h3 className="font-medium text-foreground">Preview</h3>
        <p className="text-sm text-muted-foreground">Live output of your workflow</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {hasVisualization ? (
          <div className="bg-background rounded-xl border border-border p-4">
            {vizBlock?.config?.chartTitle && (
              <h4 className="text-sm font-medium text-foreground mb-3 text-center">
                {vizBlock.config.chartTitle}
              </h4>
            )}
            <ChartPreview workflow={workflow} data={data} />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-center text-muted-foreground">
            <div>
              <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Add a visualization block to see preview</p>
            </div>
          </div>
        )}

        {/* Data Preview Table */}
        {workflow.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Data Output</h4>
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-2 text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-right text-foreground">
                        {typeof row.value === "number"
                          ? row.value.toLocaleString()
                          : row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 5 && (
                <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/20 text-center">
                  +{data.length - 5} more rows
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
