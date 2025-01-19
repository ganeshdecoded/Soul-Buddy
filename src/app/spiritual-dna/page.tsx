"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dna, Star, Activity, Compass, BookOpen, Moon, Sun, Sparkles, Plus, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"

const zodiacData = [
  { sign: "Aries", element: "Fire", ruling: "Mars", energy: 85, color: "from-red-500 to-orange-500" },
  { sign: "Taurus", element: "Earth", ruling: "Venus", energy: 70, color: "from-green-500 to-emerald-500" },
  { sign: "Gemini", element: "Air", ruling: "Mercury", energy: 90, color: "from-yellow-500 to-amber-500" },
  { sign: "Cancer", element: "Water", ruling: "Moon", energy: 75, color: "from-blue-500 to-cyan-500" },
]

const energyData = [
  { name: "Spiritual", value: 85, color: "from-violet-500 to-purple-500", symbol: "✧" },
  { name: "Mental", value: 75, color: "from-blue-500 to-cyan-500", symbol: "◇" },
  { name: "Emotional", value: 90, color: "from-pink-500 to-rose-500", symbol: "❖" },
  { name: "Physical", value: 70, color: "from-green-500 to-emerald-500", symbol: "◈" },
]

const chakras = [
  { name: "Crown", color: "bg-violet-500", energy: 90, symbol: "☸", mantra: "Om" },
  { name: "Third Eye", color: "bg-indigo-500", energy: 85, symbol: "☯", mantra: "Aum" },
  { name: "Throat", color: "bg-blue-500", energy: 80, symbol: "☤", mantra: "Ham" },
  { name: "Heart", color: "bg-green-500", energy: 95, symbol: "❤", mantra: "Yam" },
  { name: "Solar Plexus", color: "bg-yellow-500", energy: 75, symbol: "✴", mantra: "Ram" },
  { name: "Sacral", color: "bg-orange-500", energy: 70, symbol: "✺", mantra: "Vam" },
  { name: "Root", color: "bg-red-500", energy: 85, symbol: "⬢", mantra: "Lam" },
]

const ritualElements = [
  { name: "Fire", affinity: 90, symbol: "🔥" },
  { name: "Water", affinity: 85, symbol: "💧" },
  { name: "Air", affinity: 75, symbol: "🌪" },
  { name: "Earth", affinity: 80, symbol: "🌱" },
  { name: "Spirit", affinity: 95, symbol: "✨" },
]

const energyFlows = [
  { type: "Positive", value: 75, color: "from-emerald-500 to-green-500", symbol: "+" },
  { type: "Negative", value: 25, color: "from-rose-500 to-red-500", symbol: "-" },
]

const ritualCircles = [
  { name: "Inner Peace", value: 85, symbol: "☮", color: "from-blue-500 to-indigo-500" },
  { name: "Spiritual Growth", value: 90, symbol: "☯", color: "from-purple-500 to-violet-500" },
  { name: "Divine Connection", value: 95, symbol: "☸", color: "from-amber-500 to-yellow-500" },
]

const horoscopeInsights = [
  { 
    planet: "Sun",
    position: "Leo",
    aspect: "Trine",
    influence: 85,
    meaning: "Personal Power & Creativity",
    color: "from-yellow-500 to-orange-500"
  },
  {
    planet: "Moon",
    position: "Cancer",
    aspect: "Conjunction",
    influence: 90,
    meaning: "Emotional Harmony",
    color: "from-blue-400 to-indigo-500"
  },
  {
    planet: "Mercury",
    position: "Virgo",
    aspect: "Sextile",
    influence: 75,
    meaning: "Mental Clarity",
    color: "from-purple-400 to-violet-500"
  }
]

// Update card background class to be more transparent
const cardBaseClass = "backdrop-blur-sm bg-white/5 border-white/10 shadow-2xl"

