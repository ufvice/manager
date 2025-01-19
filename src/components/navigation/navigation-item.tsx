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
        "flex flex-col items-center justify-center w-full p-3 rounded-lg",
        "hover:bg-light-accent dark:hover:bg-dark-accent",
        "text-light-text/50 dark:text-dark-text/50",
        "hover:text-light-text dark:hover:text-dark-text",
        isActive && "bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text"
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