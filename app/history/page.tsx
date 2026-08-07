import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Receipt } from 'lucide-react'
import PrintButton from '@/components/PrintButton'

export default async function HistoryPage() {
  const supabase = await createClient()

  // Query the new SQL View directly. This is extremely fast because 
  // the database does the math, and Next.js only downloads the final summaries.
  const { data: summaries, error } = await supabase
    .from('account_outstanding_summaries')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return <div className="p-8 text-red-600">Error loading history summary.</div>
  }

  let totalDebit = 0
  let totalCredit = 0

  // Only loop through the aggregated rows (e.g., 50 accounts instead of 5,000 entries)
  const summaryList = summaries || []
  summaryList.forEach(summary => {
    totalDebit += Number(summary.total_debit) || 0
    totalCredit += Number(summary.total_credit) || 0
  })

  // Initialize formatter once for performance
  const pkrFormatter = new Intl.NumberFormat('en-PK')
  
  const formattedTotalDebit = pkrFormatter.format(totalDebit)
  const formattedTotalCredit = pkrFormatter.format(totalCredit)

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">

      {/* Top Header */}
      <div className="no-print bg-[#131924] w-full safe-top pt-6 pb-5 sm:pt-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto w-full">

          <div className="flex items-center gap-3 mb-8 mt-6">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-all p-2 -ml-2 rounded-lg hover:bg-white/10"
              title="Back to Dashboard"
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Outstanding</h1>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="bg-[#2A313C]/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider">Total Debit</p>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FCA5A5] tnum truncate">{formattedTotalDebit}</p>
            </div>

           <div className="bg-[#2A313C]/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider">Total Credit</p>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6EE7A8] tnum truncate">{formattedTotalCredit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print toolbar */}
      <div className="no-print bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-2.5 flex items-center justify-end gap-2">
          <PrintButton label="Print" />
        </div>
      </div>

      {/* Print-only header */}
      <div className="print-only px-4 sm:px-6 pt-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-extrabold mb-3">Ahmad Din Muhammad Nawaz Commission Shop</h1>
        <h1 className="text-xl font-bold mb-1">Outstanding</h1>
        <p className="text-sm text-gray-600 mb-4">
          Total Debit: {formattedTotalDebit} &nbsp;|&nbsp; Total Credit: {formattedTotalCredit}
        </p>
        <p className="text-xs text-gray-400 mb-4">Generated {new Date().toLocaleDateString('en-GB')}</p>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 px-4 sm:px-6 pb-8 max-w-5xl mx-auto w-full pt-6 print:pt-0">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-md overflow-hidden">
        {summaryList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center text-[#6B7280]">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center mb-5">
                <Receipt size={28} strokeWidth={1.75} />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">No outstanding balances</p>
            <p className="text-sm text-gray-500">When you add entries to accounts, their summaries will appear here.</p>
            </div>
        ) : (
            <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#6B7280] text-[11px] sm:text-xs uppercase tracking-wider divide-x divide-[#E5E7EB]">
                    <th className="px-5 py-4 font-semibold w-[40%]">Name</th>
                    <th className="px-5 py-4 font-semibold text-right w-[20%]">Total Debit</th>
                    <th className="px-5 py-4 font-semibold text-right w-[20%]">Total Credit</th>
                    <th className="px-5 py-4 font-semibold text-right w-[20%]">Current Balance</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                {summaryList.map((summary) => {
                    const bal = Number(summary.balance) || 0
                    const debit = Number(summary.total_debit) || 0
                    const credit = Number(summary.total_credit) || 0
                    
                    const formattedDebit = debit > 0 ? pkrFormatter.format(debit) : ''
                    const formattedCredit = credit > 0 ? pkrFormatter.format(credit) : ''
                    const formattedBalance = bal === 0 ? '0' : pkrFormatter.format(Math.abs(bal))
                    
                    const balanceLabel = bal > 0 ? 'Debit ' : bal < 0 ? 'Credit ' : ''
                    const balanceColor = bal > 0 ? 'text-[#DC2626]' : bal < 0 ? 'text-[#16A34A]' : 'text-gray-900'

                    return (
                    <tr key={summary.account_id} className="hover:bg-gray-50 transition-colors divide-x divide-[#E5E7EB]">
                        <td className="px-5 py-4 text-sm font-bold text-[#131924] whitespace-nowrap">
                          {summary.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-right font-bold text-[#DC2626] tnum whitespace-nowrap">
                          {formattedDebit}
                        </td>
                        <td className="px-5 py-4 text-sm text-right font-bold text-[#16A34A] tnum whitespace-nowrap">
                          {formattedCredit}
                        </td>
                        <td className="px-5 py-4 text-sm text-right whitespace-nowrap">
                          <span className={`font-bold tnum ${balanceColor}`}>
                            {balanceLabel}{formattedBalance}
                          </span>
                        </td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
        )}
        </div>
      </div>
    </main>
  )
}