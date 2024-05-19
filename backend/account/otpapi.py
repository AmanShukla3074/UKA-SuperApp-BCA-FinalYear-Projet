#-------- created for otp (2factor) api ---------- date:3/01/2024

import requests
import random
from django.conf import settings

def send_otp_to_mobile(mobile_no):

    try:
        otp=random.randint(1000,9999)
        url= f'https://2factor.in/API/V1/{settings.API_KEY}/SMS/{mobile_no}/{otp}/Shadow'
        response = requests.get(url)
        return otp

    
    except Exception as e:
        return None