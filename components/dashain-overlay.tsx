"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DashainOverlayProps {
  isVisible: boolean
  onComplete: () => void
}

// Traditional Nepali kite colors
const nepaliKiteColors = [
  "#FF0000", // Red
  "#00FF00", // Green  
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#FFC0CB", // Pink
  "#A52A2A", // Brown
  "#008000", // Dark Green
  "#000080", // Navy
  "#FFD700", // Gold
  "#C0C0C0", // Silver
  "#FF6347", // Tomato
  "#32CD32", // Lime Green
]

// Kite SVG Component with random colors
const Kite = ({ 
  delay = 0, 
  duration = 8, 
  startX = 0, 
  startY = 0, 
  endX = 100, 
  endY = 100,
  size = "medium",
  colorIndex = 0
}: {
  delay?: number
  duration?: number
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  size?: "small" | "medium" | "large"
  colorIndex?: number
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  }

  const kiteColor = nepaliKiteColors[colorIndex % nepaliKiteColors.length]

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} opacity-90`}
      initial={{ 
        x: startX, 
        y: startY,
        rotate: -15,
        scale: 0.8
      }}
      animate={{ 
        x: endX, 
        y: endY,
        rotate: 15,
        scale: 1.1
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-full h-full drop-shadow-lg"
        fill="none"
      >
        {/* Main kite body - solid color diamond shape */}
        <path 
          d="M12 2L22 8L12 14L2 8L12 2Z" 
          fill={kiteColor}
        />
        
        {/* Kite tail - solid color */}
        <path 
          d="M12 14L8 20L12 18L16 20L12 14Z" 
          fill={kiteColor}
        />
        
        {/* Kite string */}
        <line x1="12" y1="14" x2="12" y2="22" stroke="#000" strokeWidth="0.5" />
      </svg>
    </motion.div>
  )
}

export default function DashainOverlay({ isVisible, onComplete }: DashainOverlayProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      handleDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [isVisible])

  const handleDismiss = () => {
    setIsDismissed(true)
    setTimeout(() => {
      onComplete()
    }, 500) // Allow fade out animation to complete
  }

  const handleClick = () => {
    handleDismiss()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F7DD0F] via-[#F7DD0F] to-yellow-500"
          onClick={handleClick}
        >

          {/* Flying Kites */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Kite 
              delay={0} 
              duration={8} 
              startX={-50} 
              startY={100} 
              endX={window.innerWidth + 50} 
              endY={-50}
              size="large"
              colorIndex={0}
            />
            <Kite 
              delay={1} 
              duration={10} 
              startX={window.innerWidth + 50} 
              startY={200} 
              endX={-50} 
              endY={50}
              size="medium"
              colorIndex={3}
            />
            <Kite 
              delay={2} 
              duration={12} 
              startX={-30} 
              startY={300} 
              endX={window.innerWidth + 30} 
              endY={-30}
              size="small"
              colorIndex={7}
            />
            <Kite 
              delay={0.5} 
              duration={9} 
              startX={window.innerWidth + 30} 
              startY={150} 
              endX={-30} 
              endY={100}
              size="medium"
              colorIndex={1}
            />
            <Kite 
              delay={1.5} 
              duration={11} 
              startX={-40} 
              startY={250} 
              endX={window.innerWidth + 40} 
              endY={-40}
              size="small"
              colorIndex={5}
            />
            <Kite 
              delay={3} 
              duration={7} 
              startX={window.innerWidth + 40} 
              startY={300} 
              endX={-40} 
              endY={-20}
              size="large"
              colorIndex={12}
            />
            <Kite 
              delay={2.5} 
              duration={9} 
              startX={-60} 
              startY={180} 
              endX={window.innerWidth + 60} 
              endY={-60}
              size="medium"
              colorIndex={9}
            />
            <Kite 
              delay={4} 
              duration={6} 
              startX={window.innerWidth + 60} 
              startY={120} 
              endX={-60} 
              endY={80}
              size="small"
              colorIndex={14}
            />
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center px-6 max-w-4xl mx-auto relative z-10"
          >
            {/* Main Text */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-center"
            >
              {/* Happy Dashain - Ultra Smooth Fade In */}
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-black mb-2 leading-tight"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif"
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.span
                  animate={{ 
                    opacity: [1, 0.98, 1]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 2
                  }}
                >
                  Happy Dashain
                </motion.span>
              </motion.h1>
              
              {/* from - Ultra Smooth Fade In */}
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-2"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif"
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.span
                  animate={{ 
                    opacity: [1, 0.97, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 2.5
                  }}
                >
                  from
                </motion.span>
              </motion.h2>
              
              {/* DopeTech Nepal - Ultra Smooth and Minimalistic */}
              <motion.h3
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black mb-8"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif"
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.3, 
                  delay: 2.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.span
                  animate={{ 
                    scale: [1, 1.005, 1],
                    opacity: [1, 0.98, 1]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 3.5
                  }}
                >
                  DopeTech Nepal
                </motion.span>
              </motion.h3>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex justify-center space-x-4 mb-8"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-black rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-black/80 text-sm sm:text-base font-medium"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
