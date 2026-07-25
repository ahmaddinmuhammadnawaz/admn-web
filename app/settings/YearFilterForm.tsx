'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/SubmitButton'

export default function YearFilterForm({ 
  years, 
  initialSelected, 
  action 
}: { 
  years: string[], 
  initialSelected: string, 
  action: (formData: FormData) => void 
}) {
  // Initialize state based on the current cookie value
  const [selected, setSelected] = useState<string[]>(
    initialSelected === 'All' ? ['All'] : initialSelected.split(',')
  )

  const handleCheck = (val: string) => {
    if (val === 'All') {
      // If "All" is clicked, wipe out everything else
      setSelected(['All'])
    } else {
      // If a specific year is clicked, ensure "All" is removed
      let newSelected = selected.filter(y => y !== 'All')
      
      if (newSelected.includes(val)) {
        // Toggle off if already selected
        newSelected = newSelected.filter(y => y !== val)
      } else {
        // Toggle on
        newSelected.push(val)
      }
      
      // If they uncheck all specific years, default back to "All"
      if (newSelected.length === 0) {
        newSelected = ['All']
      }
      
      setSelected(newSelected)
    }
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Years to Display</label>
        
        <div className="flex flex-wrap gap-3">
          {/* All Time Checkbox */}
          <label className="cursor-pointer">
            <input 
              type="checkbox" 
              name="year" 
              value="All" 
              checked={selected.includes('All')}
              onChange={() => handleCheck('All')}
              className="peer sr-only" 
            />
            <div className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#131924] peer-checked:text-white peer-checked:border-[#131924] text-gray-600 transition-all text-sm font-bold">
              All Time
            </div>
          </label>

          {/* Dynamic Year Checkboxes */}
          {years.map(year => (
            <label key={year} className="cursor-pointer">
              <input 
                type="checkbox" 
                name="year" 
                value={year} 
                checked={selected.includes(year)}
                onChange={() => handleCheck(year)}
                className="peer sr-only" 
              />
              <div className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#131924] peer-checked:text-white peer-checked:border-[#131924] text-gray-600 transition-all text-sm font-bold">
                {year}
              </div>
            </label>
          ))}
        </div>
      </div>
      <SubmitButton>Save Preferences</SubmitButton>
    </form>
  )
}