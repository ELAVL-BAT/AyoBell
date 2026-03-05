'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function EmergencyPage() {
    const [school, setSchool] = useState(null)
    const [sounds, setSounds] = useState([])
    const [selectedSound, setSelectedSound] = useState('')
    const [loading, setLoading] = useState(true)
    const [playing, setPlaying] = useState(false)
    const audioRef = useRef(null)
    const supabase = createClient()

    useEffect(() => {
        fetchData()
        return () => {
            if (audioRef.current) audioRef.current.pause()
        }
    }, [])

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: sch } = await supabase
            .from('schools')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (sch) {
            setSchool(sch)
            const { data: snd } = await supabase
                .from('bell_sounds')
                .select('*')
                .eq('school_id', sch.id)
            setSounds(snd || [])
        }
        setLoading(false)
    }

    const handleEmergency = async () => {
        if (playing && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setPlaying(false)
            return
        }

        let soundUrl = selectedSound || null
        if (!soundUrl && sounds.length > 0) {
            soundUrl = sounds[0].file_url
        }

        // === Broadcast emergency bell to public page via Supabase Realtime ===
        if (school) {
            const channel = supabase.channel(`emergency-${school.id}`)
            await channel.subscribe()
            await channel.send({
                type: 'broadcast',
                event: 'emergency_bell',
                payload: { sound_url: soundUrl },
            })
            supabase.removeChannel(channel)
        }

        // Also play locally in dashboard
        if (soundUrl) {
            playSound(soundUrl)
        } else {
            playBeep()
        }
    }

    const playSound = (url) => {
        const audio = new Audio(url)
        audioRef.current = audio
        audio.play()
        setPlaying(true)
        audio.onended = () => setPlaying(false)
    }

    const playBeep = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)

            oscillator.frequency.value = 800
            oscillator.type = 'sine'
            gainNode.gain.value = 0.5

            oscillator.start()
            setPlaying(true)

            setTimeout(() => {
                oscillator.stop()
                ctx.close()
                setPlaying(false)
            }, 3000)
        } catch {
            setPlaying(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!school) {
        return (
            <div className="text-center py-20">
                <p className="text-text-secondary mb-4">Buat sekolah terlebih dahulu.</p>
                <a href="/dashboard/school" className="btn-primary">Buat Sekolah</a>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in" style={{ opacity: 0 }}>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Bell Darurat</h1>
                <p className="text-text-secondary mt-1">Bunyikan bell secara instan — akan terdengar di halaman publik sekolah</p>
            </div>

            <div className="max-w-lg mx-auto">
                {/* Sound selector */}
                <div className="card !p-6 mb-6">
                    <label className="label">Pilih Suara Bel</label>
                    <select
                        className="input"
                        value={selectedSound}
                        onChange={(e) => setSelectedSound(e.target.value)}
                    >
                        <option value="">
                            {sounds.length > 0 ? 'Pilih suara...' : 'Tidak ada suara (gunakan beep)'}
                        </option>
                        {sounds.map((s) => (
                            <option key={s.id} value={s.file_url}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Emergency button */}
                <div className="text-center">
                    <div className="relative inline-block">
                        {/* Pulse rings */}
                        {playing && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-danger/30 animate-pulse-ring" />
                                <div className="absolute inset-0 rounded-full bg-danger/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute inset-0 rounded-full bg-danger/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
                            </>
                        )}

                        <button
                            onClick={handleEmergency}
                            className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${playing
                                    ? 'bg-gradient-to-br from-danger to-red-700 scale-110 shadow-[0_0_60px_rgba(239,68,68,0.5)]'
                                    : 'bg-gradient-to-br from-danger to-red-700 hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                }`}
                        >
                            {playing ? (
                                <>
                                    <svg className="w-16 h-16 text-white mb-1" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" rx="1" />
                                        <rect x="14" y="4" width="4" height="16" rx="1" />
                                    </svg>
                                    <span className="text-white text-sm font-bold">BERHENTI</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-16 h-16 text-white mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                    </svg>
                                    <span className="text-white text-sm font-bold">DARURAT</span>
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-text-muted text-sm mt-6">
                        {playing ? 'Bell sedang diputar. Klik lagi untuk berhenti.' : 'Tekan tombol untuk membunyikan bell darurat di halaman publik.'}
                    </p>
                </div>
            </div>
        </div>
    )
}
