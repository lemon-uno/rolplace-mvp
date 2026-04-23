'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContactForm(data: {
  vehicleId: string
  name: string
  email: string
  phone: string
  message: string
  preferredContact?: 'email' | 'phone' | 'whatsapp'
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient()

    // Verify car exists and is available
    const { data: car } = await supabase
      .from('cars')
      .select('id, title, status')
      .eq('id', data.vehicleId)
      .single()

    if (!car) {
      return { success: false, message: 'Vehículo no encontrado.' }
    }

    if (car.status !== 'available') {
      return { success: false, message: 'Este vehículo ya no está disponible.' }
    }

    // Save to database
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        car_id: data.vehicleId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
        preferred_contact: data.preferredContact || 'whatsapp',
      })

    if (error) {
      console.error('Error saving contact submission:', error)
      return { success: false, message: 'Error al enviar el mensaje. Intenta nuevamente.' }
    }

    // Optionally forward to N8N webhook
    const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            vehicle: {
              id: car.id,
              title: car.title,
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inventory/${car.id}`,
            },
            timestamp: new Date().toISOString(),
            source: 'rolplace-web',
          }),
        })
      } catch {
        // Webhook failure doesn't affect the user — message is already saved
        console.warn('N8N webhook failed, but contact was saved to DB')
      }
    }

    return { success: true, message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.' }
  } catch (error) {
    console.error('Error in submitContactForm:', error)
    return { success: false, message: 'Error al enviar el mensaje. Intenta nuevamente.' }
  }
}

export async function getContactSubmissions(): Promise<{
  id: string
  name: string
  email: string
  phone: string
  message: string
  preferred_contact: string
  created_at: string
  car_title: string
  car_id: string
}[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('contact_submissions')
    .select('id, name, email, phone, message, preferred_contact, created_at, car_id, cars(title)')
    .order('created_at', { ascending: false })

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    preferred_contact: row.preferred_contact,
    created_at: row.created_at,
    car_title: row.cars?.title || 'Vehículo eliminado',
    car_id: row.car_id,
  }))
}
