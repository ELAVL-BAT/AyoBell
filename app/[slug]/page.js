import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicSchoolClient from './PublicSchoolClient'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: school } = await supabase
        .from('schools')
        .select('name')
        .eq('slug', slug)
        .single()

    if (!school) return { title: 'Tidak Ditemukan' }

    return {
        title: `${school.name} - AyoBell`,
        description: `Jadwal bell otomatis ${school.name}`,
    }
}

export default async function PublicSchoolPage({ params }) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch school
    const { data: school } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!school) notFound()

    // Fetch all schedules
    const { data: schedules } = await supabase
        .from('bell_schedules')
        .select('*')
        .eq('school_id', school.id)
        .order('time', { ascending: true })

    return <PublicSchoolClient school={school} allSchedules={schedules || []} />
}
