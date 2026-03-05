'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Password tidak cocok')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        setLoading(true)

        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-2xl border border-dark-border p-8 shadow-sm animate-fade-in-up" style={{ opacity: 0 }}>
                        <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-secondary">Registrasi Berhasil!</h2>
                        <p className="text-text-secondary text-sm mb-6">
                            Silakan cek email Anda untuk konfirmasi akun, lalu login.
                        </p>
                        <Link href="/login" className="btn-primary justify-center w-full">
                            Ke Halaman Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in-up" style={{ opacity: 0 }}>
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <img src="/logo.webp" alt="AyoBell" className="w-10 h-10 rounded-xl object-contain transition-transform group-hover:scale-110" />
                        <span className="text-2xl font-bold text-secondary">AyoBell</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-dark-border p-8 shadow-sm animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
                    <h1 className="text-2xl font-bold mb-1 text-secondary">Daftar</h1>
                    <p className="text-text-secondary text-sm mb-6">Buat akun AyoBell baru</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Konfirmasi Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Ulangi password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                'Daftar'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
