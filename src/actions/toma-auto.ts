'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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
  tradeInTransmission: z.string().optional().default(''),
  tradeInMileage: z.string().optional().default(''),
  tradeInExteriorColor: z.string().optional().default(''),
  tradeInInteriorColor: z.string().optional().default(''),
  paintCondition: z.string().min(1, 'Estado de pintura requerido'),
  interiorCondition: z.string().min(1, 'Estado de interiores requerido'),
  engineCondition: z.string().min(1, 'Estado de motor requerido'),
  transmissionCondition: z.string().min(1, 'Estado de transmisión requerido'),
  additionalNotes: z.string().optional().default(''),
})

export async function submitTomaAuto(formData: FormData) {
  const photoFiles: File[] = []
  formData.getAll('photos').forEach(f => {
    if (f instanceof File && f.size > 0) photoFiles.push(f)
  })

  const rawData: Record<string, string> = {}
  formData.forEach((value, key) => {
    if (typeof value === 'string') rawData[key] = value
  })

  const parsed = tomaAutoSchema.safeParse(rawData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const data = parsed.data

  const supabase = await createClient()
  const { data: car } = await supabase
    .from('cars')
    .select('id, title, user_id')
    .eq('id', data.vehicleId)
    .single()

  if (!car) return { error: 'Vehículo no encontrado' }

  const { data: owner } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', car.user_id)
    .single()

  if (!owner?.email) return { error: 'No se pudo contactar al publicante' }

  const photoUrls: string[] = []
  if (photoFiles.length > 0) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    for (const photo of photoFiles) {
      const buffer = Buffer.from(await photo.arrayBuffer())
      const ext = photo.name.split('.').pop() || 'jpg'
      const path = `toma-auto/${data.vehicleId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await admin.storage
        .from('toma-auto-photos')
        .upload(path, buffer, { contentType: photo.type })

      if (!uploadErr) {
        const { data: urlData } = admin.storage.from('toma-auto-photos').getPublicUrl(path)
        photoUrls.push(urlData.publicUrl)
      }
    }
  }

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
      tradeInTransmission: data.tradeInTransmission,
      tradeInMileage: data.tradeInMileage,
      tradeInExteriorColor: data.tradeInExteriorColor,
      tradeInInteriorColor: data.tradeInInteriorColor,
      paintCondition: data.paintCondition,
      interiorCondition: data.interiorCondition,
      engineCondition: data.engineCondition,
      transmissionCondition: data.transmissionCondition,
      additionalNotes: data.additionalNotes,
      photoUrls,
    }),
  })

  return { success: true }
}
