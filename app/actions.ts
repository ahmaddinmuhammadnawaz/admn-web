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
    console.error('Error adding Account:', error)
    throw new Error('Failed to add Account')
  }
  revalidatePath('/ledger')
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
  revalidatePath('/ledger')
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
    return redirect(`/settings?error=${encodeURIComponent(updateError.message)}`)
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
  revalidatePath('/ledger')
  redirect('/ledger')
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
  revalidatePath('/ledger')
  revalidatePath(`/account/${accountId}`)
}
export async function exportData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch smaller tables normally
  const [
    { data: folders },
    { data: accounts },
    { data: dailyPages },
    { data: dailyEntries },
  ] = await Promise.all([
    supabase.from('folders').select('*'),
    supabase.from('accounts').select('*'),
    supabase.from('daily_pages').select('*'),
    supabase.from('daily_entries').select('*'),
  ])

  // Batch fetch massive tables to prevent Vercel out-of-memory (OOM) crashes
  let entries: any[] = []
  let hasMore = true
  let offset = 0
  const BATCH_SIZE = 10000

  while (hasMore) {
    const { data } = await supabase
      .from('ledger_entries')
      .select('*')
      .range(offset, offset + BATCH_SIZE - 1)

    if (data && data.length > 0) {
      entries.push(...data)
      offset += BATCH_SIZE
    } else {
      hasMore = false
    }
  }

  // Return a tightly packed JSON string including the new tables (Bumped version to 3)
  return JSON.stringify({
    version: 3,
    timestamp: new Date().toISOString(),
    folders,
    accounts,
    entries,
    dailyPages,
    dailyEntries
  })
}
export async function importData(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/settings?error=Unauthorized')

  try {
    const file = formData.get('backupFile') as File
    if (!file) throw new Error('No file uploaded')

    const fileContent = await file.text()
    const parsedData = JSON.parse(fileContent)

    // 1. Restore Folders
    if (parsedData.folders && parsedData.folders.length > 0) {
      const { error: folderError } = await supabase.from('folders').upsert(parsedData.folders)
      if (folderError) throw folderError
    }

    // 2. Restore Accounts
    if (parsedData.accounts && parsedData.accounts.length > 0) {
      const { error: accountError } = await supabase.from('accounts').upsert(parsedData.accounts)
      if (accountError) throw accountError
    }

    // 3. Restore Master Ledger Entries (with Legacy Data Sanitization)
    if (parsedData.entries && parsedData.entries.length > 0) {
      const cleanedEntries = parsedData.entries.map((entry: any) => {
        const { category_id, ...validEntryData } = entry
        return validEntryData
      })
      const { error: entryError } = await supabase.from('ledger_entries').upsert(cleanedEntries)
      if (entryError) throw entryError
    }

    // 4. Restore Entry Book Pages (New feature support)
    if (parsedData.daily_pages && parsedData.daily_pages.length > 0) {
      const { error: pageError } = await supabase.from('daily_pages').upsert(parsedData.daily_pages)
      if (pageError) throw pageError
    }

    // 5. Restore Entry Book Entries (New feature support)
    if (parsedData.daily_entries && parsedData.daily_entries.length > 0) {
      const { error: dailyEntryError } = await supabase.from('daily_entries').upsert(parsedData.daily_entries)
      if (dailyEntryError) throw dailyEntryError
    }

  } catch (error) {
    console.error("Import error:", error)
    redirect('/settings?error=Invalid+backup+file+or+import+failed')
  }

  redirect('/settings?success=Data+restored+successfully')
}
export async function deleteAllData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    // Delete in reverse order of dependency

    // 1. Delete Entries (they depend on accounts and pages)
    await supabase.from('daily_entries').delete().not('id', 'is', null)
    await supabase.from('ledger_entries').delete().not('id', 'is', null)

    // 2. Delete Daily Pages
    await supabase.from('daily_pages').delete().not('id', 'is', null)

    // 3. Delete accounts (they depend on folders)
    await supabase.from('accounts').delete().not('id', 'is', null)

    // 4. Delete folders LAST
    await supabase.from('folders').delete().not('id', 'is', null)

    revalidatePath('/')
    revalidatePath('/ledger')
    revalidatePath('/daily')
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
  revalidatePath('/ledger')
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
      // Reverted to standard PostgREST syntax for .not()
      .not('id', 'in', `(${selectedAccountIds.join(',')})`)
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
  revalidatePath('/ledger')
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

    revalidatePath('/ledger')

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
    revalidatePath('/ledger')
    return { success: true }
  } catch (err) {
    console.error('Unexpected Error:', err)
    return { error: 'An unexpected error occurred.' }
  }
}

