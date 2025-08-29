'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminSidebarProps {
  user: string
  onLogout: () => void
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { id: 'dashboard', label: 'Beranda', icon: '📊', path: '/dashboard' },
    { id: 'products', label: 'Produk', icon: '📦', path: '/products' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️', path: '/settings' }
  ]

  const getActiveMenu = () => {
    if (pathname === '/dashboard') return 'dashboard'
    if (pathname === '/products') return 'products'
    if (pathname === '/settings') return 'settings'
    return 'dashboard'
  }

  const activeMenu = getActiveMenu()

  return (
    <>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: sidebarOpen ? '280px' : '80px',
        background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Logo */}
        <div style={{
          padding: '2rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: sidebarOpen ? 'left' : 'center'
        }}>
          <div style={{
            fontSize: sidebarOpen ? '1.5rem' : '2rem',
            fontWeight: '800',
            color: 'white'
          }}>
            {sidebarOpen ? 'NgAdmin' : '🔐'}
          </div>
          {sidebarOpen && (
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '0.5rem'
            }}>
              Panel Admin
            </p>
          )}
        </div>

        {/* User Info */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: sidebarOpen ? 'left' : 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: sidebarOpen ? '0 0 0.5rem 0' : '0 auto'
          }}>
            <span style={{ fontSize: '1.2rem' }}>👤</span>
          </div>
          {sidebarOpen && (
            <>
              <div style={{ fontWeight: '600', fontSize: '1rem' }}>{user}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Administrator</div>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                router.push(item.path)
              }}
              style={{
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: activeMenu === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: activeMenu === item.id ? '4px solid #667eea' : '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '1.2rem', minWidth: '24px' }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontWeight: activeMenu === item.id ? '600' : '400' }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Toggle Sidebar Button */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '40px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        }}
        >
          <span style={{ fontSize: '1rem' }}>{sidebarOpen ? '◀' : '▶'}</span>
        </div>
      </div>


    </>
  )
}
