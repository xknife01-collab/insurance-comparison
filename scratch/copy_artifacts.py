import shutil
import os

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain\5dc374e0-0c8b-4e11-9116-db8584717d6e"
artifacts_dir = os.path.join(brain_dir, "artifacts")
os.makedirs(artifacts_dir, exist_ok=True)

# Copy screenshot
src_img = os.path.join(brain_dir, "comparison_table_1780121450767.png")
dst_img = os.path.join(artifacts_dir, "comparison_table.png")
if os.path.exists(src_img):
    shutil.copy2(src_img, dst_img)
    print(f"Copied screenshot to {dst_img}")

# Copy webp video
src_video = os.path.join(brain_dir, "golf_results_visualized_1780120985014.webp")
dst_video = os.path.join(artifacts_dir, "golf_flow_demo.webp")
if os.path.exists(src_video):
    shutil.copy2(src_video, dst_video)
    print(f"Copied webp video to {dst_video}")
