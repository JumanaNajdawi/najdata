import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Block } from "./types";

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
  const dataBlocks = blocks.filter((b) => b.category === "data");
  const transformBlocks = blocks.filter((b) => b.category === "transform");
  const visualizeBlocks = blocks.filter((b) => b.category === "visualize");

  const renderCategory = (
    title: string,
    categoryBlocks: Block[],
    colorClass: string
  ) => (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
        {title}
      </h3>
      <div className="space-y-1">
        {categoryBlocks.map((block) => {
          const Icon = getIcon(block.icon);
          return (
            <button
              key={block.id}
              onClick={() => onAddBlock(block)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border group",
                colorClass,
                "hover:opacity-80 hover:scale-[1.02]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{block.label}</span>
              <Plus className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-60 border-r border-border/60 bg-card/50 p-3 overflow-y-auto shrink-0">
      <div className="space-y-5">
        {renderCategory("Data Sources", dataBlocks, categoryColors.data)}
        {renderCategory("Transformations", transformBlocks, categoryColors.transform)}
        {renderCategory("Visualizations", visualizeBlocks, categoryColors.visualize)}
      </div>
    </aside>
  );
};
