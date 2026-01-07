import { Plus, GripVertical, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Block } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface BlockPaletteProps {
  blocks: Block[];
  onAddBlock: (block: Block) => void;
  categoryColors: Record<string, string>;
  getIcon: (iconName: string) => React.ComponentType<{ className?: string }>;
}

export const BlockPalette = ({
  blocks,
  onAddBlock,
  categoryColors,
  getIcon,
}: BlockPaletteProps) => {
  // Only show database block for data sources
  const databaseBlock = blocks.find((b) => b.type === "database");
  const transformBlocks = blocks.filter((b) => b.category === "transform");

  const handleDragStart = (e: React.DragEvent, block: Block) => {
    e.dataTransfer.setData("application/json", JSON.stringify(block));
    e.dataTransfer.effectAllowed = "copy";
    
    // Create a custom drag image
    const dragEl = e.currentTarget.cloneNode(true) as HTMLElement;
    dragEl.style.position = "absolute";
    dragEl.style.top = "-1000px";
    dragEl.style.opacity = "0.9";
    dragEl.style.transform = "scale(1.05)";
    document.body.appendChild(dragEl);
    e.dataTransfer.setDragImage(dragEl, 50, 20);
    
    setTimeout(() => dragEl.remove(), 0);
  };

  const blockDescriptions: Record<string, string> = {
    database: "Add a database source with table and column selection",
    filter: "Filter rows based on conditions",
    sort: "Sort data by column values",
    group: "Group and aggregate data",
    join: "Join with another data source",
    pivot: "Pivot table transformation",
    formula: "Add calculated columns",
    limit: "Limit number of rows",
    distinct: "Remove duplicate rows",
    date: "Date/time operations",
    calculate: "Apply aggregate functions",
  };

  const renderBlock = (block: Block, colorClass: string, category: string) => {
    const Icon = getIcon(block.icon);
    const description = blockDescriptions[block.type] || block.label;
    
    return (
      <TooltipProvider key={block.id} delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              onClick={() => onAddBlock(block)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all border group",
                "cursor-grab active:cursor-grabbing",
                colorClass,
                "hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5",
                "active:scale-[0.98] active:shadow-sm"
              )}
            >
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center",
                category === "data" && "bg-blue-500/20",
                category === "transform" && "bg-amber-500/20",
                category === "visualize" && "bg-emerald-500/20"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left font-medium">{block.label}</span>
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:rotate-90" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="font-medium">{block.label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Click or drag to add</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside className="w-64 border-r border-border/60 bg-card/50 flex flex-col shrink-0">
      <div className="p-3 border-b border-border/60">
        <h2 className="font-semibold text-foreground">Blocks</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Drag or click to add</p>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-5">
        {/* Data Source - Only Database */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Data Source
            </h3>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              1
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {databaseBlock && renderBlock(databaseBlock, categoryColors.data, "data")}
          </div>
          <p className="text-xs text-muted-foreground px-1 py-1.5 bg-muted/30 rounded-md">
            Select database → table → columns in block settings
          </p>
        </div>

        {/* Transformations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Transformations
            </h3>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {transformBlocks.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {transformBlocks.map((block) => renderBlock(block, categoryColors.transform, "transform"))}
          </div>
        </div>
      </div>
    </aside>
  );
};
