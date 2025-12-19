import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Move,
  Image as ImageIcon,
  FileSpreadsheet
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
  ResponsiveContainer 
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface ChartCardProps {
  id: string;
  title: string;
  type: "bar" | "line" | "pie";
  data: any[];
  onDelete?: (id: string) => void;
}

const CHART_COLORS = [
  "hsl(230, 84%, 60%)",
  "hsl(162, 96%, 43%)",
  "hsl(280, 84%, 60%)",
  "hsl(35, 92%, 55%)",
  "hsl(350, 84%, 60%)",
];

export const ChartCard = ({ id, title, type, data, onDelete }: ChartCardProps) => {
  const { toast } = useToast();

  const handleExport = (format: "png" | "csv") => {
    toast({
      title: `Exported as ${format.toUpperCase()}`,
      description: `${title} has been downloaded`,
    });
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }} 
            />
            <Bar dataKey="value" fill="hsl(230, 84%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(162, 96%, 43%)" 
              strokeWidth={2}
              dot={{ fill: "hsl(162, 96%, 43%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }} 
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chart-container group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">{title}</h3>
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

      <ResponsiveContainer width="100%" height={220}>
        {renderChart()}
      </ResponsiveContainer>

      {type === "pie" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
