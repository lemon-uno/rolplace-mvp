'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Car } from '@/types/database'

export async function getCars(): Promise<Car[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cars:', error)
    return []
  }

  return data || []
}

export async function getUserCars(): Promise<Car[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user cars:', error)
    return []
  }

  return data || []
}

export async function getCarById(id: string): Promise<Car | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching car:', error)
    return null
  }

  return data
}

export async function createCar(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autenticado. Inicia sesión.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Perfil no encontrado. Inicia sesión.' }
  }

  // Get images array from FormData
  const imagesData = formData.get('images')
  const images = imagesData ? JSON.parse(imagesData as string) : []

  const booleanFields = [
    'xenon_headlights', 'aluminum_rims', 'fog_lights', 'front_fog_lights', 'rear_fog_lights',
    'roof_rack', 'color_matched_bumpers', 'tow_bar', 'rear_wiper',
    'folding_rear_seats', 'cup_holders', 'leather_upholstery', 'rear_headrests',
    'cruise_control', 'lights_reminder', 'trip_computer', 'sunroof', 'climate_control',
    'rain_sensor', 'rear_defroster', 'air_conditioning', 'power_mirrors', 'headlight_control',
    'power_driver_seat', 'light_sensor', 'parking_sensor', 'power_windows',
    'remote_trunk_release', 'power_seats', 'central_locking', 'spare_tire',
    'abs_brakes', 'alarm', 'driver_airbag', 'electronic_brake_assist', 'engine_immobilizer',
    'passenger_airbag', 'side_airbags', 'stability_control', 'steering_wheel_controls',
    'third_brake_light', 'curtain_airbags', 'armor',
    'gps', 'am_fm_radio', 'bluetooth', 'cd_player', 'dvd_player', 'mp3_player', 'sd_card', 'usb_port',
  ]

  const features: Record<string, boolean> = {}
  for (const field of booleanFields) {
    features[field] = formData.get(field) === 'true'
  }

  const invoiceValue = formData.get('invoice') as string
  const ownersValue = formData.get('owners') as string

  const { error } = await supabase
    .from('cars')
    .insert({
      user_id: user.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      year: parseInt(formData.get('year') as string),
      mileage: formData.get('mileage') as string,
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      version: formData.get('version') as string,
      invoice: invoiceValue || null,
      motor: formData.get('motor') as string || null,
      owners: ownersValue ? parseInt(ownersValue) : null,
      images: images.length > 0 ? images : null,
      featured: formData.get('featured') === 'true',
      exterior_color: formData.get('exterior_color') as string || '',
      interior_color: formData.get('interior_color') as string || '',
      ...features,
    })

  if (error) {
    console.error('Supabase insert error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/inventory')
  return { success: true }
}

export async function updateCar(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const imagesData = formData.get('images')
  const images = imagesData ? JSON.parse(imagesData as string) : []

  const booleanFields = [
    'xenon_headlights', 'aluminum_rims', 'fog_lights', 'front_fog_lights', 'rear_fog_lights',
    'roof_rack', 'color_matched_bumpers', 'tow_bar', 'rear_wiper',
    'folding_rear_seats', 'cup_holders', 'leather_upholstery', 'rear_headrests',
    'cruise_control', 'lights_reminder', 'trip_computer', 'sunroof', 'climate_control',
    'rain_sensor', 'rear_defroster', 'air_conditioning', 'power_mirrors', 'headlight_control',
    'power_driver_seat', 'light_sensor', 'parking_sensor', 'power_windows',
    'remote_trunk_release', 'power_seats', 'central_locking', 'spare_tire',
    'abs_brakes', 'alarm', 'driver_airbag', 'electronic_brake_assist', 'engine_immobilizer',
    'passenger_airbag', 'side_airbags', 'stability_control', 'steering_wheel_controls',
    'third_brake_light', 'curtain_airbags', 'armor',
    'gps', 'am_fm_radio', 'bluetooth', 'cd_player', 'dvd_player', 'mp3_player', 'sd_card', 'usb_port',
  ]

  const features: Record<string, boolean> = {}
  for (const field of booleanFields) {
    features[field] = formData.get(field) === 'true'
  }

  const invoiceValue = formData.get('invoice') as string
  const ownersValue = formData.get('owners') as string

  const { error } = await supabase
    .from('cars')
    .update({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      year: parseInt(formData.get('year') as string),
      mileage: formData.get('mileage') as string,
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      version: formData.get('version') as string,
      invoice: invoiceValue || null,
      motor: formData.get('motor') as string || null,
      owners: ownersValue ? parseInt(ownersValue) : null,
      images: images.length > 0 ? images : null,
      featured: formData.get('featured') === 'true',
      status: formData.get('status') as 'available' | 'sold' | 'reserved',
      exterior_color: formData.get('exterior_color') as string || '',
      interior_color: formData.get('interior_color') as string || '',
      ...features,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Supabase update error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/inventory')
  revalidatePath(`/inventory/${id}`)
  return { success: true }
}

export async function deleteCar(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/inventory')
  return { success: true }
}
