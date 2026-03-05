'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export default function PublicSchoolClient({ school, allSchedules: initialSchedules }) {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [allSchedules, setAllSchedules] = useState(initialSchedules)
    const [nextBell, setNextBell] = useState(null)
    const [countdown, setCountdown] = useState('')
    const [bellRinging, setBellRinging] = useState(false)
    const [bellTitle, setBellTitle] = useState('')
    const [interacted, setInteracted] = useState(false)
    const audioRef = useRef(null)
    const playedRef = useRef(new Set())
    const supabaseRef = useRef(null)

    const today = currentTime.getDay()
    const todaySchedules = allSchedules.filter((s) => s.day_of_week === today)

    useEffect(() => {
        supabaseRef.current = createClient()
    }, [])

    // Realtime subscriptions
    useEffect(() => {
        const supabase = supabaseRef.current
        if (!supabase || !school?.id) return

        const scheduleChannel = supabase
            .channel(`schedules-${school.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'bell_schedules',
                filter: `school_id=eq.${school.id}`,
            }, async () => {
                const { data } = await supabase
                    .from('bell_schedules')
                    .select('*')
                    .eq('school_id', school.id)
                    .order('time', { ascending: true })
                if (data) {
                    setAllSchedules(data)
                    playedRef.current.clear()
                }
            })
            .subscribe()

        const emergencyChannel = supabase
            .channel(`emergency-${school.id}`)
            .on('broadcast', { event: 'emergency_bell' }, (payload) => {
                const soundUrl = payload?.payload?.sound_url || null
                setBellTitle('🚨 BELL DARURAT')
                playBell(soundUrl)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(scheduleChannel)
            supabase.removeChannel(emergencyChannel)
        }
    }, [school?.id])

    const playBell = useCallback((soundUrl) => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        if (soundUrl) {
            const audio = new Audio(soundUrl)
            audioRef.current = audio
            audio.play().catch(() => { })
            setBellRinging(true)
            audio.onended = () => { setBellRinging(false); setBellTitle('') }
        } else {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)()
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.connect(gain)
                gain.connect(ctx.destination)
                osc.frequency.value = 800
                osc.type = 'sine'
                gain.gain.value = 0.5
                osc.start()
                setBellRinging(true)
                setTimeout(() => { osc.stop(); ctx.close(); setBellRinging(false); setBellTitle('') }, 3000)
            } catch { setBellRinging(false); setBellTitle('') }
        }
    }, [])

    const findNextBell = useCallback(() => {
        const now = new Date()
        const nowMinutes = now.getHours() * 60 + now.getMinutes()
        for (const s of todaySchedules) {
            const [h, m] = s.time.split(':').map(Number)
            const bellMinutes = h * 60 + m
            if (bellMinutes > nowMinutes || (bellMinutes === nowMinutes && now.getSeconds() < 5)) return s
        }
        return null
    }, [todaySchedules])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(now)
            const next = findNextBell()
            setNextBell(next)

            if (next) {
                const [h, m] = next.time.split(':').map(Number)
                const bellTime = new Date()
                bellTime.setHours(h, m, 0, 0)
                const diff = bellTime - now

                if (diff <= 0 && diff > -5000) {
                    const bellKey = `${next.id}-${now.toDateString()}`
                    if (!playedRef.current.has(bellKey)) {
                        playedRef.current.add(bellKey)
                        setBellTitle(next.title)
                        playBell(next.sound_url)
                    }
                }

                if (diff > 0) {
                    const totalSec = Math.floor(diff / 1000)
                    const hrs = Math.floor(totalSec / 3600)
                    const mins = Math.floor((totalSec % 3600) / 60)
                    const secs = totalSec % 60
                    setCountdown(`${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
                } else {
                    setCountdown('00:00:00')
                }
            } else {
                setCountdown('--:--:--')
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [findNextBell, playBell])

    const handleInteraction = () => {
        setInteracted(true)
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const buf = ctx.createBuffer(1, 1, 22050)
            const src = ctx.createBufferSource()
            src.buffer = buf
            src.connect(ctx.destination)
            src.start(0)
            setTimeout(() => ctx.close(), 100)
        } catch { }
    }

    const nowStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const dateStr = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="min-h-screen bg-cream flex flex-col" onClick={!interacted ? handleInteraction : undefined}>
            {/* Interaction prompt */}
            {!interacted && (
                <div className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-sm flex items-center justify-center" onClick={handleInteraction}>
                    <div className="text-center animate-fade-in-up p-8" style={{ opacity: 0 }}>
                        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 animate-float">
                            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-secondary">{school.name}</h2>
                        <p className="text-text-secondary mb-6">Klik di mana saja untuk mengaktifkan bell otomatis</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-dark-border text-sm text-text-secondary animate-pulse">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Klik untuk mulai
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-dark-border bg-white">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {school.logo_url ? (
                            <img src={school.logo_url} alt={school.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                            </div>
                        )}
                        <div>
                            <h1 className="font-bold text-lg text-secondary">{school.name}</h1>
                            <p className="text-xs text-text-muted">Sistem Bell Otomatis</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold font-mono text-primary">{nowStr}</p>
                        <p className="text-xs text-text-muted">{dateStr}</p>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Countdown section */}
                    <div className="flex flex-col items-center justify-center">
                        <div className={`bg-white rounded-2xl border p-8 sm:p-12 text-center w-full relative overflow-hidden ${bellRinging ? 'border-primary border-2' : 'border-dark-border'}`}>
                            {bellRinging && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}

                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${bellRinging ? 'bg-primary animate-bounce' : 'bg-secondary animate-float'
                                    }`}>
                                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                    </svg>
                                </div>

                                {bellRinging ? (
                                    <>
                                        <h2 className="text-xl font-semibold text-primary mb-2">🔔 BELL BERBUNYI!</h2>
                                        <p className="text-text-secondary">{bellTitle || 'Bell'}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-text-muted mb-1">Bell Berikutnya</p>
                                        <h2 className="text-xl font-semibold mb-1 text-secondary">
                                            {nextBell ? nextBell.title : 'Tidak ada jadwal'}
                                        </h2>
                                        {nextBell && <p className="text-sm text-text-muted mb-4">Pukul {nextBell.time?.slice(0, 5)}</p>}
                                    </>
                                )}

                                <div className="text-5xl sm:text-6xl font-bold font-mono text-primary mt-4 animate-count">
                                    {countdown}
                                </div>

                                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-dark-border text-xs">
                                    <span className={`w-2 h-2 rounded-full ${bellRinging ? 'bg-primary animate-pulse' : 'bg-success animate-pulse'}`} />
                                    {bellRinging ? 'Bell sedang berbunyi' : 'Menunggu jadwal · Realtime aktif'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's schedule */}
                    <div className="bg-white rounded-2xl border border-dark-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-secondary">Jadwal Hari Ini</h2>
                            <span className="text-sm text-text-muted">{DAYS[today]}</span>
                        </div>

                        {todaySchedules.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-12 h-12 text-text-muted mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                <p className="text-text-muted text-sm">Tidak ada jadwal untuk hari ini</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {todaySchedules.map((s) => {
                                    const [h, m] = s.time.split(':').map(Number)
                                    const bellMinutes = h * 60 + m
                                    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
                                    const isPast = bellMinutes < nowMinutes
                                    const isCurrent = nextBell?.id === s.id

                                    return (
                                        <div
                                            key={s.id}
                                            className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all border ${isCurrent
                                                    ? 'bg-primary/5 border-primary/20'
                                                    : isPast
                                                        ? 'bg-cream border-dark-border/30 opacity-60'
                                                        : 'bg-cream border-dark-border/30'
                                                }`}
                                        >
                                            <div className="flex-shrink-0 w-3 h-3 rounded-full relative">
                                                {isCurrent ? (
                                                    <>
                                                        <div className="absolute inset-0 rounded-full bg-primary animate-ping" />
                                                        <div className="relative w-3 h-3 rounded-full bg-primary" />
                                                    </>
                                                ) : (
                                                    <div className={`w-3 h-3 rounded-full ${isPast ? 'bg-text-muted' : 'bg-dark-border'}`} />
                                                )}
                                            </div>
                                            <span className={`text-sm font-mono w-14 ${isCurrent ? 'text-primary font-bold' : 'text-text-muted'}`}>
                                                {s.time?.slice(0, 5)}
                                            </span>
                                            <span className={`text-sm flex-1 ${isCurrent ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                                                {s.title}
                                            </span>
                                            {isPast && !isCurrent && (
                                                <svg className="w-4 h-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            {isCurrent && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                                                    Berikutnya
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-dark-border bg-white py-4">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-xs text-text-muted">
                        Powered by <span className="text-primary font-semibold">AyoBell</span> — Sistem Bell Sekolah Otomatis
                    </p>
                </div>
            </footer>
        </div>
    )
}
