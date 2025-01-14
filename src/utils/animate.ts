import { ease, EasingFunction } from './easing-functions'

export default function animate(
  from: number,
  to: number,
  callback: (value: number) => void,
  duration = 500,
  easing: EasingFunction = ease,
): Promise<void> {
  return new Promise((resolve) => {
    const diff = to - from

    if (!diff) {
      return
    }

    let start: number
    let value: number

    const step = (timestamp: number) => {
      if (!start) {
        start = timestamp
      }

      const time = timestamp - start
      const percent = easing(Math.min(time / duration, 1))

      value = from + diff * percent

      if (time >= duration) {
        value = to
        callback(value)
        resolve()
        return
      }

      callback(value)
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  })
}
