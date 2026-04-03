#!/usr/bin/env python3
"""
Backend Testing for Sonar App
Tests authentication and project CRUD endpoints
"""

import requests
import json
import sys
import os
from datetime import datetime
import uuid

# Get backend URL from environment
BACKEND_URL = "https://agent-behavior-phase.preview.emergentagent.com/api"

class SonarBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.auth_token = None
        self.test_project_id = None
        # Use timestamp to ensure unique email for each test run
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.test_user_email = f"project-test@sonar.dev"
        self.test_user_password = "testpass123"
        self.test_user_name = "Test User"
        
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
    
    def test_auth_setup(self):
        """Register a test user for project testing"""
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": self.test_user_name,
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                if "token" in data:
                    self.auth_token = data["token"]
                    self.log_result("Auth Setup", True, "Test user registered and token obtained")
                    return True
                else:
                    self.log_result("Auth Setup", False, "No token in response", data)
            elif response.status_code == 409:
                # User already exists, try to login
                return self.test_auth_login()
            else:
                self.log_result("Auth Setup", False, f"Registration failed with {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Auth Setup", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_auth_login(self):
        """Login with test user credentials"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data:
                    self.auth_token = data["token"]
                    self.log_result("Auth Login", True, "Successfully logged in and obtained token")
                    return True
                else:
                    self.log_result("Auth Login", False, "No token in response", data)
            else:
                self.log_result("Auth Login", False, f"Login failed with {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Auth Login", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_create_project_success(self):
        """Test successful project creation"""
        if not self.auth_token:
            self.log_result("Create Project Success", False, "No auth token available")
            return False
            
        url = f"{self.base_url}/projects"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        payload = {
            "name": "My Todo App",
            "prompt": "Build a beautiful todo app",
            "type": "todo",
            "model": "gpt-4o",
            "mode": "S-1"
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                
                # Check required fields
                required_fields = ["id", "user_id", "name", "prompt", "type", "status", "code", "messages", "model", "mode", "created_at", "updated_at"]
                
                if all(field in data for field in required_fields):
                    # Verify field values
                    if (data["name"] == payload["name"] and 
                        data["prompt"] == payload["prompt"] and
                        data["type"] == payload["type"] and
                        data["model"] == payload["model"] and
                        data["mode"] == payload["mode"] and
                        data["status"] == "created" and
                        data["code"] == "" and
                        data["messages"] == []):
                        
                        self.test_project_id = data["id"]  # Save for later tests
                        self.log_result("Create Project Success", True, "Project created with correct structure and values")
                        return True
                    else:
                        self.log_result("Create Project Success", False, "Project field values don't match expected", data)
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Create Project Success", False, f"Missing required fields: {missing}", data)
            else:
                self.log_result("Create Project Success", False, f"Expected 200/201, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Create Project Success", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_create_project_without_auth(self):
        """Test project creation without authentication (should return 403)"""
        url = f"{self.base_url}/projects"
        payload = {
            "name": "Unauthorized Project",
            "prompt": "This should fail"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 403:
                self.log_result("Create Project Without Auth", True, "Correctly rejected unauthenticated request with 403")
                return True
            else:
                self.log_result("Create Project Without Auth", False, f"Expected 403, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Create Project Without Auth", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_create_project_minimal(self):
        """Test project creation with minimal data (only prompt)"""
        if not self.auth_token:
            self.log_result("Create Project Minimal", False, "No auth token available")
            return False
            
        url = f"{self.base_url}/projects"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        payload = {
            "prompt": "Build something"
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                
                # Check defaults are applied
                if (data["name"] == "untitled-app" and 
                    data["type"] == "custom" and
                    data["prompt"] == "Build something"):
                    self.log_result("Create Project Minimal", True, "Project created with correct defaults")
                    return True
                else:
                    self.log_result("Create Project Minimal", False, "Defaults not applied correctly", data)
            else:
                self.log_result("Create Project Minimal", False, f"Expected 200/201, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Create Project Minimal", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_list_projects(self):
        """Test listing user projects"""
        if not self.auth_token:
            self.log_result("List Projects", False, "No auth token available")
            return False
            
        url = f"{self.base_url}/projects"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    # Check if our created project is in the list
                    if self.test_project_id:
                        project_found = any(p.get("id") == self.test_project_id for p in data)
                        if project_found:
                            self.log_result("List Projects", True, f"Successfully retrieved {len(data)} projects including created project")
                            return True
                        else:
                            self.log_result("List Projects", False, "Created project not found in list", data)
                    else:
                        self.log_result("List Projects", True, f"Successfully retrieved {len(data)} projects")
                        return True
                else:
                    self.log_result("List Projects", False, "Response is not a list", data)
            else:
                self.log_result("List Projects", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("List Projects", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_list_projects_without_auth(self):
        """Test listing projects without authentication (should return 403)"""
        url = f"{self.base_url}/projects"
        
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 403:
                self.log_result("List Projects Without Auth", True, "Correctly rejected unauthenticated request with 403")
                return True
            else:
                self.log_result("List Projects Without Auth", False, f"Expected 403, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("List Projects Without Auth", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_project_by_id(self):
        """Test getting a single project by ID"""
        if not self.auth_token or not self.test_project_id:
            self.log_result("Get Project By ID", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("id") == self.test_project_id:
                    self.log_result("Get Project By ID", True, "Successfully retrieved project by ID")
                    return True
                else:
                    self.log_result("Get Project By ID", False, "Project ID doesn't match", data)
            else:
                self.log_result("Get Project By ID", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Project By ID", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_project_wrong_id(self):
        """Test getting project with wrong ID (should return 404)"""
        if not self.auth_token:
            self.log_result("Get Project Wrong ID", False, "No auth token available")
            return False
            
        wrong_id = str(uuid.uuid4())
        url = f"{self.base_url}/projects/{wrong_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 404:
                self.log_result("Get Project Wrong ID", True, "Correctly returned 404 for non-existent project")
                return True
            else:
                self.log_result("Get Project Wrong ID", False, f"Expected 404, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Project Wrong ID", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_project_without_auth(self):
        """Test getting project without authentication (should return 403)"""
        if not self.test_project_id:
            self.log_result("Get Project Without Auth", False, "No project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 403:
                self.log_result("Get Project Without Auth", True, "Correctly rejected unauthenticated request with 403")
                return True
            else:
                self.log_result("Get Project Without Auth", False, f"Expected 403, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Project Without Auth", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_update_project_name(self):
        """Test updating project name only"""
        if not self.auth_token or not self.test_project_id:
            self.log_result("Update Project Name", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        payload = {
            "name": "Updated Name"
        }
        
        try:
            response = requests.patch(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("name") == "Updated Name":
                    self.log_result("Update Project Name", True, "Successfully updated project name")
                    return True
                else:
                    self.log_result("Update Project Name", False, "Name not updated correctly", data)
            else:
                self.log_result("Update Project Name", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Update Project Name", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_update_project_multiple_fields(self):
        """Test updating multiple project fields"""
        if not self.auth_token or not self.test_project_id:
            self.log_result("Update Project Multiple", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        payload = {
            "status": "generating",
            "code": "const x = 1;"
        }
        
        try:
            response = requests.patch(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("status") == "generating" and 
                    data.get("code") == "const x = 1;"):
                    self.log_result("Update Project Multiple", True, "Successfully updated multiple fields")
                    return True
                else:
                    self.log_result("Update Project Multiple", False, "Fields not updated correctly", data)
            else:
                self.log_result("Update Project Multiple", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Update Project Multiple", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_update_project_wrong_id(self):
        """Test updating project with wrong ID (should return 404)"""
        if not self.auth_token:
            self.log_result("Update Project Wrong ID", False, "No auth token available")
            return False
            
        wrong_id = str(uuid.uuid4())
        url = f"{self.base_url}/projects/{wrong_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        payload = {
            "name": "Should Fail"
        }
        
        try:
            response = requests.patch(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 404:
                self.log_result("Update Project Wrong ID", True, "Correctly returned 404 for non-existent project")
                return True
            else:
                self.log_result("Update Project Wrong ID", False, f"Expected 404, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Update Project Wrong ID", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_update_project_without_auth(self):
        """Test updating project without authentication (should return 403)"""
        if not self.test_project_id:
            self.log_result("Update Project Without Auth", False, "No project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        payload = {
            "name": "Should Fail"
        }
        
        try:
            response = requests.patch(url, json=payload, timeout=10)
            
            if response.status_code == 403:
                self.log_result("Update Project Without Auth", True, "Correctly rejected unauthenticated request with 403")
                return True
            else:
                self.log_result("Update Project Without Auth", False, f"Expected 403, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Update Project Without Auth", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_delete_project_without_auth(self):
        """Test deleting project without authentication (should return 403)"""
        if not self.test_project_id:
            self.log_result("Delete Project Without Auth", False, "No project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        
        try:
            response = requests.delete(url, timeout=10)
            
            if response.status_code == 403:
                self.log_result("Delete Project Without Auth", True, "Correctly rejected unauthenticated request with 403")
                return True
            else:
                self.log_result("Delete Project Without Auth", False, f"Expected 403, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Delete Project Without Auth", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_delete_project_success(self):
        """Test successful project deletion"""
        if not self.auth_token or not self.test_project_id:
            self.log_result("Delete Project Success", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.delete(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("deleted") == True:
                    self.log_result("Delete Project Success", True, "Successfully deleted project")
                    return True
                else:
                    self.log_result("Delete Project Success", False, "Unexpected response format", data)
            else:
                self.log_result("Delete Project Success", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Delete Project Success", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_deleted_project(self):
        """Test getting deleted project (should return 404)"""
        if not self.auth_token or not self.test_project_id:
            self.log_result("Get Deleted Project", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 404:
                self.log_result("Get Deleted Project", True, "Correctly returned 404 for deleted project")
                return True
            else:
                self.log_result("Get Deleted Project", False, f"Expected 404, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Deleted Project", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_delete_project_again(self):
        """Test deleting already deleted project (should return 404)"""
        if not self.auth_token or not self.test_project_id:
            self.log_result("Delete Project Again", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.test_project_id}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        try:
            response = requests.delete(url, headers=headers, timeout=10)
            
            if response.status_code == 404:
                self.log_result("Delete Project Again", True, "Correctly returned 404 for already deleted project")
                return True
            else:
                self.log_result("Delete Project Again", False, f"Expected 404, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Delete Project Again", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_auth_error_handling(self):
        """Test auth error handling scenarios"""
        # Test login with wrong password
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": self.test_user_email,
            "password": "wrongpassword"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 401:
                data = response.json()
                if data.get("detail") == "Invalid email or password":
                    self.log_result("Auth Wrong Password", True, "Correct error message for wrong password")
                else:
                    self.log_result("Auth Wrong Password", False, f"Unexpected error message: {data.get('detail')}")
            else:
                self.log_result("Auth Wrong Password", False, f"Expected 401, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("Auth Wrong Password", False, f"Request failed: {str(e)}")
            return False
        
        # Test register with existing email
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": "Another User",
            "email": self.test_user_email,
            "password": "anotherpass123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 409:
                data = response.json()
                if data.get("detail") == "Email already registered":
                    self.log_result("Auth Duplicate Email", True, "Correct error message for duplicate email")
                    return True
                else:
                    self.log_result("Auth Duplicate Email", False, f"Unexpected error message: {data.get('detail')}")
            else:
                self.log_result("Auth Duplicate Email", False, f"Expected 409, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("Auth Duplicate Email", False, f"Request failed: {str(e)}")
        
        return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend Project CRUD Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            # Auth setup
            self.test_auth_setup,
            
            # Project CRUD tests
            self.test_create_project_success,
            self.test_create_project_without_auth,
            self.test_create_project_minimal,
            self.test_list_projects,
            self.test_list_projects_without_auth,
            self.test_get_project_by_id,
            self.test_get_project_wrong_id,
            self.test_get_project_without_auth,
            self.test_update_project_name,
            self.test_update_project_multiple_fields,
            self.test_update_project_wrong_id,
            self.test_update_project_without_auth,
            self.test_delete_project_without_auth,
            self.test_delete_project_success,
            self.test_get_deleted_project,
            self.test_delete_project_again,
            
            # Auth error handling
            self.test_auth_error_handling
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
            print("🎉 All backend tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} tests FAILED")
            return False

def main():
    """Main test runner"""
    tester = SonarBackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()