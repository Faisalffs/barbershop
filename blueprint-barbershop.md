# Blueprint Sistem Barbershop
> Kerangka lengkap: Website + Aplikasi Android
> Role: Admin & User (Pelanggan)
> Teknologi Website: Bootstrap 5 | Teknologi Android: Flutter / React Native

---

## Daftar Isi
1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Halaman Publik Website (Tanpa Login)](#2-halaman-publik-website-tanpa-login)
3. [Website — Panel Admin](#3-website--panel-admin)
4. [Website — Portal User / Pelanggan](#4-website--portal-user--pelanggan)
5. [Aplikasi Android Admin](#5-aplikasi-android-admin)
6. [Aplikasi Android User / Pelanggan](#6-aplikasi-android-user--pelanggan)
7. [Perbedaan Role Admin vs User](#7-perbedaan-role-admin-vs-user)
8. [Alur Utama Sistem](#8-alur-utama-sistem)
9. [Komponen Bootstrap (Website)](#9-komponen-bootstrap-website)
10. [Komponen UI Android](#10-komponen-ui-android)
11. [Catatan Pengembangan](#11-catatan-pengembangan)

---

## 1. Gambaran Umum Sistem

```
SISTEM BARBERSHOP
│
├── WEBSITE (Bootstrap 5)
│   ├── Halaman Publik ──────────── Siapa saja (tanpa login)
│   ├── Panel Admin ─────────────── Login sebagai ADMIN
│   └── Portal User ─────────────── Login sebagai USER
│
└── APLIKASI ANDROID
    ├── App Admin (APK terpisah) ─── Khusus pemilik / staf
    └── App User (APK terpisah) ──── Khusus pelanggan
```

Semua platform (website dan dua aplikasi Android) terhubung ke **satu backend / API** yang sama, sehingga data booking, antrian, dan laporan selalu sinkron secara real-time.

---

## 2. Halaman Publik Website (Tanpa Login)

Dapat diakses siapa saja, berfungsi sebagai halaman pemasaran dan informasi.

### 2.1 Beranda (Landing Page)
- Hero section: foto/banner barbershop + tagline + tombol "Booking Sekarang"
- Highlight layanan unggulan (Card Bootstrap)
- Kenapa pilih kami: ikon keunggulan (berpengalaman, harga terjangkau, dll.)
- Galeri model rambut / hasil kerja (grid foto)
- Carousel testimoni pelanggan dengan rating bintang
- CTA login / daftar akun

### 2.2 Layanan & Harga
- Card atau tabel daftar layanan beserta harga
- Contoh layanan umum:
  - Potong rambut reguler
  - Cuci + potong
  - Cukur jenggot / beard trim
  - Hair coloring / cat rambut
  - Hair treatment / masker rambut
  - Creambath
  - Shaving wajah
- Badge kategori layanan (Populer, Baru, Promo)

### 2.3 Tim Barber
- Profil tiap barber (foto, nama, keahlian, rating)
- Jumlah pelanggan yang sudah ditangani
- Tombol "Pilih Barber ini" → arahkan ke halaman login/daftar

### 2.4 Galeri
- Grid foto hasil potongan rambut
- Filter berdasarkan gaya (fade, undercut, pompadour, dll.)
- Lightbox saat foto diklik

### 2.5 Promo & Diskon
- Banner promo aktif
- Syarat & ketentuan promo
- Kode voucher yang bisa disalin

### 2.6 FAQ
- Accordion Bootstrap berisi pertanyaan umum
- Cara booking, cara pembayaran, kebijakan batal, dll.

### 2.7 Kontak & Lokasi
- Alamat, nomor WhatsApp, email
- Jam operasional per hari
- Embed Google Maps
- Form kontak singkat (nama, HP, pesan)

---

## 3. Website — Panel Admin

Layout: **Sidebar kiri tetap + Navbar atas + Area konten** (Bootstrap 5)
Tema warna: Gelap profesional (dark sidebar, putih konten)

### 3.1 Dashboard
Halaman ringkasan harian setelah admin login.

**Komponen:**
- Kartu statistik: Total booking hari ini · Antrian aktif · Pendapatan hari ini · Total pelanggan terdaftar
- Grafik booking mingguan (Chart.js — bar/line chart)
- Grafik pendapatan bulanan
- Tabel booking terbaru (10 terakhir) + badge status
- Daftar antrian aktif real-time
- Notifikasi booking baru masuk

### 3.2 Kelola Booking
Manajemen semua reservasi dari seluruh pelanggan.

**Fitur:**
- Kalender booking (tampilan harian / mingguan / bulanan)
- Tabel daftar booking (DataTable Bootstrap)
- Filter: tanggal, barber, layanan, status
- Detail booking (Modal): nama pelanggan, layanan, barber, jam, catatan
- Konfirmasi / tolak booking baru
- Ubah status booking:
  ```
  Menunggu → Dikonfirmasi → Sedang Dilayani → Selesai → Dibatalkan
  ```
- Tambah booking manual (walk-in / telepon)
- Kirim notifikasi ke pelanggan (WhatsApp / email)
- Cetak bukti booking

### 3.3 Kelola Antrian
Manajemen antrian walk-in real-time di barbershop.

**Fitur:**
- Tampilan antrian aktif (nomor antrian + nama + layanan)
- Tambah pelanggan walk-in ke antrian
- Panggil nomor berikutnya
- Tampilkan estimasi waktu tunggu
- Reset antrian (awal hari)
- Mode tampilan layar besar / monitor antrean (TV mode)

### 3.4 Kelola Layanan
Pengaturan jenis dan harga layanan yang tersedia.

**Fitur:**
- Daftar semua layanan (tabel)
- Tambah layanan baru: nama, deskripsi, harga, durasi (menit), foto
- Edit / hapus layanan
- Aktifkan / nonaktifkan layanan
- Atur urutan tampilan layanan
- Tandai layanan sebagai "Populer" atau "Promo"

### 3.5 Kelola Barber / Staf
Manajemen data karyawan dan jadwal kerja.

**Fitur:**
- Daftar semua barber (foto, nama, nomor HP, spesialisasi)
- Tambah / edit / hapus data barber
- Atur jadwal kerja barber (shift per hari)
- Atur hari libur / cuti barber
- Lihat rating dan ulasan per barber
- Laporan kinerja barber (jumlah pelanggan, pendapatan per barber)
- Perhitungan komisi / gaji barber otomatis

### 3.6 Kelola Pelanggan
Manajemen data semua pelanggan terdaftar.

**Fitur:**
- Tabel daftar pelanggan
- Detail pelanggan: nama, email, HP, tanggal daftar, total kunjungan
- Riwayat booking per pelanggan
- Model rambut favorit per pelanggan (catatan)
- Poin reward / membership pelanggan
- Aktifkan / blokir akun pelanggan
- Ekspor data pelanggan (Excel / CSV)

### 3.7 Produk & Inventori
Manajemen produk yang dijual atau digunakan di barbershop.

**Fitur:**
- Daftar produk (pomade, wax, hair tonic, dll.)
- Stok produk: tambah, kurangi, update
- Notifikasi stok hampir habis
- Harga jual produk
- Riwayat penggunaan produk per layanan

### 3.8 Laporan Keuangan
Analisis pendapatan dan performa bisnis.

**Fitur:**
- Filter: harian, mingguan, bulanan, custom range
- Grafik pendapatan (line chart / bar chart)
- Rincian pendapatan per layanan
- Rincian pendapatan per barber
- Total transaksi dan rata-rata per hari
- Laporan produk terjual
- Ekspor laporan ke Excel / PDF

### 3.9 Promo & Voucher
Kelola program diskon dan loyalitas pelanggan.

**Fitur:**
- Buat kode voucher (persentase / nominal)
- Atur masa berlaku voucher
- Buat program loyalty: poin reward per kunjungan
- Kelola level membership (Silver, Gold, Platinum)
- Kirim promo ke pelanggan via WhatsApp blast

### 3.10 Pengaturan Sistem
Konfigurasi umum barbershop.

**Fitur:**
- Profil barbershop (nama, logo, alamat, jam buka, deskripsi)
- Metode pembayaran yang diterima (Cash, Transfer, QRIS, E-wallet)
- Durasi slot booking (misalnya setiap 30 atau 60 menit)
- Pengaturan notifikasi (WhatsApp API / Email SMTP)
- Pesan otomatis tiap perubahan status booking
- Pengaturan tampilan halaman publik
- Backup dan restore data

---

## 4. Website — Portal User / Pelanggan

Layout: **Navbar atas + Konten bersih + Footer** (Bootstrap 5)
Tema warna: Terang, bersih, modern

### 4.1 Beranda User (Setelah Login)
- Ucapan selamat datang + nama pelanggan
- Booking aktif / mendatang (card status)
- Nomor antrian (jika sedang antri)
- Estimasi waktu tunggu
- Shortcut menu: Booking Baru, Cek Antrian, Riwayat, Profil
- Notifikasi terbaru (Toast / Alert Bootstrap)

### 4.2 Booking Layanan
Form untuk membuat reservasi baru.

**Fitur:**
- Pilih layanan (card visual dengan foto, nama, harga, durasi)
- Pilih barber (tampilkan foto, nama, rating, jadwal tersedia)
- Pilih tanggal dan jam yang tersedia (kalender + slot waktu)
- Slot yang sudah penuh ditampilkan abu-abu / disabled
- Tambah catatan khusus (model rambut yang diinginkan)
- Ringkasan booking + estimasi total harga sebelum submit
- Input kode voucher / promo
- Pilih metode pembayaran
- Konfirmasi booking (Modal)
- Halaman sukses booking + nomor booking

### 4.3 Cek Antrian
Memantau posisi antrian secara real-time.

**Fitur:**
- Nomor antrian saat ini (besar, jelas)
- Nomor antrian yang sedang dilayani
- Estimasi waktu menunggu
- Notifikasi push saat giliran hampir tiba
- Tombol "Batalkan Antrian"

### 4.4 Riwayat Booking
Daftar semua booking yang pernah dibuat.

**Fitur:**
- List / tabel booking (hanya milik sendiri)
- Filter berdasarkan status atau tanggal
- Detail booking (Modal): layanan, barber, tanggal, total, status
- Unduh bukti booking (PDF)
- Booking ulang dengan sekali klik
- Beri ulasan dan rating setelah layanan selesai

### 4.5 Ulasan & Rating
- Beri bintang (1–5) setelah sesi selesai
- Tulis ulasan teks
- Upload foto hasil potong (opsional)
- Lihat ulasan yang sudah pernah ditulis

### 4.6 Pembayaran
- Lihat tagihan booking yang belum lunas
- Pilih metode: Transfer Bank, QRIS, E-wallet, Bayar di Tempat
- Upload bukti pembayaran
- Status: Menunggu Konfirmasi / Lunas
- Riwayat pembayaran

### 4.7 Reward & Membership
- Poin reward yang terkumpul
- Riwayat perolehan dan penukaran poin
- Level membership (Silver / Gold / Platinum)
- Voucher yang bisa digunakan
- Cara menukar poin dengan diskon / layanan gratis

### 4.8 Profil Saya
- Edit nama, nomor HP, email, foto profil
- Ganti password
- Simpan preferensi: barber favorit, model rambut biasa
- Riwayat model rambut (catatan pribadi)
- Hapus akun

---

## 5. Aplikasi Android Admin

> APK terpisah khusus untuk pemilik barbershop dan staf.
> Diakses dengan akun berole ADMIN.

### Layar & Fitur

#### 5.1 Splash Screen & Login
- Logo barbershop + animasi loading
- Form login (email / username + password)
- Pilihan "Ingat saya"

#### 5.2 Beranda Admin (Home)
- Statistik ringkas hari ini: total booking, antrian aktif, pendapatan
- Grafik mini pendapatan minggu ini
- Notifikasi booking baru masuk (badge)
- Shortcut menu cepat

#### 5.3 Manajemen Booking (App)
- List booking hari ini (card per booking)
- Swipe kanan untuk konfirmasi, swipe kiri untuk tolak
- Tap untuk lihat detail booking
- Ubah status booking langsung dari app
- Filter booking: hari ini, besok, minggu ini
- Tambah booking manual

#### 5.4 Antrian Real-Time (App)
- Tampilan antrian aktif berurutan
- Tombol "Panggil Berikutnya" (satu ketuk)
- Tampilkan nomor yang sedang dilayani
- Estimasi waktu tunggu per nomor
- Tambah pelanggan walk-in ke antrian
- Reset antrian

#### 5.5 Jadwal Barber (App)
- Kalender mingguan jadwal masing-masing barber
- Atur hari libur / cuti langsung dari app
- Lihat beban kerja per barber hari ini

#### 5.6 Laporan Cepat (App)
- Pendapatan hari ini vs kemarin
- Grafik bar pendapatan 7 hari terakhir
- Layanan terlaris hari ini
- Barber dengan booking terbanyak

#### 5.7 Notifikasi (App)
- Push notification: booking baru, pembayaran masuk, ulasan baru
- Pusat notifikasi dengan riwayat
- Pengaturan notifikasi yang ingin diterima

#### 5.8 Pengaturan App Admin
- Profil akun admin
- Ganti password
- Jam operasional barbershop
- Pengaturan notifikasi push
- Logout

---

## 6. Aplikasi Android User / Pelanggan

> APK terpisah khusus untuk pelanggan.
> Diakses dengan akun berole USER.

### Layar & Fitur

#### 6.1 Splash Screen & Onboarding
- Logo + animasi singkat
- Onboarding 3 slide (cara booking, pilih barber, antrian digital) — tampil hanya pertama kali
- Tombol "Mulai" → halaman login/daftar

#### 6.2 Login & Registrasi (App)
- Login: email + password
- Login cepat: Google Account
- Daftar akun baru: nama, email, nomor HP, password
- Lupa password: reset via email / OTP HP
- Verifikasi OTP

#### 6.3 Beranda User (Home App)
- Greeting + nama pengguna
- Banner promo aktif (swipeable)
- Status booking aktif / mendatang
- Nomor antrian real-time (jika sedang antri)
- Shortcut: Booking, Antrian, Riwayat, Promo
- Rekomendasi layanan

#### 6.4 Booking Layanan (App)
- Pilih layanan (card visual dengan foto dan harga)
- Pilih barber (foto, rating, jadwal kosong)
- Kalender interaktif pilih tanggal
- Slot waktu tersedia / tidak tersedia (warna berbeda)
- Ringkasan + total harga + input voucher
- Pilih metode pembayaran
- Konfirmasi booking → notifikasi berhasil

#### 6.5 Cek Antrian (App)
- Widget nomor antrian besar di tengah layar
- Angka nomor yang sedang dipanggil
- Progress bar / estimasi waktu tunggu
- Notifikasi push "Giliran Anda 2 orang lagi"
- Tombol batalkan antrian

#### 6.6 Riwayat & Detail Booking (App)
- List riwayat booking (card per item)
- Filter: semua, aktif, selesai, dibatalkan
- Detail booking: layanan, barber, tanggal, harga, status
- Tombol booking ulang (repeat order)
- Tombol beri ulasan (muncul jika status Selesai)
- Unduh bukti booking

#### 6.7 Ulasan & Rating (App)
- Rating bintang 1–5
- Form tulis ulasan teks
- Upload foto hasil potongan
- Lihat ulasan sebelumnya

#### 6.8 Reward & Poin (App)
- Total poin saat ini (angka besar + progress ke level berikutnya)
- Riwayat perolehan poin
- Daftar voucher yang bisa ditukar
- Level membership dengan keuntungannya
- Cara mendapatkan poin lebih banyak

#### 6.9 Notifikasi (App)
- Push notification: konfirmasi booking, giliran antrian, promo baru
- Pusat notifikasi dengan riwayat pesan
- Pengaturan notifikasi yang ingin diterima

#### 6.10 Profil (App)
- Foto profil + nama + level membership
- Edit data diri: nama, nomor HP, email
- Ganti password
- Barber favorit tersimpan
- Catatan preferensi rambut
- Kebijakan privasi & syarat penggunaan
- Tombol logout

---

## 7. Perbedaan Role Admin vs User

| Fitur                              | Admin (Web) | Admin (App) | User (Web) | User (App) |
|------------------------------------|:-----------:|:-----------:|:----------:|:----------:|
| Lihat semua booking                | ✅          | ✅          | ❌         | ❌         |
| Konfirmasi / tolak booking         | ✅          | ✅          | ❌         | ❌         |
| Kelola antrian real-time           | ✅          | ✅          | ❌         | ❌         |
| Tambah / edit layanan              | ✅          | ❌          | ❌         | ❌         |
| Kelola data barber & jadwal        | ✅          | ✅          | ❌         | ❌         |
| Lihat laporan keuangan             | ✅          | ✅ (ringkas)| ❌         | ❌         |
| Kelola produk & inventori          | ✅          | ❌          | ❌         | ❌         |
| Buat promo & voucher               | ✅          | ❌          | ❌         | ❌         |
| Lihat data semua pelanggan         | ✅          | ❌          | ❌         | ❌         |
| Buat booking baru                  | ✅ (manual) | ✅ (manual) | ✅         | ✅         |
| Cek antrian sendiri                | —           | —           | ✅         | ✅         |
| Lihat riwayat booking sendiri      | —           | —           | ✅         | ✅         |
| Beri ulasan & rating               | ❌          | ❌          | ✅         | ✅         |
| Program reward & poin              | —           | —           | ✅         | ✅         |
| Akses pengaturan sistem            | ✅          | ✅ (terbatas)| ❌        | ❌         |
| Notifikasi booking baru            | ✅          | ✅          | ❌         | ❌         |
| Notifikasi giliran antrian         | ❌          | ❌          | ✅         | ✅         |

---

## 8. Alur Utama Sistem

### 8.1 Alur Autentikasi

```
Buka Website / App
        │
        ▼
   Halaman Login
        │
        │ Berhasil login
        ▼
   Cek Role Akun
        │
        ├── ADMIN ──► Panel Admin (Web) / App Admin
        │
        └── USER ───► Portal User (Web) / App User
```

### 8.2 Alur Booking (User)

```
Pilih Layanan
      │
      ▼
Pilih Barber (opsional)
      │
      ▼
Pilih Tanggal & Slot Waktu
      │
      ▼
Ringkasan + Input Voucher
      │
      ▼
Pilih Metode Pembayaran
      │
      ▼
Konfirmasi Booking
      │
      ▼
Notifikasi Booking Terkirim ─────► Admin terima notifikasi
      │                                    │
      ▼                                    ▼
Status: Menunggu Konfirmasi     Admin konfirmasi / tolak
      │                                    │
      ▼                                    ▼
Status: Dikonfirmasi ◄──────────── Admin klik "Konfirmasi"
      │
      ▼
Hari H: Datang ke Barbershop
      │
      ▼
Status: Sedang Dilayani (Admin update)
      │
      ▼
Status: Selesai (Admin update)
      │
      ▼
User diminta beri Ulasan & Rating
```

### 8.3 Alur Antrian Walk-In

```
Pelanggan Datang Langsung
         │
         ▼
Admin Tambah ke Antrian (App / Web)
         │
         ▼
Pelanggan Terima Nomor Antrian
(via App atau struk fisik)
         │
         ▼
Pelanggan Pantau Antrian di App
         │
         ▼
Notifikasi "2 orang lagi / giliran Anda"
         │
         ▼
Admin Panggil Nomor Antrian
         │
         ▼
Layanan Selesai → Admin Update Status
```

### 8.4 Alur Status Booking

```
Menunggu ──► Dikonfirmasi ──► Sedang Dilayani ──► Selesai
                    │
                    └──► Dibatalkan (oleh Admin atau User)
```

---

## 9. Komponen Bootstrap (Website)

### Layout
- `container` / `container-fluid` — pembungkus halaman
- `navbar` — navigasi atas (publik & user) dan sidebar (admin)
- `row` / `col-*` — grid sistem halaman
- `offcanvas` — sidebar admin di mobile

### Komponen UI
| Komponen         | Penggunaan di Barbershop                              |
|------------------|-------------------------------------------------------|
| `card`           | Profil barber, daftar layanan, statistik dashboard    |
| `table`          | Daftar booking, pelanggan, laporan                    |
| `modal`          | Detail booking, konfirmasi aksi, form tambah          |
| `badge`          | Status booking (warning/success/danger/info)          |
| `alert`          | Notifikasi sistem, pesan sukses/error                 |
| `toast`          | Notifikasi pop-up sementara (booking baru, dll.)      |
| `accordion`      | FAQ di halaman publik, rincian layanan                |
| `carousel`       | Galeri model rambut, testimoni, banner promo          |
| `progress`       | Estimasi waktu tunggu antrian, level membership       |
| `breadcrumb`     | Navigasi halaman admin                                |
| `pagination`     | Navigasi tabel data                                   |
| `dropdown`       | Filter data, pilih barber                             |
| `tabs` / `pills` | Riwayat booking (semua / aktif / selesai)             |
| `spinner`        | Loading state saat fetch data                         |
| `offcanvas`      | Menu mobile / sidebar responsif                       |
| `list-group`     | Daftar antrian real-time                              |

### Status Booking — Warna Badge
```
bg-warning    ── Menunggu Konfirmasi
bg-info       ── Dikonfirmasi
bg-primary    ── Sedang Dilayani
bg-success    ── Selesai
bg-danger     ── Dibatalkan
```

### Navigasi

**Navbar Publik:**
```
[Logo]  Beranda  Layanan  Tim Barber  Galeri  Promo  Kontak  [Login] [Daftar]
```

**Navbar User (Setelah Login):**
```
[Logo]  Beranda  Booking  Antrian  Riwayat  Reward  [Foto User ▾]
                                                     └─ Profil
                                                     └─ Logout
```

**Sidebar Admin:**
```
[Logo Barbershop]
─────────────────
Dashboard
Booking
  └─ Semua Booking
  └─ Tambah Manual
  └─ Kalender
Antrian
Layanan
Barber & Staf
Pelanggan
Produk & Inventori
Laporan
Promo & Voucher
Pengaturan
─────────────────
[Foto Admin]  Nama Admin
Logout
```

---

## 10. Komponen UI Android

### Navigasi
- `BottomNavigationView` — navigasi bawah (User App): Beranda, Booking, Antrian, Riwayat, Profil
- `BottomNavigationView` — navigasi bawah (Admin App): Beranda, Booking, Antrian, Laporan, Pengaturan
- `DrawerLayout` (opsional) — menu samping admin

### Komponen UI Umum
| Komponen Android         | Penggunaan                                        |
|--------------------------|---------------------------------------------------|
| `RecyclerView`           | List booking, riwayat, daftar barber              |
| `CardView`               | Card layanan, card booking, card barber           |
| `ViewPager2`             | Onboarding, banner promo                          |
| `BottomSheet`            | Detail booking, konfirmasi aksi                   |
| `AlertDialog`            | Konfirmasi batalkan antrian, konfirmasi logout     |
| `Snackbar`               | Pesan singkat (booking berhasil, dll.)            |
| `ProgressBar`            | Loading dan estimasi waktu antrian                |
| `ChipGroup`              | Filter status booking, pilih kategori layanan     |
| `CalendarView`           | Pilih tanggal booking                             |
| `RatingBar`              | Input dan tampilkan rating barber                 |
| `SwipeRefreshLayout`     | Refresh data antrian dan booking                  |
| `TabLayout`              | Filter riwayat booking                            |
| `FloatingActionButton`   | Tombol booking baru / tambah antrian              |
| `BadgeDrawable`          | Indikator notifikasi baru di ikon                 |

### Notifikasi Push (Firebase Cloud Messaging)
- Booking baru masuk (ke Admin)
- Konfirmasi booking berhasil (ke User)
- Pengingat booking H-1 dan 1 jam sebelumnya (ke User)
- Giliran antrian hampir tiba (ke User)
- Booking selesai — ajakan beri ulasan (ke User)
- Promo baru / voucher tersedia (ke User)

---

## 11. Catatan Pengembangan

### Teknologi yang Disarankan

| Komponen         | Pilihan Teknologi                          |
|------------------|--------------------------------------------|
| Website Frontend | HTML, CSS, Bootstrap 5, JavaScript         |
| Website Backend  | Laravel (PHP) / Node.js / Django (Python)  |
| Android App      | Flutter (satu codebase) / React Native     |
| Database         | MySQL / PostgreSQL                         |
| Real-time        | Firebase Realtime DB / WebSocket           |
| Push Notif       | Firebase Cloud Messaging (FCM)             |
| Notif WhatsApp   | Fonnte / WA Gateway / Twilio               |
| Pembayaran       | Midtrans / Xendit / QRIS Statis            |
| Peta / Lokasi    | Google Maps API                            |
| File Storage     | Cloudinary / AWS S3 / local server         |

### Perbedaan Tampilan Admin vs User

| Aspek            | Website Admin                  | Website User                    |
|------------------|--------------------------------|---------------------------------|
| Layout           | Sidebar + konten               | Navbar atas + konten + footer   |
| Tema warna       | Gelap profesional (dark mode)  | Terang, bersih, modern          |
| Font             | Formal, rapat                  | Lebih santai, besar             |
| Tabel data       | DataTable lengkap + filter     | Tidak ada tabel kompleks        |
| Aksi utama       | Kelola, konfirmasi, laporan    | Booking, cek status, reward     |

| Aspek            | App Android Admin              | App Android User                |
|------------------|--------------------------------|---------------------------------|
| Ikon app         | Berbeda (warna gelap/profesional)| Warna sesuai branding barbershop|
| Navigasi bawah   | Beranda, Booking, Antrian, Laporan, Pengaturan | Beranda, Booking, Antrian, Riwayat, Profil |
| Layar utama      | Statistik + antrian aktif      | Status booking + nomor antrian  |
| Gestur           | Swipe konfirmasi booking       | Pull-to-refresh antrian         |

### Konvensi Status & Warna

```
Menunggu Konfirmasi  → Kuning  (#FFC107)
Dikonfirmasi         → Biru    (#0D6EFD)
Sedang Dilayani      → Ungu   (#6F42C1)
Selesai              → Hijau   (#198754)
Dibatalkan           → Merah   (#DC3545)
```

### Prioritas Pengembangan (Fase)

**Fase 1 — MVP (Minimum Viable Product):**
- Website: Halaman publik + Login + Booking + Dashboard Admin dasar
- Android: App User (booking + cek antrian)

**Fase 2 — Fitur Inti:**
- Website: Antrian real-time + Laporan + Kelola barber
- Android: App Admin (booking + antrian)

**Fase 3 — Fitur Lanjutan:**
- Website: Reward & membership + Promo + Inventori
- Android: Push notifikasi + Ulasan + Reward

**Fase 4 — Optimasi:**
- Integrasi pembayaran online
- Integrasi WhatsApp notifikasi otomatis
- Analitik lanjutan + ekspor laporan

---

*Blueprint ini adalah kerangka awal. Setiap modul dapat dikembangkan lebih lanjut sesuai kebutuhan dan skala bisnis barbershop.*
