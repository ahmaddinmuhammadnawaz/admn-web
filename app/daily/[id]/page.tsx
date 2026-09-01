import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import BackButton from '@/components/BackButton'
import DailyEntryClient from './DailyEntryClient'
import TransferButton from './TransferButton'
import DeleteDailyPageButton from './DeleteDailyPageButton'
import { notFound } from 'next/navigation'

export default async function DailyPageDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [ { data: page }, { data: entries }, { data: accounts } ] = await Promise.all([
    supabase.from('daily_pages').select('*').eq('id', id).single(),
    supabase.from('daily_entries').select('*, accounts(name)').eq('page_id', id).order('created_at', { ascending: true }),
    supabase.from('accounts').select('id, name, area').eq('status', 'Active').order('name')
  ])

  if (!page) notFound()

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col relative pb-28">
      
      {/* --- CLEAN TOP BAR --- */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 text-white min-w-0">
            <Link href="/daily" className="text-white/80 hover:text-white transition-colors shrink-0 p-1 -ml-1">
              <ArrowLeft size={22} strokeWidth={2.25} />
            </Link>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate tnum">
                {new Date(page.work_date + 'T00:00:00').toLocaleDateString('en-GB')}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-white/60 font-medium flex items-center gap-1.5">
                  <FileText size={14} strokeWidth={2} /> Page No. {page.page_no}
                </p>
                {page.is_transferred ? (
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">Transferred</span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto pl-[34px] sm:pl-0">
              {/* Delete button (only if not transferred) */}
              {!page.is_transferred && (
                <DeleteDailyPageButton pageId={page.id} />
              )}

              {/* Only show transfer button if there are entries and it's not transferred yet */}
              {!page.is_transferred && entries && entries.length > 0 && (
                <div className="flex-1 sm:flex-none">
                  <TransferButton pageId={page.id} />
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <DailyEntryClient page={page} entries={entries || []} accounts={accounts || []} />
      </div>
    </main>
  )
}