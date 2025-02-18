import { useState } from "react"
import { MainSidebar } from "./main-sidebar"
import { SecondarySidebar } from "./secondary-sidebar"
import { MainContent } from "./main-content"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ExamplesView } from "@/views/ExampleView"
import { ModelsView } from "@/views/ModelsView"
import { NovelView } from "@/views/NovelView.tsx"
import { ConfigPanel } from '@/components/settings/ConfigPanel';

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const location = useLocation()
  const showSecondarySidebar = location.pathname === "/"

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <MainSidebar isCollapsed={isSidebarCollapsed} />
      {showSecondarySidebar && <SecondarySidebar isCollapsed={isSidebarCollapsed} />}
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
        <Route
          path="/models"
          element={
            <div className="flex-1 overflow-hidden">
              <ModelsView />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/novel" element={<NovelView />} />
        <Route path="/settings" element={<ConfigPanel />} />
      </Routes>
    </div>
  )
}