import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./components/auth/AuthPage";
import { DataSourcePage } from "./components/data-source/DataSourcePage";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { DatabasesPage } from "./pages/DatabasesPage";
import { CreateDatabasePage } from "./pages/CreateDatabasePage";
import { DatabaseDetailPage } from "./pages/DatabaseDetailPage";
import { InsightsPage } from "./pages/InsightsPage";
import { CreateInsightPage } from "./pages/CreateInsightPage";
import { WorkflowBuilderPage } from "./pages/WorkflowBuilderPage";
import { SQLEditorPage } from "./pages/SQLEditorPage";
import { DashboardsPage } from "./pages/DashboardsPage";
import { DashboardViewPage } from "./pages/DashboardViewPage";
import { AIAgentPage } from "./pages/AIAgentPage";
import { SettingsPage } from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/data-source" element={<DataSourcePage />} />
          
          {/* App routes with layout */}
          <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/databases" element={<AppLayout><DatabasesPage /></AppLayout>} />
          <Route path="/databases/new" element={<AppLayout><CreateDatabasePage /></AppLayout>} />
          <Route path="/databases/:id" element={<AppLayout><DatabaseDetailPage /></AppLayout>} />
          <Route path="/insights" element={<AppLayout><InsightsPage /></AppLayout>} />
          <Route path="/insights/new" element={<AppLayout><CreateInsightPage /></AppLayout>} />
          <Route path="/insights/new/workflow" element={<AppLayout><WorkflowBuilderPage /></AppLayout>} />
          <Route path="/insights/new/sql" element={<AppLayout><SQLEditorPage /></AppLayout>} />
          <Route path="/dashboards" element={<AppLayout><DashboardsPage /></AppLayout>} />
          <Route path="/dashboards/:id" element={<AppLayout><DashboardViewPage /></AppLayout>} />
          <Route path="/ai-agent" element={<AppLayout><AIAgentPage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          
          {/* Legacy redirect */}
          <Route path="/dashboard" element={<Navigate to="/dashboards/main" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
