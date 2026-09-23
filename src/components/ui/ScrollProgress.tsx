import { useState, useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  /** If provided, only show the progress bar on these pathnames */
  showOnPaths?: string[]
}

export default function ScrollProgress({ showOnPaths }: ScrollProgressProps) {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(true)

  const scaleX = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Check if we should show on current page
  useEffect(() => {
    if (!showOnPaths || showOnPaths.length === 0) {
      setVisible(true)
      return
    }

    const checkPath = () => {
      const currentPath = window.location.pathname
      setVisible(showOnPaths.some(path => currentPath.startsWith(path)))
    }

    checkPath()

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', checkPath)
    return () => {
      window.removeEventListener('popstate', checkPath)
    }
  }, [showOnPaths])

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percentage = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollPercentage(percentage)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Update the spring value when scrollPercentage changes
  useEffect(() => {
    scaleX.set(scrollPercentage)
  }, [scrollPercentage, scaleX])

  if (!visible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #FF6A30, #E85A20, #FF8F5E)',
      }}
    />
  )
}
