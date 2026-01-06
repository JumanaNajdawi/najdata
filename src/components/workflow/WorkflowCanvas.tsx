import { useState, useRef } from "react";
import { GripVertical, Settings, X, ChevronDown, ChevronUp, Copy, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Block, WorkflowBlock } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkflowCanvasProps {
  workflow: WorkflowBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onReorderBlocks: (fromIndex: number, toIndex: number) => void;
  onAddBlock: (block: Block) => void;
  onDuplicateBlock?: (id: string) => void;
  categoryColors: Record<string, string>;
  getIcon: (iconName: string) => React.ComponentType<{ className?: string }>;
}

export const WorkflowCanvas = ({
  workflow,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onReorderBlocks,
  onAddBlock,
  onDuplicateBlock,
  categoryColors,
  getIcon,
}: WorkflowCanvasProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingFromPalette, setIsDraggingFromPalette] = useState(false);
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    // Check if dragging from palette
    const paletteData = e.dataTransfer.types.includes("application/json");
    if (paletteData) {
      setIsDraggingFromPalette(true);
      setDragOverIndex(index);
      return;
    }
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the canvas entirely
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        setDragOverIndex(null);
        setIsDraggingFromPalette(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    // Check if dropping from palette
    const paletteData = e.dataTransfer.getData("application/json");
    if (paletteData) {
      try {
        const block = JSON.parse(paletteData) as Block;
        onAddBlock(block);
      } catch (err) {
        console.error("Failed to parse block data", err);
      }
      setIsDraggingFromPalette(false);
      setDragOverIndex(null);
      return;
    }
    
    // Reordering within canvas
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderBlocks(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const paletteData = e.dataTransfer.getData("application/json");
    if (paletteData) {
      try {
        const block = JSON.parse(paletteData) as Block;
        onAddBlock(block);
      } catch (err) {
        console.error("Failed to parse block data", err);
      }
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDraggingFromPalette(false);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDraggingFromPalette(false);
  };

  const toggleCollapse = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(instanceId)) {
        next.delete(instanceId);
      } else {
        next.add(instanceId);
      }
      return next;
    });
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

  const getBlockNumber = (index: number) => index + 1;

  return (
    <main 
      ref={canvasRef}
      className={cn(
        "flex-1 p-6 overflow-y-auto bg-gradient-surface transition-colors",
        isDraggingFromPalette && "bg-primary/5 ring-2 ring-inset ring-primary/20"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes("application/json")) {
          setIsDraggingFromPalette(true);
        }
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleCanvasDrop}
    >
      <div className="max-w-2xl mx-auto">
        {workflow.length === 0 ? (
          <div className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center transition-all",
            isDraggingFromPalette 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-border/60"
          )}>
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <GripVertical className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {isDraggingFromPalette ? "Drop block here" : "Start Building"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {isDraggingFromPalette 
                ? "Release to add this block to your workflow"
                : "Drag blocks from the palette or click to add them to your workflow"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {workflow.map((block, index) => {
              const Icon = getIcon(block.icon);
              const configSummary = getConfigSummary(block);
              const isCollapsed = collapsedBlocks.has(block.instanceId);
              const isSelected = selectedBlockId === block.instanceId;
              const isDragging = draggedIndex === index;

              return (
                <div
                  key={block.instanceId}
                  className={cn(
                    "animate-fade-in transition-all duration-200",
                    isDragging && "opacity-40 scale-95"
                  )}
                >
                  {/* Connector */}
                  {index > 0 && (
                    <div className="flex justify-center py-1">
                      <div
                        className={cn(
                          "w-0.5 h-5 rounded-full transition-all",
                          dragOverIndex === index ? "bg-primary h-8" : "bg-border/80"
                        )}
                      />
                    </div>
                  )}

                  {/* Drop zone indicator */}
                  {dragOverIndex === index && (draggedIndex !== null || isDraggingFromPalette) && (
                    <div className="h-1.5 bg-primary rounded-full mb-2 animate-pulse shadow-lg shadow-primary/30" />
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
                      "relative rounded-xl border-2 bg-card transition-all cursor-pointer group overflow-hidden",
                      isSelected
                        ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                        : "border-border/60 hover:border-border hover:shadow-md"
                    )}
                  >
                    {/* Block header */}
                    <div className="flex items-center gap-3 p-4">
                      <div className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <Badge variant="outline" className="text-xs font-mono px-1.5 py-0 h-5">
                        {getBlockNumber(index)}
                      </Badge>

                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          categoryColors[block.category]
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{block.label}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                            {block.category}
                          </Badge>
                        </div>
                        {configSummary && !isCollapsed && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {configSummary}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => toggleCollapse(block.instanceId, e)}
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectBlock(block.instanceId)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            {onDuplicateBlock && (
                              <DropdownMenuItem onClick={() => onDuplicateBlock(block.instanceId)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onRemoveBlock(block.instanceId)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Expanded config summary */}
                    {!isCollapsed && configSummary && (
                      <div className="px-4 pb-3 pt-0">
                        <div className="pl-[72px] border-l-2 border-border/40 ml-6">
                          <div className="bg-muted/50 rounded-lg px-3 py-2">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground/80">Configuration: </span>
                              {configSummary}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Drop zone at end */}
            {isDraggingFromPalette && (
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-5 rounded-full bg-border/80" />
              </div>
            )}
            {isDraggingFromPalette && (
              <div 
                className="border-2 border-dashed border-primary/50 rounded-xl p-8 text-center bg-primary/5"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCanvasDrop}
              >
                <p className="text-sm text-primary font-medium">Drop here to add at the end</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
