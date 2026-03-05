'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SoundsPage() {
    const [school, setSchool] = useState(null)
    const [sounds, setSounds] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [soundName, setSoundName] = useState('')
    const [soundFile, setSoundFile] = useState(null)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [playingId, setPlayingId] = useState(null)
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
                .order('created_at', { ascending: false })
            setSounds(snd || [])
        }
        setLoading(false)
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!soundFile || !soundName.trim()) return
        setUploading(true)
        setMessage({ type: '', text: '' })

        try {
            const ext = soundFile.name.split('.').pop()
            const fileName = `${school.id}/${Date.now()}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from('bell-sounds')
                .upload(fileName, soundFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('bell-sounds')
                .getPublicUrl(fileName)

            const { error: dbError } = await supabase
                .from('bell_sounds')
                .insert({
                    school_id: school.id,
                    name: soundName,
                    file_url: publicUrl,
                })

            if (dbError) throw dbError

            setSoundName('')
            setSoundFile(null)
            setMessage({ type: 'success', text: 'Suara bel berhasil diupload!' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setUploading(false)
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        }
    }

    const handlePlay = (sound) => {
        if (audioRef.current) {
            audioRef.current.pause()
        }

        if (playingId === sound.id) {
            setPlayingId(null)
            return
        }

        const audio = new Audio(sound.file_url)
        audioRef.current = audio
        audio.play()
        setPlayingId(sound.id)
        audio.onended = () => setPlayingId(null)
    }

    const handleDelete = async (sound) => {
        if (!confirm(`Hapus suara "${sound.name}"?`)) return

        try {
            // Extract path from URL for storage deletion
            const urlParts = sound.file_url.split('/bell-sounds/')
            if (urlParts[1]) {
                await supabase.storage.from('bell-sounds').remove([urlParts[1]])
            }

            await supabase.from('bell_sounds').delete().eq('id', sound.id)
            setMessage({ type: 'success', text: 'Suara berhasil dihapus' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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
                <h1 className="text-2xl sm:text-3xl font-bold">Suara Bel</h1>
                <p className="text-text-secondary mt-1">Upload dan kelola suara bel custom</p>
            </div>

            {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-success/10 border border-success/30 text-success'
                        : 'bg-danger/10 border border-danger/30 text-danger'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Upload form */}
            <div className="card !p-6">
                <h3 className="font-semibold mb-4">Upload Suara Baru</h3>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Nama Suara</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Contoh: Bell Utama"
                                value={soundName}
                                onChange={(e) => setSoundName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">File Audio (MP3/WAV)</label>
                            <input
                                type="file"
                                accept=".mp3,.wav,audio/mpeg,audio/wav"
                                onChange={(e) => setSoundFile(e.target.files?.[0] || null)}
                                className="input file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary/15 file:text-primary-light file:cursor-pointer"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary text-sm !py-2.5 disabled:opacity-50"
                    >
                        {uploading ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Mengupload...
                            </span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Upload
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Sound list */}
            <div className="card !p-0 overflow-hidden">
                <div className="px-5 py-3 border-b border-dark-border">
                    <h3 className="font-semibold text-sm">Daftar Suara ({sounds.length})</h3>
                </div>
                {sounds.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-text-muted mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                        <p className="text-text-muted text-sm">Belum ada suara yang diupload</p>
                    </div>
                ) : (
                    <div className="divide-y divide-dark-border">
                        {sounds.map((sound) => (
                            <div key={sound.id} className="flex items-center gap-4 px-5 py-4 hover:bg-dark-lighter transition-colors">
                                {/* Play button */}
                                <button
                                    onClick={() => handlePlay(sound)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${playingId === sound.id
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/15 text-primary-light hover:bg-primary/25'
                                        }`}
                                >
                                    {playingId === sound.id ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{sound.name}</p>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {new Date(sound.created_at).toLocaleDateString('id-ID')}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(sound)}
                                    className="p-2 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-all"
                                    title="Hapus"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
