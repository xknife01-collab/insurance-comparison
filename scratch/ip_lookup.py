import urllib.request
import json

ip = "2406:da18:e5c:b700:7f66:6c70:579f:ae2c"
url = f"https://ipinfo.io/{ip}/json"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"[-] Failed: {e}")
