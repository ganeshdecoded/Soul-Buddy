declare global {
  interface Window {
    Hands: any;
  }
}

export async function initializeHandDetection() {
  // Wait for the script to load and make Hands available globally
  if (typeof window !== 'undefined' && !window.Hands) {
    await new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  const hands = new window.Hands({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  return hands;
}

export async function overlayRingOnHand(
  handImage: HTMLImageElement,
  ringImage: HTMLImageElement,
  canvas: HTMLCanvasElement,
  hands: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Set canvas dimensions to match hand image
    canvas.width = handImage.width;
    canvas.height = handImage.height;

    // Draw hand image on canvas
    ctx.drawImage(handImage, 0, 0);

    // Process the image with MediaPipe Hands
    hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Get middle finger MCP and PIP points
        const mcp = landmarks[9]; // MIDDLE_FINGER_MCP
        const pip = landmarks[10]; // MIDDLE_FINGER_PIP

        // Calculate position for ring
        const x = mcp.x * canvas.width - (ringImage.width / 2);
        const y = ((mcp.y + pip.y) / 2) * canvas.height - (ringImage.height / 2);

        // Draw ring on canvas
        ctx.drawImage(
          ringImage,
          x,
          y,
          ringImage.width,
          ringImage.height
        );

        // Convert canvas to data URL
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('No hand detected in the image'));
      }
    });

    // Send the canvas image data to MediaPipe Hands
    hands.send({ image: canvas });
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
} 