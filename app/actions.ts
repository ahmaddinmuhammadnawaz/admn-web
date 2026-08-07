'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
export async function addaccount(formData: FormData) {
  const supabase = await createClient()
  const folderId = formData.get('folder_id') as string
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
    folder_id: folderId === 'none' ? null : folderId, // Add this line
    status: 'Active',
  }).select().single()
  if (error) {
    console.error('Error adding Page:', error)
    throw new Error('Failed to add Page')
  }
  revalidatePath('/')
  return data.id // RETURN the ID instead of redirecting
}
export async function addLedgerEntry(accountId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as string
  const amount = parseInt(formData.get('amount') as string, 10) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('ledger_entries').insert({
    account_id: accountId,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount,
    page_no: (formData.get('page_no') as string) || null,
    detail: (formData.get('detail') as string) || null,
    reference: (formData.get('reference') as string) || null,
    entry_date: (formData.get('entry_date') as string) || new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Karachi' }),
  })

  if (error) {
    console.error('Error adding entry:', error)
    throw new Error('Failed to add entry')
  }

  // Revalidate the ledger path data cache
  revalidatePath(`/account/${accountId}`)
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
      entry_date: (formData.get('entry_date') as string) || new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Karachi' }),
    })
    .eq('id', entryId)
  if (error) {
    console.error('Error updating entry:', error)
    throw new Error('Failed to update entry')
  }
  // Refresh the ledger page and redirect back to it
  revalidatePath(`/account/${accountId}`)
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
  const folderId = formData.get('folder_id') as string
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
    folder_id: folderId === 'none' ? null : folderId,
  }).eq('id', accountId)
  if (error) {
    console.error('Error updating account:', error)
    throw new Error('Failed to update account')
  }
  // Refresh the dashboard and redirect to the account's ledger
  revalidatePath('/')
  revalidatePath(`/account/${accountId}`)
}
export async function exportData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  // Fetch accounts, entries, and folders with explicit high limits
  const { data: accounts } = await supabase.from('accounts').select('*').limit(100000)
  const { data: entries } = await supabase.from('ledger_entries').select('*').limit(500000)
  const { data: folders } = await supabase.from('folders').select('*').limit(10000) // <-- Added folders fetch
  // Return a tightly packed JSON string including folders
  return JSON.stringify({ 
    version: 2, 
    timestamp: new Date().toISOString(),
    folders, // <-- Included in backup
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
    // Restore in top-down order to satisfy foreign keys: Folders -> Accounts -> Entries
    if (data.folders && data.folders.length > 0) {
      const { error: folderError } = await supabase
        .from('folders')
        .upsert(data.folders, { onConflict: 'id' })
      if (folderError) throw folderError
    }
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
  redirect('/settings?success=Data and folders restored successfully without duplicates')
}
export async function deleteAllData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  try {
    // 1. Delete entries first (they depend on accounts)
    await supabase.from('ledger_entries').delete().not('id', 'is', null)
    // 2. Delete accounts second (they depend on folders)
    await supabase.from('accounts').delete().not('id', 'is', null)
    // 3. Delete folders LAST (nothing depends on them anymore)
    await supabase.from('folders').delete().not('id', 'is', null)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error resetting database:', error)
    return { error: 'Failed to delete all data.' }
  }
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
export async function createFolder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('folders').insert({
    name: formData.get('name') as string,
  })
  if (error) {
    console.error('Error creating folder:', error)
    throw new Error('Failed to create folder')
  }
  revalidatePath('/')
}
export async function manageFolderAccounts(folderId: string, selectedAccountIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  if (selectedAccountIds.length > 0) {
    // 1. Remove folder_id from accounts that are CURRENTLY in this folder but were UNCHECKED
      await supabase.from('accounts')
        .update({ folder_id: null })
        .eq('folder_id', folderId)
        // FIX: Pass the array directly instead of a joined SQL-style string
        .not('id', 'in', selectedAccountIds)
    // 2. Add this folder_id to all CHECKED accounts
    await supabase.from('accounts')
      .update({ folder_id: folderId })
      .in('id', selectedAccountIds)
  } else {
    // If the array is empty (user unchecked everything), remove all accounts from this folder
    await supabase.from('accounts')
      .update({ folder_id: null })
      .eq('folder_id', folderId)
  }
  // Refresh the UI
  revalidatePath(`/folder/${folderId}`)
  revalidatePath('/')
}
// --- SAFE FOLDER ACTIONS ---
export async function editFolder(folderId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'You must be logged in to do this.' }
    const newName = formData.get('name') as string
    const { error } = await supabase

      .from('folders')

      .update({ name: newName })

      .eq('id', folderId)
    if (error) {

      console.error('Database Error:', error)

      return { error: 'Failed to update the folder name. Please try again.' }

    }
    // Refresh both the home screen and the folder page

    revalidatePath('/')

    revalidatePath(`/folder/${folderId}`)
    return { success: true }

  } catch (err) {

    console.error('Unexpected Error:', err)

    return { error: 'An unexpected error occurred.' }

  }

}
export async function deleteFolder(folderId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'You must be logged in to do this.' }

    // explicitly detach all accounts so they return to the home screen
    await supabase
      .from('accounts')
      .update({ folder_id: null })
      .eq('folder_id', folderId)

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)

    if (error) {
      console.error('Database Error:', error)
      return { error: 'Failed to delete the folder. Please try again.' }
    }
    // Refresh the home screen and redirect to it
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Unexpected Error:', err)
    return { error: 'An unexpected error occurred.' }
  }
}