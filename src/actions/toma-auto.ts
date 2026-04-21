'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/features/email/services/emailService'
import TomaAutoEmail from '@/features/email/templates/TomaAutoEmail'
import React from 'react'

const tomaAutoSchema = z.object({
  vehicleId: z.string().uuid(),
  contactName: z.string().min(2, 'Nombre requerido'),
  contactPhone: z.string().min(6, 'Teléfono requerido'),
  contactEmail: z.string().email('Email inválido'),
  tradeInMake: z.string().min(1, 'Marca requerida'),
  tradeInModel: z.string().min(1, 'Modelo requerido'),
  tradeInYear: z.string().min(4, 'Año requerido'),
  tradeInVersion: z.string().optional().default(''),
  tradeInColor: z.string().optional().default(''),
  tradeInMileage: z.string().optional().default(''),
  paintCondition: z.string().min(1, 'Estado de pintura requerido'),
  interiorCondition: z.string().min(1, 'Estado de interiores requerido'),
  engineCondition: z.string().min(1, 'Estado de motor requerido'),
  transmissionCondition: z.string().min(1, 'Estado de transmisión requerido'),
  additionalNotes: z.string().optional().default(''),
})

export async function submitTomaAuto(formData: FormData) {
  const rawData: Record<string, string> = {}
  formData.forEach((value, key) => {
    rawData[key] = value as string
  })

  const parsed = tomaAutoSchema.safeParse(rawData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { error: firstError.message }
  }

  const data = parsed.data

  // Get car and owner info
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('id, title, user_id')
    .eq('id', data.vehicleId)
    .single()

  if (!car) {
    return { error: 'Vehículo no encontrado' }
  }

  const { data: owner } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', car.user_id)
    .single()

  if (!owner?.email) {
    return { error: 'No se pudo contactar al publicante' }
  }

  // Send email to the vehicle publisher
  await sendEmail({
    to: owner.email,
    subject: `Toma de auto — ${car.title}`,
    react: React.createElement(TomaAutoEmail, {
      vehicleTitle: car.title,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      tradeInMake: data.tradeInMake,
      tradeInModel: data.tradeInModel,
      tradeInYear: data.tradeInYear,
      tradeInVersion: data.tradeInVersion,
      tradeInColor: data.tradeInColor,
      tradeInMileage: data.tradeInMileage,
      paintCondition: data.paintCondition,
      interiorCondition: data.interiorCondition,
      engineCondition: data.engineCondition,
      transmissionCondition: data.transmissionCondition,
      additionalNotes: data.additionalNotes,
    }),
  })

  return { success: true }
}
