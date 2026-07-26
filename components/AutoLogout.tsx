'use client'

import { useEffect, useRef, startTransition } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions' 

export function AutoLogout() {
  const pathname = usePathname()
  // 30 minutes in milliseconds
  const TIMEOUT_MS = 30 * 60 * 1000 
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Disable the idle timeout if the user is already on the login screen
    if (pathname === '/login') return

    const handleLogout = () => {
      startTransition(async () => {
        await signOut() 
      })
    }

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(handleLogout, TIMEOUT_MS)
    }

    // Initialize the timer immediately
    resetTimer()

    // Events that count as user "activity"
    const events = ['mousemove', 'keydown', 'wheel', 'click', 'scroll', 'touchstart']
    
    let lastActivity = Date.now()
    const THROTTLE_MS = 2000 // Only reset the timer at most once every 2 seconds

    const handleActivity = () => {
      const now = Date.now()
      if (now - lastActivity > THROTTLE_MS) {
        lastActivity = now
        resetTimer()
      }
    }
    
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