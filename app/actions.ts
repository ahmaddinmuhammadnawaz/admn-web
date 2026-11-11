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

export async function signOut() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  await supabase.auth.signOut()
  redirect('/login')
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

export async function deleteAccount(accountId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Delete un-transferred daily entries associated with this account
  const { error: dailyError } = await supabase
    .from('daily_entries')
    .delete()
    .eq('account_id', accountId)
  if (dailyError) {
    console.error('Error deleting daily entries:', dailyError)
    throw new Error('Failed to delete daily entries')
  }

  // 2. Delete un-transferred daybook entries associated with this account
  const { error: daybookError } = await supabase
    .from('daybook_entries')
    .delete()
    .eq('account_id', accountId)
  if (daybookError) {
    console.error('Error deleting daybook entries:', daybookError)
    throw new Error('Failed to delete daybook entries')
  }

  // 3. Delete all ledger entries associated with this account
  const { error: entriesError } = await supabase
    .from('ledger_entries')
    .delete()
    .eq('account_id', accountId)
  if (entriesError) {
    console.error('Error deleting ledger entries:', entriesError)
    throw new Error('Failed to delete ledger entries')
  }

  // 4. Finally, delete the account itself
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
  redirect('/ledger', 'replace')
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

  const PAGE = 1000

  async function fetchAll(table: string) {
    const rows: any[] = []
    let from = 0

    while (true) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1)

      if (error) throw new Error(`Export failed on ${table}: ${error.message}`)
      if (!data || data.length === 0) break

      rows.push(...data)
      from += data.length
    }

    // Safety check: make sure we got every row
    const { count, error: countError } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })

    if (countError) throw new Error(`Count failed on ${table}: ${countError.message}`)
    if (count !== rows.length) {
      throw new Error(`Export mismatch on ${table}: expected ${count}, got ${rows.length}`)
    }

    return rows
  }

  const [folders, accounts, entries, dailyPages, dailyEntries, daybookPages, daybookEntries] =
    await Promise.all([
      fetchAll('folders'),
      fetchAll('accounts'),
      fetchAll('ledger_entries'),
      fetchAll('daily_pages'),
      fetchAll('daily_entries'),
      fetchAll('daybook_pages'),
      fetchAll('daybook_entries'),
    ])

  return JSON.stringify({
    version: 4,
    timestamp: new Date().toISOString(),
    counts: {
      folders: folders.length,
      accounts: accounts.length,
      ledger_entries: entries.length,
      daily_pages: dailyPages.length,
      daily_entries: dailyEntries.length,
      daybook_pages: daybookPages.length,
      daybook_entries: daybookEntries.length,
    },
    folders,
    accounts,
    entries,
    dailyPages,
    dailyEntries,
    daybookPages,
    daybookEntries,
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
    if (parsedData.dailyPages && parsedData.dailyPages.length > 0) {
      const { error: pageError } = await supabase.from('daily_pages').upsert(parsedData.dailyPages)
      if (pageError) throw pageError
    }

    // 5. Restore Entry Book Entries (New feature support)
    if (parsedData.dailyEntries && parsedData.dailyEntries.length > 0) {
      const { error: dailyEntryError } = await supabase.from('daily_entries').upsert(parsedData.dailyEntries)
      if (dailyEntryError) throw dailyEntryError
    }

    // 6. Restore Day Book Pages
    if (parsedData.daybookPages && parsedData.daybookPages.length > 0) {
      const { error: daybookPageError } = await supabase.from('daybook_pages').upsert(parsedData.daybookPages)
      if (daybookPageError) throw daybookPageError
    }

    // 7. Restore Day Book Entries
    if (parsedData.daybookEntries && parsedData.daybookEntries.length > 0) {
      const { error: daybookEntryError } = await supabase.from('daybook_entries').upsert(parsedData.daybookEntries)
      if (daybookEntryError) throw daybookEntryError
    }

  } catch (error) {
    console.error("Import error:", error)
    redirect('/settings?error=Invalid+backup+file+or+import+failed')
  }

  redirect('/settings?success=Data+restored+successfully')
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
  const amount = parseFloat(formData.get('amount') as string) || 0
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

  const { data: page } = await supabase.from('daily_pages').select('*').eq('id', pageId).single()
  if (!page || page.is_transferred) throw new Error('Invalid or already transferred page')

  // FIX: Add .order() to ensure correct sequence
  const { data: entries } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: true })
    
  if (!entries || entries.length === 0) throw new Error('No entries to transfer')

  const ledgerPayload = entries.map(e => ({
    account_id: e.account_id,
    debit: e.debit,
    credit: e.credit,
    page_no: page.page_no.toString(),
    detail: e.detail,
    reference: e.reference,
    entry_date: page.work_date,
    created_at: e.created_at // FIX: Pass the original timestamp to break SQL ties
  }))

  const { error: insertError } = await supabase.from('ledger_entries').insert(ledgerPayload)
  if (insertError) throw new Error('Failed to transfer to ledger')

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
  const amount = parseFloat(formData.get('amount') as string) || 0
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

