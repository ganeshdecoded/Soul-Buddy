'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

const rings = [
  { name: "astroring1.png", path: "/astroring1.png" },
  { name: "astroring2.png", path: "/astroring2.png" },
  { name: "astroring3.png", path: "/astroring3.png" },
];

export default function RingTryonPage() {
  const [selectedRing, setSelectedRing] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processRing = async (ringPath: string) => {
    setIsProcessing(true);
    try {
      // Create form data
      const formData = new FormData();
      
      // Fetch the hand image and add to form
      const handResponse = await fetch('/hand.jpeg');
      const handBlob = await handResponse.blob();
      formData.append('hand_file', handBlob);

      // Fetch the ring image and add to form
      const ringResponse = await fetch(ringPath);
      const ringBlob = await ringResponse.blob();
      formData.append('ring_file', ringBlob);

      // Send to API
      const response = await fetch('/api/process-ring', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process image');

      // Get the processed image blob
      const processedBlob = await response.blob();
      const imageUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error('Error processing ring:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Virtual Ring Try-On</h1>

      {/* Ring Selection Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {rings.map((ring) => (
          <Card 
            key={ring.name}
            className="cursor-pointer"
            onClick={() => {
              setSelectedRing(ring.path);
              processRing(ring.path);
            }}
          >
            <CardContent className="p-4">
              <div className="relative w-full aspect-square">
                <Image
                  src={ring.path}
                  alt={ring.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-center mt-2">{ring.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hand Image Display */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={processedImage || "/hand.jpeg"}
                alt="Hand"
                fill
                className="object-contain"
                priority
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white">Processing...</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 