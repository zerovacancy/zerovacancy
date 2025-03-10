
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkMobile()
    
    // Set up event listener using matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the appropriate event listener based on browser support
    const onChange = () => checkMobile()
    mql.addEventListener("change", onChange)
    
    // Cleanup
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return boolean value (use !! to ensure boolean)
  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    checkTablet()
    
    const handleResize = () => {
      checkTablet()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return !!isTablet
}

export function useIsMobileOrTablet() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  return isMobile || isTablet
}

export function useViewportSize() {
  const [size, setSize] = React.useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })
  
  React.useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    // Throttle the resize event to improve performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const throttledResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateSize, 100)
    }
    
    // Initialize on mount
    updateSize()
    
    window.addEventListener('resize', throttledResize)
    
    return () => window.removeEventListener('resize', throttledResize)
  }, [])
  
  return size
}
