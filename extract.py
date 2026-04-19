import fitz
import json
import os

doc = fitz.open('C:/Users/sanj2/Desktop/watch/ge2204.pdf')

parsed_watches = []
output_dir = 'C:/Users/sanj2/Desktop/watch/luxury-watch/public/images/scraped'
os.makedirs(output_dir, exist_ok=True)

# Start from page 10 where watches seem to begin
for i in range(10, min(61, len(doc))):
    page = doc[i]
    text = page.get_text()
    lines = [L.strip() for L in text.split('\n') if L.strip()]
    
    if len(lines) < 5:
        continue
        
    # Heuristic: Lot number is first line, Brand is second, Model is third...
    lot = lines[0]
    brand = lines[1]
    title_model = lines[2]
    
    # Try to find an image
    image_list = page.get_images(full=True)
    img_path = None
    if image_list:
        # Get the largest image by area
        image_list.sort(key=lambda img: img[2] * img[3], reverse=True)
        xref = image_list[0][0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        img_name = f"watch_{i}.{image_ext}"
        img_path = f"/images/scraped/{img_name}"
        
        with open(os.path.join(output_dir, img_name), "wb") as f:
            f.write(image_bytes)
            
    parsed_watches.append({
        "title": f"{brand} - {title_model}",
        "brand": brand,
        "model": title_model,
        "type": "Mechanical", # default or parsed
        "founded": "N/A",
        "price": "Auction",
        "overview": " ".join(lines[:15]),
        "image": img_path
    })
    
with open('C:/Users/sanj2/Desktop/watch/luxury-watch/app/data/scraped.json', 'w') as f:
    json.dump(parsed_watches[:50], f, indent=2)

print(f"Extracted {len(parsed_watches)} watches.")
