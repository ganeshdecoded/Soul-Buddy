"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-4",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-1 glass-card backdrop-blur-lg py-1.5 px-3 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.url

          return (
            <Link
              key={item.name}
              href={item.url}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-2.5 py-1.5 rounded-full transition-all duration-300",
                "text-white/70 hover:text-white flex items-center gap-1.5",
                isActive && "text-accent-gold"
              )}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon size={16} strokeWidth={2.5} />
                <span className={cn(
                  "transition-all duration-300 text-sm",
                  isMobile ? "hidden" : "inline"
                )}>
                  {item.name}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute inset-0 bg-white/10 rounded-full -z-0"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-purple/20 rounded-full blur-sm" />
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-accent-gold to-accent-purple">
                    <div className="absolute w-16 h-4 bg-accent-gold/20 rounded-full blur-xl -top-2 -left-2" />
                    <div className="absolute w-8 h-4 bg-accent-purple/20 rounded-full blur-lg -top-1 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}