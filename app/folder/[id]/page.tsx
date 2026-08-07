import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Folder } from 'lucide-react'
import DashboardClient from '@/app/DashboardClient'
import ManageFolderAccounts from '@/components/ManageFolderAccounts'
import DeleteFolderButton from '@/components/DeleteFolderButton'
import EditFolderButton from '@/components/EditFolderButton'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the specific folder
  const { data: folder } = await supabase.from('folders').select('*').eq('id', id).single()
  if (!folder) notFound()

  // Fetch ALL accounts and the aggregated balances simultaneously
  const [ { data: allAccounts }, { data: balances } ] = await Promise.all([
    supabase.from('accounts').select('id, name, folder_id, area, status').order('name'),
    supabase.rpc('get_account_balances') // Fetches grouped balances instead of raw entries
  ])
  
  // Filter out only the accounts that currently belong to this folder for the main view
  const folderAccounts = allAccounts?.filter(a => a.folder_id === id) || []
  
  const balanceMap: Record<string, number> = {}
  balances?.forEach((b: any) => {
    balanceMap[b.account_id] = Number(b.balance) || 0
  })

  const accountsWithBalance = folderAccounts.map(account => ({
    ...account,
    balance: Math.round((balanceMap[account.id] || 0) * 100) / 100,
  }))

  return (
    <main className="bg-[#F7F8FA] min-h-screen relative pb-28">
      <div className="bg-[#131924] w-full safe-top">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white min-w-0 pr-4">
            <Link href="/" className="hover:text-gray-300 shrink-0">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Folder size={24} className="text-white/80 shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold truncate">{folder.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <ManageFolderAccounts folderId={folder.id} allAccounts={allAccounts || []} />
            <EditFolderButton folderId={folder.id} currentName={folder.name} />
            <DeleteFolderButton folderId={folder.id} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <DashboardClient 
          initialaccounts={accountsWithBalance} 
          isFolderView={true} 
        />
      </div>
    </main>
  )
}