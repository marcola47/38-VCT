import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Usuário de teste (deve existir no Supabase Auth)
email = "leoveiga2002@gmail.comm"
password = "12345678"

def fake_frontend_login():
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "email": email,
        "password": password
    }
    response = requests.post(url, headers=headers, data=json.dumps(data), timeout=10)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

if __name__ == "__main__":
    token = fake_frontend_login()
    print(token)
