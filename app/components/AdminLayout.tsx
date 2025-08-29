'use client'

import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
  user: string
  onLogout: () => void
}

export default function AdminLayout({ children, user, onLogout }: AdminLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminSidebar user={user} onLogout={onLogout} />
      <div style={{ 
        marginLeft: '280px', 
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: 'Roboto, Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0 0 15px 15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Panel Admin
            </h1>
            <p style={{
              color: '#7f8c8d',
              fontSize: '1.1rem'
            }}>
              Selamat datang kembali, <strong>{user}</strong>!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="/"
              target="_blank"
              style={{
                background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(46, 204, 113, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              🌐 Lihat Website
            </a>
            <button 
              onClick={onLogout}
              style={{
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '0 2rem 2rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
