import { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical, Settings, Trash2, MoreHorizontal, Copy, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Block, WorkflowBlock, Connection, Position } from "./types";
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
  connections: Connection[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onRemoveBlock: (id: string) => void;
  onUpdateBlockPosition: (id: string, position: Position) => void;
  onAddBlock: (block: Block, position: Position) => void;
  onAddConnection: (sourceId: string, targetId: string) => void;
  onRemoveConnection: (id: string) => void;
  onDuplicateBlock?: (id: string) => void;
  categoryColors: Record<string, string>;
  getIcon: (iconName: string) => React.ComponentType<{ className?: string }>;
}

const GRID_SIZE = 20;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

export const WorkflowCanvas = ({
  workflow,
  connections,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onUpdateBlockPosition,
  onAddBlock,
  onAddConnection,
  onRemoveConnection,
  onDuplicateBlock,
  categoryColors,
  getIcon,
}: WorkflowCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<Position | null>(null);
  
  const [isDraggingFromPalette, setIsDraggingFromPalette] = useState(false);

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const screenToCanvas = useCallback((screenX: number, screenY: number): Position => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom,
    };
  }, [pan, zoom]);

  // Handle mouse wheel for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * delta)));
      }
    };

    const canvas = canvasRef.current;
    canvas?.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas?.removeEventListener("wheel", handleWheel);
  }, []);

  // Pan handling
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-grid")) {
      onSelectBlock(null);
      setConnectingFrom(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggingBlock) {
      const pos = screenToCanvas(e.clientX, e.clientY);
      onUpdateBlockPosition(draggingBlock, {
        x: snapToGrid(pos.x - dragOffset.x),
        y: snapToGrid(pos.y - dragOffset.y),
      });
    } else if (connectingFrom) {
      setConnectionEnd(screenToCanvas(e.clientX, e.clientY));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingBlock(null);
    if (connectingFrom && !connectionEnd) {
      setConnectingFrom(null);
    }
  };

  // Block dragging
  const handleBlockMouseDown = (e: React.MouseEvent, block: WorkflowBlock) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    
    const pos = screenToCanvas(e.clientX, e.clientY);
    setDragOffset({ x: pos.x - block.position.x, y: pos.y - block.position.y });
    setDraggingBlock(block.instanceId);
    onSelectBlock(block.instanceId);
  };

  // Connection handling
  const handlePortClick = (e: React.MouseEvent, blockId: string, isOutput: boolean) => {
    e.stopPropagation();
    
    if (isOutput) {
      setConnectingFrom(blockId);
      setConnectionEnd(null);
    } else if (connectingFrom && connectingFrom !== blockId) {
      // Complete connection
      const existingConnection = connections.find(
        c => c.targetId === blockId
      );
      if (!existingConnection) {
        onAddConnection(connectingFrom, blockId);
      }
      setConnectingFrom(null);
      setConnectionEnd(null);
    }
  };

  const handlePortMouseUp = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== blockId) {
      const existingConnection = connections.find(c => c.targetId === blockId);
      if (!existingConnection) {
        onAddConnection(connectingFrom, blockId);
      }
      setConnectingFrom(null);
      setConnectionEnd(null);
    }
  };

  // Drop from palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFromPalette(false);
    
    const data = e.dataTransfer.getData("application/json");
    if (data) {
      try {
        const block = JSON.parse(data) as Block;
        const pos = screenToCanvas(e.clientX, e.clientY);
        onAddBlock(block, { x: snapToGrid(pos.x - 80), y: snapToGrid(pos.y - 30) });
      } catch (err) {
        console.error("Failed to parse block", err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("application/json")) {
      setIsDraggingFromPalette(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingFromPalette(false);
  };

  // Get block center for connections
  const getBlockCenter = (block: WorkflowBlock, isOutput: boolean): Position => {
    const width = 200;
    const height = 80;
    return {
      x: block.position.x + (isOutput ? width : 0),
      y: block.position.y + height / 2,
    };
  };

  // Render connection line
  const renderConnection = (conn: Connection) => {
    const source = workflow.find(b => b.instanceId === conn.sourceId);
    const target = workflow.find(b => b.instanceId === conn.targetId);
    if (!source || !target) return null;

    const start = getBlockCenter(source, true);
    const end = getBlockCenter(target, false);
    
    const midX = (start.x + end.x) / 2;
    const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

    return (
      <g key={conn.id}>
        <path
          d={path}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="transition-colors"
        />
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={12}
          className="cursor-pointer"
          onClick={() => onRemoveConnection(conn.id)}
        />
        {/* Arrow */}
        <circle
          cx={end.x - 4}
          cy={end.y}
          r={4}
          fill="hsl(var(--primary))"
        />
      </g>
    );
  };

  // Render temporary connection while dragging
  const renderTempConnection = () => {
    if (!connectingFrom || !connectionEnd) return null;
    
    const source = workflow.find(b => b.instanceId === connectingFrom);
    if (!source) return null;

    const start = getBlockCenter(source, true);
    const midX = (start.x + connectionEnd.x) / 2;
    const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${connectionEnd.y}, ${connectionEnd.x} ${connectionEnd.y}`;

    return (
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeDasharray="5,5"
        className="pointer-events-none"
      />
    );
  };

  const getConfigSummary = (block: WorkflowBlock): string => {
    const config = block.config;
    if (!config) return "";
    const parts: string[] = [];
    if (config.database) parts.push(config.database);
    if (config.table) parts.push(config.table);
    if (config.columns?.length) parts.push(`${config.columns.length} cols`);
    if (config.filterColumn) parts.push(`Filter: ${config.filterColumn}`);
    if (config.joinType) parts.push(`${config.joinType} join`);
    if (config.chartType) parts.push(config.chartType);
    return parts.slice(0, 2).join(" • ");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border/60 bg-card/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(z => Math.min(MAX_ZOOM, z * 1.2))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(z => Math.max(MIN_ZOOM, z * 0.8))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground px-2">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">
          {workflow.length} blocks • {connections.length} connections
        </span>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn(
          "flex-1 overflow-hidden relative cursor-default",
          isPanning && "cursor-grabbing",
          isDraggingFromPalette && "ring-2 ring-inset ring-primary/30 bg-primary/5"
        )}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Grid background */}
        <div
          className="canvas-grid absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Transformed content */}
        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Connections SVG layer */}
          <svg
            className="absolute overflow-visible"
            style={{ 
              width: "4000px", 
              height: "4000px",
              left: "-2000px",
              top: "-2000px",
              pointerEvents: "none",
            }}
          >
            <g style={{ transform: "translate(2000px, 2000px)" }}>
              {connections.map((conn) => {
                const source = workflow.find(b => b.instanceId === conn.sourceId);
                const target = workflow.find(b => b.instanceId === conn.targetId);
                if (!source || !target) return null;

                const start = getBlockCenter(source, true);
                const end = getBlockCenter(target, false);
                
                const midX = (start.x + end.x) / 2;
                const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

                return (
                  <g key={conn.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      className="transition-colors"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      style={{ pointerEvents: "stroke", cursor: "pointer" }}
                      onClick={() => onRemoveConnection(conn.id)}
                    />
                    {/* Arrow */}
                    <circle
                      cx={end.x - 4}
                      cy={end.y}
                      r={4}
                      fill="hsl(var(--primary))"
                    />
                  </g>
                );
              })}
              {connectingFrom && connectionEnd && (() => {
                const source = workflow.find(b => b.instanceId === connectingFrom);
                if (!source) return null;

                const start = getBlockCenter(source, true);
                const midX = (start.x + connectionEnd.x) / 2;
                const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${connectionEnd.y}, ${connectionEnd.x} ${connectionEnd.y}`;

                return (
                  <path
                    d={path}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                  />
                );
              })()}
            </g>
          </svg>

          {/* Blocks */}
          {workflow.map((block) => {
            const Icon = getIcon(block.icon);
            const isSelected = selectedBlockId === block.instanceId;
            const isDragging = draggingBlock === block.instanceId;
            const summary = getConfigSummary(block);
            const hasInputs = block.category !== "data";
            const hasOutputs = block.category !== "visualize";

            return (
              <div
                key={block.instanceId}
                className={cn(
                  "absolute w-[200px] rounded-xl border-2 bg-card shadow-lg transition-shadow select-none",
                  isSelected
                    ? "border-primary shadow-xl ring-2 ring-primary/20"
                    : "border-border/60 hover:border-border",
                  isDragging && "shadow-2xl opacity-90"
                )}
                style={{
                  left: block.position.x,
                  top: block.position.y,
                  cursor: draggingBlock === block.instanceId ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => handleBlockMouseDown(e, block)}
              >
                {/* Input port */}
                {hasInputs && (
                  <div
                    className={cn(
                      "absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 bg-card cursor-crosshair transition-all",
                      connectingFrom
                        ? "border-primary bg-primary/20 scale-125"
                        : "border-border hover:border-primary hover:bg-primary/10"
                    )}
                    onClick={(e) => handlePortClick(e, block.instanceId, false)}
                    onMouseUp={(e) => handlePortMouseUp(e, block.instanceId)}
                  />
                )}

                {/* Output port */}
                {hasOutputs && (
                  <div
                    className={cn(
                      "absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 bg-card cursor-crosshair transition-all",
                      connectingFrom === block.instanceId
                        ? "border-primary bg-primary scale-125"
                        : "border-border hover:border-primary hover:bg-primary/10"
                    )}
                    onClick={(e) => handlePortClick(e, block.instanceId, true)}
                  />
                )}

                {/* Block content */}
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        categoryColors[block.category]
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">
                        {block.label}
                      </div>
                      {summary && (
                        <div className="text-[10px] text-muted-foreground truncate">
                          {summary}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3 h-3" />
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
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute -top-2 left-3">
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 capitalize">
                    {block.category}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {workflow.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "text-center p-8 rounded-2xl border-2 border-dashed transition-all",
              isDraggingFromPalette 
                ? "border-primary bg-primary/10" 
                : "border-border/60"
            )}>
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <GripVertical className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {isDraggingFromPalette ? "Drop here to start" : "Build Your Workflow"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Drag blocks from the palette and connect them to create your data pipeline
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
