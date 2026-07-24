'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addFarmer(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.from('farmers').insert({
    name: formData.get('name') as string,
    father_name: (formData.get('father_name') as string) || null,
    area: (formData.get('area') as string) || null,
    phone: (formData.get('phone') as string) || null,
    reference_person: (formData.get('reference_person') as string) || null,
    status: 'Active',
  }).select().single()

  if (error) {
    console.error('Error adding farmer:', error)
    throw new Error('Failed to add farmer')
  }

  // Refresh the dashboard and redirect to the new farmer's ledger
  revalidatePath('/')
  redirect(`/farmer/${data.id}`)
}

export async function addLedgerEntry(farmerId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as string // 'debit' or 'credit'
  const amount = parseFloat(formData.get('amount') as string) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('ledger_entries').insert({
    farmer_id: farmerId,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount,
    page_no: (formData.get('page_no') as string) || null,
    detail: (formData.get('detail') as string) || null,
    reference: (formData.get('reference') as string) || null,
    entry_date: (formData.get('entry_date') as string) || new Date().toISOString().split('T')[0],
  })

  if (error) {
    console.error('Error adding entry:', error)
    throw new Error('Failed to add entry')
  }

  // Refresh the ledger page and redirect back to it
  revalidatePath(`/farmer/${farmerId}`)
  redirect(`/farmer/${farmerId}`)
}
export async function signOut() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  await supabase.auth.signOut()
  redirect('/login')
}
export async function deleteLedgerEntry(entryId: string, farmerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('ledger_entries')
    .delete()
    .eq('id', entryId)

  if (error) {
    console.error('Error deleting entry:', error)
    throw new Error('Failed to delete entry')
  }

  // Refresh the ledger page to show the updated running balance
  revalidatePath(`/farmer/${farmerId}`)
}

export async function toggleFarmerStatus(farmerId: string, currentStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active'
  
  const { error } = await supabase
    .from('farmers')
    .update({ status: newStatus })
    .eq('id', farmerId)

  if (error) {
    console.error('Error updating status:', error)
    throw new Error('Failed to update status')
  }

  // Refresh both the specific ledger page and the main dashboard
  revalidatePath(`/farmer/${farmerId}`)
  revalidatePath('/')
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (newPassword !== confirmPassword) {
    return redirect('/settings?error=Passwords do not match')
  }

  // Get current user to verify their email
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error('Unauthorized')

  // Verify the old password is correct
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.user.email!, 
    password: oldPassword,
  })

  if (signInError) {
    return redirect('/settings?error=Old password is incorrect')
  }

  // Set the new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return redirect(`/settings?error=${updateError.message}`)
  }

  return redirect('/settings?success=Password updated successfully')
}

export async function editLedgerEntry(entryId: string, farmerId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as string // 'Debit' or 'Credit'
  const amount = parseFloat(formData.get('amount') as string) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase
    .from('ledger_entries')
    .update({
      debit: isDebit ? amount : 0,
      credit: isDebit ? 0 : amount,
      page_no: (formData.get('page_no') as string) || null,
      detail: (formData.get('detail') as string) || null,
      reference: (formData.get('reference') as string) || null,
      entry_date: (formData.get('entry_date') as string) || new Date().toISOString().split('T')[0],
    })
    .eq('id', entryId)

  if (error) {
    console.error('Error updating entry:', error)
    throw new Error('Failed to update entry')
  }

  // Refresh the ledger page and redirect back to it
  revalidatePath(`/farmer/${farmerId}`)
  redirect(`/farmer/${farmerId}`)
}
export async function deleteFarmer(farmerId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // First, delete all ledger entries associated with this farmer
  const { error: entriesError } = await supabase
    .from('ledger_entries')
    .delete()
    .eq('farmer_id', farmerId)

  if (entriesError) {
    console.error('Error deleting ledger entries:', entriesError)
    throw new Error('Failed to delete ledger entries')
  }

  // Then, delete the farmer account
  const { error: farmerError } = await supabase
    .from('farmers')
    .delete()
    .eq('id', farmerId)

  if (farmerError) {
    console.error('Error deleting farmer:', farmerError)
    throw new Error('Failed to delete farmer')
  }

  // Refresh the main dashboard and redirect to it
  revalidatePath('/')
  redirect('/')
}