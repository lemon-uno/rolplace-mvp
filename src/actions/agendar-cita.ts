'use server'

import React from 'react'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/features/email/services/emailService'
import CitaEmail from '@/features/email/templates/CitaEmail'

const citaSchema = z.object({
  vehicleId: z.string().uuid(),
  date: z.string().min(1),
  time: z.string().min(1),
  contactName: z.string().min(2, 'Nombre requerido'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(6, 'Celular requerido'),
})

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export async function submitAgendarCita(formData: FormData) {
  const rawData: Record<string, string> = {}
  formData.forEach((value, key) => {
    if (typeof value === 'string') rawData[key] = value
  })

  const parsed = citaSchema.safeParse(rawData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const data = parsed.data
  const appointmentDate = new Date(data.date)
  const dia = DIAS[appointmentDate.getDay()]
  const diaNum = appointmentDate.getDate()
  const mes = MESES[appointmentDate.getMonth()]
  const fechaFormateada = `${dia} ${diaNum} de ${mes}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: car } = await supabase
    .from('cars')
    .select('id, title, user_id')
    .eq('id', data.vehicleId)
    .single()

  if (!car) return { error: 'Vehículo no encontrado' }

  const { data: owner } = await supabase
    .from('profiles')
    .select('email, whatsapp')
    .eq('id', car.user_id)
    .single()

  if (!owner?.email) return { error: 'No se pudo contactar al publicante' }

  // Build WhatsApp link for publisher to confirm with buyer
  const whatsappMsg = `Hola ${data.contactName}, confirmo tu cita para conocer el ${car.title} el ${fechaFormateada} a las ${data.time}. Te esperamos!`
  const whatsappLink = `https://wa.me/${data.contactPhone}?text=${encodeURIComponent(whatsappMsg)}`

  // Send email to publisher
  try {
    await sendEmail({
      to: owner.email,
      subject: `Nueva cita agendada — ${car.title}`,
      react: React.createElement(CitaEmail, {
        vehicleTitle: car.title,
        fecha: fechaFormateada,
        hora: data.time,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        whatsappLink,
      }),
    })
  } catch (err) {
    console.error('Cita email error:', err)
  }

  return { success: true }
}
