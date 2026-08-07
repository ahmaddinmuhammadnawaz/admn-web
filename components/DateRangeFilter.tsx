'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { CalendarRange, X, Check } from 'lucide-react'

function formatShort(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function DateRangeFilter({
  initialFrom,
  initialTo,
}: {
  initialFrom?: string
  initialTo?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [from, setFrom] = useState(initialFrom || '')
  const [to, setTo] = useState(initialTo || '')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const hasActiveFilter = Boolean(initialFrom || initialTo)

  // Recompute the panel's position whenever it opens, and keep it pinned
  // to the button on resize/scroll. On small screens it spans the viewport
  // width (minus margins) instead of a fixed 280px, so it can never run
  // off the right edge of the screen.
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect()
      const margin = 16
      const isSmallScreen = window.innerWidth < 640

      if (isSmallScreen) {
        setPanelStyle({
          position: 'fixed',
          top: rect.bottom + 8,
          left: margin,
          right: margin,
          width: 'auto',
        })
      } else {
        const panelWidth = 280
        const wouldOverflow = rect.left + panelWidth > window.innerWidth - margin

        setPanelStyle({
          position: 'fixed',
          top: rect.bottom + 8,
          left: wouldOverflow ? undefined : rect.left,
          right: wouldOverflow ? window.innerWidth - rect.right : undefined,
          width: panelWidth,
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const apply = () => {
    // FIX: Clone existing params instead of starting blank
    const params = new URLSearchParams(searchParams.toString()) 
    
    if (from) params.set('from', from)
    else params.delete('from')
    
    if (to) params.set('to', to)
    else params.delete('to')

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    setOpen(false)
  }

  const clear = () => {
    setFrom('')
    setTo('')
    router.push(pathname)
    setOpen(false)
  }

  const pillLabel = hasActiveFilter
    ? `${initialFrom ? formatShort(initialFrom) : 'Start'} – ${initialTo ? formatShort(initialTo) : 'Today'}`
    : 'Date range'

  return (
    <div ref={wrapperRef} className="no-print inline-block">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors ${
          hasActiveFilter
            ? 'bg-[#131924] text-white border-[#131924]'
            : 'bg-white text-[#131924] border-[#E5E7EB] hover:border-[#131924]'
        }`}
      >
        <CalendarRange size={15} strokeWidth={2.25} />
        {pillLabel}
        {hasActiveFilter && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
            className="ml-0.5 -mr-1 rounded-full hover:bg-white/20 p-0.5"
            title="Clear date range"
          >
            <X size={13} strokeWidth={2.5} />
          </span>
        )}
      </button>

      {open && (
        <div
          style={panelStyle}
          className="z-20 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-medium text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-[#F7F8FA] px-2.5 py-2 rounded-lg text-sm border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#131924]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-medium text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-[#F7F8FA] px-2.5 py-2 rounded-lg text-sm border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#131924]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={apply}
              className="flex-1 bg-[#131924] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#232B38] transition-colors flex items-center justify-center gap-1.5"
            >
              <Check size={14} strokeWidth={2.5} /> Apply
            </button>
            {hasActiveFilter && (
              <button
                onClick={clear}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-[#131924] hover:bg-gray-100 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}