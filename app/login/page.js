'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push('/dashboard')
        router.refresh()
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
                    <h1 className="text-2xl font-bold mb-1 text-secondary">Masuk</h1>
                    <p className="text-text-secondary text-sm mb-6">Masuk ke dashboard AyoBell Anda</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
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
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                'Masuk'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-primary hover:text-primary-dark transition-colors font-medium">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
