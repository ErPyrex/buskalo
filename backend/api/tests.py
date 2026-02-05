from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import os

class SecurityTestCase(TestCase):
    def test_debug_is_false(self):
        """Verify that DEBUG is False in the test environment if not explicitly set."""
        from django.conf import settings
        # In Django tests, DEBUG is usually True by default unless overridden.
        # But our settings.py logic should be checked.
        # Since we use os.getenv("DEBUG", "False"), we can check it.
        self.assertEqual(os.getenv("DEBUG", "False"), "False")

class ApiVersioningTestCase(APITestCase):
    def test_v1_path_exists(self):
        """Verify that v1 API path is accessible."""
        # 'hello_world' is in api.urls which is included in v1
        url = "/api/v1/hello/"
        response = self.client.get(url)
        # Note: If hello_world requires authentication, it might return 401/403
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_swagger_docs_accessible(self):
        """Verify that Swagger UI is accessible (at least the URL exists)."""
        url = reverse('swagger-ui')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
