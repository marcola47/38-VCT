import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Novo usuário de teste
email = "leoveiga2002@gmail.comm"
password = "12345678"

def fake_frontend_signup():
    url = f"{SUPABASE_URL}/auth/v1/signup"
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "email": email,
        "password": password
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print("Status:", response.status_code)
    print("Response:", response.json())
    if response.status_code == 200:
        print("Usuário criado com sucesso!")
    else:
        print("Falha ao criar usuário.")

if __name__ == "__main__":
    fake_frontend_signup()
