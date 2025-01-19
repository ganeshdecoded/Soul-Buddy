"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const RingViewer = dynamic(() => import("@/components/RingViewer"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-4xl h-[80vh] glass-card flex items-center justify-center">
        <div className="text-accent-gold text-lg">Loading 3D Viewer...</div>
      </div>
    </div>
  )
});

export default function SpiritualPage() {
  const [isRingViewerOpen, setIsRingViewerOpen] = useState(false);
  const [selectedGemstone, setSelectedGemstone] = useState("");

  const spiritualData = {
    gemstones: [
      {
        name: "Blue Sapphire",
        benefit: "Strengthens Saturn's influence",
        description: "Enhances discipline, responsibility, and career growth",
        preview: "/goldring.glb",
        image: "/preview1.png"
      },
      {
        name: "Black Ring",
        benefit: "Harnesses protective energy",
        description: "Provides protection, grounding, and enhances personal power",
        preview: "/black.glb",
        image: "/preview2.png"
      },
      {
        name: "Pearl",
        benefit: "Enhances Moon's positive effects",
        description: "Promotes emotional balance, intuition, and mental peace",
        preview: "/ring5.glb",
        image: "/preview3.png"
      },
      {
        name: "Gold ring with a diamond",
        benefit: "Amplifies Sun's energy",
        description: "Brings leadership qualities, success, and spiritual enlightenment",
        preview: "/ring5.glb",
        image: "/preview4.png"
      }
    ],
    meditation: {
      techniques: [
        {
          name: "Brahma Muhurat Meditation",
          time: "4:53 AM - 5:41 AM",
          benefits: "Enhanced spiritual connection and mental clarity",
          image: "/meditation1.jpg",
          steps: [
            "Wake up before sunrise",
            "Sit in a comfortable position",
            "Focus on your breath for 10-15 minutes",
            "Chant 'Om' for spiritual vibrations"
          ]
        },
        {
          name: "Abhijit Muhurat Practice",
          time: "12:08 PM - 12:56 PM",
          benefits: "Success in spiritual endeavors",
          image: "/meditation2.jpg",
          steps: [
            "Find a quiet space",
            "Light incense for ambiance",
            "Practice mindfulness",
            "Visualize positive energy"
          ]
        }
      ]
    },
    sleep: {
      recommendations: [
        {
          title: "Optimal Sleep Time",
          description: "Sleep between 10 PM and 6 AM to align with natural cycles",
          image: "/sleep1.jpg"
        },
        {
          title: "Pre-sleep Ritual",
          description: "Chant 'Om Namah Shivaya' 108 times before sleep",
          image: "/sleep2.jpg"
        },
        {
          title: "Bedroom Setup",
          description: "Place your crystal or gemstone near your pillow",
          image: "/sleep3.jpg"
        },
        {
          title: "Avoid Inauspicious Times",
          description: "Avoid sleeping during Brahma Muhurat (4:53 AM - 5:41 AM)",
          image: "/sleep4.jpg"
        }
      ]
    },
    workout: {
      routines: [
        {
          name: "Surya Namaskar",
          benefits: "Complete body workout with spiritual benefits",
          timing: "Best during sunrise",
          image: "/yoga1.jpg",
          steps: [
            "12 poses flowing with breath",
            "Face the rising sun",
            "Chant mantras with each pose",
            "Practice mindfully"
          ]
        },
        {
          name: "Yoga Asanas",
          benefits: "Physical and spiritual alignment",
          timing: "Avoid during Rahu Kaal (11:01 AM - 12:32 PM)",
          image: "/yoga2.jpg",
          poses: [
            "Padmasana for meditation",
            "Vajrasana for digestion",
            "Shavasana for relaxation"
          ]
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#070b1e]">
      <RingViewer 
        isOpen={isRingViewerOpen} 
        onClose={() => setIsRingViewerOpen(false)}
        gemType={selectedGemstone}
      />
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-purple/20 blur-3xl -z-10" />
          <h1 className="premium-text text-5xl font-bold mb-4">
            Spiritual Guidance
          </h1>
          <p className="text-gray-300/70">
            Discover ancient wisdom for modern well-being
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-purple mx-auto rounded-full mt-4"></div>
        </div>
        
        <Tabs defaultValue="gemstones" className="w-full">
          <TabsList className="flex justify-center w-full mb-8">
            <div className="glass-card backdrop-blur-lg p-1 rounded-full inline-flex gap-1">
              <TabsTrigger 
                value="gemstones"
                className="px-6 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-gold data-[state=active]:to-accent-purple data-[state=active]:text-white transition-all duration-300"
              >
                Gemstones
              </TabsTrigger>
              <TabsTrigger 
                value="meditation" 
                className="px-6 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-gold data-[state=active]:to-accent-purple data-[state=active]:text-white transition-all duration-300"
              >
                Meditation
              </TabsTrigger>
              <TabsTrigger 
                value="sleep"
                className="px-6 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-gold data-[state=active]:to-accent-purple data-[state=active]:text-white transition-all duration-300"
              >
                Sleep
              </TabsTrigger>
              <TabsTrigger 
                value="workout"
                className="px-6 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-gold data-[state=active]:to-accent-purple data-[state=active]:text-white transition-all duration-300"
              >
                Workout
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="gemstones">
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {spiritualData.gemstones.map((gemstone, index) => (
                <div key={index} className="group">
                  <Card 
                    className="glass-card overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer border-0"
                    onClick={() => {
                      setSelectedGemstone(gemstone.name);
                      setIsRingViewerOpen(true);
                    }}
                  >
                    <div className="relative h-[200px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-purple/20 z-10" />
                      <Image
                        src={gemstone.image}
                        alt={gemstone.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-20">
                        <p className="text-sm text-white/70">Click to view in 3D</p>
                      </div>
                    </div>
                    <CardHeader className="relative border-b border-white/10 p-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-accent-purple/5" />
                      <CardTitle className="premium-text text-lg">
                        {gemstone.name}
                      </CardTitle>
                      <p className="text-accent-gold font-medium text-sm">{gemstone.benefit}</p>
                    </CardHeader>
                    <CardContent className="relative p-3">
                      <p className="text-gray-300/80 leading-relaxed text-sm line-clamp-2">{gemstone.description}</p>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-accent-gold/10 to-transparent rounded-full blur-xl" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meditation">
            <div className="grid gap-6 md:grid-cols-2">
              {spiritualData.meditation.techniques.map((technique, index) => (
                <div key={index} className="group">
                  <Card className="glass-card transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0 overflow-hidden">
                    <div className="relative h-[250px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-purple/20 z-10" />
                      <Image
                        src={technique.image}
                        alt={technique.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <CardHeader className="relative border-b border-white/10 p-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-accent-purple/5" />
                      <CardTitle className="premium-text text-xl">
                        {technique.name}
                      </CardTitle>
                      <p className="text-accent-gold font-medium">{technique.time}</p>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="font-semibold mb-4 text-gray-300">
                        Benefits: {technique.benefits}
                      </p>
                      <ul className="space-y-3">
                        {technique.steps.map((step, idx) => (
                          <li key={idx} className="flex items-center text-gray-300/80">
                            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-accent-gold to-accent-purple mr-3"></span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sleep">
            <div className="grid gap-6 md:grid-cols-2">
              {spiritualData.sleep.recommendations.map((rec, index) => (
                <div key={index} className="group">
                  <Card className="glass-card transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0 overflow-hidden">
                    <div className="relative h-[200px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-purple/20 z-10" />
                      <Image
                        src={rec.image}
                        alt={rec.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <CardHeader className="relative border-b border-white/10 p-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-accent-purple/5" />
                      <CardTitle className="premium-text text-xl">
                        {rec.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-300/80 leading-relaxed">{rec.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workout">
            <div className="grid gap-6 md:grid-cols-2">
              {spiritualData.workout.routines.map((routine, index) => (
                <div key={index} className="group">
                  <Card className="glass-card transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0 overflow-hidden">
                    <div className="relative h-[250px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-purple/20 z-10" />
                      <Image
                        src={routine.image}
                        alt={routine.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <CardHeader className="relative border-b border-white/10 p-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-accent-purple/5" />
                      <CardTitle className="premium-text text-xl">
                        {routine.name}
                      </CardTitle>
                      <p className="text-accent-gold font-medium">{routine.timing}</p>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="font-semibold mb-4 text-gray-300">
                        Benefits: {routine.benefits}
                      </p>
                      <ul className="space-y-3">
                        {(routine.steps || routine.poses).map((item, idx) => (
                          <li key={idx} className="flex items-center text-gray-300/80">
                            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-accent-gold to-accent-purple mr-3"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 