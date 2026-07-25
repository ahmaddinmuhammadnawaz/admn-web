'use client'

import { Printer } from 'lucide-react'

export default function PrintButton({
  label = 'Print',
  printTitle,
}: {
  label?: string
  /** Temporarily replaces the browser tab/document title while printing,
   *  so if the person doesn't disable "Headers and footers" in the print
   *  dialog, it shows something meaningful instead of the app name. */
  printTitle?: string
}) {
  const handlePrint = () => {
    if (!printTitle) {
      window.print()
      return
    }

    const originalTitle = document.title
    document.title = printTitle

    const restore = () => {
      document.title = originalTitle
      window.removeEventListener('afterprint', restore)
    }
    window.addEventListener('afterprint', restore)

    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="no-print flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold bg-white text-[#131924] border border-[#E5E7EB] hover:border-[#131924] transition-colors"
      title="Print or save as PDF"
    >
      <Printer size={15} strokeWidth={2.25} />
      {label}
    </button>
  )
}