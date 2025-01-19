interface HeaderProps {
  children: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center p-4 border-b border-gray-800">
      {children}
    </header>
  )
}

