import requests

API_KEY = input("Paste your Groq API key: ").strip()

url = "https://api.groq.com/openai/v1/models"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

if response.status_code != 200:
    print("\n❌ Request failed")
    print("Status:", response.status_code)
    print(response.text)
    exit()

data = response.json()

print("\n✅ Models available to your API key:\n")

for model in data.get("data", []):
    print(f"Model: {model.get('id')}")
    print(f"Owner: {model.get('owned_by')}")
    print(f"Context: {model.get('context_window')}")
    print(f"Max output: {model.get('max_completion_tokens')}")
    print("-" * 50)

print(f"\nTotal models returned: {len(data.get('data', []))}")