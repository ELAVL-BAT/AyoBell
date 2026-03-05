'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const DAYS = [
    { value: 1, label: 'Senin' },
    { value: 2, label: 'Selasa' },
    { value: 3, label: 'Rabu' },
    { value: 4, label: 'Kamis' },
    { value: 5, label: 'Jumat' },
    { value: 6, label: 'Sabtu' },
    { value: 0, label: 'Minggu' },
]

export default function SchedulePage() {
    const [school, setSchool] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [sounds, setSounds] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1)
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ time: '', title: '', sound_url: '' })
    const [message, setMessage] = useState({ type: '', text: '' })
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (school) fetchSchedules()
    }, [selectedDay, school])

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: sch } = await supabase
            .from('schools')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (sch) {
            setSchool(sch)
            // Fetch sounds
            const { data: snd } = await supabase
                .from('bell_sounds')
                .select('*')
                .eq('school_id', sch.id)
                .order('created_at', { ascending: false })
            setSounds(snd || [])
        }
        setLoading(false)
    }

    const fetchSchedules = async () => {
        if (!school) return
        const { data } = await supabase
            .from('bell_schedules')
            .select('*')
            .eq('school_id', school.id)
            .eq('day_of_week', selectedDay)
            .order('time', { ascending: true })
        setSchedules(data || [])
    }

    const resetForm = () => {
        setForm({ time: '', title: '', sound_url: '' })
        setEditId(null)
        setShowForm(false)
    }

    const handleEdit = (item) => {
        setForm({ time: item.time?.slice(0, 5), title: item.title, sound_url: item.sound_url || '' })
        setEditId(item.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Hapus jadwal ini?')) return
        await supabase.from('bell_schedules').delete().eq('id', id)
        fetchSchedules()
        setMessage({ type: 'success', text: 'Jadwal berhasil dihapus' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const payload = {
                school_id: school.id,
                day_of_week: selectedDay,
                time: form.time,
                title: form.title,
                sound_url: form.sound_url || null,
            }

            if (editId) {
                const { error } = await supabase
                    .from('bell_schedules')
                    .update(payload)
                    .eq('id', editId)
                if (error) throw error
                setMessage({ type: 'success', text: 'Jadwal berhasil diperbarui' })
            } else {
                const { error } = await supabase
                    .from('bell_schedules')
                    .insert(payload)
                if (error) throw error
                setMessage({ type: 'success', text: 'Jadwal berhasil ditambahkan' })
            }

            resetForm()
            fetchSchedules()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSaving(false)
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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
                <p className="text-text-secondary mb-4">Buat sekolah terlebih dahulu untuk mengatur jadwal bel.</p>
                <a href="/dashboard/school" className="btn-primary">Buat Sekolah</a>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in" style={{ opacity: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Jadwal Bel</h1>
                    <p className="text-text-secondary mt-1">Atur jadwal bell otomatis untuk {school.name}</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tambah Jadwal
                </button>
            </div>

            {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-success/10 border border-success/30 text-success'
                        : 'bg-danger/10 border border-danger/30 text-danger'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Day tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {DAYS.map((day) => (
                    <button
                        key={day.value}
                        onClick={() => setSelectedDay(day.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDay === day.value
                                ? 'bg-primary/15 text-primary-light border border-primary/30'
                                : 'bg-dark-card border border-dark-border text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {day.label}
                    </button>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="card !p-6 animate-fade-in" style={{ opacity: 0 }}>
                    <h3 className="font-semibold mb-4">{editId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Waktu</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Kegiatan / Nama</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Contoh: Masuk Sekolah"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Suara Bel (opsional)</label>
                            <select
                                className="input"
                                value={form.sound_url}
                                onChange={(e) => setForm({ ...form, sound_url: e.target.value })}
                            >
                                <option value="">Suara default</option>
                                {sounds.map((s) => (
                                    <option key={s.id} value={s.file_url}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={saving} className="btn-primary text-sm !py-2.5 disabled:opacity-50">
                                {saving ? 'Menyimpan...' : (editId ? 'Perbarui' : 'Tambah')}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-outline text-sm !py-2.5">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Schedule list */}
            <div className="card !p-0 overflow-hidden">
                {schedules.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-text-muted mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        <p className="text-text-muted text-sm">Belum ada jadwal untuk hari {DAYS.find(d => d.value === selectedDay)?.label}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-dark-border">
                        {schedules.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-dark-lighter transition-colors">
                                <div className="w-14 text-center">
                                    <span className="text-lg font-bold font-mono text-primary-light">{item.time?.slice(0, 5)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{item.title}</p>
                                    {item.sound_url && (
                                        <p className="text-xs text-text-muted mt-0.5 truncate">🔊 Custom sound</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 rounded-lg hover:bg-dark-card text-text-muted hover:text-primary-light transition-all"
                                        title="Edit"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-all"
                                        title="Hapus"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
