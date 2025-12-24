import { useState } from "react";
import { GripVertical, ChevronRight, X, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkflowBlock } from "./types";

interface WorkflowCanvasProps {
  workflow: WorkflowBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (instanceId: string | null) => void;
  onRemoveBlock: (instanceId: string) => void;
  onReorderBlocks: (startIndex: number, endIndex: number) => void;
  categoryColors: Record<string, string>;
  getIcon: (iconName: string) => React.ComponentType<{ className?: string }>;
}

export const WorkflowCanvas = ({
  workflow,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onReorderBlocks,
  categoryColors,
  getIcon,
}: WorkflowCanvasProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderBlocks(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getConfigSummary = (block: WorkflowBlock): string => {
    const config = block.config;
    if (!config) return "";

    const parts: string[] = [];

    if (config.database) parts.push(config.database);
    if (config.table) parts.push(config.table);
    if (config.columns?.length) parts.push(`${config.columns.length} columns`);
    if (config.filterColumn) parts.push(`${config.filterColumn} ${config.filterOperator} ${config.filterValue}`);
    if (config.groupByColumns?.length) parts.push(`Group: ${config.groupByColumns.join(", ")}`);
    if (config.sortColumn) parts.push(`Sort: ${config.sortColumn} ${config.sortDirection}`);
    if (config.aggregateFunction) parts.push(`${config.aggregateFunction}(${config.aggregateColumn})`);
    if (config.limitRows) parts.push(`Limit: ${config.limitRows}`);
    if (config.chartType) parts.push(config.chartType);
    if (config.colorScheme && config.colorScheme !== "default") parts.push(config.colorScheme);

    return parts.join(" • ");
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gradient-surface">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-3">
          {workflow.map((block, index) => {
            const Icon = getIcon(block.icon);
            const configSummary = getConfigSummary(block);

            return (
              <div
                key={block.instanceId}
                className={cn(
                  "animate-fade-in",
                  draggedIndex === index && "opacity-50"
                )}
              >
                {/* Connector */}
                {index > 0 && (
                  <div className="flex justify-center py-1">
                    <div
                      className={cn(
                        "w-px h-4 transition-colors",
                        dragOverIndex === index ? "bg-primary" : "bg-border"
                      )}
                    />
                  </div>
                )}

                {/* Drop zone indicator */}
                {dragOverIndex === index && draggedIndex !== null && (
                  <div className="h-1 bg-primary rounded-full mb-2 animate-pulse" />
                )}

                {/* Block */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onSelectBlock(block.instanceId)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 bg-card transition-all cursor-pointer group",
                    selectedBlockId === block.instanceId
                      ? "border-primary shadow-md ring-2 ring-primary/20"
                      : "border-border/60 hover:border-border"
                  )}
                >
                  <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      categoryColors[block.category]
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{block.label}</p>
                    {configSummary && (
                      <p className="text-sm text-muted-foreground truncate">
                        {configSummary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBlock(block.instanceId);
                      }}
                    >
                      <Settings2 className="w-4 h-4" />
                    </Button>

                    <ChevronRight className="w-4 h-4 text-muted-foreground" />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBlock(block.instanceId);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Block Placeholder */}
          {workflow.length === 0 && (
            <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center text-muted-foreground">
              <p className="font-medium mb-1">Start building your workflow</p>
              <p className="text-sm">Add blocks from the palette on the left</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
