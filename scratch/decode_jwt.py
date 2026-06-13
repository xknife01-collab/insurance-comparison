import base64
import json

jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDU2OTYsImV4cCI6MjA4OTk4MTY5Nn0.B_udlQS12H5hXock5AZK_t6ikqoTvpAb2-ovOH995mg"
payload = jwt_token.split('.')[1]
# Fix padding
payload += '=' * (-len(payload) % 4)
decoded = base64.b64decode(payload).decode('utf-8')
print(json.dumps(json.loads(decoded), indent=2))
