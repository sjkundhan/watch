import json

data = json.load(open('C:/Users/sanj2/Desktop/watch/luxury-watch/app/data/watches.json'))
print(f'Total: {len(data)}')
print(f'With images: {sum(1 for w in data if w.get("image"))}')