// --- DAY BOOK ACTIONS ---
export async function createDaybookPage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const date = formData.get('date') as string

  const { data, error } = await supabase.from('daybook_pages').insert({ work_date: date }).select().single()

  if (error) {
    if (error.code === '23505') return { error: 'A page for this exact date already exists.' }
    return { error: 'Failed to create page.' }
  }
  redirect(`/daybook/${data.id}`)
}

export async function addDaybookEntry(pageId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const type = formData.get('type') as string
  const amount = parseFloat(formData.get('amount') as string) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('daybook_entries').insert({
    page_id: pageId,
    account_id: formData.get('account_id') as string,
    detail: formData.get('detail') as string || null,
    reference: formData.get('reference') as string || null,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount
  })
  if (error) throw new Error('Failed to add entry')
  revalidatePath(`/daybook/${pageId}`)
}

export async function updateDaybookEntry(entryId: string, pageId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const type = formData.get('type') as string
  const amount = parseFloat(formData.get('amount') as string) || 0
  const isDebit = type === 'Debit'

  const { error } = await supabase.from('daybook_entries').update({
    account_id: formData.get('account_id') as string,
    detail: (formData.get('detail') as string) || null,
    reference: (formData.get('reference') as string) || null,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount
  }).eq('id', entryId)

  if (error) throw new Error('Failed to update entry')
  revalidatePath(`/daybook/${pageId}`)
}

export async function deleteDaybookEntry(entryId: string, pageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('daybook_entries').delete().eq('id', entryId)
  if (error) throw new Error('Failed to delete entry')
  revalidatePath(`/daybook/${pageId}`)
}

export async function deleteDaybookPage(pageId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: page } = await supabase.from('daybook_pages').select('is_transferred').eq('id', pageId).single()
    if (page?.is_transferred) return { error: 'Cannot delete a transferred page.' }

    await supabase.from('daybook_entries').delete().eq('page_id', pageId)
    const { error } = await supabase.from('daybook_pages').delete().eq('id', pageId)
    if (error) return { error: 'Failed to delete the page.' }

    revalidatePath('/daybook')
    return { success: true }
  } catch (err) {
    return { error: 'An unexpected error occurred.' }
  }
}

export async function transferDaybookToLedger(pageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: page } = await supabase.from('daybook_pages').select('*').eq('id', pageId).single()
  if (!page || page.is_transferred) throw new Error('Invalid or already transferred page')

  // FIX: Add .order() to ensure correct sequence
  const { data: entries } = await supabase
    .from('daybook_entries')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: true })

  if (!entries || entries.length === 0) throw new Error('No entries to transfer')

  const ledgerPayload = entries.map(e => ({
    account_id: e.account_id,
    debit: e.debit,
    credit: e.credit,
    page_no: `DB-${page.page_no}`,
    detail: e.detail,
    reference: e.reference,
    entry_date: page.work_date,
    created_at: e.created_at // FIX: Pass the original timestamp to break SQL ties
  }))

  const { error: insertError } = await supabase.from('ledger_entries').insert(ledgerPayload)
  if (insertError) throw new Error('Failed to transfer to ledger')

  await supabase.from('daybook_pages').update({ is_transferred: true }).eq('id', pageId)

  revalidatePath(`/daybook/${pageId}`)
  revalidatePath('/daybook')
  revalidatePath('/ledger')
}