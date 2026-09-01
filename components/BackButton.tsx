'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ 
  className, 
  children,
  title
}: { 
  className?: string,
  children: React.ReactNode,
  title?: string
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className}
      title={title}
    >
      {children}
    </button>
  )
}