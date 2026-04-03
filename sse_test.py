#!/usr/bin/env python3
"""
Backend SSE Endpoints Testing Script
Tests the /api/generate and /api/chat SSE endpoints
"""

import subprocess
import json
import time
import sys
import os
from pathlib import Path

# Get backend URL from frontend .env
def get_backend_url():
    env_path = Path(__file__).parent / "frontend" / ".env"
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BACKEND_URL = get_backend_url()
print(f"Testing backend at: {BACKEND_URL}")

def test_sse_endpoint(endpoint, payload, test_name, timeout=60):
    """Test an SSE endpoint with curl and parse the response"""
    print(f"\n{'='*60}")
    print(f"Testing: {test_name}")
    print(f"Endpoint: {endpoint}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print(f"{'='*60}")
    
    # Prepare curl command
    cmd = [
        'curl', '-X', 'POST',
        '--no-buffer',
        '-H', 'Content-Type: application/json',
        '-d', json.dumps(payload),
        f"{BACKEND_URL}{endpoint}",
        '--max-time', str(timeout),
        '-v'  # Verbose to see headers
    ]
    
    try:
        # Run curl command
        print(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        
        print(f"\nReturn code: {result.returncode}")
        print(f"STDERR (headers/debug):\n{result.stderr}")
        print(f"STDOUT (response body):\n{result.stdout}")
        
        # Parse response
        response_lines = result.stdout.strip().split('\n')
        events = []
        chunks = []
        final_code = None
        
        for line in response_lines:
            if line.startswith('data: '):
                try:
                    data = json.loads(line[6:])  # Remove 'data: ' prefix
                    events.append(data)
                    
                    if data.get('type') == 'chunk':
                        chunks.append(data.get('content', ''))
                    elif data.get('type') == 'done':
                        final_code = data.get('full_code', '')
                except json.JSONDecodeError as e:
                    print(f"Failed to parse JSON: {line} - Error: {e}")
        
        # Analyze results
        success = True
        issues = []
        
        # Check return code
        if result.returncode != 0:
            success = False
            issues.append(f"Non-zero return code: {result.returncode}")
        
        # Check for content-type header in stderr
        if 'content-type: text/event-stream' not in result.stderr.lower():
            success = False
            issues.append("Missing or incorrect Content-Type header (should be text/event-stream)")
        
        # Check for SSE events
        if not events:
            success = False
            issues.append("No SSE events found in response")
        
        # Check for final 'done' event
        done_events = [e for e in events if e.get('type') == 'done']
        if not done_events:
            success = False
            issues.append("No 'done' event found in response")
        
        # Check final code
        if final_code:
            if 'import' not in final_code:
                success = False
                issues.append("Generated code missing 'import' statement")
            if 'export default' not in final_code:
                success = False
                issues.append("Generated code missing 'export default' statement")
            print(f"\nGenerated code preview (first 200 chars):\n{final_code[:200]}...")
        else:
            success = False
            issues.append("No final code received")
        
        # Print results
        print(f"\n{'='*40}")
        print(f"TEST RESULT: {'✅ PASS' if success else '❌ FAIL'}")
        print(f"Events received: {len(events)}")
        print(f"Chunks received: {len(chunks)}")
        print(f"Final code length: {len(final_code) if final_code else 0}")
        
        if issues:
            print(f"Issues found:")
            for issue in issues:
                print(f"  - {issue}")
        
        return success, issues, final_code
        
    except subprocess.TimeoutExpired:
        print(f"❌ TIMEOUT: Request took longer than {timeout} seconds")
        return False, [f"Request timeout after {timeout} seconds"], None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False, [f"Exception: {str(e)}"], None

def main():
    """Run all SSE endpoint tests"""
    print("Starting SSE Endpoints Testing")
    print(f"Backend URL: {BACKEND_URL}")
    
    all_tests_passed = True
    test_results = []
    
    # Test 1: POST /api/generate
    generate_payload = {
        "prompt": "Build a simple counter app with increment and decrement buttons",
        "model": "gpt-4o",
        "mode": "S-1"
    }
    
    success1, issues1, code1 = test_sse_endpoint(
        "/api/generate", 
        generate_payload, 
        "Generate Counter App"
    )
    test_results.append(("POST /api/generate", success1, issues1))
    if not success1:
        all_tests_passed = False
    
    # Test 2: POST /api/chat
    chat_payload = {
        "message": "Add a reset button that sets counter to 0",
        "current_code": "import { useState } from 'react';\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className='p-8'>\n      <h1>{count}</h1>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n      <button onClick={() => setCount(c => c - 1)}>-</button>\n    </div>\n  );\n}",
        "model": "gpt-4o",
        "mode": "S-1"
    }
    
    success2, issues2, code2 = test_sse_endpoint(
        "/api/chat", 
        chat_payload, 
        "Chat - Add Reset Button"
    )
    test_results.append(("POST /api/chat", success2, issues2))
    if not success2:
        all_tests_passed = False
    
    # Final summary
    print(f"\n{'='*80}")
    print("FINAL TEST SUMMARY")
    print(f"{'='*80}")
    
    for test_name, success, issues in test_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if issues:
            for issue in issues:
                print(f"  - {issue}")
    
    print(f"\nOverall Result: {'✅ ALL TESTS PASSED' if all_tests_passed else '❌ SOME TESTS FAILED'}")
    
    return 0 if all_tests_passed else 1

if __name__ == "__main__":
    sys.exit(main())