// DAILY WORK ACTIONS
export async function createDailyPage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const date = formData.get('date') as string

  const { data, error } = await supabase.from('daily_pages').insert({ work_date: date }).select().single()

  if (error) {
    if (error.code === '23505') {
      // Return a graceful error instead of redirecting
      return { error: 'A page for this exact date already exists.' }
    }
    return { error: 'Failed to create page.' }
  }

  redirect(`/daily/${data.id}`)
}

export async function addDailyEntry(pageId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const type = formData.get('type') as string
  const amount = parseInt(formData.get('amount') as string, 10) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('daily_entries').insert({
    page_id: pageId,
    account_id: formData.get('account_id') as string,
    detail: formData.get('detail') as string || null,
    reference: formData.get('reference') as string || null,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount
  })
  if (error) throw new Error('Failed to add entry')
  revalidatePath(`/daily/${pageId}`)
}

export async function deleteDailyEntry(entryId: string, pageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('daily_entries').delete().eq('id', entryId)
  if (error) throw new Error('Failed to delete entry')
  revalidatePath(`/daily/${pageId}`)
}

export async function transferDailyToLedger(pageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Fetch page
  const { data: page } = await supabase.from('daily_pages').select('*').eq('id', pageId).single()
  if (!page || page.is_transferred) throw new Error('Invalid or already transferred page')

  // 2. Fetch entries
  const { data: entries } = await supabase.from('daily_entries').select('*').eq('page_id', pageId)
  if (!entries || entries.length === 0) throw new Error('No entries to transfer')

  // 3. Map to ledger formatting
  const ledgerPayload = entries.map(e => ({
    account_id: e.account_id,
    debit: e.debit,
    credit: e.credit,
    page_no: page.page_no.toString(),
    detail: e.detail,
    reference: e.reference,
    entry_date: page.work_date
  }))

  // 4. Batch Insert to ledger
  const { error: insertError } = await supabase.from('ledger_entries').insert(ledgerPayload)
  if (insertError) throw new Error('Failed to transfer to ledger')

  // 5. Lock the daily page
  await supabase.from('daily_pages').update({ is_transferred: true }).eq('id', pageId)

  revalidatePath(`/daily/${pageId}`)
  revalidatePath('/daily')
  revalidatePath('/ledger')
}

export async function updateDailyEntry(entryId: string, pageId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const type = formData.get('type') as string
  const amount = parseInt(formData.get('amount') as string, 10) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('daily_entries').update({
    account_id: formData.get('account_id') as string,
    detail: (formData.get('detail') as string) || null,
    reference: (formData.get('reference') as string) || null,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount
  }).eq('id', entryId)

  if (error) throw new Error('Failed to update entry')
  revalidatePath(`/daily/${pageId}`)
}

export async function deleteDailyPage(pageId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Double-check if the page is transferred just to be safe
    const { data: page } = await supabase.from('daily_pages').select('is_transferred').eq('id', pageId).single()
    if (page?.is_transferred) {
      return { error: 'Cannot delete a page that has already been transferred to the ledger.' }
    }

    // Delete entries first
    await supabase.from('daily_entries').delete().eq('page_id', pageId)

    // Delete the page
    const { error } = await supabase.from('daily_pages').delete().eq('id', pageId)

    if (error) {
      console.error('Database Error:', error)
      return { error: 'Failed to delete the page.' }
    }

    revalidatePath('/daily')
    return { success: true }
  } catch (err) {
    console.error('Unexpected Error:', err)
    return { error: 'An unexpected error occurred.' }
  }
}