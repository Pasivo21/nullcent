'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  Calendar, 
  LineChart, 
  Settings 
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: ReactNode
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Budget', href: '/budget', icon: <Wallet size={20} /> },
  { name: 'Fälligkeiten', href: '/due-dates', icon: <Calendar size={20} /> },
  { name: 'Optimieren', href: '/optimize', icon: <LineChart size={20} /> },
  { name: 'Einstellungen', href: '/settings', icon: <Settings size={20} /> },
]

interface DashboardLayoutProps {
  children: ReactNode
  title: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F1F8F4] font-body">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#6CA98A] text-white md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#6CA98A] transform transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white font-heading">NullCent</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#428766] text-white'
                      : 'text-white/80 hover:bg-[#428766]/20'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-[#1B392D] font-heading">{title}</h1>
            <div className="flex items-center space-x-4">
              {/* Placeholder for user avatar/name */}
              <div className="w-8 h-8 rounded-full bg-[#6CA98A] flex items-center justify-center text-white">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 