import React, { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  // Start with false as default for SSR/initial render to avoid layout shifts
  // This ensures desktop view is the default until we can determine device type
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial check at mount time
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Use CSS-based approach with matchMedia for efficient breakpoint detection
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Update state based on media query
    const updateIsMobile = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Check immediately
    updateIsMobile(mediaQuery)
    
    // Use correct event listener based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateIsMobile)
    } else {
      // For older browsers
      mediaQuery.addListener(updateIsMobile)
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateIsMobile)
      } else {
        // For older browsers
        mediaQuery.removeListener(updateIsMobile)
      }
    }
  }, [])

  return isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Use matchMedia for better performance
    const mediaQuery = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    )
    
    const updateIsTablet = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsTablet(e.matches)
    }
    
    // Check immediately
    updateIsTablet(mediaQuery)
    
    // Use correct event listener based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateIsTablet)
    } else {
      // For older browsers
      mediaQuery.addListener(updateIsTablet)
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateIsTablet)
      } else {
        // For older browsers
        mediaQuery.removeListener(updateIsTablet)
      }
    }
  }, [])

  return !!isTablet
}

// Helpers that combine breakpoints
export function useIsMobileOrTablet() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  return isMobile || isTablet
}

export function useViewportSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Throttled resize handler for better performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 200) // Increased throttle for better performance
    }
    
    // Set initial size
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
    
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return size
}
