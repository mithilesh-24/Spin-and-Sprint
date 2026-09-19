from PIL import Image
import numpy as np

def extract_spidey():
    img = Image.open('mascot.jpg').convert('RGBA')
    w, h = img.size
    
    # Crop to the spidey character area (omitting top header logos and bottom text)
    # Spidey is located roughly between 15% and 80% vertically, and 10% to 90% horizontally
    crop_box = (int(w * 0.12), int(h * 0.16), int(w * 0.88), int(h * 0.78))
    cropped = img.crop(crop_box)
    
    data = np.array(cropped)
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # The background is white/near-white (> 230 on all channels) with faint gray web lines (> 205 and low saturation)
    # The character itself has bold black comic outline (low brightness), red suit, blue pants, green backpack, yellow/off-white eye lenses.
    # Note: Spidey eyes have warm yellow/off-white (e.g., r:245, g:230, b:200) with saturation and are enclosed by black outline.
    
    # Let's perform flood-fill transparency from the outer edges
    cw, ch = cropped.size
    visited = np.zeros((ch, cw), dtype=bool)
    mask = np.zeros((ch, cw), dtype=bool) # True = background
    
    # Criteria for background pixel:
    # Brightness is high: R>210, G>210, B>210 and diff between max and min channel < 30
    is_bg_color = (r > 200) & (g > 200) & (b > 200) & (np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b) < 40)
    
    # Also allow faint spiderweb lines that are on the white background: (brightness > 185 and diff < 20)
    is_faint_web = (r > 185) & (g > 185) & (b > 185) & (np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b) < 18)
    is_bg_candidate = is_bg_color | is_faint_web
    
    # Flood fill from all 4 borders
    queue = []
    for x in range(cw):
        if is_bg_candidate[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_bg_candidate[ch-1, x]:
            queue.append((ch-1, x))
            visited[ch-1, x] = True
            
    for y in range(ch):
        if is_bg_candidate[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_bg_candidate[y, cw-1]:
            queue.append((y, cw-1))
            visited[y, cw-1] = True
            
    idx = 0
    while idx < len(queue):
        cy, cx = queue[idx]
        idx += 1
        mask[cy, cx] = True
        
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < ch and 0 <= nx < cw and not visited[ny, nx]:
                visited[ny, nx] = True
                # If it's a background candidate or thin line near background
                if is_bg_candidate[ny, nx]:
                    queue.append((ny, nx))
                    
    # Apply alpha: background pixels get 0
    data[mask, 3] = 0
    
    # Smooth edges with slight feathering
    result = Image.fromarray(data, 'RGBA')
    
    # Trim empty borders
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
        
    result.save('public/spidey-alone.png', 'PNG')
    result.save('src/assets/spidey-alone.png', 'PNG')
    print("Spidey extracted successfully! Size:", result.size)

if __name__ == '__main__':
    extract_spidey()
