from PIL import Image
import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
social_src = os.path.join(root, "public", "images", "social.png")
favicon_src = os.path.join(root, "public", "images", "faviconcore-environnement.png")

# OG image 1200x630 under 300KB
img = Image.open(social_src).convert("RGB")
target_w, target_h = 1200, 630
src_w, src_h = img.size
scale = max(target_w / src_w, target_h / src_h)
new_size = (int(src_w * scale), int(src_h * scale))
img = img.resize(new_size, Image.LANCZOS)
left = (img.width - target_w) // 2
top = (img.height - target_h) // 2
img = img.crop((left, top, left + target_w, top + target_h))

og_path = os.path.join(root, "public", "images", "og-social.jpg")
for quality in [85, 80, 75, 70, 65, 60, 55, 50]:
    img.save(og_path, "JPEG", quality=quality, optimize=True, progressive=True)
    size = os.path.getsize(og_path)
    if size <= 300_000:
        print(f"og-social.jpg: {target_w}x{target_h}, q={quality}, {size} bytes")
        break
else:
    print(f"og-social.jpg: still {os.path.getsize(og_path)} bytes at q=50")

# App icons from favicon source
src = Image.open(favicon_src).convert("RGBA")
for name, size in [("icon.png", 512), ("apple-icon.png", 180)]:
    out = os.path.join(root, "app", name)
    resized = src.resize((size, size), Image.LANCZOS)
    resized.save(out, "PNG", optimize=True)
    print(f"{name}: {size}x{size}, {os.path.getsize(out)} bytes")

# Sync app/favicon.ico from public
pub_fav = os.path.join(root, "public", "favicon.ico")
app_fav = os.path.join(root, "app", "favicon.ico")
with open(pub_fav, "rb") as f:
    data = f.read()
with open(app_fav, "wb") as f:
    f.write(data)
print(f"app/favicon.ico: {len(data)} bytes")
