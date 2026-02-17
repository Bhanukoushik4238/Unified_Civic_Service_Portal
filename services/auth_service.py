"""
Authentication Service - Microservice for JWT token management
Handles JWT generation, validation, and secure cookie operations
"""

import jwt
import datetime
from typing import Dict, Optional, Tuple
from functools import wraps
from flask import request, jsonify, make_response
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class AuthService:
    """Authentication Service Class - Microservice approach for JWT management"""
    
    def __init__(self):
        self.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
        self.algorithm = 'HS256'
        self.token_expiry_hours = 1
        self.refresh_token_expiry_days = 7
        self.cookie_name = 'auth_token'
        self.refresh_cookie_name = 'refresh_token'
        self.cookie_secure = os.getenv('COOKIE_SECURE', 'False').lower() == 'true'
        self.cookie_samesite = os.getenv('COOKIE_SAMESITE', 'Strict')

    def _use_secure_cookie(self) -> bool:
        """
        Use secure cookies in HTTPS/prod. Allow localhost HTTP for development.
        """
        if self.cookie_secure:
            return True
        host = (request.host or '').split(':')[0].lower()
        if host in {'localhost', '127.0.0.1'} and not request.is_secure:
            return False
        return self.cookie_secure
    
    def generate_tokens(self, user_data: Dict) -> Tuple[str, str]:
        """
        Generate access and refresh tokens
        
        Args:
            user_data (Dict): User information
            
        Returns:
            Tuple[str, str]: (access_token, refresh_token)
        """
        try:
            # Access Token (short-lived)
            access_payload = {
                'user_id': user_data['user_id'],
                'mobile': user_data['mobile'],
                'name': user_data['name'],
                'email': user_data.get('email', ''),
                'role': user_data.get('role', 'user'),
                'type': 'access',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=self.token_expiry_hours),
                'iat': datetime.datetime.utcnow()
            }
            
            # Refresh Token (long-lived)
            refresh_payload = {
                'user_id': user_data['user_id'],
                'mobile': user_data['mobile'],
                'type': 'refresh',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=self.refresh_token_expiry_days),
                'iat': datetime.datetime.utcnow()
            }
            
            access_token = jwt.encode(access_payload, self.secret_key, algorithm=self.algorithm)
            refresh_token = jwt.encode(refresh_payload, self.secret_key, algorithm=self.algorithm)
            
            print("✅ Auth Service: Tokens generated for user " + str(user_data['user_id']))
            return access_token, refresh_token
            
        except Exception as e:
            print("❌ Auth Service: Error generating tokens: " + str(e))
            return "", ""
    
    def validate_token(self, token: str, token_type: str = 'access') -> Tuple[bool, Optional[Dict]]:
        """
        Validate JWT token
        
        Args:
            token (str): JWT token
            token_type (str): Token type ('access' or 'refresh')
            
        Returns:
            Tuple[bool, Optional[Dict]]: (is_valid, payload)
        """
        try:
            if not token:
                return False, None
            
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check token type
            if payload.get('type') != token_type:
                print("❌ Auth Service: Invalid token - " + token_type + ", got " + str(payload.get('type')))
                return False, None
            
            # Check expiration
            if datetime.datetime.utcnow() > datetime.datetime.fromtimestamp(payload['exp']):
                print(" Auth Service: Token expired")
                return False, None
            
            return True, payload
            
        except jwt.ExpiredSignatureError:
            print(" Auth Service: Token signature expired")
            return False, None
        except jwt.InvalidTokenError as e:
            print(" Auth Service: Invalid token - " + str(e))
            return False, None
        except Exception as e:
            print(" Auth Service Error validating token: " + str(e))
            return False, None
    
    def refresh_access_token(self, refresh_token: str) -> Tuple[bool, str]:
        """
        Generate new access token using refresh token
        
        Args:
            refresh_token (str): Refresh token
            
        Returns:
            Tuple[bool, str]: (success, new_access_token)
        """
        try:
            is_valid, payload = self.validate_token(refresh_token, 'refresh')
            
            if not is_valid or not payload:
                return False, ""
            
            # Generate new access token
            user_data = {
                'user_id': payload['user_id'],
                'mobile': payload['mobile'],
                'name': payload.get('name', ''),
                'email': payload.get('email', ''),
                'role': payload.get('role', 'user')
            }
            
            access_token, _ = self.generate_tokens(user_data)
            
            print(" Auth Service: Access token refreshed for user " + str(payload['user_id']))
            return True, access_token
            
        except Exception as e:
            print(" Auth Service: Error refreshing token: " + str(e))
            return False, ""
    
    def set_auth_cookies(self, response, access_token: str, refresh_token: str) -> None:
        """
        Set authentication cookies in response
        
        Args:
            response: Flask response object
            access_token (str): Access token
            refresh_token (str): Refresh token
        """
        # Access Token Cookie (HTTPOnly, Secure, SameSite)
        response.set_cookie(
            self.cookie_name,
            access_token,
            httponly=True,
            secure=self._use_secure_cookie(),
            samesite=self.cookie_samesite,
            max_age=3600  # 1 hour
        )
        
        # Refresh Token Cookie (HTTPOnly, Secure, SameSite)
        response.set_cookie(
            self.refresh_cookie_name,
            refresh_token,
            httponly=True,
            secure=self._use_secure_cookie(),
            samesite=self.cookie_samesite,
            max_age=604800  # 7 days
        )
        
        print(" Auth Service: Authentication cookies set")
    
    def clear_auth_cookies(self, response) -> None:
        """
        Clear authentication cookies
        
        Args:
            response: Flask response object
        """
        response.delete_cookie(self.cookie_name)
        response.delete_cookie(self.refresh_cookie_name)
        print(" Auth Service: Authentication cookies cleared")
    
    def get_token_from_request(self) -> Optional[str]:
        """
        Extract token from request cookies or headers
        
        Returns:
            Optional[str]: Token string or None
        """
        # Try to get from cookie first
        token = request.cookies.get(self.cookie_name)
        
        # If not in cookie, try Authorization header
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        return token
    
    def get_refresh_token_from_request(self) -> Optional[str]:
        """
        Extract refresh token from request cookies
        
        Returns:
            Optional[str]: Refresh token string or None
        """
        return request.cookies.get(self.refresh_cookie_name)
    
    def token_required(self, f):
        """
        Decorator for routes that require authentication
        
        Args:
            f: Function to decorate
            
        Returns:
            Decorated function
        """
        @wraps(f)
        def decorated(*args, **kwargs):
            token = self.get_token_from_request()

            payload = None
            token_refreshed = False
            refresh_token = self.get_refresh_token_from_request()

            if token:
                is_valid, payload = self.validate_token(token)
            else:
                is_valid = False

            if not is_valid:
                if refresh_token:
                    success, new_access_token = self.refresh_access_token(refresh_token)
                    if success:
                        token_refreshed = True
                        _, payload = self.validate_token(new_access_token)
                        request.current_user = payload
                        result = f(payload, *args, **kwargs)
                        response = make_response(result)
                        self.set_auth_cookies(response, new_access_token, refresh_token)
                        return response

                if not token:
                    return jsonify({
                        'message': 'Authentication token is missing',
                        'error_code': 'TOKEN_MISSING'
                    }), 401

                return jsonify({
                    'message': 'Authentication token is invalid or expired',
                    'error_code': 'TOKEN_INVALID'
                }), 401

            request.current_user = payload
            return f(payload, *args, **kwargs)
        
        return decorated
    
    def admin_required(self, f):
        """
        Decorator for routes that require admin role
        
        Args:
            f: Function to decorate
            
        Returns:
            Decorated function
        """
        @wraps(f)
        @self.token_required
        def decorated(current_user, *args, **kwargs):
            if current_user.get('role') != 'admin':
                return jsonify({
                    'message': 'Admin access required',
                    'error_code': 'INSUFFICIENT_PERMISSIONS'
                }), 403
            
            return f(current_user, *args, **kwargs)
        
        return decorated
    
    def get_current_user(self) -> Optional[Dict]:
        """
        Get current user from request context
        
        Returns:
            Optional[Dict]: Current user data or None
        """
        return getattr(request, 'current_user', None)
    
    def is_authenticated(self) -> bool:
        """
        Check if current user is authenticated
        
        Returns:
            bool: True if authenticated
        """
        return self.get_current_user() is not None
    
    def is_admin(self) -> bool:
        """
        Check if current user is admin
        
        Returns:
            bool: True if admin
        """
        current_user = self.get_current_user()
        return current_user and current_user.get('role') == 'admin'
    
    def get_user_id(self) -> Optional[str]:
        """
        Get current user ID
        
        Returns:
            Optional[str]: User ID or None
        """
        current_user = self.get_current_user()
        return current_user.get('user_id') if current_user else None

# Singleton instance for application-wide use
auth_service = AuthService()
