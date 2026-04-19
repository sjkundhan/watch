import fitz

doc = fitz.open('C:/Users/sanj2/Desktop/watch/ge2204.pdf')

print(f"Total Pages: {len(doc)}")
for i in range(10, min(30, len(doc))):
    text = doc[i].get_text()
    if text.strip():
        print(f"--- Page {i} ---")
        print(text[:200])
        print("..." )

# also count images
total_img = 0
for i in range(min(50, len(doc))):
    images = doc[i].get_images()
    total_img += len(images)

print(f"Images in first 50 pages: {total_img}")
