import json

try:
    with open('C:/Users/sanj2/Desktop/watch/luxury-watch/app/data/watches.json') as f:
        data = json.load(f)
        for i, w in enumerate(data[:10]):
            print(f"{i}: {w.get('brand', '')} | {w.get('model', '')}")
except Exception as e:
    print(e)
