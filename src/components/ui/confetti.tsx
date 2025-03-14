import type { ReactNode } from "react"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti"
import confetti from "canvas-confetti"

import { Button, ButtonProps } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

type Api = {
  fire: (options?: ConfettiOptions) => void
}

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
  manualstart?: boolean
  children?: ReactNode
}

export type ConfettiRef = Api | null

const ConfettiContext = createContext<Api>({} as Api)

export const useConfetti = () => useContext(ConfettiContext)

const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)
  const isMobile = useIsMobile()

  const canvasRef = useCallback(
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        if (instanceRef.current) return
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        })
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset()
          instanceRef.current = null
        }
      }
    },
    [globalOptions],
  )

  const fire = useCallback(
    (opts = {}) => {
      if (!instanceRef.current) {
        console.warn("Confetti instance not initialized")
        return
      }
      
      const mobileAdjustedOptions = isMobile
        ? {
            particleCount: 80,
            spread: 50,
            ...opts,
          }
        : opts
      
      try {
        return instanceRef.current({
          ...options,
          ...mobileAdjustedOptions,
        })
      } catch (error) {
        console.error("Error firing confetti:", error)
      }
    },
    [options, isMobile],
  )

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire],
  )

  useImperativeHandle(ref, () => api, [api])

  useEffect(() => {
    if (!manualstart) {
      console.log("Auto-firing confetti")
      
      // Fire multiple bursts for better effect
      const fireConfetti = () => {
        fire({
          spread: 90,
          startVelocity: 30,
          particleCount: 100,
          gravity: 0.8,
          origin: { y: 0.1 }
        })
      }
      
      // Fire immediately
      fireConfetti()
      
      // Fire additional bursts with delays
      setTimeout(() => fireConfetti(), 250)
      setTimeout(() => fireConfetti(), 500)
    }
  }, [manualstart, fire])

  return (
    <ConfettiContext.Provider value={api}>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none"
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999, // Ensure it's on top of everything
        }}
        {...rest} 
      />
      {children}
    </ConfettiContext.Provider>
  )
})

interface ConfettiButtonProps extends ButtonProps {
  options?: ConfettiOptions &
    ConfettiGlobalOptions & { canvas?: HTMLCanvasElement }
  children?: React.ReactNode
}

function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    confetti({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    })
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

Confetti.displayName = "Confetti"

export { Confetti, ConfettiButton }