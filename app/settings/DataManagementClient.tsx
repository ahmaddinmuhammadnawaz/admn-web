'use client'

import { useState, useRef, useTransition } from 'react'
import { Download, Upload, Database, Loader2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'
import { AlertModal } from '@/components/AlertModal'
import { exportData } from '@/app/actions'

export default function DataManagementClient({ 
  importAction 
}: { 
  importAction: (formData: FormData) => void 
}) {
  const [isExporting, startExport] = useTransition()
  const [isImporting, startImport] = useTransition()
  
  const [showAlert, setShowAlert] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' })

  const [showImportModal, setShowImportModal] = useState(false)
  const importFormRef = useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = useState('')

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
            await navigator.share({
              title: 'ADMN Backup',
              files: [file]
            })
          } catch (shareError) {
            if ((shareError as Error).name === 'AbortError') return
            triggerDownload()
          }
        } else {
          triggerDownload()
        }
      } catch (serverError) {
        setAlertInfo({ 
          title: "Export Failed", 
          message: "An error occurred while gathering your data from the server. Please try again." 
        })
        setShowAlert(true)
      }
    })
  }

  const handleConfirmImport = () => {
    if (importFormRef.current) {
      const formData = new FormData(importFormRef.current)
      startImport(async () => {
        await importAction(formData)
        setShowImportModal(false)
      })
    }
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
              disabled={isExporting || isImporting}
              className="bg-[#131924] text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:bg-[#232B38] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={2.5} />}
              {isExporting ? 'Packaging Backup...' : 'Create Backup'}
            </button>
          </div>

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
                  disabled={isImporting || isExporting}
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
                disabled={isImporting || isExporting}
                onClick={() => {
                  if (!fileName) {
                    setAlertInfo({ 
                      title: "Action Required", 
                      message: "Please tap to select a backup file first." 
                    })
                    setShowAlert(true)
                    return
                  }
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

      <AlertModal 
        isOpen={showAlert} 
        onClose={() => setShowAlert(false)} 
        title={alertInfo.title} 
        message={alertInfo.message} 
      />

      <ConfirmModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onConfirm={handleConfirmImport}
        title="Restore Data"
        description="Are you sure you want to restore from this file? Data will not be duplicated; existing entries will be updated seamlessly."
        confirmText="Yes, Restore Data"
        isLoading={isImporting}
      />
    </>
  )
}