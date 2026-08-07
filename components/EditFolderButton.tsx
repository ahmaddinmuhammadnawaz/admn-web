'use client'

import { useState, useTransition } from 'react'
import { Pencil, X, AlertCircle } from 'lucide-react'
import { editFolder } from '@/app/actions'
import { SubmitButton } from './SubmitButton'

export default function EditFolderButton({ folderId, currentName }: { folderId: string, currentName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setErrorMsg(null) // Clear previous errors
    
    startTransition(async () => {
      const result = await editFolder(folderId, formData)
      
      if (result?.error) {
        // Show the graceful error message in the modal
        setErrorMsg(result.error)
      } else {
        // Success! Close the modal
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/90 hover:text-white p-2 sm:px-3 sm:py-2 rounded-lg text-sm font-medium transition-colors"
        title="Edit Folder"
      >
        <Pencil size={16} />
        <span className="hidden sm:inline ml-2">Edit</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-lg border border-[#E5E7EB] p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#131924]">Rename Folder</h2>
              <button onClick={() => { setIsOpen(false); setErrorMsg(null); }} className="text-gray-400 hover:text-[#131924] transition-colors">
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            
            {/* Graceful Error Display */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2 border border-red-100">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}
            
            <form action={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name *</label>
                <input 
                  name="name" 
                  type="text" 
                  required 
                  autoFocus 
                  defaultValue={currentName}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none text-gray-900" 
                />
              </div>
              <SubmitButton>Save Changes</SubmitButton>
            </form>
          </div>
        </div>
      )}
    </>
  )
}