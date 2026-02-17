import random
import datetime
from typing import Dict, Optional, Tuple

class OTPService:
    def __init__(self):
        self._otp_store: Dict[str, Dict] = {}
        self.otp_length = 6
        self.expiry_minutes = 3
        self.max_attempts = 3
        self.sms_enabled = False  # Disabled for development
    
    def generate_otp(self) -> str:
        return str(random.randint(100000, 999999))
    
    def store_otp(self, mobile: str, otp: str) -> bool:
        try:
            expiry_time = datetime.datetime.now() + datetime.timedelta(minutes=self.expiry_minutes)
            
            self._otp_store[mobile] = {
                'otp': otp,
                'expiry': expiry_time,
                'attempts': 0,
                'created_at': datetime.datetime.now(),
                'is_used': False
            }
            
            # Console output for development
            print(f"OTP for {mobile}: {otp}")
            
            return True
        except Exception as e:
            print("OTP Service Error storing OTP: " + str(e))
            return False
    
    def validate_otp(self, mobile: str, otp: str) -> Tuple[bool, str]:
        try:
            if mobile not in self._otp_store:
                return False, 'OTP not found. Please request a new OTP'
            
            stored_data = self._otp_store[mobile]
            
            if datetime.datetime.now() > stored_data['expiry']:
                del self._otp_store[mobile]
                return False, 'OTP has expired. Please request a new OTP'
            
            if stored_data['attempts'] >= self.max_attempts:
                del self._otp_store[mobile]
                return False, 'Maximum attempts reached. Please request a new OTP'
            
            if stored_data['otp'] != otp:
                stored_data['attempts'] += 1
                remaining_attempts = self.max_attempts - stored_data['attempts']
                return False, f'Invalid OTP. {remaining_attempts} attempts remaining'
            
            del self._otp_store[mobile]
            return True, 'OTP verified successfully'
            
        except Exception as e:
            print("OTP Service Error validating OTP: " + str(e))
            return False, 'Server error'
    
    def cleanup_expired_otps(self) -> None:
        try:
            current_time = datetime.datetime.now()
            expired_keys = []
            
            for mobile, data in self._otp_store.items():
                if current_time > data['expiry']:
                    expired_keys.append(mobile)
            
            for key in expired_keys:
                del self._otp_store[key]
                
        except Exception as e:
            print("OTP Service Error cleaning up: " + str(e))
    
    def get_otp_info(self, mobile: str) -> Optional[Dict]:
        return self._otp_store.get(mobile)

otp_service = OTPService()
