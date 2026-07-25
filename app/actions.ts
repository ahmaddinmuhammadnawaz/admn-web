'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function addaccount(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.from('accounts').insert({
    name: formData.get('name') as string,
    father_name: (formData.get('father_name') as string) || null,
    area: (formData.get('area') as string) || null,
    phone: (formData.get('phone') as string) || null,
    reference_person: (formData.get('reference_person') as string) || null,
    cnic: (formData.get('cnic') as string) || null, 
    crop: (formData.get('crop') as string) || null,
    note: (formData.get('note') as string) || null,
    status: 'Active',
  }).select().single()

  if (error) {
    console.error('Error adding Page:', error)
    throw new Error('Failed to add Page')
  }

  // Refresh the dashboard and redirect to the new account's ledger
  revalidatePath('/')
  redirect(`/account/${data.id}`)
}

export async function addLedgerEntry(accountId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as string // 'debit' or 'credit'
  const amount = parseInt(formData.get('amount') as string, 10) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('ledger_entries').insert({
    account_id: accountId,
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
  revalidatePath(`/account/${accountId}`)
  redirect(`/account/${accountId}`)
}
export async function signOut() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  await supabase.auth.signOut()
  redirect('/login')
}
export async function deleteLedgerEntry(entryId: string, accountId: string) {
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
  revalidatePath(`/account/${accountId}`)
}

export async function toggleAccountStatus(accountId: string, currentStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active'
  
  const { error } = await supabase
    .from('accounts')
    .update({ status: newStatus })
    .eq('id', accountId)

  if (error) {
    console.error('Error updating status:', error)
    throw new Error('Failed to update status')
  }

  // Refresh both the specific ledger page and the main dashboard
  revalidatePath(`/account/${accountId}`)
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

export async function editLedgerEntry(entryId: string, accountId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as string // 'Debit' or 'Credit'
  const amount = parseInt(formData.get('amount') as string, 10) || 0
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
  revalidatePath(`/account/${accountId}`)
  redirect(`/account/${accountId}`)
}
export async function deleteAccount(accountId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // First, delete all ledger entries associated with this account
  const { error: entriesError } = await supabase
    .from('ledger_entries')
    .delete()
    .eq('account_id', accountId)

  if (entriesError) {
    console.error('Error deleting ledger entries:', entriesError)
    throw new Error('Failed to delete ledger entries')
  }

  // Then, delete the account account
  const { error: accountError } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId)

  if (accountError) {
    console.error('Error deleting account:', accountError)
    throw new Error('Failed to delete account')
  }

  // Refresh the main dashboard and redirect to it
  revalidatePath('/')
  redirect('/')
}
export async function editaccount(accountId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('accounts').update({
    name: formData.get('name') as string,
    father_name: (formData.get('father_name') as string) || null,
    area: (formData.get('area') as string) || null,
    phone: (formData.get('phone') as string) || null,
    reference_person: (formData.get('reference_person') as string) || null,
    cnic: (formData.get('cnic') as string) || null, 
    crop: (formData.get('crop') as string) || null, 
    note: (formData.get('note') as string) || null,
  }).eq('id', accountId)

  if (error) {
    console.error('Error updating account:', error)
    throw new Error('Failed to update account')
  }

  // Refresh the dashboard and redirect to the account's ledger
  revalidatePath('/')
  revalidatePath(`/account/${accountId}`)
  redirect(`/account/${accountId}`)
}
export async function exportData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch absolutely everything from both tables
  const { data: accounts } = await supabase.from('accounts').select('*')
  const { data: entries } = await supabase.from('ledger_entries').select('*')

  // Return a tightly packed JSON string
  return JSON.stringify({ 
    version: 1, 
    timestamp: new Date().toISOString(),
    accounts, 
    entries 
  })
}

export async function importData(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('backupFile') as File
  if (!file) return redirect('/settings?error=No file selected')

  try {
    const fileContents = await file.text()
    const data = JSON.parse(fileContents)

    // Using { onConflict: 'id' } guarantees no duplicates. 
    // If the ID exists, it updates the record. If it's new, it inserts it.
    if (data.accounts && data.accounts.length > 0) {
      const { error: accountError } = await supabase
        .from('accounts')
        .upsert(data.accounts, { onConflict: 'id' })
      if (accountError) throw accountError
    }

    if (data.entries && data.entries.length > 0) {
      const { error: entryError } = await supabase
        .from('ledger_entries')
        .upsert(data.entries, { onConflict: 'id' })
      if (entryError) throw entryError
    }
  } catch (err) {
    console.error('Import error:', err)
    return redirect('/settings?error=Invalid backup file or import failed')
  }

  revalidatePath('/')
  redirect('/settings?success=Data restored successfully without duplicates')
}

export async function deleteAllData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // .not('id', 'is', null) is the safest way to target and delete ALL rows in Supabase
  // We delete entries first to prevent foreign key errors, then the accounts.
  await supabase.from('ledger_entries').delete().not('id', 'is', null)
  await supabase.from('accounts').delete().not('id', 'is', null)

  revalidatePath('/')
  redirect('/settings?success=All data has been permanently deleted')
}
export async function setYearFilter(formData: FormData) {
  // getAll retrieves an array of all checked checkboxes with the name "year"
  const years = formData.getAll('year') as string[]
  const cookieStore = await cookies()
  
  // If "All" is selected, or if they unchecked everything, default to 'All'
  if (years.includes('All') || years.length === 0) {
    cookieStore.set('selected_year', 'All', { path: '/' })
  } else {
    // Save as a comma-separated string (e.g., "2024,2025")
    cookieStore.set('selected_year', years.join(','), { path: '/' })
  }
  
  revalidatePath('/', 'layout')
  redirect('/settings?success=Financial years updated successfully')
}