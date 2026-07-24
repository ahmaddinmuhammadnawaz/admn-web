'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions' // Imports your existing server action

export function AutoLogout() {
  const pathname = usePathname()
  // 30 minutes in milliseconds
  const TIMEOUT_MS = 30 * 60 * 1000 
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Disable the idle timeout if the user is already on the login screen
    if (pathname === '/login') return

    const handleLogout = async () => {
      await signOut() 
    }

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(handleLogout, TIMEOUT_MS)
    }

    // Initialize the timer immediately
    resetTimer()

    // Events that count as user "activity"
    const events = ['mousemove', 'keydown', 'wheel', 'click', 'scroll', 'touchstart']
    const handleActivity = () => resetTimer()
    
    // Attach passive event listeners to the window
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Cleanup listeners and timer on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [pathname])

  return null // This component runs purely in the background
}