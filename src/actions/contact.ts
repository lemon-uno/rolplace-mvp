'use server'

import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/features/email/services/emailService'
import ContactEmail from '@/features/email/templates/ContactEmail'

export async function submitContactForm(formData: FormData) {
  const vehicleId = formData.get('vehicleId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const message = (formData.get('message') as string) || ''
  const preferredContact = (formData.get('preferredContact') as string) || 'whatsapp'

  if (!vehicleId || !name || !email || !phone) {
    return { error: 'Todos los campos marcados con * son requeridos.' }
  }

  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('id, title, user_id, status')
    .eq('id', vehicleId)
    .single()

  if (!car) return { error: 'Vehículo no encontrado.' }
  if (car.status !== 'available') return { error: 'Este vehículo ya no está disponible.' }

  const { data: owner } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', car.user_id)
    .single()

  const { error: dbError } = await supabase
    .from('contact_submissions')
    .insert({
      car_id: vehicleId,
      name,
      email,
      phone,
      message,
      preferred_contact: preferredContact,
    })

  if (dbError) {
    console.error('Error saving contact:', dbError)
    return { error: 'Error al guardar. Intenta nuevamente.' }
  }

  // Send email in background — don't block the response
  if (owner?.email) {
    sendEmail({
      to: owner.email,
      subject: `Nuevo contacto — ${car.title}`,
      react: React.createElement(ContactEmail, {
        vehicleTitle: car.title,
        contactName: name,
        contactPhone: phone,
        contactEmail: email,
        preferredContact,
        message,
      }),
    }).catch((err) => console.error('Contact email error:', err))
  }

  return { success: true }
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