function FloatingPlanet({ size, color, delay, duration, path }: { 
  size: number, 
  color: string, 
  delay: number, 
  duration: number,
  path: [number, number, number, number] // [startX, startY, endX, endY]
}) {
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br ${color} shadow-lg`}
      style={{
        width: size,
        height: size,
        left: path[0] + '%',
        top: path[1] + '%',
      }}
      animate={{
        x: [0, path[2], 0],
        y: [0, path[3], 0],
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute inset-0 rounded-full bg-white/10 blur-sm" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
    </motion.div>
  )
}

function SolarSystem() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sun */}
      <div className="absolute top-[5%] right-[10%] w-40 h-40">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* More Planets */}
      <FloatingPlanet
        size={100}
        color="from-purple-600 to-indigo-800"
        delay={0}
        duration={25}
        path={[20, 30, 100, 50]}
      />
      <FloatingPlanet
        size={60}
        color="from-blue-600 to-cyan-800"
        delay={2}
        duration={20}
        path={[70, 60, -100, -50]}
      />
      <FloatingPlanet
        size={80}
        color="from-red-600 to-orange-800"
        delay={1}
        duration={30}
        path={[40, 70, 150, -100]}
      />
      <FloatingPlanet
        size={45}
        color="from-emerald-600 to-teal-800"
        delay={3}
        duration={22}
        path={[85, 40, -120, 80]}
      />
      <FloatingPlanet
        size={70}
        color="from-pink-600 to-rose-800"
        delay={2}
        duration={28}
        path={[10, 80, 200, -150]}
      />
      <FloatingPlanet
        size={35}
        color="from-amber-600 to-yellow-800"
        delay={4}
        duration={18}
        path={[90, 20, -80, 120]}
      />

      {/* Shooting Stars - Increase count and make them more visible */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 200, 400],
            y: [0, 100, 200],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <div className="w-12 h-0.5 bg-gradient-to-r from-white via-white to-transparent -translate-x-6" />
        </motion.div>
      ))}

      {/* Star Field - Increase count and vary sizes */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgb(255, 255, ${Math.random() * 55 + 200})`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Nebula Effects */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-purple-800/50 via-violet-800/30 to-transparent blur-3xl rotate-12" />
        <div className="absolute bottom-1/4 right-1/4 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-800/50 via-indigo-800/30 to-transparent blur-3xl -rotate-12" />
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-gradient-to-r from-pink-800/30 via-rose-800/20 to-transparent blur-3xl rotate-45" />
      </div>

      {/* Enhanced Cosmic Dust */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/30 to-transparent" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-cyan-900/20 to-transparent" />
      </div>
    </div>
  )
}

