'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/features/email/services/emailService'
import WelcomeEmail from '@/features/email/templates/WelcomeEmail'
import React from 'react'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  // Send welcome email (fire-and-forget, don't block signup flow)
  if (data.user) {
    sendEmail({
      to: email,
      subject: 'Bienvenido a Rolplace!',
      react: React.createElement(WelcomeEmail, {
        userName: email.split('@')[0],
        appName: 'Rolplace',
        loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      }),
      userId: data.user.id,
    }).catch(() => {})
  }

  revalidatePath('/', 'layout')
  redirect('/check-email')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const tasaRaw = formData.get('tasa_interes_anual') as string
  const plazoRaw = formData.get('plazo_credito_meses') as string
  const engancheRaw = formData.get('enganche_porcentaje') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string || null,
      whatsapp: formData.get('whatsapp') as string || null,
      whatsapp_mensaje: formData.get('whatsapp_mensaje') as string || null,
      tasa_interes_anual: tasaRaw ? parseFloat(tasaRaw) : null,
      plazo_credito_meses: plazoRaw ? parseInt(plazoRaw, 10) : null,
      enganche_porcentaje: engancheRaw ? parseFloat(engancheRaw) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getContactPhone(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('phone')
    .limit(1)
    .single()
  return data?.phone || null
}
