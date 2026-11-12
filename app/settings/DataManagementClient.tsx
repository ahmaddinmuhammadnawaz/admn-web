'use client'

import { useState, useRef, useTransition } from 'react'
import { Download, Upload, Database, Loader2, X, AlertTriangle, Trash2 } from 'lucide-react'
import { AlertModal } from '@/components/AlertModal'
import { ConfirmModal } from '@/components/ConfirmModal'
import { exportData, deleteAllData } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function DataManagementClient({ 
  importAction 
}: { 
  importAction: (formData: FormData) => void 
}) {
  const router = useRouter()
  const [isExporting, startExport] = useTransition()
  const [isImporting, startImport] = useTransition()
  const [isDeletingAll, startDeletingAll] = useTransition()
  
  const [showAlert, setShowAlert] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' })

  const [showImportModal, setShowImportModal] = useState(false)
  const [showWipeModal, setShowWipeModal] = useState(false)
  
  const importFormRef = useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = useState('')
  
  const [importMode, setImportMode] = useState('merge')
  const [confirmWord, setConfirmWord] = useState('')

  const handleExport = () => {
    startExport(async () => {
      try {
        const jsonString = await exportData()
        const fileName = `ADMN_Backup_${new Date().toISOString().split('T')[0]}.json`
        const file = new File([jsonString], fileName, { type: 'application/json' })

        const triggerDownload = () => {
          const url = URL.createObjectURL(file)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ title: 'ADMN Backup', files: [file] })
          } catch (shareError) {
            if ((shareError as Error).name === 'AbortError') return
            triggerDownload()
          }
        } else {
          triggerDownload()
        }
      } catch (serverError) {
        setAlertInfo({ title: "Export Failed", message: "An error occurred while gathering your data from the server. Please try again." })
        setShowAlert(true)
      }
    })
  }

  const handleConfirmImport = () => {
    if (importMode === 'replace' && confirmWord !== 'REPLACE') return
    
    if (importFormRef.current) {
      const formData = new FormData(importFormRef.current)
      formData.append('importMode', importMode)
      
      startImport(async () => {
        await importAction(formData)
        setShowImportModal(false)
        setConfirmWord('')
      })
    }
  }

  const handleConfirmWipe = () => {
    startDeletingAll(async () => {
      const result = await deleteAllData()
      if (result.error) {
        setAlertInfo({ title: "Deletion Failed", message: result.error })
        setShowAlert(true)
      } else {
        setShowWipeModal(false)
        router.push('/?success=All data has been successfully deleted')
      }
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#131924]/5 p-2 rounded-lg">
            <Database size={20} strokeWidth={2} className="text-[#131924]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Data Backup & Restore</h2>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E5E7EB]">
            <h3 className="font-bold text-gray-900 mb-1">Export Backup</h3>
            <p className="text-sm text-gray-500 mb-4">Download a complete, highly optimized local copy of all your accounts and ledger entries.</p>
            <button
              onClick={handleExport}
              disabled={isExporting || isImporting || isDeletingAll}
              className="bg-[#131924] text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:bg-[#232B38] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={2.5} />}
              {isExporting ? 'Packaging Backup...' : 'Create Backup'}
            </button>
          </div>

          <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E5E7EB]">
            <h3 className="font-bold text-gray-900 mb-1">Restore from Backup</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a previously downloaded <code className="bg-gray-200 px-1 rounded">.json</code> backup file to restore your data.</p>
            
            <form ref={importFormRef} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="file" 
                  name="backupFile" 
                  accept=".json" 
                  required
                  disabled={isImporting || isExporting || isDeletingAll}
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
                disabled={isImporting || isExporting || isDeletingAll}
                onClick={() => {
                  if (!fileName) {
                    setAlertInfo({ title: "Action Required", message: "Please tap to select a backup file first." })
                    setShowAlert(true)
                    return
                  }
                  setImportMode('merge')
                  setConfirmWord('')
                  setShowImportModal(true)
                }}
                className="bg-[#131924] text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shrink-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isImporting && <Loader2 size={18} className="animate-spin" />}
                {isImporting ? 'Opening...' : 'Restore Data'}
              </button>
            </form>
          </div>


        </div>
      </div>

      <AlertModal isOpen={showAlert} onClose={() => setShowAlert(false)} title={alertInfo.title} message={alertInfo.message} />

      {/* IMPORT ASK MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] shrink-0">
              <h2 className="text-lg font-bold text-[#131924]">How to Restore Data?</h2>
              <button onClick={() => setShowImportModal(false)} className="text-[#9CA3AF] hover:text-[#131924] transition-colors p-1">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto thin-scrollbar">
              <p className="text-sm text-[#6B7280]">
                You are restoring from <strong>{fileName}</strong>. Please choose how you want to apply this file to your system.
              </p>

              <div className="flex flex-col gap-3">
                <label className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-all ${importMode === 'merge' ? 'bg-white border-[#131924] ring-1 ring-[#131924] shadow-sm' : 'bg-[#F7F8FA] border-[#E5E7EB] hover:bg-gray-50'}`}>
                  <input type="radio" name="modalImportMode" value="merge" checked={importMode === 'merge'} onChange={() => setImportMode('merge')} className="w-5 h-5 text-[#131924] focus:ring-[#131924] mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Merge Data (Safe)</span>
                    <span className="text-sm text-gray-500 mt-1">Updates existing accounts and adds new ones. Your current data that is not in the file will be kept safe.</span>
                  </div>
                </label>

                <label className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-all ${importMode === 'replace' ? 'bg-red-50 border-red-500 ring-1 ring-red-500 shadow-sm' : 'bg-[#F7F8FA] border-[#E5E7EB] hover:bg-gray-50'}`}>
                  <input type="radio" name="modalImportMode" value="replace" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} className="w-5 h-5 text-red-600 focus:ring-red-600 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-red-700 flex items-center gap-1.5"><AlertTriangle size={16} /> Replace Everything (Destructive)</span>
                    <span className="text-sm text-red-600/80 mt-1">Completely deletes <strong>all</strong> current accounts, folders, and entries, then loads exactly what is in the file.</span>
                  </div>
                </label>
              </div>

              {importMode === 'replace' && (
                <div className="mt-2 p-4 bg-red-50 rounded-xl border border-red-100 animate-in fade-in zoom-in-95 duration-200">
                  <label className="block text-sm font-medium text-red-800 mb-2">
                    Type <span className="font-bold select-all text-red-900">REPLACE</span> to confirm data deletion
                  </label>
                  <input
                    type="text"
                    value={confirmWord}
                    onChange={(e) => setConfirmWord(e.target.value)}
                    placeholder="REPLACE"
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                    className="w-full px-4 py-2.5 rounded-lg border border-red-200 focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none text-red-900 bg-white"
                    autoComplete="off"
                  />
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#E5E7EB] bg-[#F7F8FA] flex gap-3 shrink-0">
              <button type="button" onClick={() => setShowImportModal(false)} disabled={isImporting} className="flex-1 px-4 py-3 rounded-xl font-bold text-[#6B7280] bg-white border border-[#E5E7EB] hover:bg-gray-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmImport} disabled={isImporting || (importMode === 'replace' && confirmWord !== 'REPLACE')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${importMode === 'replace' ? 'bg-[#DC2626] hover:bg-red-700' : 'bg-[#131924] hover:bg-gray-800'}`}>
                {isImporting && <Loader2 size={18} className="animate-spin" />}
                {isImporting ? 'Processing...' : 'Start Restore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FACTORY RESET / WIPE ALL MODAL */}
      <ConfirmModal
        isOpen={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        onConfirm={handleConfirmWipe}
        title="Wipe All Data"
        description="Are you absolutely sure you want to delete everything? ALL accounts, folders, and entries across the entire application will be erased permanently."
        confirmText="Yes, Delete Everything"
        isDestructive={true}
        requireWord="WIPE DATA"
        isLoading={isDeletingAll}
      />
    </>
  )
}