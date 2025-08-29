'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { SiteSettings } from '@/lib/supabase'
import AdminSidebar from '../components/AdminSidebar'

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, SiteSettings>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dbConnected, setDbConnected] = useState(false)
  const [user, setUser] = useState('')
  const router = useRouter()

  // Form states for each section
  const [heroData, setHeroData] = useState({
    title: '',
    content: '',
    image_url: ''
  })

  const [advantagesData, setAdvantagesData] = useState({
    title: '',
    content: ''
  })

  const [contactData, setContactData] = useState({
    whatsapp_number: ''
  })

  const [footerData, setFooterData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem('ngadmin_logged_in')
    const username = localStorage.getItem('ngadmin_user')
    
    if (isLoggedIn !== 'true') {
      router.push('/admin')
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
      if (!isSupabaseConfigured()) {
        setDbConnected(false)
        setIsLoading(false)
        return
      }

      await fetchSettings()
      setDbConnected(true)
    } catch (error) {
      console.error('Database connection error:', error)
      setDbConnected(false)
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error

      // Convert array to object by section
      const settingsObj: Record<string, SiteSettings> = {}
      data?.forEach(setting => {
        settingsObj[setting.section] = setting
      })
      setSettings(settingsObj)

      // Populate form data
      if (settingsObj.hero) {
        setHeroData({
          title: settingsObj.hero.title || '',
          content: settingsObj.hero.content || '',
          image_url: settingsObj.hero.image_url || ''
        })
      }

      if (settingsObj.advantages) {
        setAdvantagesData({
          title: settingsObj.advantages.title || '',
          content: settingsObj.advantages.content || ''
        })
      }

      if (settingsObj.contact) {
        setContactData({
          whatsapp_number: settingsObj.contact.whatsapp_number || ''
        })
      }

      if (settingsObj.footer) {
        setFooterData({
          title: settingsObj.footer.title || '',
          content: settingsObj.footer.content || ''
        })
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSubmitting(true)

    try {
      const sections = [
        {
          section: 'hero',
          data: heroData
        },
        {
          section: 'advantages',
          data: advantagesData
        },
        {
          section: 'contact',
          data: contactData
        },
        {
          section: 'footer',
          data: footerData
        }
      ]

      for (const { section, data } of sections) {
        const update = {
          section,
          ...data,
          updated_at: new Date().toISOString()
        }

        if (settings[section]) {
          // Update existing setting
          const { error } = await supabase
            .from('site_settings')
            .update(update)
            .eq('section', section)

          if (error) throw error
        } else {
          // Insert new setting
          const { error } = await supabase
            .from('site_settings')
            .insert(update)

          if (error) throw error
        }
      }

      alert('Pengaturan berhasil disimpan!')
      fetchSettings()

    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error menyimpan pengaturan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
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
          <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Memuat Pengaturan...</h2>
          <p style={{ color: '#7f8c8d' }}>Mohon tunggu sementara kami memuat pengaturan website</p>
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
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Database Setup Required</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>Please setup Supabase database before using settings</p>
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
            Pengaturan Website
          </h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }}>
            Sesuaikan konten dan tampilan website Anda
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
            👀 Lihat Website
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
          display: 'grid', 
          gap: '1rem'
        }}>
          {/* Hero Section Settings */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.5rem' }}>🏠 Hero Section</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>Pengaturan untuk bagian utama website</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                Judul Utama
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                placeholder="Selamat Datang di Website Kami"
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
                value={heroData.content}
                onChange={(e) => setHeroData({...heroData, content: e.target.value})}
                rows={3}
                placeholder="Deskripsi singkat tentang website Anda"
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
                URL Gambar Background
              </label>
              <input
                type="url"
                value={heroData.image_url}
                onChange={(e) => setHeroData({...heroData, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
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
          </div>

          {/* Advantages Section Settings */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.5rem' }}>⭐ Keunggulan</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>Pengaturan untuk bagian keunggulan produk/layanan</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                Judul Section
              </label>
              <input
                type="text"
                value={advantagesData.title}
                onChange={(e) => setAdvantagesData({...advantagesData, title: e.target.value})}
                placeholder="Mengapa Memilih Kami?"
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
                Deskripsi Section
              </label>
              <textarea
                value={advantagesData.content}
                onChange={(e) => setAdvantagesData({...advantagesData, content: e.target.value})}
                rows={3}
                placeholder="Deskripsi singkat tentang keunggulan Anda"
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
          </div>

          {/* Contact Settings */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.5rem' }}>📱 WhatsApp Contact</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>Nomor WhatsApp untuk kontak pelanggan</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={contactData.whatsapp_number}
                onChange={(e) => setContactData({...contactData, whatsapp_number: e.target.value})}
                placeholder="6281234567890 (dengan kode negara, tanpa +)"
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
              <small style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                Format: 6281234567890 (Indonesia) atau 60123456789 (Malaysia)
              </small>
            </div>
          </div>

          {/* Footer Settings */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.5rem' }}>📄 Footer Section</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>Informasi footer di bagian bawah website</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
                Judul Footer
              </label>
              <input
                type="text"
                value={footerData.title}
                onChange={(e) => setFooterData({...footerData, title: e.target.value})}
                placeholder="Toko Kami"
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
                Deskripsi Footer
              </label>
              <textarea
                value={footerData.content}
                onChange={(e) => setFooterData({...footerData, content: e.target.value})}
                rows={3}
                placeholder="Mitra terpercaya Anda untuk produk berkualitas"
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
          </div>

          {/* Save Button */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <button
              onClick={saveSettings}
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#bdc3c7' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {isSubmitting ? 'Menyimpan...' : '💾 Simpan Semua Pengaturan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
