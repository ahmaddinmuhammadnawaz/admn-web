import Link from 'next/link'
import Image from 'next/image'
import { Settings, ClipboardList, ArrowRight } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import { signOut } from '@/app/actions'

export default function HubPage() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col relative pb-28">
      
      {/* --- STANDARD DARK TOP BAR --- */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-inner overflow-hidden bg-[#2A313C]">
              <Image
                src="/icon.png"
                alt="App Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="font-bold text-lg tracking-wide truncate">ADMN</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/history?source=home" className="text-white/70 hover:text-white transition-colors flex items-center gap-2" title="Outstanding Balances">
              <ClipboardList size={20} className="md:hidden" />
              <span className="hidden md:inline text-sm font-medium">Outstanding</span>
            </Link>
            
            <Link href="/settings" className="text-white/70 hover:text-white transition-colors flex items-center gap-2" title="System Settings">
              <Settings size={20} className="md:hidden" />
              <span className="hidden md:inline text-sm font-medium">Settings</span>
            </Link>

            <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
            
            <form action={signOut}>
              <LogoutButton />
            </form>
          </div>
        </div>
      </div>

      {/* --- MAIN WORKSPACE CONTENT --- */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        
        {/* The 2-Book Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 max-w-4xl mx-auto mt-4 sm:mt-8">
          
          {/* BOOK 1: Master Ledger (Moved to First Position) */}
          <Link href="/ledger" className="group relative bg-white rounded-r-3xl rounded-l-md p-8 sm:p-12 shadow-[10px_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[16px_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full min-h-[420px] border-y border-[#E5E7EB] border-r-[4px] border-r-gray-200 border-l-[32px] border-l-[#131924]">
            
            {/* Book Spine Crease Illusion */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent pointer-events-none"></div>

            {/* Simulate book pages on the right edge */}
            <div className="absolute right-[-4px] top-2 bottom-2 w-2 bg-gradient-to-l from-gray-100 to-gray-50 border-r border-gray-300 rounded-r-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex-1 relative z-10 flex flex-col">
              {/* ADMN Publisher Brand Mark */}
              <div className="flex items-center gap-4 mb-16">
                <Image src="/icon.png" alt="ADMN" width={52} height={52} className="object-contain drop-shadow-sm rounded-2xl" />
                <span className="font-black text-2xl sm:text-3xl tracking-wide text-[#131924] uppercase">ADMN</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">Ledger Book</h2>
 
              <div className="mt-auto pt-6 border-t-2 border-gray-100">
                <p className="text-[11px] sm:text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">
                  Permanent Records
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Client Accounts & History
                </p>
              </div>
            </div>
          </Link>

          {/* BOOK 2: Daily Work (Moved to Second Position) */}
          <Link href="/daily" className="group relative bg-white rounded-r-3xl rounded-l-md p-8 sm:p-12 shadow-[10px_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[16px_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full min-h-[420px] border-y border-[#E5E7EB] border-r-[4px] border-r-gray-200 border-l-[32px] border-l-[#131924]">
            
            {/* Book Spine Crease Illusion */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent pointer-events-none"></div>

            {/* Simulate book pages on the right edge */}
            <div className="absolute right-[-4px] top-2 bottom-2 w-2 bg-gradient-to-l from-gray-100 to-gray-50 border-r border-gray-300 rounded-r-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex-1 relative z-10 flex flex-col">
              
              {/* ADMN Publisher Brand Mark */}
              <div className="flex items-center gap-4 mb-16">
                <Image src="/icon.png" alt="ADMN" width={52} height={52} className="object-contain drop-shadow-sm rounded-2xl" />
                <span className="font-black text-2xl sm:text-3xl tracking-wide text-[#131924] uppercase">ADMN</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">Entry Book</h2>
              
              <div className="mt-auto pt-6 border-t-2 border-gray-100">
                <p className="text-[11px] sm:text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">
                  Daily Transactions
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Cash Flow & Transfers
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  )
}