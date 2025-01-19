import cv2
import mediapipe as mp
import numpy as np
import sys

def overlay_image_alpha(background, overlay, x, y, alpha_mask):
    h, w = overlay.shape[:2]
    alpha_mask = alpha_mask / 255.0

    if x < 0 or y < 0 or x + w > background.shape[1] or y + h > background.shape[0]:
        raise ValueError("Overlay position is out of bounds.")

    roi = background[y:y+h, x:x+w]

    for c in range(3):
        roi[:, :, c] = (
            alpha_mask * overlay[:, :, c] +
            (1.0 - alpha_mask) * roi[:, :, c]
        ).astype(np.uint8)

    background[y:y+h, x:x+w] = roi

def process_hand_image(hand_image, ring_image):
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(static_image_mode=True)
    
    hand_image_rgb = cv2.cvtColor(hand_image, cv2.COLOR_BGR2RGB)
    results = hands.process(hand_image_rgb)
    
    if results.multi_hand_landmarks:
        for landmarks in results.multi_hand_landmarks:
            mcp = landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP]
            pip = landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_PIP]

            mcp_x, mcp_y = int(mcp.x * hand_image.shape[1]), int(mcp.y * hand_image.shape[0])
            pip_x, pip_y = int(pip.x * hand_image.shape[1]), int(pip.y * hand_image.shape[0])

            mid_y = (mcp_y + pip_y) // 2

            overlay_image_alpha(
                hand_image,
                ring_image[:, :, :3],
                mcp_x - 30,
                mid_y - 10,
                ring_image[:, :, 3],
            )

    hands.close()
    return hand_image

def main():
    if len(sys.argv) != 4:
        print("Usage: python process_ring.py <hand_image_path> <ring_image_path> <output_path>")
        sys.exit(1)

    hand_path = sys.argv[1]
    ring_path = sys.argv[2]
    output_path = sys.argv[3]

    # Read images
    hand_image = cv2.imread(hand_path)
    ring_image = cv2.imread(ring_path, cv2.IMREAD_UNCHANGED)
    ring_image = cv2.resize(ring_image, (100, 90))

    # Process image
    result = process_hand_image(hand_image, ring_image)
    
    # Save result
    cv2.imwrite(output_path, result)

if __name__ == "__main__":
    main() 