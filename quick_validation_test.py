#!/usr/bin/env python3
"""
Quick Final Validation Test - Exact scenarios from review request
"""

import requests
import json
import sys

# Backend URL from existing test configuration
BASE_URL = "https://agent-behavior-phase.preview.emergentagent.com/api"

def quick_validation_test():
    """Run the exact test scenarios from review request"""
    print("🚀 Quick Final Validation Test")
    print("Testing exact scenarios from review request")
    print("=" * 50)
    
    # Test data as specified in review request
    test_user = {
        "name": "Final Test",
        "email": "final-check@sonar.dev", 
        "password": "testpass123"
    }
    
    test_project = {
        "name": "Final App",
        "prompt": "Build something cool",
        "type": "todo"
    }
    
    token = None
    project_id = None
    
    try:
        # 1. Register user
        print("\n1️⃣ Register user")
        print(f"POST {BASE_URL}/auth/register")
        response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("token")
            print("✅ Registration successful, token saved")
        elif response.status_code == 409:
            print("⚠️ User exists, logging in instead...")
            login_response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": test_user["email"],
                "password": test_user["password"]
            })
            if login_response.status_code == 200:
                token = login_response.json().get("token")
                print("✅ Login successful, token saved")
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                return False
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Create project
        print("\n2️⃣ Create project")
        print(f"POST {BASE_URL}/projects with auth")
        response = requests.post(f"{BASE_URL}/projects", json=test_project, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            project_id = data.get("id")
            user_id = data.get("user_id")
            status = data.get("status")
            
            print(f"✅ Project created")
            print(f"   UUID id: {project_id}")
            print(f"   user_id: {user_id}")
            print(f"   status: {status}")
            
            # Verify requirements from review request
            if not project_id or len(project_id) != 36:
                print("❌ Invalid UUID format")
                return False
            if not user_id:
                print("❌ Missing user_id")
                return False
            if status != "created":
                print("❌ Status should be 'created'")
                return False
        else:
            print(f"❌ Project creation failed: {response.text}")
            return False
            
        # 3. List projects
        print("\n3️⃣ List projects")
        print(f"GET {BASE_URL}/projects with auth")
        response = requests.get(f"{BASE_URL}/projects", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ Retrieved {len(projects)} projects")
            
            # Verify project appears in list
            found = any(p.get("id") == project_id for p in projects)
            if found:
                print("✅ Project appears in list")
            else:
                print("❌ Project not found in list")
                return False
        else:
            print(f"❌ List projects failed: {response.text}")
            return False
            
        # 4. Update project
        print("\n4️⃣ Update project")
        print(f"PATCH {BASE_URL}/projects/{project_id} with auth")
        update_data = {
            "status": "complete",
            "code": "console.log('hello')"
        }
        response = requests.patch(f"{BASE_URL}/projects/{project_id}", json=update_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Update successful")
            print(f"   status: {data.get('status')}")
            print(f"   code: {data.get('code')}")
            
            if data.get("status") != "complete":
                print("❌ Status not updated correctly")
                return False
            if data.get("code") != "console.log('hello')":
                print("❌ Code not updated correctly")
                return False
        else:
            print(f"❌ Update failed: {response.text}")
            return False
            
        # 5. Delete project
        print("\n5️⃣ Delete project")
        print(f"DELETE {BASE_URL}/projects/{project_id} with auth")
        response = requests.delete(f"{BASE_URL}/projects/{project_id}", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Delete successful")
            print(f"   Response: {data}")
            
            if data.get("deleted") != True:
                print("❌ Should return {'deleted': true}")
                return False
        else:
            print(f"❌ Delete failed: {response.text}")
            return False
            
        # 6. Auth errors
        print("\n6️⃣ Auth errors")
        
        # Test duplicate email → 409
        print("Testing duplicate email registration...")
        response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        print(f"Duplicate email status: {response.status_code}")
        if response.status_code == 409:
            print("✅ Duplicate email → 409")
        else:
            print(f"❌ Expected 409, got {response.status_code}")
            return False
            
        # Test wrong password → 401
        print("Testing wrong password login...")
        wrong_creds = {
            "email": test_user["email"],
            "password": "wrongpassword"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=wrong_creds)
        print(f"Wrong password status: {response.status_code}")
        if response.status_code == 401:
            print("✅ Wrong password → 401")
        else:
            print(f"❌ Expected 401, got {response.status_code}")
            return False
            
        print("\n" + "=" * 50)
        print("🎉 QUICK VALIDATION COMPLETE - All scenarios passed!")
        return True
        
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection error - Backend not accessible at {BASE_URL}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = quick_validation_test()
    sys.exit(0 if success else 1)