'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOwnerFinancingSettings(carId: string) {
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('user_id')
    .eq('id', carId)
    .single()

  if (!car) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('tasa_interes_anual, plazo_credito_meses, enganche_porcentaje')
    .eq('id', car.user_id)
    .single()

  if (!profile) return null

  return {
    tasaInteresAnual: profile.tasa_interes_anual,
    plazoCreditoMeses: profile.plazo_credito_meses,
    enganchePorcentaje: profile.enganche_porcentaje,
  }
}
