import { useState, useCallback, useRef, useEffect } from 'react'

const STORAGE_KEY = 'lkl_sound_effects'

/**
 * Creates a short oscillator tone via the Web Audio API.
 */
function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

/**
 * Plays two ascending tones for a "success" sound.
 */
function playSuccessTones(ctx: AudioContext, volume: number) {
  playTone(ctx, 600, 0.12, volume, 'sine')

  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.12)
  gain2.gain.setValueAtTime(volume, ctx.currentTime + 0.12)
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.start(ctx.currentTime + 0.12)
  osc2.stop(ctx.currentTime + 0.3)
}

export function useSoundEffect() {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const ctxRef = useRef<AudioContext | null>(null)
  const hasInteractedRef = useRef(false)

  // Track if the user has interacted with the page (autoplay policy)
  useEffect(() => {
    const markInteracted = () => {
      hasInteractedRef.current = true
    }

    window.addEventListener('click', markInteracted, { once: true })
    window.addEventListener('keydown', markInteracted, { once: true })
    window.addEventListener('touchstart', markInteracted, { once: true })

    return () => {
      window.removeEventListener('click', markInteracted)
      window.removeEventListener('keydown', markInteracted)
      window.removeEventListener('touchstart', markInteracted)
    }
  }, [])

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // localStorage might be unavailable
    }
  }, [])

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const canPlay = useCallback(() => {
    return enabled && hasInteractedRef.current
  }, [enabled])

  const playHover = useCallback(() => {
    if (!canPlay()) return
    const ctx = getContext()
    playTone(ctx, 1200, 0.05, 0.03, 'sine')
  }, [canPlay, getContext])

  const playClick = useCallback(() => {
    if (!canPlay()) return
    const ctx = getContext()
    playTone(ctx, 600, 0.08, 0.06, 'sine')
  }, [canPlay, getContext])

  const playSuccess = useCallback(() => {
    if (!canPlay()) return
    const ctx = getContext()
    playSuccessTones(ctx, 0.05)
  }, [canPlay, getContext])

  return {
    playHover,
    playClick,
    playSuccess,
    enabled,
    setEnabled,
  }
}
