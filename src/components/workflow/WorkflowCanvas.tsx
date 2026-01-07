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
  const [mousePos, setMousePos] = useState<Position | null>(null);
  
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

  // Global mouse up to cancel connection
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (connectingFrom) {
        setConnectingFrom(null);
        setMousePos(null);
      }
      setIsPanning(false);
      setDraggingBlock(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConnectingFrom(null);
        setMousePos(null);
        onSelectBlock(null);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [connectingFrom, onSelectBlock]);

  // Pan handling
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-grid")) {
      onSelectBlock(null);
      // Cancel any active connection
      setConnectingFrom(null);
      setMousePos(null);
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
      // Track mouse position for temp connection line
      setMousePos(screenToCanvas(e.clientX, e.clientY));
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    setDraggingBlock(null);
    // Don't cancel connection here - let port click handle it
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

  // Connection handling - start from output port
  const handleOutputPortMouseDown = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setConnectingFrom(blockId);
    setMousePos(screenToCanvas(e.clientX, e.clientY));
  };

  // Complete connection on input port
  const handleInputPortMouseUp = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (connectingFrom && connectingFrom !== blockId) {
      // Check if connection already exists
      const existingConnection = connections.find(
        c => c.sourceId === connectingFrom && c.targetId === blockId
      );
      if (!existingConnection) {
        onAddConnection(connectingFrom, blockId);
      }
    }
    setConnectingFrom(null);
    setMousePos(null);
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
        {connectingFrom && (
          <Badge variant="secondary" className="text-xs">
            Connecting... (ESC to cancel)
          </Badge>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn(
          "flex-1 overflow-hidden relative",
          isPanning ? "cursor-grabbing" : connectingFrom ? "cursor-crosshair" : "cursor-default",
          isDraggingFromPalette && "ring-2 ring-inset ring-primary/30 bg-primary/5"
        )}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
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
            className="absolute overflow-visible pointer-events-none"
            style={{ 
              width: "4000px", 
              height: "4000px",
              left: "-2000px",
              top: "-2000px",
            }}
          >
            <g style={{ transform: "translate(2000px, 2000px)" }}>
              {/* Existing connections */}
              {connections.map((conn) => {
                const source = workflow.find(b => b.instanceId === conn.sourceId);
                const target = workflow.find(b => b.instanceId === conn.targetId);
                if (!source || !target) return null;

                const start = getBlockCenter(source, true);
                const end = getBlockCenter(target, false);
                
                const dx = end.x - start.x;
                const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);
                const path = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;

                return (
                  <g key={conn.id}>
                    {/* Visible connection line */}
                    <path
                      d={path}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      className="transition-colors"
                    />
                    {/* Invisible wider path for easier clicking */}
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      style={{ pointerEvents: "stroke", cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveConnection(conn.id);
                      }}
                    />
                    {/* Arrow head */}
                    <circle
                      cx={end.x - 5}
                      cy={end.y}
                      r={5}
                      fill="hsl(var(--primary))"
                    />
                  </g>
                );
              })}
              
              {/* Temporary connection while dragging */}
              {connectingFrom && mousePos && (() => {
                const source = workflow.find(b => b.instanceId === connectingFrom);
                if (!source) return null;

                const start = getBlockCenter(source, true);
                const dx = mousePos.x - start.x;
                const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);
                const path = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${mousePos.x - controlOffset} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`;

                return (
                  <path
                    d={path}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    strokeDasharray="8,4"
                    opacity={0.7}
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
            const isConnectingTarget = connectingFrom && connectingFrom !== block.instanceId && hasInputs;

            return (
              <div
                key={block.instanceId}
                className={cn(
                  "absolute w-[200px] rounded-xl border-2 bg-card shadow-lg transition-all select-none",
                  isSelected
                    ? "border-primary shadow-xl ring-2 ring-primary/20"
                    : "border-border/60 hover:border-border",
                  isDragging && "shadow-2xl opacity-90",
                  isConnectingTarget && "ring-2 ring-primary/40"
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
                      "absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-card flex items-center justify-center transition-all z-10",
                      isConnectingTarget
                        ? "border-primary bg-primary/20 scale-125 cursor-crosshair"
                        : "border-border hover:border-primary hover:bg-primary/10 cursor-crosshair"
                    )}
                    onMouseUp={(e) => handleInputPortMouseUp(e, block.instanceId)}
                  >
                    <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                  </div>
                )}

                {/* Output port */}
                {hasOutputs && (
                  <div
                    className={cn(
                      "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-card flex items-center justify-center cursor-crosshair transition-all z-10",
                      connectingFrom === block.instanceId
                        ? "border-primary bg-primary scale-125"
                        : "border-border hover:border-primary hover:bg-primary/10"
                    )}
                    onMouseDown={(e) => handleOutputPortMouseDown(e, block.instanceId)}
                  >
                    <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                  </div>
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
                          className="w-6 h-6 opacity-0 group-hover:opacity-100 hover:opacity-100 shrink-0"
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
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {workflow.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Empty Canvas</p>
              <p className="text-sm">Drag blocks from the palette or click to add</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
