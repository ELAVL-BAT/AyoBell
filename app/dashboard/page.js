import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch school
    const { data: school } = await supabase
        .from('schools')
        .select('*')
        .eq('user_id', user.id)
        .single()

    let scheduleCount = 0
    let soundCount = 0
    let todaySchedules = []

    if (school) {
        // Count schedules
        const { count: sc } = await supabase
            .from('bell_schedules')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', school.id)
        scheduleCount = sc || 0

        // Count sounds
        const { count: soc } = await supabase
            .from('bell_sounds')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', school.id)
        soundCount = soc || 0

        // Today's schedules
        const today = new Date().getDay()
        const { data: todaySch } = await supabase
            .from('bell_schedules')
            .select('*')
            .eq('school_id', school.id)
            .eq('day_of_week', today)
            .order('time', { ascending: true })
        todaySchedules = todaySch || []
    }

    const stats = [
        {
            label: 'Jadwal Bel',
            value: scheduleCount,
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            color: 'text-primary-light',
            bg: 'bg-primary/15',
            href: '/dashboard/schedule',
        },
        {
            label: 'Suara Bel',
            value: soundCount,
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
            ),
            color: 'text-text-primary',
            bg: 'bg-cream-darker',
            href: '/dashboard/sounds',
        },
        {
            label: 'Jadwal Hari Ini',
            value: todaySchedules.length,
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
            color: 'text-warning',
            bg: 'bg-warning/15',
            href: '/dashboard/schedule',
        },
        {
            label: 'Status',
            value: school ? 'Aktif' : 'Setup',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
            color: school ? 'text-primary' : 'text-warning',
            bg: school ? 'bg-primary/10' : 'bg-warning/15',
            href: '/dashboard/school',
        },
    ]

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    return (
        <div className="space-y-8 animate-fade-in" style={{ opacity: 0 }}>
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                <p className="text-text-secondary mt-1">
                    {school ? `Selamat datang di ${school.name}` : 'Selamat datang! Mulai dengan membuat sekolah Anda.'}
                </p>
            </div>

            {/* Alert if no school */}
            {!school && (
                <div className="card !p-5 border-warning/30 !bg-warning/5">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <div>
                            <p className="font-medium text-warning">Belum ada sekolah</p>
                            <p className="text-sm text-text-secondary mt-1">Buat sekolah terlebih dahulu untuk mulai mengatur jadwal bel.</p>
                            <Link href="/dashboard/school" className="btn-primary text-sm !py-2 !px-4 mt-3">
                                Buat Sekolah
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="card group !p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Today schedule */}
            {school && (
                <div className="card !p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Jadwal Hari Ini</h2>
                            <p className="text-sm text-text-muted">{days[new Date().getDay()]}</p>
                        </div>
                        {school && (
                            <Link
                                href={`/${school.slug}`}
                                target="_blank"
                                className="text-sm text-primary-light hover:text-primary transition-colors flex items-center gap-1"
                            >
                                Lihat Halaman Publik
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </Link>
                        )}
                    </div>

                    {todaySchedules.length === 0 ? (
                        <p className="text-sm text-text-muted py-4 text-center">Tidak ada jadwal untuk hari ini.</p>
                    ) : (
                        <div className="space-y-2">
                            {todaySchedules.map((s) => (
                                <div key={s.id} className="flex items-center gap-4 bg-cream rounded-lg px-4 py-3 border border-dark-border/50">
                                    <span className="text-sm font-mono text-primary w-14">{s.time?.slice(0, 5)}</span>
                                    <span className="text-sm text-text-secondary flex-1">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/dashboard/emergency" className="card !p-5 group !border-danger/30 hover:!border-danger hover:!bg-danger/5 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-danger/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </div>
                    <p className="font-semibold text-danger">Bell Darurat</p>
                    <p className="text-xs text-text-muted mt-1">Bunyikan bell sekarang</p>
                </Link>

                <Link href="/dashboard/schedule" className="card !p-5 group text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <p className="font-semibold">Atur Jadwal</p>
                    <p className="text-xs text-text-muted mt-1">Kelola jadwal bel</p>
                </Link>

                <Link href="/dashboard/sounds" className="card !p-5 group text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-cream-darker flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                    </div>
                    <p className="font-semibold">Suara Bel</p>
                    <p className="text-xs text-text-muted mt-1">Upload suara custom</p>
                </Link>
            </div>
        </div>
    )
}
