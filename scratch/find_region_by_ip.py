import urllib.request
import json
import socket

try:
    ip = socket.gethostbyname("wfkxwztxpugakusynhpx.supabase.co")
    print(f"[+] IP address of wfkxwztxpugakusynhpx.supabase.co: {ip}")
    
    url = f"https://ipinfo.io/{ip}/json"
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        print("[+] GeoIP Info:")
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"[-] Failed: {e}")
