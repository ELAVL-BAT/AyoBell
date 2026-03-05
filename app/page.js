import Link from 'next/link'

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ZapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

const features = [
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Penjadwalan Otomatis',
    description: 'Atur jadwal bell berdasarkan hari dan jam. Bell akan berbunyi otomatis tanpa perlu operator.',
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Bell Darurat',
    description: 'Tombol emergency untuk membunyikan bell secara instan saat situasi darurat.',
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" />
        <path d="M12 6h.01" /><path d="M12 10h.01" />
      </svg>
    ),
    title: 'Multi Sekolah',
    description: 'Satu akun dapat mengelola sekolah dengan halaman publik dan jadwal masing-masing.',
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: 'Suara Bell Custom',
    description: 'Upload file bell sendiri dalam format MP3/WAV. Pilih suara berbeda untuk setiap jadwal.',
  },
]

const benefits = [
  'Mengurangi ketergantungan pada operator bell manual',
  'Waktu bell selalu tepat dan konsisten',
  'Mengurangi gangguan pada proses belajar mengajar',
  'Mudah diakses dari komputer, smart TV, atau speaker',
  'Hemat biaya operasional sekolah',
  'Setup cepat, langsung bisa digunakan',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-dark-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <Link href="/" className="flex items-center gap-2 group justify-self-start">
              <img src="/logo.webp" alt="AyoBell" className="w-8 h-8 rounded-lg object-contain transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold text-secondary">AyoBell</span>
            </Link>
            <div className="hidden sm:flex items-center justify-center gap-8 text-sm font-medium text-text-secondary">
              <a href="#features" className="hover:text-text-primary transition-colors">Fitur</a>
              <a href="#about" className="hover:text-text-primary transition-colors">Tentang</a>
              <a href="#visi" className="hover:text-text-primary transition-colors">Visi & Misi</a>
            </div>
            <div className="flex items-center gap-3 justify-self-end col-start-3">
              <Link href="/login" className="text-text-secondary hover:text-text-primary transition-colors px-4 py-2 text-sm font-medium">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary text-sm !py-2 !px-5">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-fade-in-up" style={{ opacity: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Sistem Bell Sekolah Modern
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up text-secondary" style={{ opacity: 0, animationDelay: '0.15s' }}>
              Satu alat untuk <span className="gradient-text">mengelola</span> bell sekolah Anda
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ opacity: 0, animationDelay: '0.3s' }}>
              AyoBell membantu sekolah mengatur jadwal bell otomatis, memutar bell darurat,
              dan mengelola suara bell custom — semua dari satu dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.45s' }}>
              <Link href="/register" className="btn-primary text-base !py-3 !px-8">
                Mulai Sekarang
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link href="#features" className="btn-outline text-base !py-3 !px-8">
                Lihat Fitur
              </Link>
            </div>
          </div>

          {/* Hero visual - Dashboard preview */}
          <div className="mt-16 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.6s' }}>
            <div className="relative mx-auto max-w-4xl">
              <div className="bg-white rounded-2xl border border-dark-border shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                  <span className="text-xs text-text-muted ml-2 font-medium">AyoBell Dashboard</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { label: 'Jadwal Hari Ini', value: '8', color: 'text-primary' },
                    { label: 'Bell Berikutnya', value: '08:30', color: 'text-success' },
                    { label: 'Total Suara', value: '5', color: 'text-accent' },
                    { label: 'Status', value: 'Aktif', color: 'text-success' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-cream rounded-xl p-3 sm:p-4 text-center border border-dark-border/50">
                      <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['07:00 — Masuk Sekolah', '08:30 — Istirahat', '10:00 — Masuk Kelas'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3 text-sm border border-dark-border/30">
                      <ClockIcon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-text-secondary">{item}</span>
                      {i === 0 && <span className="ml-auto text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Selesai</span>}
                      {i === 1 && <span className="ml-auto text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">Berikutnya</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Fitur Unggulan</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              Teknologi canggih untuk memastikan<br className="hidden sm:block" /> semua kebutuhan Anda terpenuhi
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Semua yang dibutuhkan sekolah untuk mengelola sistem bell secara modern dan efisien.
            </p>
          </div>

          {/* Large feature card */}
          <div className="bg-white rounded-2xl border border-dark-border p-6 sm:p-8 mb-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-5">
                  {features[0].icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{features[0].title}</h3>
                <p className="text-text-secondary leading-relaxed mb-5">{features[0].description}</p>
                <Link href="/register" className="btn-primary text-sm !py-2.5 !px-6">
                  Coba Sekarang
                </Link>
              </div>
              <div className="bg-cream rounded-xl p-5 border border-dark-border/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-text-primary">Jadwal Bel</span>
                  <span className="text-xs text-text-muted">Senin</span>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '07:00', label: 'Masuk Sekolah', active: false },
                    { time: '08:30', label: 'Istirahat', active: true },
                    { time: '10:00', label: 'Masuk Kelas', active: false },
                    { time: '12:00', label: 'Pulang', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${item.active ? 'bg-primary/8 border border-primary/20' : 'bg-white border border-dark-border/30'}`}>
                      <span className={`text-sm font-mono font-semibold ${item.active ? 'text-primary' : 'text-text-muted'}`}>{item.time}</span>
                      <span className={`text-sm ${item.active ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>{item.label}</span>
                      {item.active && <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller feature cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.slice(1, 3).map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl border border-dark-border p-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Fourth feature */}
          <div className="mt-6 bg-white rounded-2xl border border-dark-border p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-cream rounded-xl p-5 border border-dark-border/50 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  </div>
                  <span className="text-sm font-semibold">bell_utama.mp3</span>
                </div>
                <div className="h-12 bg-white rounded-lg border border-dark-border/30 flex items-center px-4 gap-2">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  <div className="flex-1 h-1.5 bg-dark-border/30 rounded-full">
                    <div className="h-full w-2/3 bg-primary rounded-full" />
                  </div>
                  <span className="text-xs text-text-muted">0:03</span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-5">
                  {features[3].icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{features[3].title}</h3>
                <p className="text-text-secondary leading-relaxed">{features[3].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About AyoBell - Dark section */}
      <section id="about" className="py-20 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Apa itu AyoBell?
            </h2>
            <p className="text-white/70 leading-relaxed">
              AyoBell adalah platform manajemen bell sekolah berbasis web yang memungkinkan sekolah mengotomatiskan
              jadwal bell harian tanpa perlu operator manual. Cukup atur jadwal di dashboard, dan bell akan berbunyi otomatis.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Berbasis Web', 'Realtime', 'Gratis', 'Multi Platform', 'Custom Sound'].map((tag) => (
              <div key={tag} className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2.5">
                <CheckIcon className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/90">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-4xl sm:text-5xl text-primary/20 mb-6">"</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4 leading-snug">
                Mengapa sekolah memilih <span className="gradient-text">AyoBell</span>?
              </h2>
              <p className="text-text-secondary">
                Manfaat menggunakan sistem bell otomatis untuk sekolah Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-dark-border p-4 animate-fade-in-up" style={{ opacity: 0 }}>
                  <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-sm text-text-secondary">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 bg-cream-dark border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '2026', label: 'Tahun Didirikan' },
              { value: '∞', label: 'Jadwal Bel' },
              { value: '100%', label: 'Gratis' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-secondary">{stat.value}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section id="visi" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Tentang Kami</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
              Visi & Misi
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-dark-border p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Visi</h3>
              <p className="text-text-secondary leading-relaxed">
                Menjadi platform manajemen bell sekolah terdepan yang membantu ribuan sekolah
                di Indonesia mengotomatiskan operasional harian mereka dengan teknologi modern.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-dark-border p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full" />
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <ZapIcon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Misi</h3>
              <ul className="space-y-2.5 text-text-secondary text-sm leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Menyediakan solusi bell otomatis yang mudah digunakan
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Mengurangi ketergantungan pada proses manual
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Mendukung digitalisasi sekolah di seluruh Indonesia
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Meningkatkan efisiensi operasional sekolah
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Siap mengotomatiskan bell sekolah?
              </h2>
              <p className="text-white/60 mt-1">
                Daftar sekarang dan mulai kelola bell sekolah Anda.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="#features" className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/20 transition-all">
                Lihat Fitur
              </Link>
              <Link href="/register" className="bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-dark transition-all flex items-center gap-2">
                Daftar Sekarang
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white/70 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.webp" alt="AyoBell" className="w-7 h-7 rounded-lg object-contain brightness-0 invert" />
                <span className="font-bold text-white text-lg">AyoBell</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Sistem bell sekolah otomatis untuk Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Tentang</a></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Daftar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Akun</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Masuk</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Daftar</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Bantuan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#visi" className="hover:text-white transition-colors">Visi & Misi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-white/40 text-center">
              &copy; {new Date().getFullYear()} AyoBell. Sistem Bell Sekolah Otomatis. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
