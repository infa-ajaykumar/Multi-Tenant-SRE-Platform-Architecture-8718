import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { OrgContextProvider } from './components/common/OrgContextProvider';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import AlertsPage from './components/alerts/AlertsPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuth } from './components/common/OrgContextProvider';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * App content with authentication check
 */
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="large" text="Loading application..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">SRE Agent Platform</h2>
            <p className="mt-2 text-gray-600">Please log in to continue</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              This is a demo. In production, this would show a proper login form.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/resources" element={<div className="p-6">Resources (Coming Soon)</div>} />
          <Route path="/metrics" element={<div className="p-6">Metrics (Coming Soon)</div>} />
          <Route path="/settings" element={<div className="p-6">Settings (Coming Soon)</div>} />
        </Routes>
      </main>
    </div>
  );
};

/**
 * Main App component with providers
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OrgContextProvider>
        <Router>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </OrgContextProvider>
    </QueryClientProvider>
  );
};

export default App;