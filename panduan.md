

# Buku Panduan Penggunaan

## Sistem Informasi Pemasaran Produk Olahan Hasil Pertanian

---

## 1. Pendahuluan

Aplikasi ini dibuat untuk membantu pelaku usaha pertanian memasarkan produk olahan secara digital. Dengan sistem informasi ini, pemasaran menjadi lebih mudah, jangkauan pelanggan lebih luas, dan proses transaksi lebih efisien. Digitalisasi pemasaran produk pertanian sangat penting agar usaha tetap relevan di era teknologi, meningkatkan daya saing, dan mempercepat pertumbuhan bisnis.

**Tujuan aplikasi:**
- Memperluas pasar produk olahan hasil pertanian.
- Memudahkan komunikasi antara penjual dan pembeli.
- Menyediakan platform profesional untuk promosi produk.

---

## 2. Fitur Utama Aplikasi

### Fitur untuk Pengunjung
- Hero Section: Banner utama berisi judul, deskripsi, dan tombol navigasi.
- Katalog Produk: Daftar produk lengkap dengan gambar, deskripsi, harga, dan kategori.
- Tombol WhatsApp: Setiap produk dapat langsung dipesan via WhatsApp.
- Keunggulan Produk: Penjelasan kelebihan produk.
- Kontak: Informasi WhatsApp untuk pertanyaan umum.
- Footer: Info toko dan link ke admin.

### Fitur untuk Pengelola/Admin
- Login Admin: Sistem login aman untuk pengelola.
- Dashboard: Ringkasan dan navigasi fitur admin.
- Manajemen Produk: Tambah, edit, hapus produk, upload gambar, atur detail produk.
- Pengaturan Website: Ubah hero, keunggulan, kontak, footer.
- Preview Website: Lihat tampilan website publik dari admin.

---

## 3. Panduan Pengunjung

### Cara Mengakses Website
1. Buka alamat website di browser.
2. Tampilan utama akan langsung menampilkan banner, katalog produk, dan info kontak.

### Navigasi Halaman Utama
- Gunakan tombol di Hero Section untuk langsung ke katalog produk.
- Scroll ke bawah untuk melihat keunggulan, produk, dan kontak.

### Melihat Detail Produk
- Setiap produk menampilkan gambar, nama, deskripsi, harga, dan kategori.
- Klik gambar produk untuk memperbesar (jika tersedia).

### Melakukan Pemesanan via WhatsApp
1. Klik tombol WhatsApp pada produk yang diminati.
2. Anda akan diarahkan ke aplikasi WhatsApp dengan pesan otomatis.
3. Lanjutkan komunikasi dan transaksi dengan penjual.

### FAQ Pengunjung
- **Bagaimana cara memesan produk?** Klik tombol WhatsApp pada produk.
- **Apakah harga sudah termasuk ongkir?** Silakan tanyakan langsung ke penjual via WhatsApp.
- **Bagaimana jika produk habis?** Produk yang habis tidak akan muncul di katalog.

---

## 4. Panduan Pengelola/Admin

### Cara Login & Keamanan
1. Buka `/admin` di browser.
2. Masukkan username dan password admin.
3. Jika berhasil, Anda masuk ke dashboard admin.

### Penjelasan Dashboard
- Dashboard menampilkan ringkasan dan menu navigasi ke fitur utama.

### Manajemen Produk
1. Pilih menu Produk.
2. Tambah produk baru: isi nama, deskripsi, harga, kategori, dan upload gambar.
3. Edit produk: klik produk yang ingin diubah, lakukan perubahan, lalu simpan.
4. Hapus produk: klik tombol hapus pada produk yang diinginkan.

### Pengaturan Website
1. Pilih menu Pengaturan.
2. Ubah judul, deskripsi, gambar hero, keunggulan, kontak WhatsApp, dan footer.
3. Simpan perubahan agar langsung tampil di website publik.

### Preview Website
- Klik tombol Preview untuk melihat tampilan website publik.

### Logout & Keamanan Data
- Setelah selesai, klik Logout untuk keluar dari admin.
- Pastikan password admin tidak dibagikan ke orang lain.

---

## 5. Panduan Pengaturan Database (Supabase)

### Setup Supabase
1. Daftar akun di https://supabase.com dan buat project baru.
2. Buat tabel `products` dan `site_settings` sesuai kebutuhan aplikasi.
3. Salin API Key dan URL Supabase ke environment variable project.

### Struktur Tabel
- **products:** id, name, description, price, category, images, created_at
- **site_settings:** id, section, title, content, image_url, whatsapp_number

### Backup & Restore Data
- Export data dari Supabase secara berkala.
- Untuk restore, import file backup ke tabel yang sesuai.

---

## 6. Panduan Deployment ke Vercel

### Persiapan Akun Vercel
1. Daftar di https://vercel.com
2. Login dan buat project baru.

### Upload Project ke Vercel
1. Hubungkan repository (GitHub/GitLab/Bitbucket) ke Vercel.
2. Pilih project Next.js dan deploy.

### Setting Environment Variables
- Tambahkan variable Supabase (URL dan API Key) di dashboard Vercel.

### Pengaturan Domain & SSL
- Vercel menyediakan domain gratis dan SSL otomatis.
- Anda bisa menambahkan custom domain melalui dashboard Vercel.

### Cara Update Aplikasi di Vercel
- Lakukan perubahan di repository.
- Push ke branch utama, Vercel akan otomatis build dan deploy.

---

## 7. Troubleshooting

### Masalah Umum
- Gagal login: pastikan username/password benar.
- Gambar tidak tampil: cek URL gambar dan koneksi Supabase.
- Database error: cek environment variable dan status Supabase.

### Cara Menghubungi Support
- Hubungi pengembang melalui kontak di lampiran.

---

## 8. Tips Pengelolaan Konten

- Gunakan foto produk yang jelas, terang, dan menarik.
- Tulis deskripsi produk yang singkat, padat, dan informatif.
- Update katalog produk secara berkala.
- Promosikan website melalui media sosial dan WhatsApp.
- Pastikan nomor WhatsApp aktif dan responsif.

---

## 9. Lampiran

### Daftar Istilah
- **Hero Section:** Bagian banner utama website.
- **Supabase:** Platform database backend.
- **Vercel:** Platform hosting untuk aplikasi Next.js.

### Kontak Pengembang
- Email: admin@contoh.com
- WhatsApp: 6281234567890

### Riwayat Perubahan Aplikasi
- v1.0: Rilis awal aplikasi
- v1.1: Penambahan fitur slider produk di hero section
- v1.2: Perbaikan tampilan mobile

---

Selamat menggunakan aplikasi Sistem Informasi Pemasaran Produk Olahan Hasil Pertanian!
