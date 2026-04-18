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

export async function createCar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Get images array from FormData
  const imagesData = formData.get('images')
  const images = imagesData ? JSON.parse(imagesData as string) : []

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
      images: images.length > 0 ? images : null,
      featured: formData.get('featured') === 'true',
    })

  if (error) {
    redirect('/dashboard/cars/new?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard')
  revalidatePath('/inventory')
  redirect('/dashboard/cars')
}

export async function updateCar(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get images array from FormData
  const imagesData = formData.get('images')
  const images = imagesData ? JSON.parse(imagesData as string) : []

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
      images: images.length > 0 ? images : null,
      featured: formData.get('featured') === 'true',
      status: formData.get('status') as 'available' | 'sold' | 'reserved',
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
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
