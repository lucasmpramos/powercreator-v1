import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { FontProvider } from "@/components/font-provider"
import DashboardPage from "./app/admin/dashboard/page"
import FlowPage from "./app/admin/flow/page"
import AgentsPage from "./app/admin/agents/page"
import PlaygroundPage from "./app/admin/playground/page"
import FormBuilderPage from "./app/admin/form-builder/page"
import UsersPage from "./app/admin/users/page"
import SettingsPage from "./app/admin/settings/page"
import AgentDetailsPage from "./app/admin/agents/[id]/page"
import CategoriesPage from "./app/admin/categories/page"
import TemplatesPage from "./app/admin/templates/page"

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <FontProvider defaultFont="system">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/flow" element={<FlowPage />} />
          <Route path="/admin/form-builder" element={<FormBuilderPage />} />
          <Route path="/admin/agents" element={<AgentsPage />} />
          <Route path="/admin/agents/:id" element={<AgentDetailsPage />} />
          <Route path="/admin/agents/new" element={<AgentDetailsPage />} />
          <Route path="/admin/playground" element={<PlaygroundPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/templates" element={<TemplatesPage />} />
        </Routes>
      </FontProvider>
    </ThemeProvider>
  )
}

export default App
