import { useEffect, useState } from 'react'

export default function useId(prefix: string) {
  const [id, setId] = useState(
    `${prefix}-${Math.random().toString(36).substring(2, 9)}`,
  )

  useEffect(() => {
    setId(`${prefix}-${Math.random().toString(36).substring(2, 9)}`)
  }, [prefix])

  return id
}
