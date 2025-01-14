import { useEffect, useState } from 'react'

export default function useMotionAllowed() {
  const [motionAllowed, setMotionAllowed] = useState(true)

  useEffect(() => {
    setMotionAllowed(
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [setMotionAllowed])

  return motionAllowed
}
