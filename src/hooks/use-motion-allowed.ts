import { useEffect, useState } from 'react'

const useMotionAllowed = () => {
  const [motionAllowed, setMotionAllowed] = useState(true)

  useEffect(() => {
    setMotionAllowed(
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [setMotionAllowed])

  return motionAllowed
}

export default useMotionAllowed
