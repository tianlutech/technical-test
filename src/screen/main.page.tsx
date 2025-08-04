import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '../frontend-service/api-client';
import { Button } from '../layout/button.layout';

export default function MainPage() {
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
          <Button onClick={handleLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Login Successful!
            </h2>
            <p className="text-gray-600">
              You have successfully logged in to the Product List App.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
