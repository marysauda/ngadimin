'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Product, SiteSettings } from '@/lib/supabase'

export default function PublicHomePage() {
  // Slider hero images
  const heroSlides = [
    'https://rzqwtrmqxpequanpedjb.supabase.co/storage/v1/object/public/products/1755618863147-keripik-pisang-aneka-rasa.png',
    'https://rzqwtrmqxpequanpedjb.supabase.co/storage/v1/object/public/products/1755619127679-sale-pisang.png',
    'https://rzqwtrmqxpequanpedjb.supabase.co/storage/v1/object/public/products/1755619387847-bolen-pisang.png',
    'https://rzqwtrmqxpequanpedjb.supabase.co/storage/v1/object/public/products/1755619857618-eggroll-jagung.png',
    'https://rzqwtrmqxpequanpedjb.supabase.co/storage/v1/object/public/products/1755620067062-puding-jagung.png',
  ];
  const [slideIdx, setSlideIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Auto slide
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideIdx((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [slideIdx]);

  const prevSlide = () => setSlideIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setSlideIdx((prev) => (prev + 1) % heroSlides.length);
  const [products, setProducts] = useState<Product[]>([])
  const [siteSettings, setSiteSettings] = useState<Record<string, SiteSettings>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch site settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')

      setProducts(productsData || [])
      
      // Convert settings array to object by section
      const settingsObj: Record<string, SiteSettings> = {}
      settingsData?.forEach(setting => {
        settingsObj[setting.section] = setting
      })
      setSiteSettings(settingsObj)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateWhatsAppLink = (product: Product) => {
    const whatsappNumber = siteSettings.contact?.whatsapp_number || '6281234567890'
    const message = `Halo! Saya tertarik dengan produk *${product.name}*%0A%0AHarga: Rp${product.price.toLocaleString('id-ID')}%0A%0ABisakah saya mendapat informasi lebih lanjut?`
    return `https://wa.me/${whatsappNumber}?text=${message}`
  }

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '15px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>Memuat...</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Mohon tunggu sebentar</p>
        </div>
      </div>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '15px', 
          textAlign: 'center', 
          maxWidth: '600px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛠️</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>Website Setup Required</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#666', lineHeight: '1.6' }}>
            Database belum dikonfigurasi. Silakan setup Supabase terlebih dahulu.
          </p>
          <a 
            href="/admin" 
            style={{ 
              background: '#007bff', 
              color: 'white', 
              padding: '15px 30px', 
              textDecoration: 'none', 
              borderRadius: '10px',
              display: 'inline-block',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0056b3';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#007bff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Buka Panel Admin
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#2c3e50',
      background: '#ffffff'
    }}>
      {/* Hero Section - Enhanced Visual Hierarchy */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, rgba(52, 152, 219, 0.95) 0%, rgba(155, 89, 182, 0.95) 100%), url('https://rzqwtrmqxpequanpedjb.supabase.co/storage/v1/object/public/products/bg-1.jpg') center/cover no-repeat`,
          color: 'white',
          padding: '6rem 2rem',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            gap: '4rem',
            width: '100%',
            maxWidth: '1200px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Kolom Kiri: Judul, Deskripsi, Tombol */}
          <div
            style={{
              flex: '1 1 400px',
              minWidth: '350px',
              textAlign: 'left',
              padding: '0 1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                marginBottom: '2rem',
                fontWeight: '800',
                lineHeight: 1.1,
                color: 'white',
                textShadow: '0 6px 20px rgba(0,0,0,0.4)',
                letterSpacing: '-0.02em',
                fontFamily: 'Roboto, Arial, sans-serif'
              }}
            >
              {siteSettings.hero?.title || 'Selamat Datang di Toko Kami'}
            </h1>
            <p
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)',
                marginBottom: '3rem',
                opacity: 0.98,
                lineHeight: 1.7,
                color: 'white',
                textShadow: '0 3px 12px rgba(0,0,0,0.3)',
                fontWeight: '300',
                maxWidth: '600px'
              }}
            >
              {siteSettings.hero?.content || 'Temukan produk berkualitas dengan layanan terbaik'}
            </p>
            <a
              href="#products"
              style={{
                background: 'white',
                color: '#2c3e50',
                padding: '20px 40px',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '1.3rem',
                display: 'inline-block',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                border: '3px solid white',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ecf0f1';
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.35)';
                e.currentTarget.style.color = '#34495e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
                e.currentTarget.style.color = '#2c3e50';
              }}
            >
              Lihat Produk Kami
            </a>
          </div>

          {/* Kolom Kanan: Slider Gambar */}
          <div
            style={{
              flex: '1 1 400px',
              minWidth: '350px',
              textAlign: 'center',
              padding: '0 1rem',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', width: '100%', minHeight: '350px' }}>
              <img
                src={heroSlides[slideIdx]}
                alt={`Slide ${slideIdx + 1}`}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '350px',
                  objectFit: 'contain',
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                  background: 'white',
                  margin: '0 auto',
                  transition: 'all 0.5s ease',
                }}
              />
              {/* Tombol panah - Enhanced */}
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
                aria-label="Sebelumnya"
              >&#8592;</button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
                aria-label="Berikutnya"
              >&#8594;</button>
              {/* Indikator bulat - Enhanced */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIdx(idx)}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: idx === slideIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section - Enhanced Visual Hierarchy */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', 
            marginBottom: '4rem', 
            color: '#2c3e50',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            position: 'relative'
          }}>
            {siteSettings.advantages?.title || 'Mengapa Memilih Kami?'}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #3498db, #9b59b6)',
              borderRadius: '2px'
            }}></div>
          </h2>
                      <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '3rem' 
            }}>
              <div style={{ 
                padding: '3rem 2rem', 
                background: 'white', 
                borderRadius: '20px', 
                boxShadow: '0 12px 35px rgba(0,0,0,0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #e9ecef',
                position: 'relative',
                overflow: 'hidden'
              }}
                          onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ 
                fontSize: '4.5rem', 
                marginBottom: '2rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>🚀</div>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                color: '#2c3e50', 
                fontSize: '1.5rem', 
                fontWeight: '700',
                letterSpacing: '-0.01em'
              }}>Pengiriman Cepat</h3>
              <p style={{ 
                color: '#7f8c8d', 
                fontSize: '1.15rem', 
                lineHeight: '1.7',
                fontWeight: '400'
              }}>Pengiriman cepat dan terpercaya hingga ke tangan Anda</p>
            </div>
            <div style={{ 
              padding: '2.5rem', 
              background: 'white', 
              borderRadius: '15px', 
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⭐</div>
              <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.4rem', fontWeight: 'bold' }}>Produk Berkualitas</h3>
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>Hanya produk berkualitas terbaik untuk pelanggan kami</p>
            </div>
            <div style={{ 
              padding: '2.5rem', 
              background: 'white', 
              borderRadius: '15px', 
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💬</div>
              <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.4rem', fontWeight: 'bold' }}>Layanan 24/7</h3>
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>Selalu siap membantu Anda melalui WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Enhanced Visual Hierarchy */}
      <section id="products" style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', 
            textAlign: 'center', 
            marginBottom: '4rem', 
            color: '#2c3e50',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            position: 'relative'
          }}>
            Produk Olahan Hasil Pertanian
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #3498db, #9b59b6)',
              borderRadius: '2px'
            }}></div>
          </h2>
          
          {/* Search and Filter Section - Enhanced */}
          <div style={{ 
            marginBottom: '4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {/* Search Bar */}
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <input
                type="text"
                placeholder="🔍 Cari produk yang Anda inginkan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 25px',
                  border: '3px solid #e9ecef',
                  borderRadius: '30px',
                  fontSize: '1.2rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            </div>
            
            {/* Category Filter - Enhanced */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              maxWidth: '800px'
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '12px 24px',
                    border: selectedCategory === category ? '3px solid #3498db' : '3px solid #e9ecef',
                    borderRadius: '25px',
                    background: selectedCategory === category ? 'linear-gradient(135deg, #3498db, #2980b9)' : 'white',
                    color: selectedCategory === category ? 'white' : '#2c3e50',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: selectedCategory === category ? '700' : '500',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: selectedCategory === category ? '0 6px 20px rgba(52, 152, 219, 0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
                    transform: selectedCategory === category ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                    }
                  }}
                >
                  {category === 'all' ? 'Semua Produk' : category}
                </button>
              ))}
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {searchTerm || selectedCategory !== 'all' ? 'Produk tidak ditemukan' : 'Belum ada produk tersedia'}
              </h3>
              <p style={{ fontSize: '1.1rem' }}>
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Coba ubah kata kunci pencarian atau pilih kategori lain' 
                  : 'Nantikan produk-produk menarik kami!'}
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '2.5rem' 
            }}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e9ecef'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
                }}
                >
                  {product.images && product.images.length > 0 && (
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '280px', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ 
                      marginBottom: '0.8rem', 
                      color: '#333', 
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      lineHeight: '1.3'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      marginBottom: '1.2rem', 
                      lineHeight: '1.6',
                      fontSize: '1.1rem'
                    }}>
                      {product.description}
                    </p>
                    <p style={{ 
                      color: '#28a745', 
                      fontWeight: 'bold', 
                      fontSize: '1.6rem', 
                      marginBottom: '1rem' 
                    }}>
                      Rp. {product.price.toLocaleString('id-ID')}
                    </p>
                    <p style={{ 
                      color: '#6c757d', 
                      fontSize: '1rem', 
                      marginBottom: '1.5rem',
                      fontWeight: '500'
                    }}>
                      Kategori: {product.category}
                    </p>
                    
                    <a
                      href={generateWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#25D366',
                        color: 'white',
                        padding: '15px 30px',
                        textDecoration: 'none',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#128C7E'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#25D366'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <span>📱</span>
                      Beli Sekarang
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section - Enhanced Visual Hierarchy */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h2 style={{ 
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', 
            marginBottom: '2.5rem', 
            color: 'white',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            Ayo Dukung Petani Indonesia
          </h2>
          <p style={{ 
            fontSize: '1.4rem', 
            marginBottom: '3rem', 
            color: 'white',
            opacity: 0.98,
            lineHeight: '1.7',
            fontWeight: '300',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            Segera hubungi kami melalui WhatsApp untuk informasi lebih lanjut
          </p>
          <a
            href={`https://wa.me/${siteSettings.contact?.whatsapp_number || '6281234567890'}?text=Halo! Saya butuh informasi lebih lanjut tentang produk Anda.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366',
              color: 'white',
              padding: '18px 36px',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              border: '2px solid #25D366'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#128C7E';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#25D366';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            }}
          >
            <span>📱</span>
            Chat di WhatsApp
          </a>
        </div>
      </section>

      {/* Footer - Enhanced Visual Hierarchy */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', 
        color: 'white', 
        padding: '5rem 2rem 3rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ 
            marginBottom: '2rem',
            fontSize: '2rem',
            fontWeight: '700',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            {siteSettings.footer?.title || 'Toko Kami'}
          </h3>
          <p style={{ 
            marginBottom: '2.5rem', 
            opacity: 0.9,
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            {siteSettings.footer?.content || 'Mitra terpercaya Anda untuk produk berkualitas'}
          </p>
          <div style={{ 
            borderTop: '1px solid #34495e', 
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ opacity: 0.7, fontSize: '1rem' }}>
              © 2025 - Semua hak dilindungi
            </p>
            <a 
              href="/admin" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none',
                opacity: 0.6,
                fontSize: '1rem',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
              }}
            >
              Panel Admin
            </a>
          </div>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 3rem 1rem !important;
          }
          
          h1, h2 {
            font-size: 2rem !important;
          }
          
          .hero-content {
            flex-direction: column !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          
          .hero-content > div {
            text-align: center !important;
            align-items: center !important;
          }
          
          .search-filter {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .category-buttons {
            justify-content: center !important;
          }
        }
        
        @media (max-width: 480px) {
          section {
            padding: 2rem 1rem !important;
          }
          
          h1 {
            font-size: 1.8rem !important;
          }
          
          h2 {
            font-size: 1.6rem !important;
          }
          
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
