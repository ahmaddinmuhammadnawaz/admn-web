'use client'

import { AlertCircle } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export function AlertModal({ isOpen, onClose, title, message }: AlertModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl p-5 sm:p-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 border border-red-100 shadow-sm">
            <AlertCircle size={28} className="text-red-600" strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {message}
          </p>
          
          <button 
            onClick={onClose}
            className="w-full bg-[#131924] text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors active:scale-[0.98] shadow-sm"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  )
}