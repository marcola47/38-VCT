import requests
import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()

# --- Configurations ---
# The base URL of your FastAPI API
API_BASE_URL = "http://127.0.0.0:8000"

# The endpoint you want to test (one that requires authentication, e.g., list projects)
TEST_ENDPOINT = "/api/v1/projects"

# Your VALID JWT token from Supabase
# Make sure to set this in your .env file
VALID_TOKEN = os.getenv("VALID_SUPABASE_TOKEN")

# An INVALID JWT token (for testing failure cases)
INVALID_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjQrc1JUYXdqSlZCenZDSTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3p0aXh0ZXJjZGFic3RveG53dGZjLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmYWNiOGEzZi05MzkzLTQyZmItYjE0Zi1jZGVkNGE5Yjk1NzkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ5ODc2NTY0LCJpYXQiOjE3NDk4NzI5NjQsImVtYWlsIjoibGVvdmVpZ2EyMDAyQGdtYWlsLmNvbW0iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoibGVvdmVpZ2EyMDAyQGdtYWlsLmNvbW0iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJmYWNiOGEzZi05MzkzLTQyZmItYjE0Zi1jZGVkNGE5Yjk1NzkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0OTg3Mjk2NH1dLCJzZXNzaW9uX2lkIjoiM2I4NjVhNGEtNDUzZC00MjBjLWJlZTItYmU4M2UzMWU1ODA3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.2dhw38y9VAwlaKk9G1tTVeueavXhJhAN7wzm00YX1YU"
# No token (for testing requests without a token)
NO_TOKEN = None


# --- Function to Make the Request ---
def make_authenticated_request(token: Optional[str], url: str):
    """Makes a GET request to the provided URL with the authorization token."""
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        print(f"\n--- Attempting request with TOKEN: {token[:30]}... ---")
    else:
        print("\n--- Attempting request WITHOUT TOKEN ---")

    try:
        print(f"Requesting URL: {url}")
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
        print(f"Status Code: {response.status_code}")
        print("Response (JSON):")
        print(response.json())
    except requests.exceptions.HTTPError as exc:
        print(f"Request Error: {exc.response.status_code} - {exc.response.text}")
        print("Expected! The API denied access, which is a good sign for invalid/missing tokens.")
    except requests.exceptions.ConnectionError as exc:
        print(f"Network Error connecting to the API at '{exc.request.url}': {exc}")
        print("Make sure your FastAPI API is running at " + API_BASE_URL)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# --- Main Test Function ---
def main():
    print("Starting FastAPI API authentication tests...")

    # First, make sure you have a valid token in your .env
    if not VALID_TOKEN:
        print("\nATTENTION: 'VALID_SUPABASE_TOKEN' not found in your .env file.")
        print("Please add your valid token to test successful authentication.")
        print("Example: VALID_SUPABASE_TOKEN='eyJhbGciOiJIUzI1NiI...'\n")

    # Test 1: Request with a VALID token
    if VALID_TOKEN:
        make_authenticated_request(VALID_TOKEN, f"{API_BASE_URL}{TEST_ENDPOINT}")

    # Test 2: Request with an INVALID token
    make_authenticated_request(INVALID_TOKEN, f"{API_BASE_URL}{TEST_ENDPOINT}")

    # Test 3: Request without a token
    make_authenticated_request(NO_TOKEN, f"{API_BASE_URL}{TEST_ENDPOINT}")

    print("\nTests completed.")


if __name__ == "__main__":
    main()