from src.config import PINATA_TOKEN, PINATA_URL
import requests

def upload_file(file):
    headers = {
        'Authorization': f'Bearer {PINATA_TOKEN}'
    }
    data = {
        'file': file
    }
    response = requests.post(
        PINATA_URL,
        headers=headers,
        files=data
    )
    return response