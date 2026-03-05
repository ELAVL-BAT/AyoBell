'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SchoolPage() {
    const [school, setSchool] = useState(null)
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchSchool()
    }, [])

    const fetchSchool = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data } = await supabase
            .from('schools')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (data) {
            setSchool(data)
            setName(data.name)
            setSlug(data.slug)
            if (data.logo_url) setLogoPreview(data.logo_url)
        }
        setLoading(false)
    }

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '')
            .trim()
    }

    const handleNameChange = (value) => {
        setName(value)
        if (!school) {
            setSlug(generateSlug(value))
        }
    }

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })
        setSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            let logoUrl = school?.logo_url || null

            // Upload logo if changed
            if (logoFile) {
                const ext = logoFile.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${ext}`

                const { error: uploadError } = await supabase.storage
                    .from('school-logos')
                    .upload(fileName, logoFile, { upsert: true })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('school-logos')
                    .getPublicUrl(fileName)

                logoUrl = publicUrl
            }

            if (school) {
                // Update
                const { error } = await supabase
                    .from('schools')
                    .update({ name, slug, logo_url: logoUrl })
                    .eq('id', school.id)

                if (error) throw error
                setMessage({ type: 'success', text: 'Sekolah berhasil diperbarui!' })
            } else {
                // Create
                const { error } = await supabase
                    .from('schools')
                    .insert({ user_id: user.id, name, slug, logo_url: logoUrl })

                if (error) throw error
                setMessage({ type: 'success', text: 'Sekolah berhasil dibuat!' })
            }

            await fetchSchool()
            router.refresh()
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in" style={{ opacity: 0 }}>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    {school ? 'Informasi Sekolah' : 'Buat Sekolah'}
                </h1>
                <p className="text-text-secondary mt-1">
                    {school ? 'Edit informasi sekolah Anda' : 'Mulai dengan membuat profil sekolah Anda'}
                </p>
            </div>

            {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-success/10 border border-success/30 text-success'
                        : 'bg-danger/10 border border-danger/30 text-danger'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card !p-6 space-y-5">
                {/* Logo */}
                <div>
                    <label className="label">Logo Sekolah</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-dark border border-dark-border flex items-center justify-center overflow-hidden">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-8 h-8 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <label className="btn-outline text-sm !py-2 !px-4 cursor-pointer">
                                Upload Logo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-text-muted mt-1">PNG, JPG (maks 2MB)</p>
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="label">Nama Sekolah</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Contoh: SMKN 1 Pekanbaru"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="label">Slug (URL)</label>
                    <div className="flex items-center gap-0">
                        <span className="bg-dark-lighter border border-dark-border border-r-0 rounded-l-xl px-3 py-[0.75rem] text-sm text-text-muted whitespace-nowrap">
                            domain.com/
                        </span>
                        <input
                            type="text"
                            className="input !rounded-l-none"
                            placeholder="smkn1pekanbaru"
                            value={slug}
                            onChange={(e) => setSlug(generateSlug(e.target.value))}
                            required
                        />
                    </div>
                    <p className="text-xs text-text-muted mt-1.5">
                        URL halaman publik sekolah Anda
                    </p>
                </div>

                {/* Public URL preview */}
                {slug && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-text-muted mb-1">Halaman publik:</p>
                        <p className="text-sm text-primary-light font-mono">
                            {typeof window !== 'undefined' ? window.location.origin : 'domain.com'}/{slug}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary !py-3 w-full justify-center disabled:opacity-50"
                >
                    {saving ? (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        school ? 'Simpan Perubahan' : 'Buat Sekolah'
                    )}
                </button>
            </form>
        </div>
    )
}
