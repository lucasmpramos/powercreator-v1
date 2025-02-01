import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "./app/dashboard/page"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App
