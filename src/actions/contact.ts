'use server'

import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/features/email/services/emailService'
import ContactEmail from '@/features/email/templates/ContactEmail'

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
      .select('id, title, user_id, status')
      .eq('id', data.vehicleId)
      .single()

    if (!car) {
      return { success: false, message: 'Vehículo no encontrado.' }
    }

    if (car.status !== 'available') {
      return { success: false, message: 'Este vehículo ya no está disponible.' }
    }

    // Get owner email
    const { data: owner } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', car.user_id)
      .single()

    // Save to database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        car_id: data.vehicleId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
        preferred_contact: data.preferredContact || 'whatsapp',
      })

    if (dbError) {
      console.error('Error saving contact submission:', dbError)
      return { success: false, message: 'Error al enviar el mensaje. Intenta nuevamente.' }
    }

    // Return success immediately — email sends in background
    const ownerEmail = owner?.email
    if (ownerEmail) {
      sendEmail({
        to: ownerEmail,
        subject: `Nuevo contacto — ${car.title}`,
        react: React.createElement(ContactEmail, {
          vehicleTitle: car.title,
          contactName: data.name,
          contactPhone: data.phone,
          contactEmail: data.email,
          preferredContact: data.preferredContact || 'whatsapp',
          message: data.message || '',
        }),
      }).catch((err) => console.error('Contact email error:', err))
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
