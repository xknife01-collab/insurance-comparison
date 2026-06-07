from PIL import Image

img_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\media__1780812945795.png"
img = Image.open(img_path)

# Crop the bottom table area of the card
# The image is 1920x1080 or similar. Let's inspect its dimensions first.
w, h = img.size
print(f"Dimensions: {w}x{h}")

# The card is in the center-right. Let's crop the bottom part:
# x from w/2 to w, y from h*0.8 to h
box = (int(w * 0.4), int(h * 0.88), int(w * 0.85), h)
cropped = img.crop(box)
cropped.save(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\cropped_table.png")
print("Cropped table saved to scripts/scratch/cropped_table.png")
