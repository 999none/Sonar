#!/usr/bin/env python3
"""
Integration Test for Sonar App Backend API
Following the specific test plan from the review request
"""

import requests
import json
import sys
import os
from datetime import datetime
import uuid

# Get backend URL from environment
BACKEND_URL = "https://agent-behavior-phase.preview.emergentagent.com/api"

class SonarIntegrationTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.user1_token = None
        self.user2_token = None
        self.project1_id = None
        self.project2_id = None
        
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
    
    def step1_register_user(self):
        """Step 1: Register a new user"""
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": "Integration Tester",
            "email": "integration@sonar.dev",
            "password": "testpass123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                if "token" in data and "user" in data:
                    self.user1_token = data["token"]
                    self.log_result("Step 1: Register User", True, "User registered successfully and token obtained")
                    return True
                else:
                    self.log_result("Step 1: Register User", False, "Missing token or user in response", data)
            elif response.status_code == 409:
                # User already exists, try to login
                return self.login_existing_user()
            else:
                self.log_result("Step 1: Register User", False, f"Registration failed with {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 1: Register User", False, f"Request failed: {str(e)}")
        
        return False
    
    def login_existing_user(self):
        """Login with existing user credentials"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": "integration@sonar.dev",
            "password": "testpass123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data:
                    self.user1_token = data["token"]
                    self.log_result("Step 1: Login Existing User", True, "Successfully logged in and obtained token")
                    return True
                else:
                    self.log_result("Step 1: Login Existing User", False, "No token in response", data)
            else:
                self.log_result("Step 1: Login Existing User", False, f"Login failed with {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 1: Login Existing User", False, f"Request failed: {str(e)}")
        
        return False
    
    def step2_create_projects(self):
        """Step 2: Create 2 projects"""
        if not self.user1_token:
            self.log_result("Step 2: Create Projects", False, "No auth token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.user1_token}"}
        
        # Create Project 1
        url = f"{self.base_url}/projects"
        project1_payload = {
            "name": "My Todo App",
            "prompt": "Build a todo app",
            "type": "todo",
            "model": "gpt-4o",
            "mode": "S-1"
        }
        
        try:
            response = requests.post(url, json=project1_payload, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                
                # Verify ProjectResponse structure
                required_fields = ["id", "user_id", "status", "code", "messages"]
                if all(field in data for field in required_fields):
                    if (data["status"] == "created" and 
                        data["code"] == "" and
                        data["messages"] == [] and
                        data["name"] == "My Todo App"):
                        
                        self.project1_id = data["id"]
                        self.log_result("Step 2a: Create Project 1", True, "Project 1 created with correct structure")
                    else:
                        self.log_result("Step 2a: Create Project 1", False, "Project structure incorrect", data)
                        return False
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Step 2a: Create Project 1", False, f"Missing fields: {missing}", data)
                    return False
            else:
                self.log_result("Step 2a: Create Project 1", False, f"Expected 200/201, got {response.status_code}", response.text)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 2a: Create Project 1", False, f"Request failed: {str(e)}")
            return False
        
        # Create Project 2
        project2_payload = {
            "name": "My Dashboard",
            "prompt": "Build a dashboard",
            "type": "dashboard"
        }
        
        try:
            response = requests.post(url, json=project2_payload, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                
                # Verify ProjectResponse structure
                if all(field in data for field in required_fields):
                    if (data["status"] == "created" and 
                        data["code"] == "" and
                        data["messages"] == [] and
                        data["name"] == "My Dashboard"):
                        
                        self.project2_id = data["id"]
                        self.log_result("Step 2b: Create Project 2", True, "Project 2 created with correct structure")
                        return True
                    else:
                        self.log_result("Step 2b: Create Project 2", False, "Project structure incorrect", data)
                        return False
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Step 2b: Create Project 2", False, f"Missing fields: {missing}", data)
                    return False
            else:
                self.log_result("Step 2b: Create Project 2", False, f"Expected 200/201, got {response.status_code}", response.text)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 2b: Create Project 2", False, f"Request failed: {str(e)}")
            return False
    
    def step3_list_projects(self):
        """Step 3: List projects"""
        if not self.user1_token:
            self.log_result("Step 3: List Projects", False, "No auth token available")
            return False
            
        url = f"{self.base_url}/projects"
        headers = {"Authorization": f"Bearer {self.user1_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list) and len(data) >= 2:
                    # Verify both projects are in the list
                    project_ids = [p.get("id") for p in data]
                    if self.project1_id in project_ids and self.project2_id in project_ids:
                        # Check if sorted by updated_at descending (most recent first)
                        # Since we just created them, project2 should be first
                        if len(data) >= 2:
                            self.log_result("Step 3: List Projects", True, f"Successfully retrieved {len(data)} projects including both created projects")
                            return True
                        else:
                            self.log_result("Step 3: List Projects", True, f"Retrieved {len(data)} projects")
                            return True
                    else:
                        self.log_result("Step 3: List Projects", False, "Created projects not found in list", data)
                else:
                    self.log_result("Step 3: List Projects", False, f"Expected at least 2 projects, got {len(data) if isinstance(data, list) else 'non-list'}", data)
            else:
                self.log_result("Step 3: List Projects", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 3: List Projects", False, f"Request failed: {str(e)}")
        
        return False
    
    def step4_get_project_by_id(self):
        """Step 4: Get project by ID"""
        if not self.user1_token or not self.project1_id:
            self.log_result("Step 4: Get Project By ID", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.project1_id}"
        headers = {"Authorization": f"Bearer {self.user1_token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("id") == self.project1_id and
                    data.get("name") == "My Todo App" and
                    data.get("prompt") == "Build a todo app" and
                    data.get("type") == "todo"):
                    self.log_result("Step 4: Get Project By ID", True, "Successfully retrieved project with all fields matching")
                    return True
                else:
                    self.log_result("Step 4: Get Project By ID", False, "Project fields don't match expected values", data)
            else:
                self.log_result("Step 4: Get Project By ID", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 4: Get Project By ID", False, f"Request failed: {str(e)}")
        
        return False
    
    def step5_update_project(self):
        """Step 5: Update project"""
        if not self.user1_token or not self.project1_id:
            self.log_result("Step 5: Update Project", False, "No auth token or project ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.project1_id}"
        headers = {"Authorization": f"Bearer {self.user1_token}"}
        payload = {
            "name": "Updated Todo",
            "status": "complete",
            "code": "const x = 1;",
            "messages": [{"role": "user", "content": "test"}]
        }
        
        try:
            response = requests.patch(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("name") == "Updated Todo" and
                    data.get("status") == "complete" and
                    data.get("code") == "const x = 1;" and
                    data.get("messages") == [{"role": "user", "content": "test"}]):
                    
                    # Verify updated_at changed (should be different from created_at)
                    if data.get("updated_at") != data.get("created_at"):
                        self.log_result("Step 5: Update Project", True, "Successfully updated all fields and updated_at changed")
                        return True
                    else:
                        self.log_result("Step 5: Update Project", False, "updated_at did not change", data)
                else:
                    self.log_result("Step 5: Update Project", False, "Fields not updated correctly", data)
            else:
                self.log_result("Step 5: Update Project", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 5: Update Project", False, f"Request failed: {str(e)}")
        
        return False
    
    def step6_delete_project(self):
        """Step 6: Delete project"""
        if not self.user1_token or not self.project2_id:
            self.log_result("Step 6: Delete Project", False, "No auth token or project2 ID available")
            return False
            
        url = f"{self.base_url}/projects/{self.project2_id}"
        headers = {"Authorization": f"Bearer {self.user1_token}"}
        
        try:
            response = requests.delete(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("deleted") == True:
                    # Verify list now shows only 1 project
                    list_url = f"{self.base_url}/projects"
                    list_response = requests.get(list_url, headers=headers, timeout=10)
                    
                    if list_response.status_code == 200:
                        projects = list_response.json()
                        if isinstance(projects, list):
                            # Should have one less project now
                            remaining_ids = [p.get("id") for p in projects]
                            if self.project2_id not in remaining_ids and self.project1_id in remaining_ids:
                                self.log_result("Step 6: Delete Project", True, f"Successfully deleted project, list now shows {len(projects)} projects")
                                return True
                            else:
                                self.log_result("Step 6: Delete Project", False, "Project still appears in list or wrong project deleted", projects)
                        else:
                            self.log_result("Step 6: Delete Project", False, "List response is not an array", projects)
                    else:
                        self.log_result("Step 6: Delete Project", False, f"Could not verify list after deletion: {list_response.status_code}")
                else:
                    self.log_result("Step 6: Delete Project", False, "Unexpected response format", data)
            else:
                self.log_result("Step 6: Delete Project", False, f"Expected 200, got {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 6: Delete Project", False, f"Request failed: {str(e)}")
        
        return False
    
    def step7_auth_error_handling(self):
        """Step 7: Auth error handling test"""
        success_count = 0
        
        # Test 1: Register with same email → expect 409
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": "Duplicate User",
            "email": "integration@sonar.dev",
            "password": "testpass123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 409:
                data = response.json()
                if data.get("detail") == "Email already registered":
                    self.log_result("Step 7a: Duplicate Email", True, "Correct 409 error for duplicate email")
                    success_count += 1
                else:
                    self.log_result("Step 7a: Duplicate Email", False, f"Wrong error message: {data.get('detail')}")
            else:
                self.log_result("Step 7a: Duplicate Email", False, f"Expected 409, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 7a: Duplicate Email", False, f"Request failed: {str(e)}")
        
        # Test 2: Login with wrong password → expect 401
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": "integration@sonar.dev",
            "password": "wrongpassword"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 401:
                data = response.json()
                if data.get("detail") == "Invalid email or password":
                    self.log_result("Step 7b: Wrong Password", True, "Correct 401 error for wrong password")
                    success_count += 1
                else:
                    self.log_result("Step 7b: Wrong Password", False, f"Wrong error message: {data.get('detail')}")
            else:
                self.log_result("Step 7b: Wrong Password", False, f"Expected 401, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 7b: Wrong Password", False, f"Request failed: {str(e)}")
        
        # Test 3: GET projects without auth → expect 403
        url = f"{self.base_url}/projects"
        
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 403:
                self.log_result("Step 7c: No Auth", True, "Correct 403 error for missing auth")
                success_count += 1
            else:
                self.log_result("Step 7c: No Auth", False, f"Expected 403, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 7c: No Auth", False, f"Request failed: {str(e)}")
        
        return success_count == 3
    
    def step8_cross_user_isolation(self):
        """Step 8: Cross-user isolation"""
        # Register a second user
        url = f"{self.base_url}/auth/register"
        payload = {
            "name": "Second User",
            "email": "second@sonar.dev",
            "password": "testpass123"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code in [200, 201]:
                data = response.json()
                if "token" in data:
                    self.user2_token = data["token"]
                    self.log_result("Step 8a: Register Second User", True, "Second user registered successfully")
                else:
                    self.log_result("Step 8a: Register Second User", False, "No token in response", data)
                    return False
            elif response.status_code == 409:
                # User already exists, try to login
                login_url = f"{self.base_url}/auth/login"
                login_payload = {
                    "email": "second@sonar.dev",
                    "password": "testpass123"
                }
                login_response = requests.post(login_url, json=login_payload, timeout=10)
                if login_response.status_code == 200:
                    login_data = login_response.json()
                    if "token" in login_data:
                        self.user2_token = login_data["token"]
                        self.log_result("Step 8a: Login Second User", True, "Second user logged in successfully")
                    else:
                        self.log_result("Step 8a: Login Second User", False, "No token in login response", login_data)
                        return False
                else:
                    self.log_result("Step 8a: Login Second User", False, f"Login failed: {login_response.status_code}")
                    return False
            else:
                self.log_result("Step 8a: Register Second User", False, f"Registration failed: {response.status_code}", response.text)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Step 8a: Register Second User", False, f"Request failed: {str(e)}")
            return False
        
        success_count = 1  # Registration/login succeeded
        
        # Test 1: Try to GET first user's project as second user → expect 404
        if self.project1_id and self.user2_token:
            url = f"{self.base_url}/projects/{self.project1_id}"
            headers = {"Authorization": f"Bearer {self.user2_token}"}
            
            try:
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code == 404:
                    self.log_result("Step 8b: Cross-user GET", True, "Correct 404 error for accessing other user's project")
                    success_count += 1
                else:
                    self.log_result("Step 8b: Cross-user GET", False, f"Expected 404, got {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_result("Step 8b: Cross-user GET", False, f"Request failed: {str(e)}")
        
        # Test 2: Try to DELETE first user's project as second user → expect 404
        if self.project1_id and self.user2_token:
            url = f"{self.base_url}/projects/{self.project1_id}"
            headers = {"Authorization": f"Bearer {self.user2_token}"}
            
            try:
                response = requests.delete(url, headers=headers, timeout=10)
                
                if response.status_code == 404:
                    self.log_result("Step 8c: Cross-user DELETE", True, "Correct 404 error for deleting other user's project")
                    success_count += 1
                else:
                    self.log_result("Step 8c: Cross-user DELETE", False, f"Expected 404, got {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_result("Step 8c: Cross-user DELETE", False, f"Request failed: {str(e)}")
        
        return success_count == 3
    
    def run_integration_test(self):
        """Run the complete integration test following the review request"""
        print(f"🚀 Starting Integration Test for Sonar App Backend")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence following the review request exactly
        tests = [
            ("Step 1: Register User", self.step1_register_user),
            ("Step 2: Create 2 Projects", self.step2_create_projects),
            ("Step 3: List Projects", self.step3_list_projects),
            ("Step 4: Get Project by ID", self.step4_get_project_by_id),
            ("Step 5: Update Project", self.step5_update_project),
            ("Step 6: Delete Project", self.step6_delete_project),
            ("Step 7: Auth Error Handling", self.step7_auth_error_handling),
            ("Step 8: Cross-user Isolation", self.step8_cross_user_isolation)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🔄 Running {test_name}...")
            if test_func():
                passed += 1
            print()  # Add spacing between tests
        
        print("=" * 60)
        print(f"📊 Integration Test Results: {passed}/{total} steps passed")
        
        if passed == total:
            print("🎉 All integration tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} steps FAILED")
            return False

def main():
    """Main test runner"""
    tester = SonarIntegrationTester()
    success = tester.run_integration_test()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()