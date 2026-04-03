#!/usr/bin/env python3
"""
Backend Authentication Testing for Sonar App
Tests the 3 auth endpoints: register, login, me
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env
BACKEND_URL = "https://6365f16a-9c13-4c38-88d3-e4deb9c2ac9a.preview.emergentagent.com/api"

class AuthTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.auth_token = None
        # Use timestamp to ensure unique email for each test run
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.test_user_email = f"sonar.test.user.{timestamp}@example.com"
        self.test_user_password = "testpass123"
        self.test_user_name = "Sonar Test User"
        
    def log_result(self, test_name, success, details, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_register_success(self):
        """Test successful user registration"""
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": self.test_user_name,
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 201 or response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if "token" in data and "user" in data:
                    user = data["user"]
                    required_fields = ["id", "name", "email", "avatar_url", "created_at"]
                    
                    if all(field in user for field in required_fields):
                        if user["email"] == self.test_user_email and user["name"] == self.test_user_name:
                            self.auth_token = data["token"]  # Store token for later tests
                            self.log_result("Register Success", True, "User registered successfully with correct data structure", data)
                            return True
                        else:
                            self.log_result("Register Success", False, "User data doesn't match input", data)
                    else:
                        missing = [f for f in required_fields if f not in user]
                        self.log_result("Register Success", False, f"Missing user fields: {missing}", data)
                else:
                    self.log_result("Register Success", False, "Missing token or user in response", data)
            else:
                self.log_result("Register Success", False, f"Expected 200/201, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Register Success", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_register_duplicate_email(self):
        """Test registration with duplicate email (should return 409)"""
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": "Another User",
            "email": self.test_user_email,  # Same email as previous test
            "password": "anotherpass123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 409:
                self.log_result("Register Duplicate Email", True, "Correctly rejected duplicate email with 409")
                return True
            else:
                data = response.text if response.status_code != 200 else response.json()
                self.log_result("Register Duplicate Email", False, f"Expected 409, got {response.status_code}", data)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Register Duplicate Email", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_register_short_password(self):
        """Test registration with short password (should return 400)"""
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": "Short Pass User",
            "email": "shortpass@example.com",
            "password": "123"  # Less than 6 characters
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 400:
                self.log_result("Register Short Password", True, "Correctly rejected short password with 400")
                return True
            else:
                data = response.text if response.status_code != 200 else response.json()
                self.log_result("Register Short Password", False, f"Expected 400, got {response.status_code}", data)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Register Short Password", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_login_success(self):
        """Test successful login with correct credentials"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if "token" in data and "user" in data:
                    user = data["user"]
                    required_fields = ["id", "name", "email", "avatar_url", "created_at"]
                    
                    if all(field in user for field in required_fields):
                        if user["email"] == self.test_user_email:
                            self.auth_token = data["token"]  # Update token
                            self.log_result("Login Success", True, "Login successful with correct data structure", data)
                            return True
                        else:
                            self.log_result("Login Success", False, "User email doesn't match", data)
                    else:
                        missing = [f for f in required_fields if f not in user]
                        self.log_result("Login Success", False, f"Missing user fields: {missing}", data)
                else:
                    self.log_result("Login Success", False, "Missing token or user in response", data)
            else:
                self.log_result("Login Success", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Login Success", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_login_wrong_password(self):
        """Test login with wrong password (should return 401)"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": self.test_user_email,
            "password": "wrongpassword123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 401:
                self.log_result("Login Wrong Password", True, "Correctly rejected wrong password with 401")
                return True
            else:
                data = response.text if response.status_code != 200 else response.json()
                self.log_result("Login Wrong Password", False, f"Expected 401, got {response.status_code}", data)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Login Wrong Password", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_login_nonexistent_email(self):
        """Test login with non-existent email (should return 401)"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": "nonexistent@example.com",
            "password": "somepassword123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 401:
                self.log_result("Login Nonexistent Email", True, "Correctly rejected nonexistent email with 401")
                return True
            else:
                data = response.text if response.status_code != 200 else response.json()
                self.log_result("Login Nonexistent Email", False, f"Expected 401, got {response.status_code}", data)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Login Nonexistent Email", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_me_with_valid_token(self):
        """Test /me endpoint with valid JWT token"""
        if not self.auth_token:
            self.log_result("Me Valid Token", False, "No auth token available from previous tests")
            return False
            
        url = f"{self.base_url}/auth/me"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "name", "email", "avatar_url", "created_at"]
                
                if all(field in data for field in required_fields):
                    if data["email"] == self.test_user_email:
                        self.log_result("Me Valid Token", True, "Successfully retrieved user data with valid token", data)
                        return True
                    else:
                        self.log_result("Me Valid Token", False, "User email doesn't match", data)
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Me Valid Token", False, f"Missing user fields: {missing}", data)
            else:
                self.log_result("Me Valid Token", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Me Valid Token", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_me_with_invalid_token(self):
        """Test /me endpoint with invalid JWT token (should return 401)"""
        url = f"{self.base_url}/auth/me"
        headers = {"Authorization": "Bearer invalid.jwt.token"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 401:
                self.log_result("Me Invalid Token", True, "Correctly rejected invalid token with 401")
                return True
            else:
                data = response.text if response.status_code != 200 else response.json()
                self.log_result("Me Invalid Token", False, f"Expected 401, got {response.status_code}", data)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Me Invalid Token", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_me_without_token(self):
        """Test /me endpoint without token (should return 403)"""
        url = f"{self.base_url}/auth/me"
        
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 403:
                self.log_result("Me Without Token", True, "Correctly rejected missing token with 403")
                return True
            else:
                data = response.text if response.status_code != 200 else response.json()
                self.log_result("Me Without Token", False, f"Expected 403, got {response.status_code}", data)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Me Without Token", False, f"Request failed: {str(e)}")
        
        return False
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print(f"🚀 Starting Backend Authentication Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_register_success,
            self.test_register_duplicate_email,
            self.test_register_short_password,
            self.test_login_success,
            self.test_login_wrong_password,
            self.test_login_nonexistent_email,
            self.test_me_with_valid_token,
            self.test_me_with_invalid_token,
            self.test_me_without_token
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print()  # Add spacing between tests
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All authentication tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} tests FAILED")
            return False

def main():
    """Main test runner"""
    tester = AuthTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()