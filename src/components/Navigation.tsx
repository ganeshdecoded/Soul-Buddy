"use client"

import { User, BookOpen, MessageSquare, Gem, Dna } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function Navigation() {
  const navItems = [
    { name: 'Dashboard', url: '/dashboard', icon: User },
    { name: 'Spiritual Content', url: '/spiritual', icon: BookOpen },
    { name: 'Ring Tryon', url: '/ring-tryon', icon: Gem },
    { name: 'Spiritual DNA', url: '/spiritual-dna', icon: Dna },
    { name: 'Chatbot', url: '/chatbot', icon: MessageSquare }
  ]

  return <NavBar items={navItems} />
}