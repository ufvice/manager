import { useState } from "react"
import { MainSidebar } from "./main-sidebar"
import { SecondarySidebar } from "./secondary-sidebar"
import { MainContent } from "./main-content"
import { Routes, Route, Navigate } from "react-router-dom"
import { ExamplesView } from "../examples/examples-view"

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <MainSidebar isCollapsed={isSidebarCollapsed} />
      <SecondarySidebar isCollapsed={isSidebarCollapsed} />
      <Routes>
        <Route
          path="/"
          element={
            <MainContent
              isSidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          }
        />
        <Route
          path="/examples"
          element={
            <ExamplesView
              onBack={() => setIsSidebarCollapsed(false)}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}