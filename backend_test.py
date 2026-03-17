import requests
import sys
from datetime import datetime
import json

class WTFAgencyAPITester:
    def __init__(self, base_url="https://wtf-flows.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if data:
            print(f"   Data: {data}")
        if params:
            print(f"   Params: {params}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            
            result = {
                "test": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"   Response: {json.dumps(result['response_data'], indent=2)[:200]}...")
                except:
                    result["response_data"] = response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                    result["error"] = error_data
                except:
                    result["error"] = response.text

            self.test_results.append(result)
            return success, result["response_data"]

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test": name,
                "method": method, 
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_create_project_link(self, url, title, description=None, category="proyecto"):
        """Create a project link"""
        project_data = {
            "url": url,
            "title": title,
            "category": category
        }
        if description:
            project_data["description"] = description
            
        success, response = self.run_test(
            f"Create Project Link - {title}",
            "POST",
            "projects",
            200,
            data=project_data
        )
        return response.get('id') if success else None, response

    def test_get_all_projects(self):
        """Get all project links"""
        success, response = self.run_test(
            "Get All Projects",
            "GET", 
            "projects",
            200
        )
        return success, response

    def test_get_projects_by_category(self, category):
        """Get projects filtered by category"""
        success, response = self.run_test(
            f"Get Projects by Category - {category}",
            "GET",
            "projects",
            200,
            params={"category": category}
        )
        return success, response

    def test_delete_project(self, project_id):
        """Delete a project by ID"""
        success, response = self.run_test(
            f"Delete Project - {project_id}",
            "DELETE",
            f"projects/{project_id}",
            200
        )
        return success

    def test_delete_nonexistent_project(self):
        """Test deleting non-existent project"""
        fake_id = "nonexistent-id-12345"
        success, response = self.run_test(
            "Delete Non-existent Project",
            "DELETE",
            f"projects/{fake_id}",
            404
        )
        return success

def main():
    print("🚀 Starting WTF Agency API Tests...")
    tester = WTFAgencyAPITester()
    
    # Test API root
    if not tester.test_api_root():
        print("❌ API root failed, stopping tests")
        return 1

    # Test creating different types of projects
    test_projects = [
        {
            "url": "https://example.com/proyecto1",
            "title": "Test Proyecto",
            "description": "Un proyecto de prueba",
            "category": "proyecto"
        },
        {
            "url": "https://example.com/flujo1", 
            "title": "Test Flujo",
            "description": "Un flujo de trabajo",
            "category": "flujo"
        },
        {
            "url": "https://example.com/ref1",
            "title": "Test Referencia", 
            "category": "referencia"
        }
    ]
    
    created_project_ids = []
    
    # Create test projects
    for project_data in test_projects:
        project_id, _ = tester.test_create_project_link(**project_data)
        if project_id:
            created_project_ids.append(project_id)
        else:
            print(f"❌ Failed to create project: {project_data['title']}")

    # Test getting all projects
    success, all_projects = tester.test_get_all_projects()
    if success:
        print(f"📋 Found {len(all_projects)} total projects")
    
    # Test category filtering
    for category in ["proyecto", "flujo", "referencia"]:
        success, category_projects = tester.test_get_projects_by_category(category)
        if success:
            print(f"📂 Found {len(category_projects)} projects in category '{category}'")

    # Test deleting created projects
    for project_id in created_project_ids:
        if not tester.test_delete_project(project_id):
            print(f"❌ Failed to delete project {project_id}")

    # Test deleting non-existent project
    tester.test_delete_nonexistent_project()

    # Print final results
    print(f"\n📊 Final Results:")
    print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Show failed tests
    failed_tests = [r for r in tester.test_results if not r['success']]
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test['test']}: Expected {test['expected_status']}, got {test.get('actual_status', 'ERROR')}")

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())