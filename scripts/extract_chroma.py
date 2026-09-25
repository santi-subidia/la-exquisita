from PIL import Image
import numpy as np

def extract_chroma_key(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)

    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]
    a = arr[:, :, 3]

    # Calculate how much green dominates over red and blue
    max_rb = np.maximum(r, b)
    greenness = g - max_rb

    # Define thresholds
    # Pure green has greenness = 255. Crust has negative or near zero greenness.
    high_threshold = 40.0
    low_threshold = 15.0

    # Alpha mask calculation with smooth transition
    alpha_factor = 1.0 - np.clip((greenness - low_threshold) / (high_threshold - low_threshold), 0.0, 1.0)
    
    # Also handle near-pure greens
    is_pure_green = (g > 180) & (r < 70) & (b < 70)
    alpha_factor[is_pure_green] = 0.0

    new_a = a * alpha_factor

    # Despill: suppress excess green in semi-transparent and border areas
    despill_mask = greenness > 5.0
    new_g = g.copy()
    new_g[despill_mask] = np.minimum(g[despill_mask], max_rb[despill_mask] * 0.95 + 5.0)

    # Reconstruct RGBA
    result = np.zeros_like(arr, dtype=np.uint8)
    result[:, :, 0] = np.clip(r, 0, 255).astype(np.uint8)
    result[:, :, 1] = np.clip(new_g, 0, 255).astype(np.uint8)
    result[:, :, 2] = np.clip(b, 0, 255).astype(np.uint8)
    result[:, :, 3] = np.clip(new_a, 0, 255).astype(np.uint8)

    out_img = Image.fromarray(result, mode='RGBA')
    
    # Auto-crop bounding box of non-transparent content
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)

    out_img.save(output_path, format='PNG')
    print(f"Successfully processed chroma key. Output saved to {output_path} with size {out_img.size}")

if __name__ == '__main__':
    extract_chroma_key('media/comida/tarta-jamon_y_queso-fondoverde.png', 'media/comida/tarta-hero-transparent.png')
