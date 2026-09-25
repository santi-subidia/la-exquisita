/**
 * Canvas Chroma Key Processor
 * Performs real-time green screen removal and despill on HTMLCanvasElement.
 */

export interface ChromaKeyOptions {
  lowThreshold?: number;
  highThreshold?: number;
  despill?: boolean;
}

export function processCanvasChromaKey(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ChromaKeyOptions = {}
): ImageData {
  const { lowThreshold = 15, highThreshold = 40, despill = true } = options;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    const maxRb = Math.max(r, b);
    const greenness = g - maxRb;

    // Check pure green or high green dominance
    if (g > 180 && r < 70 && b < 70) {
      data[i + 3] = 0;
      continue;
    }

    if (greenness > highThreshold) {
      data[i + 3] = 0;
    } else if (greenness > lowThreshold) {
      const factor = 1.0 - (greenness - lowThreshold) / (highThreshold - lowThreshold);
      data[i + 3] = Math.round(a * factor);

      if (despill) {
        data[i + 1] = Math.min(g, Math.round(maxRb * 0.95 + 5));
      }
    } else if (despill && greenness > 5) {
      data[i + 1] = Math.min(g, Math.round(maxRb * 0.95 + 5));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return imageData;
}
