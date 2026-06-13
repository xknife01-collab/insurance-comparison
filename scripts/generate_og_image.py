import os
from PIL import Image

def generate_og_image():
    # Paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    logo_path = os.path.join(project_root, 'public', '6397187.png')
    output_path = os.path.join(project_root, 'public', 'og-image.png')

    print(f"Loading logo from: {logo_path}")
    if not os.path.exists(logo_path):
        print("Logo not found!")
        return

    # Open original logo
    logo = Image.open(logo_path)
    
    # 2:1 KakaoTalk standard OG size: 800 x 400
    canvas_w = 800
    canvas_h = 400
    
    # Create new white canvas
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (255, 255, 255, 255))
    
    # Calculate scale factor to make logo fit nicely (height = 360px with padding)
    target_h = 340
    scale = target_h / logo.height
    target_w = int(logo.width * scale)
    
    # Resize logo
    resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Center position
    offset_x = (canvas_w - target_w) // 2
    offset_y = (canvas_h - target_h) // 2
    
    # Paste logo onto canvas
    # If original has alpha channel, use it as mask
    if resized_logo.mode == 'RGBA':
        canvas.alpha_composite(resized_logo, (offset_x, offset_y))
    else:
        canvas.paste(resized_logo, (offset_x, offset_y))
        
    # Convert to RGB (to ensure standard compatibility and compression)
    final_img = canvas.convert('RGB')
    final_img.save(output_path, 'PNG')
    print(f"Successfully created OG image at: {output_path}")

if __name__ == '__main__':
    generate_og_image()
