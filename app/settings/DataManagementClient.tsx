'use client'

import { useState, useRef, useTransition } from 'react'
import { Download, Upload, Trash2, Database, AlertOctagon, Loader2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'
import { exportData } from '@/app/actions'

export default function DataManagementClient({ 
  importAction, 
  deleteAllAction 
}: { 
  importAction: (formData: FormData) => void, 
  deleteAllAction: () => void 
}) {
  // Dedicated loading states for each action
  const [isExporting, startExport] = useTransition()
  const [isImporting, startImport] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  
  // Import State
  const [showImportModal, setShowImportModal] = useState(false)
  const importFormRef = useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = useState('')
  
  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleExport = () => {
    startExport(async () => {
      try {
        const jsonString = await exportData()
        
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        
        a.href = url
        a.download = `admn_backup_${new Date().toISOString().split('T')[0]}.json`
        
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (e) {
        alert("Failed to export data")
      }
    })
  }

  // Handle the actual import execution and track loading
  const handleConfirmImport = () => {
    if (importFormRef.current) {
      const formData = new FormData(importFormRef.current)
      startImport(async () => {
        await importAction(formData)
        setShowImportModal(false)
      })
    }
  }

  // Handle the actual delete execution and track loading
  const handleConfirmDelete = () => {
    startDelete(async () => {
      await deleteAllAction()
      setShowDeleteModal(false)
    })
  }

  return (
    <>
      {/* Backup & Restore Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#131924]/5 p-2 rounded-lg">
            <Database size={20} strokeWidth={2} className="text-[#131924]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Data Backup & Restore</h2>
        </div>
        
        <div className="flex flex-col gap-6">
          
          {/* Export Section */}
          <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E5E7EB]">
            <h3 className="font-bold text-gray-900 mb-1">Export Backup</h3>
            <p className="text-sm text-gray-500 mb-4">Download a complete, highly optimized local copy of all your accounts and ledger entries.</p>
            <button
              onClick={handleExport}
              disabled={isExporting || isImporting || isDeleting}
              className="bg-white border border-[#E5E7EB] text-[#131924] font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-[#131924] active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              {isExporting ? 'Packaging File...' : 'Download Backup File'}
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E5E7EB]">
            <h3 className="font-bold text-gray-900 mb-1">Restore from Backup</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a previously downloaded <code className="bg-gray-200 px-1 rounded">.json</code> backup file to restore your data. Accounts with matching IDs will be seamlessly updated.</p>
            
            <form ref={importFormRef} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="file" 
                  name="backupFile" 
                  accept=".json" 
                  required
                  disabled={isImporting || isExporting || isDeleting}
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />
                <div className={`w-full bg-white border ${fileName ? 'border-[#131924] ring-1 ring-[#131924]' : 'border-[#E5E7EB]'} py-3 px-4 rounded-xl text-sm truncate flex items-center gap-2 transition-all ${isImporting ? 'opacity-70' : ''}`}>
                  <Upload size={18} className={fileName ? 'text-[#131924]' : 'text-gray-400'} />
                  <span className={fileName ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                    {fileName || 'Tap to select .json file...'}
                  </span>
                </div>
              </div>
              
              <button 
                type="button"
                disabled={isImporting || isExporting || isDeleting}
                onClick={() => {
                  if (!fileName) return alert('Please tap to select a backup file first.')
                  setShowImportModal(true)
                }}
                className="bg-[#131924] text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shrink-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isImporting && <Loader2 size={18} className="animate-spin" />}
                {isImporting ? 'Restoring...' : 'Restore Data'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-red-200 shadow-sm p-5 sm:p-8 mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -z-0 opacity-60"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="bg-red-50 p-2 rounded-lg border border-red-100">
            <AlertOctagon size={20} strokeWidth={2} className="text-[#DC2626]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Danger Zone</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-5 relative z-10">
          This action will permanently delete <strong className="text-gray-900 font-bold">EVERYTHING</strong> in your database. All accounts, accounts, and ledger entries will be completely erased. This cannot be undone. Please ensure you have downloaded a backup first.
        </p>
        
        <button 
          type="button"
          disabled={isDeleting || isExporting || isImporting}
          onClick={() => setShowDeleteModal(true)}
          className="w-full sm:w-auto bg-[#DC2626] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm relative z-10 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          {isDeleting ? 'Deleting Everything...' : 'Delete All Data Forever'}
        </button>
      </div>

      {/* Reusable Confirm Modals tracking the transition states */}
      <ConfirmModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onConfirm={handleConfirmImport}
        title="Restore Data"
        description="Are you sure you want to restore from this file? Data will not be duplicated; existing entries will be updated seamlessly."
        confirmText="Yes, Restore Data"
        isLoading={isImporting}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="DANGER: Delete All Data"
        description="You are about to permanently erase ALL data. This action is irreversible and affects everything."
        confirmText="Delete Everything"
        isDestructive={true}
        requireWord="DELETE"
        isLoading={isDeleting}
      />
    </>
  )
}