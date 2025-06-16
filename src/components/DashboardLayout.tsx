'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import DashboardOverview from './DashboardOverview'
import BudgetView from './BudgetView'
import OptimierenView from './OptimierenView'
import SettingsView from './SettingsView'

interface MenuItem {
  id: string
  label: string
  icon: string
  component: React.ReactNode
}

export default function DashboardLayout() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Übersicht',
      icon: '📊',
      component: <DashboardOverview />
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: '💰',
      component: <BudgetView />
    },
    {
      id: 'optimieren',
      label: 'Optimieren',
      icon: '⚡',
      component: <OptimierenView />
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: '⚙️',
      component: <SettingsView />
    }
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const activeComponent = menuItems.find(item => item.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-[#F1F8F4]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#204535] font-heading">
                NullCent
              </h1>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#428766] flex items-center justify-center text-white font-heading">
                  {currentUser?.email?.[0].toUpperCase() || 'U'}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-[#428766] text-white'
                    : 'text-[#204535] hover:bg-[#428766]/10'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Component */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeComponent}
        </div>
      </main>
    </div>
  )
} 