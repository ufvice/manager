import { useState } from "react"
import { MainSidebar } from "./main-sidebar"
import { SecondarySidebar } from "./secondary-sidebar"
import { MainContent } from "./main-content"
import { Routes, Route, Navigate } from "react-router-dom"
import { ExamplesView } from "../../views/ExampleView"

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
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