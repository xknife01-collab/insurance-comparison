import requests

def main():
    url = "https://wfkxwztxpugakusynhpx.supabase.co/rest/v1/"
    headers = {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDU2OTYsImV4cCI6MjA4OTk4MTY5Nn0.B_udlQS12H5hXock5AZK_t6ikqoTvpAb2-ovOH995mg"
    }
    try:
        res = requests.get(url, headers=headers)
        print("Status Code:", res.status_code)
        print("Headers:")
        for k, v in res.headers.items():
            print(f"  {k}: {v}")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
