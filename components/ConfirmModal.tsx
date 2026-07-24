'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  isDestructive?: boolean
  requireWord?: string
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  isDestructive = false,
  requireWord,
  isLoading = false,
}: ConfirmModalProps) {
  const [typedWord, setTypedWord] = useState('')
  const { pending } = useFormStatus() 
  const isCurrentlyLoading = pending || isLoading

  // Reset input when modal closes
  useEffect(() => {
    if (!isOpen) setTypedWord('')
  }, [isOpen])

  if (!isOpen) return null

  const isButtonDisabled = (requireWord ? typedWord !== requireWord : false) || isCurrentlyLoading

  return (
    <div className="fixed inset-0 z-50 bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E5E7EB] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            {isDestructive && <AlertTriangle size={20} className="text-[#DC2626]" />}
            <h2 className="text-lg font-bold text-[#131924]">{title}</h2>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#131924] transition-colors p-1">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {description}
          </p>

          {requireWord && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="font-bold select-all text-[#131924]">{requireWord}</span> to confirm
              </label>
              <input
                type="text"
                value={typedWord}
                onChange={(e) => setTypedWord(e.target.value)}
                placeholder={requireWord}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#DC2626] focus:border-[#DC2626] focus:outline-none text-black"
                autoComplete="off"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={isCurrentlyLoading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-[#6B7280] bg-[#F7F8FA] hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isButtonDisabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive ? 'bg-[#DC2626] hover:bg-red-700' : 'bg-[#131924] hover:bg-gray-800'
            }`}
          >
            {/* 5. Show spinner if loading */}
            {isCurrentlyLoading && <Loader2 size={18} className="animate-spin" />}
            {isCurrentlyLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}