import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from './DashboardShell'

export const metadata = {
    title: 'Dashboard - AyoBell',
    description: 'Kelola bell sekolah Anda',
}

export default async function DashboardLayout({ children }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return <DashboardShell user={user}>{children}</DashboardShell>
}
