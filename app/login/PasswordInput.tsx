'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ 
  name, 
  placeholder = "••••••••", 
  minLength 
}: { 
  name: string; 
  placeholder?: string;
  minLength?: number;
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Lock size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
      
      <input
        className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#131924] focus:ring-1 focus:ring-[#131924] bg-white text-black"
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        required
      />
      
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#131924] transition-colors p-1"
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff size={17} strokeWidth={2} />
        ) : (
          <Eye size={17} strokeWidth={2} />
        )}
      </button>
    </div>
  )
}