import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardPage from "./app/admin/dashboard/page"
import FlowPage from "./app/admin/flow/page"
import FormsPage from "./app/admin/forms/page"
import AgentsPage from "./app/admin/agents/page"

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/flow" element={<FlowPage />} />
        <Route path="/admin/forms" element={<FormsPage />} />
        <Route path="/admin/agents" element={<AgentsPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
