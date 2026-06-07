from PIL import Image

# Let's crop from the screenshot:
img = Image.open(r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\media__1780812945795.png")
w, h = img.size
# Crop the table rows at the bottom of the card
box = (int(w * 0.35), int(h * 0.70), int(w * 0.65), int(h * 0.98))
cropped = img.crop(box)
cropped.save(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\cropped_upgrade_table.png")
print("Cropped upgrade table saved to scripts/scratch/cropped_upgrade_table.png")
