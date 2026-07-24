import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock } from 'lucide-react'

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Invalid email or password')
    }

    return redirect('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F8FA] p-5 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-6 sm:p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-5 overflow-hidden bg-[#131924]">
            <Image
              src="/icon.png"
              alt="App Logo"
              width={96}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#131924] tracking-wider">ADMN</h1>
          <p className="text-sm text-[#6B7280] mt-1">Commission Shop Ledger</p>
        </div>

        <form action={signIn} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email / ID</label>
            <div className="relative">
              <Mail size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              <input
                id="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#131924] focus:ring-1 focus:ring-[#131924] bg-white text-black"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              <input
                id="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#131924] focus:ring-1 focus:ring-[#131924] bg-white text-black"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button className="w-full bg-[#131924] text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-gray-800 active:scale-[0.99] transition-all">
            Log In
          </button>

          {message && (
            <p className="mt-4 text-center text-red-600 text-sm font-medium">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
