import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Trash2,
  GripVertical,
  Maximize2,
  Minimize2,
  Edit3,
  Image as ImageIcon,
  FileSpreadsheet,
  Settings2,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { COLOR_SCHEMES, ChartType } from "@/components/workflow/types";

interface EnhancedChartCardProps {
  id: string;
  title: string;
  type: ChartType;
  data: any[];
  colorScheme?: string;
  showLegend?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<EnhancedChartCardProps>) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

export const EnhancedChartCard = ({
  id,
  title,
  type,
  data,
  colorScheme = "default",
  showLegend = true,
  onDelete,
  onUpdate,
  isDragging,
  dragHandleProps,
  isExpanded,
  onToggleExpand,
}: EnhancedChartCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const colors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;

  const handleExport = (format: "png" | "csv") => {
    toast({
      title: `Exported as ${format.toUpperCase()}`,
      description: `${title} has been downloaded`,
    });
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && onUpdate) {
      onUpdate(id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Data refreshed",
      description: `${title} has been updated`,
    });
  };

  const renderChart = () => {
    const chartHeight = isExpanded ? 400 : 220;

    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors[1]}
                strokeWidth={2}
                dot={{ fill: colors[1], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "donut":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={type === "donut" ? 50 : 0}
                outerRadius={isExpanded ? 120 : 80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ScatterChart>
              <XAxis dataKey="x" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="y" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Scatter data={data} fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RadarChart data={data}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" fontSize={12} />
              <Radar
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case "kpi":
        const kpiValue = data[0]?.value || 0;
        const kpiChange = data[0]?.change || 0;
        return (
          <div className={cn("flex flex-col items-center justify-center", isExpanded ? "h-[400px]" : "h-[220px]")}>
            <div className="text-4xl font-bold text-foreground mb-2">
              {typeof kpiValue === "number" ? kpiValue.toLocaleString() : kpiValue}
            </div>
            {kpiChange !== 0 && (
              <div
                className={cn(
                  "text-sm font-medium",
                  kpiChange > 0 ? "text-secondary" : "text-destructive"
                )}
              >
                {kpiChange > 0 ? "+" : ""}
                {kpiChange}%
              </div>
            )}
          </div>
        );

      case "gauge":
        const gaugeValue = data[0]?.value || 0;
        const percentage = Math.min(100, Math.max(0, gaugeValue));
        return (
          <div className={cn("flex flex-col items-center justify-center", isExpanded ? "h-[400px]" : "h-[220px]")}>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={colors[0]}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 3.52} 352`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-[220px] flex items-center justify-center text-muted-foreground">
            Unsupported chart type: {type}
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "chart-container group relative",
        isDragging && "opacity-50 ring-2 ring-primary",
        isExpanded && "lg:col-span-2"
      )}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pl-6">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveTitle}>
              <Check className="w-4 h-4 text-secondary" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <h3 className="font-medium text-foreground">{title}</h3>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8",
              isRefreshing && "opacity-100"
            )}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>

          {onToggleExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => onToggleExpand(id)}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Title
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings2 className="w-4 h-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("png")}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Legend for pie/donut */}
      {(type === "pie" || type === "donut") && !showLegend && (
        <div className="mt-4 flex flex-wrap gap-2 pl-6">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
