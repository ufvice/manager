import { TypeIcon as type, LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
}

export function NavigationItem({
  icon: Icon,
  label,
  isActive,
  isCollapsed
}: NavigationItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full p-3 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors",
        isActive && "bg-gray-800 text-white"
      )}
      title={label}
    >
      <Icon className="w-5 h-5" />
      {!isCollapsed && (
        <span className="text-xs mt-1 font-medium">{label}</span>
      )}
    </div>
  );
}