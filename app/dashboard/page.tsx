'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../components/AdminSidebar'

// Supabase configuration
const SUPABASE_URL = 'https://rzqwtrmqxpequanpedjb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6cXd0cm1xeHBlcXVhbnBlZGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Njc5NDQsImV4cCI6MjA3MDM0Mzk0NH0.oWY4uwMP9KCBv2uv74glSF6XYmxXaq5NvfKPaaql7Hg'

// Product interface
interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  images: string[]
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ngadmin_logged_in')
    const username = localStorage.getItem('ngadmin_user')

    if (isLoggedIn !== 'true') {
      router.push('/')
      return
    }

    setUser(username || '')
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setProducts(data)
        setTotalProducts(data.length)
        
        // Calculate unique categories
        const uniqueCategories = new Set(data.map(product => product.category))
        setTotalCategories(uniqueCategories.size)
      } else {
        setProducts([])
        setTotalProducts(0)
        setTotalCategories(0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setTotalProducts(0)
      setTotalCategories(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('ngadmin_logged_in')
    localStorage.removeItem('ngadmin_user')
    router.push('/')
  }

  const statsCards = [
    { 
      title: 'Total Produk', 
      value: totalProducts.toString(), 
      icon: '📦', 
      color: '#3498db', 
      change: '+12% dari bulan lalu',
      description: 'Jumlah produk yang tersedia'
    },
    { 
      title: 'Total Kategori', 
      value: totalCategories.toString(), 
      icon: '🏷️', 
      color: '#2ecc71', 
      change: '+8% dari bulan lalu',
      description: 'Jumlah kategori produk'
    }
  ]

  const quickActions = [
    { id: 'products', label: 'Produk', icon: '📦', path: '/products' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️', path: '/settings' }
  ]

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Memuat Beranda...</h2>
          <p style={{ color: '#7f8c8d' }}>Mohon tunggu sementara kami menyiapkan panel admin Anda</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminSidebar user={user} onLogout={handleLogout} />
      
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '280px',
        right: 0,
        zIndex: 999,
        background: 'white',
        padding: '1rem 2rem',
        borderRadius: '0 0 15px 15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '0.5rem',
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
            Beranda
          </h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }}>
            Selamat datang kembali, <strong>{user}</strong>! Berikut adalah ringkasan hari ini.
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
            onClick={handleLogout}
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
      <div style={{ 
        marginLeft: '280px', 
        marginTop: '130px',
        padding: '0 2rem 0.25rem',
        background: '#f8f9fa',
        fontFamily: 'Roboto, Arial, sans-serif'
      }}>
        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          {statsCards.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${stat.color}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)'
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: '#7f8c8d',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    {stat.title}
                  </p>
                  <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#2c3e50',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </h2>
                  <p style={{
                    color: stat.color,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.change}
                  </p>
                  <p style={{
                    color: '#7f8c8d',
                    fontSize: '0.8rem'
                  }}>
                    {stat.description}
                  </p>
                </div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1.5rem',
            fontSize: '1.5rem'
          }}>
            Aksi Cepat
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.path)}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{
              color: '#2c3e50',
              marginBottom: '1.5rem',
              fontSize: '1.5rem'
            }}>
              Produk Terbaru
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {products.slice(0, 4).map((product) => (
                <div key={product.id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  padding: '1rem',
                  background: '#f8f9fa',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  {product.images && product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      style={{ 
                        width: '100%', 
                        height: '120px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        marginBottom: '0.5rem'
                      }}
                    />
                  )}
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#2c3e50', 
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    color: '#28a745', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                    marginBottom: '0.25rem'
                  }}>
                    Rp{product.price.toLocaleString('id-ID')}
                  </p>
                  <p style={{ 
                    color: '#6c757d', 
                    fontSize: '0.8rem',
                    margin: 0
                  }}>
                    {product.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
