export interface Block {
  id: string;
  type: string;
  label: string;
  icon: string;
  category: "data" | "transform" | "visualize";
  description?: string;
}

export interface WorkflowBlock extends Block {
  instanceId: string;
  config?: BlockConfig;
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
  
  joinTable?: string;
  joinType?: "inner" | "left" | "right" | "full";
  joinOnLeft?: string;
  joinOnRight?: string;
  
  pivotRowColumn?: string;
  pivotColumnColumn?: string;
  pivotValueColumn?: string;
  
  formulaExpression?: string;
  formulaResultColumn?: string;
  
  dateColumn?: string;
  dateOperation?: "extract_year" | "extract_month" | "extract_day" | "date_diff" | "date_add";
  dateUnit?: "days" | "months" | "years";
  
  // Visualize blocks
  chartType?: ChartType;
  xAxis?: string;
  yAxis?: string;
  seriesColumn?: string;
  colorScheme?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showDataLabels?: boolean;
  chartTitle?: string;
  innerRadius?: number;
  outerRadius?: number;
  barRadius?: number;
  lineStrokeWidth?: number;
  areaOpacity?: number;
}

export type ChartType = 
  | "bar" 
  | "line" 
  | "pie" 
  | "area" 
  | "scatter" 
  | "donut" 
  | "gauge" 
  | "kpi" 
  | "heatmap" 
  | "funnel" 
  | "radar";

export interface ChartConfig {
  type: ChartType;
  xAxis?: string;
  yAxis?: string;
  seriesColumn?: string;
  colorScheme: string;
  showLegend: boolean;
  showGrid: boolean;
  showDataLabels: boolean;
  title?: string;
  innerRadius?: number;
  outerRadius?: number;
  barRadius?: number;
  lineStrokeWidth?: number;
  areaOpacity?: number;
}

export const COLOR_SCHEMES = {
  default: [
    "hsl(230, 84%, 60%)",
    "hsl(162, 96%, 43%)",
    "hsl(280, 84%, 60%)",
    "hsl(35, 92%, 55%)",
    "hsl(350, 84%, 60%)",
  ],
  ocean: [
    "hsl(200, 80%, 50%)",
    "hsl(180, 70%, 45%)",
    "hsl(220, 75%, 55%)",
    "hsl(190, 85%, 40%)",
    "hsl(210, 90%, 60%)",
  ],
  sunset: [
    "hsl(25, 90%, 55%)",
    "hsl(45, 95%, 50%)",
    "hsl(5, 85%, 55%)",
    "hsl(35, 88%, 48%)",
    "hsl(15, 92%, 52%)",
  ],
  forest: [
    "hsl(130, 60%, 40%)",
    "hsl(150, 55%, 45%)",
    "hsl(110, 50%, 50%)",
    "hsl(170, 65%, 35%)",
    "hsl(140, 58%, 42%)",
  ],
  monochrome: [
    "hsl(220, 15%, 25%)",
    "hsl(220, 15%, 40%)",
    "hsl(220, 15%, 55%)",
    "hsl(220, 15%, 70%)",
    "hsl(220, 15%, 85%)",
  ],
};
