from PIL import Image

img_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx"
# Let's crop from the screenshot:
img = Image.open(r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\media__1780812633003.png")
w, h = img.size
# Crop around the top-left area of the card
box = (int(w * 0.25), int(h * 0.15), int(w * 0.35), int(h * 0.35))
cropped = img.crop(box)
cropped.save(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\cropped_icon.png")
print("Cropped icon saved to scripts/scratch/cropped_icon.png")
