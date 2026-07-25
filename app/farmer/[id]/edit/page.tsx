import { createClient } from '@/utils/supabase/server'
import { editFarmer } from '@/app/actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SubmitButton } from '@/components/SubmitButton'

export default async function EditFarmerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the existing farmer data to pre-fill the form
  const { data: farmer, error } = await supabase
    .from('farmers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !farmer) {
    notFound()
  }

  // Bind the farmer ID to the server action
  const updateFarmerWithId = editFarmer.bind(null, id)

  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10">

        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href={`/farmer/${id}`}
            className="text-[#6B7280] hover:text-[#131924] transition-colors p-1 -ml-1 shrink-0"
            title="Cancel"
          >
            <ArrowLeft size={22} strokeWidth={2.25} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131924]">Edit Info</h1>
        </div>

        <form action={updateFarmerWithId} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" type="text" required defaultValue={farmer.name} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
              <input name="father_name" type="text" defaultValue={farmer.father_name || ''} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input name="phone" type="tel" defaultValue={farmer.phone || ''} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <input name="area" type="text" defaultValue={farmer.area || ''} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Person</label>
              <input name="reference_person" type="text" defaultValue={farmer.reference_person || ''} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
              <input name="cnic" type="text" defaultValue={farmer.cnic || ''} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Crop</label>
              <input name="crop" type="text" defaultValue={farmer.crop || ''} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Note / Remarks</label>
            <textarea 
              name="note" 
              rows={3} 
              defaultValue={farmer.note || ''}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none resize-none"
            ></textarea>
          </div>

         <SubmitButton>Save Changes</SubmitButton>
        </form>
      </div>
    </main>
  )
}