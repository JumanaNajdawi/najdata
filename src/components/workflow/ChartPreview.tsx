import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { WorkflowBlock, COLOR_SCHEMES, ChartType } from "./types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ChartPreviewProps {
  workflow: WorkflowBlock[];
  data: any[];
}

const GAUGE_DATA = [
  { name: "value", value: 75 },
  { name: "remaining", value: 25 },
];

export const ChartPreview = ({ workflow, data }: ChartPreviewProps) => {
  const vizBlock = workflow.find((b) => b.category === "visualize");
  if (!vizBlock) return null;

  const config = vizBlock.config || {};
  const chartType: ChartType = config.chartType || vizBlock.type.replace("-chart", "") as ChartType;
  const colorScheme = COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;
  const showLegend = config.showLegend ?? true;
  const showGrid = config.showGrid ?? true;

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Bar
              dataKey="value"
              fill={colorScheme[0]}
              radius={[config.barRadius ?? 4, config.barRadius ?? 4, 0, 0]}
            >
              {config.showDataLabels && (
                <LabelList dataKey="value" position="top" fontSize={11} />
              )}
            </Bar>
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colorScheme[0]}
              strokeWidth={config.lineStrokeWidth ?? 2}
              dot={{ fill: colorScheme[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            >
              {config.showDataLabels && (
                <LabelList dataKey="value" position="top" fontSize={11} />
              )}
            </Line>
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorScheme[0]} stopOpacity={config.areaOpacity ?? 0.3} />
                <stop offset="95%" stopColor={colorScheme[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorScheme[0]}
              strokeWidth={config.lineStrokeWidth ?? 2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        );

      case "pie":
      case "donut":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={chartType === "donut" ? (config.innerRadius ?? 50) : (config.innerRadius ?? 0)}
              outerRadius={config.outerRadius ?? 90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
              ))}
              {config.showDataLabels && (
                <LabelList dataKey="name" position="outside" fontSize={11} />
              )}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="value" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            <Scatter name="Values" data={data} fill={colorScheme[0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        );

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="name" fontSize={11} />
            <PolarRadiusAxis fontSize={10} />
            <Radar
              name="Value"
              dataKey="value"
              stroke={colorScheme[0]}
              fill={colorScheme[0]}
              fillOpacity={0.4}
            />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
          </RadarChart>
        );

      case "funnel":
        return (
          <FunnelChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Funnel dataKey="value" data={data} isAnimationActive>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
              ))}
              <LabelList
                position="center"
                fill="#fff"
                stroke="none"
                dataKey="name"
                fontSize={12}
              />
            </Funnel>
          </FunnelChart>
        );

      case "kpi":
        const currentValue = data[data.length - 1]?.value || 0;
        const previousValue = data[data.length - 2]?.value || currentValue;
        const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
        const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";

        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground mb-1">
              {config.chartTitle || "Total Value"}
            </p>
            <p className="text-4xl font-bold text-foreground mb-2">
              {currentValue.toLocaleString()}
            </p>
            <div className={`flex items-center gap-1 text-sm ${
              trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
            }`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === "down" ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span className="text-muted-foreground">vs previous</span>
            </div>
          </div>
        );

      case "gauge":
        const gaugeValue = data[data.length - 1]?.value || 0;
        const maxValue = Math.max(...data.map((d) => d.value)) * 1.2;
        const percentage = (gaugeValue / maxValue) * 100;

        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-48 h-24 overflow-hidden">
              <div
                className="absolute w-48 h-48 rounded-full border-8 border-muted"
                style={{ top: 0 }}
              />
              <div
                className="absolute w-48 h-48 rounded-full border-8 border-transparent"
                style={{
                  top: 0,
                  borderTopColor: colorScheme[0],
                  borderRightColor: percentage > 25 ? colorScheme[0] : "transparent",
                  borderBottomColor: percentage > 50 ? colorScheme[0] : "transparent",
                  borderLeftColor: percentage > 75 ? colorScheme[0] : "transparent",
                  transform: `rotate(${-90 + (percentage * 1.8)}deg)`,
                  transition: "transform 0.5s ease-out",
                }}
              />
              <div className="absolute inset-0 flex items-end justify-center pb-2">
                <span className="text-2xl font-bold">{gaugeValue.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {config.chartTitle || "Progress"}
            </p>
          </div>
        );

      default:
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill={colorScheme[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  if (chartType === "kpi" || chartType === "gauge") {
    return (
      <div className="h-[280px] w-full">
        {renderChart()}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      {renderChart()}
    </ResponsiveContainer>
  );
};
