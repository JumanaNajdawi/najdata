export interface Block {
  id: string;
  type: string;
  label: string;
  icon: string;
  category: "data" | "transform" | "visualize";
  description?: string;
  inputs?: number;
  outputs?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePort?: number;
  targetPort?: number;
}

export interface WorkflowBlock extends Block {
  instanceId: string;
  config?: BlockConfig;
  position: Position;
}

export interface BlockConfig {
  // Data blocks
  database?: string;
  table?: string;
  columns?: string[];
  
  // Transform blocks
  filterColumn?: string;
  filterOperator?: "equals" | "contains" | "greater" | "less" | "between";
  filterValue?: string;
  filterValue2?: string;
  
  groupByColumns?: string[];
  aggregateFunction?: "SUM" | "AVG" | "COUNT" | "MIN" | "MAX";
  aggregateColumn?: string;
  
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  
  limitRows?: number;
  
  // Join config
  joinType?: "inner" | "left" | "right" | "full";
  joinTable?: string;
  joinLeftColumn?: string;
  joinRightColumn?: string;
  joinOnLeft?: string;
  joinOnRight?: string;
  
  // Pivot config
  pivotRowColumn?: string;
  pivotColumnColumn?: string;
  pivotValueColumn?: string;
  
  // Formula config
  formulaExpression?: string;
  formulaOutputColumn?: string;
  formulaResultColumn?: string;
  
  // Date config
  dateColumn?: string;
  dateOperation?: "extract" | "format" | "diff";
  datePart?: "year" | "month" | "day" | "quarter" | "week";
  
  // Visualization blocks
  chartType?: ChartType;
  xAxis?: string;
  yAxis?: string;
  seriesColumn?: string;
  colorScheme?: string;
  chartTitle?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  showDataLabels?: boolean;
  barRadius?: number;
  lineStrokeWidth?: number;
  areaOpacity?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export type ChartType = 
  | "bar" 
  | "line" 
  | "pie" 
  | "area" 
  | "scatter"
  | "radar"
  | "donut"
  | "funnel"
  | "treemap"
  | "heatmap"
  | "composed"
  | "kpi"
  | "gauge";

export interface ChartConfig {
  type: ChartType;
  xAxis?: string;
  yAxis?: string;
  seriesColumn?: string;
  colorScheme?: string;
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
}

export const COLOR_SCHEMES = {
  default: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"],
  ocean: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#03045e"],
  sunset: ["#ff6b6b", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"],
  forest: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2"],
  monochrome: ["#212529", "#495057", "#6c757d", "#adb5bd", "#dee2e6"],
};

export interface WorkflowState {
  blocks: WorkflowBlock[];
  connections: Connection[];
}
