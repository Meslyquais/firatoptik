import requests
import sys
import json
from datetime import datetime

class FiratOptikAPITester:
    def __init__(self, base_url="https://luxury-lens-gallery.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login and get token"""
        print("\n=== TESTING ADMIN LOGIN ===")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"username": "admin", "password": "firatoptik2024"}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_brands_endpoints(self):
        """Test all brand-related endpoints"""
        print("\n=== TESTING BRAND ENDPOINTS ===")
        
        # Test public brands endpoint
        success, brands = self.run_test(
            "Get Public Brands",
            "GET",
            "brands",
            200
        )
        
        if success:
            print(f"   Found {len(brands)} brands")
            if len(brands) >= 12:
                print("✅ Expected 12 brands found")
            else:
                print(f"⚠️  Expected 12 brands, found {len(brands)}")
        
        # Test specific brand endpoint (using Gucci)
        if brands:
            gucci_brand = next((b for b in brands if b['slug'] == 'gucci'), None)
            if gucci_brand:
                self.run_test(
                    "Get Gucci Brand Details",
                    "GET",
                    f"brands/gucci",
                    200
                )
            else:
                print("⚠️  Gucci brand not found in brands list")
        
        # Test admin brands endpoint (requires auth)
        if self.token:
            self.run_test(
                "Get All Brands (Admin)",
                "GET",
                "brands/all",
                200
            )

    def test_products_endpoints(self):
        """Test product-related endpoints"""
        print("\n=== TESTING PRODUCT ENDPOINTS ===")
        
        # Test public products endpoint
        self.run_test(
            "Get Public Products",
            "GET",
            "products",
            200
        )
        
        # Test admin products endpoint (requires auth)
        if self.token:
            self.run_test(
                "Get All Products (Admin)",
                "GET",
                "products/all",
                200
            )

    def test_settings_endpoint(self):
        """Test settings endpoint"""
        print("\n=== TESTING SETTINGS ENDPOINT ===")
        
        success, settings = self.run_test(
            "Get Settings",
            "GET",
            "settings",
            200
        )
        
        if success:
            expected_keys = ['phone', 'whatsapp', 'address', 'email']
            for key in expected_keys:
                if key in settings:
                    print(f"✅ {key}: {settings[key]}")
                else:
                    print(f"❌ Missing {key} in settings")

    def test_admin_crud_operations(self):
        """Test admin CRUD operations"""
        if not self.token:
            print("\n⚠️  Skipping CRUD tests - no admin token")
            return
            
        print("\n=== TESTING ADMIN CRUD OPERATIONS ===")
        
        # Test creating a new brand
        test_brand_data = {
            "name": "Test Brand",
            "slug": "test-brand",
            "description": "Test brand description",
            "image_url": "https://example.com/test.jpg",
            "button_text": "TEST BUTTON",
            "order": 99,
            "is_active": True
        }
        
        success, created_brand = self.run_test(
            "Create Test Brand",
            "POST",
            "brands",
            200,
            data=test_brand_data
        )
        
        if success and 'id' in created_brand:
            brand_id = created_brand['id']
            print(f"   Created brand with ID: {brand_id}")
            
            # Test updating the brand
            update_data = {
                "name": "Updated Test Brand",
                "description": "Updated description"
            }
            
            self.run_test(
                "Update Test Brand",
                "PUT",
                f"brands/{brand_id}",
                200,
                data=update_data
            )
            
            # Test creating a product for this brand
            test_product_data = {
                "brand_id": brand_id,
                "name": "Test Product",
                "description": "Test product description",
                "image_url": "https://example.com/product.jpg",
                "price": "₺1.500",
                "category": "Test Category",
                "is_active": True
            }
            
            success, created_product = self.run_test(
                "Create Test Product",
                "POST",
                "products",
                200,
                data=test_product_data
            )
            
            # Clean up - delete test product and brand
            if success and 'id' in created_product:
                product_id = created_product['id']
                self.run_test(
                    "Delete Test Product",
                    "DELETE",
                    f"products/{product_id}",
                    200
                )
            
            self.run_test(
                "Delete Test Brand",
                "DELETE",
                f"brands/{brand_id}",
                200
            )

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*50}")
        print(f"📊 TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"{i}. {failure['test']}")
                if 'expected' in failure:
                    print(f"   Expected: {failure['expected']}, Got: {failure['actual']}")
                    print(f"   Response: {failure['response']}")
                if 'error' in failure:
                    print(f"   Error: {failure['error']}")
        
        return len(self.failed_tests) == 0

def main():
    print("🚀 Starting Fırat Optik API Tests")
    print("=" * 50)
    
    tester = FiratOptikAPITester()
    
    # Run all tests
    tester.test_admin_login()
    tester.test_brands_endpoints()
    tester.test_products_endpoints()
    tester.test_settings_endpoint()
    tester.test_admin_crud_operations()
    
    # Print summary and return exit code
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())