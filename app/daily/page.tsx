import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Search, FileText, Receipt, Settings, ClipboardList } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import { signOut } from '@/app/actions'
import CreateDailyFab from '@/components/CreateDailyFab'
import DailySearch from './DailySearch'

export default async function DailyDashboard({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const { q } = await searchParams

  // FIX: Limit to the most recent 100 pages to prevent memory crashes, and show newest first
  const { data: pages } = await supabase
    .from('daily_pages')
    .select('*')
    .order('work_date', { ascending: false })
    .limit(100)

const filteredPages = pages?.filter(p => {
    if (!q) return true;

    const query = q.toLowerCase().trim()
    const [year, month, day] = p.work_date.split('-')
    const formatDash = `${day}-${month}-${year}`
    const formatSlash = `${day}/${month}/${year}`

    return (
      formatDash.includes(query) ||
      formatSlash.includes(query) ||
      p.work_date.includes(query)
    )
  })

  return (
   <main className="bg-[#F7F8FA] min-h-screen flex flex-col relative pb-28">
      
      {/* --- STANDARD DARK TOP BAR --- */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          
          {/* LEFT SIDE: Back Button & Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-white/80 hover:text-white transition-colors shrink-0 p-1 -ml-1">
              <ArrowLeft size={22} strokeWidth={2.25} />
            </Link>
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-inner overflow-hidden bg-[#2A313C]">
              <Image
                src="/icon.png"
                alt="App Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="font-bold text-lg tracking-wide truncate">Entry Book</span>
          </div>

          {/* RIGHT SIDE: REPLACE THIS ENTIRE BLOCK WITH YOUR SNIPPET */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/history?source=daily" className="text-white/70 hover:text-white transition-colors flex items-center gap-2" title="Outstanding Balances">
              <ClipboardList size={20} className="md:hidden" />
              <span className="hidden md:inline text-sm font-medium">Outstanding</span>
            </Link>
            
            <Link href="/settings" className="text-white/70 hover:text-white transition-colors flex items-center gap-2" title="Settings">
              <Settings size={20} className="md:hidden" />
              <span className="hidden md:inline text-sm font-medium">Settings</span>
            </Link>

            {/* Keep the divider and logout button that come right after it */}
            <div className="w-px h-5 bg-white/20 hidden sm:block"></div>

            <form action={signOut}>
              <LogoutButton />
            </form>
          </div>
          {/* END OF REPLACEMENT */}

        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        {/* Search Bar with Show All Button */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
          <DailySearch initialQuery={q} />
        </div>

        {/* List Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPages?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center text-[#6B7280]">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4">
                <FileText size={24} strokeWidth={1.75} />
              </div>
              <p className="text-base font-medium text-gray-700">No Entry pages found</p>
            </div>
          )}

          {filteredPages?.map(page => (
            <Link href={`/daily/${page.id}`} key={page.id} className="block group">
              <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm group-hover:border-[#131924] group-hover:shadow-md transition-all h-full flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg text-gray-800 tnum">{new Date(page.work_date + 'T00:00:00').toLocaleDateString('en-GB')}</h2>
                  </div>
                  <div className="shrink-0">
                    {page.is_transferred ? (
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-green-50 text-green-700 border border-green-100">Transferred</span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CreateDailyFab />
    </main>
  )
}