'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../components/AdminSidebar'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [dbConnected, setDbConnected] = useState(false)
  const [user, setUser] = useState('')
  const router = useRouter()

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem('ngadmin_logged_in')
    const username = localStorage.getItem('ngadmin_user')
    
    if (isLoggedIn !== 'true') {
      router.push('/')
      return
    }

    setUser(username || '')
    checkDatabaseConnection()
  }, [router])



  const handleLogout = () => {
    localStorage.removeItem('ngadmin_logged_in')
    localStorage.removeItem('ngadmin_user')
    router.push('/')
  }

  const checkDatabaseConnection = async () => {
    try {
      await fetchProducts()
      setDbConnected(true)
    } catch (error) {
      console.error('Database connection error:', error)
      setDbConnected(false)
      // Don't set loading to false here, let fetchProducts handle it
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`Failed to fetch products: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('Data is not an array:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Don't throw error, just set empty array and continue
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(files)
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
      
      try {
        const response = await fetch(
          `${SUPABASE_URL}/storage/v1/object/products/${fileName}`,
          {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: file
          }
        )
        
        if (response.ok) {
          const url = `${SUPABASE_URL}/storage/v1/object/public/products/${fileName}`
          uploadedUrls.push(url)
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrls: string[] = []
      
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages)
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: imageUrls
      }

      if (editingProduct) {
        // Update existing product
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${editingProduct.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })

        if (!response.ok) throw new Error('Failed to update product')
      } else {
        // Create new product
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })

        if (!response.ok) throw new Error('Failed to create product')
      }

      // Reset form and refresh products
      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: '', category: '' })
      setSelectedImages([])
      await fetchProducts()

    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category
    })
    setShowForm(true)
  }

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete product')

      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product. Please try again.')
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', category: '' })
    setSelectedImages([])
  }

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
          <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Memuat Produk...</h2>
          <p style={{ color: '#7f8c8d' }}>Mohon tunggu sementara kami memuat data produk</p>
        </div>
      </div>
    )
  }

  if (!dbConnected) {
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Database Connection Error</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>Unable to connect to database. Please check your configuration.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{ 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '10px', 
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Kembali ke Beranda
          </button>
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
            Produk
          </h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }}>
            Kelola produk dan inventori Anda
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
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '15px', 
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowForm(true)}
              style={{ 
                background: 'linear-gradient(135deg, #28a745, #20c997)', 
                color: 'white', 
                border: 'none', 
                padding: '15px 30px', 
                borderRadius: '10px', 
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              ➕ Tambah Produk
            </button>
            
            <button 
              onClick={() => {
                setIsLoading(true)
                fetchProducts()
              }}
              style={{ 
                background: 'linear-gradient(135deg, #007bff, #0056b3)', 
                color: 'white', 
                border: 'none', 
                padding: '15px 30px', 
                borderRadius: '10px', 
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            marginBottom: '1rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  min="0"
                  step="1000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                  Kategori
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                  Gambar Produk
                </label>
                <input
                  type="file"
                  onChange={handleImageSelect}
                  multiple
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                />
                <small style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Pilih satu atau lebih gambar untuk produk ini
                </small>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? '#bdc3c7' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? 'Menyimpan...' : (editingProduct ? 'Update Produk' : 'Tambah Produk')}
                </button>
                
                <button
                  type="button"
                  onClick={cancelForm}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '15px', 
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#2c3e50', margin: 0 }}>Produk ({products.length})</h2>
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #e9ecef',
                  borderTop: '2px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '0.9rem' }}>Memuat...</span>
              </div>
            )}
          </div>
          
          {products.length === 0 ? (
            <div key="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '1.5rem' }}>
                Belum Ada Produk
              </h3>
              <p style={{ color: '#7f8c8d', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Anda belum memiliki produk. Mulai dengan menambahkan produk pertama Anda!
              </p>
              <button 
                onClick={() => setShowForm(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #28a745, #20c997)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '15px 30px', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                ➕ Tambah Produk Pertama
              </button>
            </div>
          ) : (
            <div key={`products-grid-${products.length}`} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem'
            }}>
              {products.map((product) => (
                <div key={product.id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  background: '#f8f9fa',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  {product.images && product.images.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover', 
                          borderRadius: '8px' 
                        }}
                      />
                      {product.images.length > 1 && (
                        <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '5px' }}>
                          +{product.images.length - 1} gambar lainnya
                        </p>
                      )}
                    </div>
                  )}
                  
                  <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.2rem' }}>{product.name}</h3>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '10px', lineHeight: '1.5' }}>
                    {product.description}
                  </p>
                  <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '10px' }}>
                    Rp{product.price.toLocaleString('id-ID')}
                  </p>
                  <p style={{ color: '#6c757d', fontSize: '0.8rem', marginBottom: '15px' }}>
                    Kategori: {product.category}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        background: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e0a800'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffc107'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#c82333'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#dc3545'
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
