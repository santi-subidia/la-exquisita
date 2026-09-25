import urllib.request
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
}

print("--- FETCHING INSTAGRAM ---")
try:
    req = urllib.request.Request('https://www.instagram.com/la.exquisitasl/', headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        for match in re.finditer(r'<meta (?:property|name)="([^"]+)" content="([^"]+)"', html):
            prop, content = match.groups()
            if 'description' in prop or 'title' in prop or 'image' in prop:
                print(f"IG {prop}: {content}")
        # Look for bio or json in script
        bio_matches = re.findall(r'"biography":"(.*?)"', html)
        if bio_matches:
            print(f"IG Bio: {bio_matches[0]}")
except Exception as e:
    print(f"Error fetching Instagram: {e}")

print("\n--- FETCHING GOOGLE MAPS PLACE ---")
try:
    maps_url = 'https://www.google.com/maps/place/LA+EXQUISITA/@-33.3135898,-66.3442309,17z/data=!4m6!3m5!1s0x95d43b00523b1b75:0x816dbf258dc79b7f!8m2!3d-33.3135898!4d-66.3442309!16s%2Fg%2F11lw81xsp8'
    req_map = urllib.request.Request(maps_url, headers=headers)
    with urllib.request.urlopen(req_map, timeout=10) as resp:
        html_map = resp.read().decode('utf-8', errors='ignore')
        for match in re.finditer(r'<meta content="([^"]+)" itemprop="([^"]+)"', html_map):
            content, item_prop = match.groups()
            print(f"Maps {item_prop}: {content}")
        # Extract title
        titles = re.findall(r'<title>(.*?)</title>', html_map)
        if titles:
            print(f"Maps Title: {titles[0]}")
        # Extract snippet around location
        address_match = re.findall(r'(\b[A-Za-z0-9\.\s,ºª-]+(?:San Luis|D5700)[^"\\]*)', html_map)
        if address_match:
            print(f"Possible Address: {address_match[:3]}")
except Exception as e:
    print(f"Error fetching Maps: {e}")