export default function SpiritualDNA() {
  const [activeSection, setActiveSection] = useState("energy-patterns")
  const [energyLevel, setEnergyLevel] = useState(0)
  const [activeChakra, setActiveChakra] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(true)

  // Calculate the overall spiritual energy based on all factors
  const calculateOverallEnergy = () => {
    // Average of chakra energies
    const chakraAvg = chakras.reduce((acc, c) => acc + c.energy, 0) / chakras.length
    
    // Average of ritual circles
    const ritualAvg = ritualCircles.reduce((acc, r) => acc + r.value, 0) / ritualCircles.length
    
    // Planetary influences
    const planetaryAvg = horoscopeInsights.reduce((acc, p) => acc + p.influence, 0) / horoscopeInsights.length
    
    // Energy balance (positive energy percentage)
    const energyBalance = energyFlows.find(f => f.type === "Positive")?.value || 0
    
    // Weighted average (adjust weights based on importance)
    return Math.round(
      (chakraAvg * 0.3) +      // 30% weight to chakra alignment
      (ritualAvg * 0.25) +     // 25% weight to ritual circles
      (planetaryAvg * 0.25) +  // 25% weight to planetary influences
      (energyBalance * 0.2)    // 20% weight to energy balance
    )
  }

  useEffect(() => {
    const targetEnergy = calculateOverallEnergy()
    if (isCalculating) {
      const interval = setInterval(() => {
        setEnergyLevel((prev) => {
          if (prev >= targetEnergy) {
            setIsCalculating(false)
            clearInterval(interval)
            return targetEnergy
          }
          return prev + 1
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isCalculating])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-indigo-950">
      <SolarSystem />
      <div className="container mx-auto p-6 space-y-8 relative">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full">
              <div className="flex justify-center items-center gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                  />
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
              Spiritual DNA Analysis
            </h1>
          </motion.div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Unlock the secrets of your spiritual essence through ancient wisdom and cosmic energies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`p-6 space-y-6 relative overflow-hidden ${cardBaseClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
            <h2 className="text-2xl font-semibold flex items-center gap-2 relative">
              <Activity className="w-6 h-6 text-violet-500" />
              Energy Balance
            </h2>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 rounded-full border-2 border-violet-500/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-36 h-36 rounded-full border-2 border-indigo-500/20"
                />
              </div>
              <div className="space-y-6 relative z-10">
                {energyFlows.map((flow) => (
                  <div key={flow.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {flow.type === "Positive" ? (
                          <Plus className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Minus className="w-4 h-4 text-rose-500" />
                        )}
                        {flow.type} Energy
                      </span>
                      <span className="text-sm">{flow.value}%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${flow.value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${flow.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className={`p-6 space-y-6 relative overflow-hidden ${cardBaseClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
            <h2 className="text-2xl font-semibold flex items-center gap-2 relative">
              <Star className="w-6 h-6 text-indigo-500" />
              Sacred Circles
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {ritualCircles.map((circle, index) => (
                <div key={circle.name} className="relative">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20 + index * 5, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                  </motion.div>
                  <div className="relative flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${circle.color} flex items-center justify-center text-white text-xl`}
                    >
                      {circle.symbol}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{circle.name}</span>
                        <span className="text-sm">{circle.value}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${circle.value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${circle.color}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className={`p-6 space-y-4 relative overflow-hidden ${cardBaseClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <h2 className="text-2xl font-semibold flex items-center gap-2 relative">
              <Moon className="w-6 h-6 text-blue-500" />
              Chakra Alignment
            </h2>
            <div className="grid grid-cols-1 gap-4 relative">
              {chakras.map((chakra) => (
                <motion.div
                  key={chakra.name}
                  className="flex items-center gap-4 group"
                  onHoverStart={() => setActiveChakra(chakra.name)}
                  onHoverEnd={() => setActiveChakra(null)}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`w-8 h-8 rounded-full ${chakra.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <span className="text-sm">{chakra.symbol}</span>
                    </motion.div>
                    {activeChakra === chakra.name && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text"
                      >
                        {chakra.mantra}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{chakra.name}</span>
                      <span>{chakra.energy}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${chakra.energy}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${chakra.color} shadow-lg`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className={`p-6 space-y-4 relative overflow-hidden ${cardBaseClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
            <h2 className="text-2xl font-semibold flex items-center gap-2 relative">
              <Sun className="w-6 h-6 text-yellow-500" />
              Celestial Influences
            </h2>
            <div className="grid grid-cols-1 gap-6 relative">
              {horoscopeInsights.map((insight, index) => (
                <motion.div
                  key={insight.planet}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-full bg-gradient-to-b from-yellow-500/50 to-orange-500/50" />
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-semibold">{insight.planet} in {insight.position}</span>
                        <div className="text-xs text-muted-foreground">{insight.meaning}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                        {insight.aspect}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.influence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${insight.color}`}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Influence</span>
                      <span>{insight.influence}%</span>
                    </div>
                  </div>
                  <motion.div
                    className="absolute -right-2 top-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${insight.color} shadow-lg`} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-center text-muted-foreground"
              >
                Current Planetary Alignment suggests a period of spiritual growth and inner transformation
              </motion.div>
            </div>
          </Card>

          <Card className={`p-6 md:col-span-2 relative overflow-hidden ${cardBaseClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />
            <div className="text-center space-y-4 relative">
              <h2 className="text-2xl font-semibold">Spiritual Energy Field</h2>
              <div className="relative h-48 w-48 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/20"
                />
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="283"
                    animate={{
                      strokeDashoffset: isCalculating ? [283, 0] : [283 * (1 - energyLevel/100), 283 * (1 - energyLevel/100)],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: isCalculating ? Infinity : 0,
                      ease: "linear",
                    }}
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="1"
                    strokeDasharray="220"
                    animate={{
                      strokeDashoffset: isCalculating ? [220, 0] : [220 * (1 - energyLevel/100), 220 * (1 - energyLevel/100)],
                      rotate: [360, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: isCalculating ? Infinity : 0,
                      ease: "linear",
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500"
                  >
                    {energyLevel}%
                  </motion.div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                {isCalculating ? (
                  "Calculating overall spiritual energy..."
                ) : (
                  <>
                    Your spiritual energy field is {energyLevel >= 80 ? "exceptionally strong" :
                      energyLevel >= 60 ? "well-balanced" :
                      energyLevel >= 40 ? "developing" : "seeking alignment"}
                  </>
                )}
              </motion.div>
            </div>
          </Card>
        </div>

        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <button className="relative px-8 py-3 rounded-full font-medium shadow-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-indigo-600/80 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white">Generate Complete Spiritual Analysis</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
} 