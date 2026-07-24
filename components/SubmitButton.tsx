'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

export function SubmitButton({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full bg-[#131924] text-white font-bold py-3.5 sm:py-4 rounded-xl mt-4 hover:bg-gray-800 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className || ''}`}
    >
      {pending && <Loader2 size={18} className="animate-spin" />}
      {pending ? 'Processing...' : children}
    </button>
  )
}