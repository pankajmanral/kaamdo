import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || 
                     location.pathname === '/vendor-login' || location.pathname === '/vendor-register';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                KaamDo
              </Link>
              <nav className="flex space-x-4">
                {token ? (
                  <>
                    <Link to="/user-dashboard" className="text-gray-700 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link to="/create-job" className="text-gray-700 hover:text-blue-600">
                      Create Job
                    </Link>
                    <Link to="/vendor-jobs" className="text-gray-700 hover:text-blue-600">
                      Vendor Jobs
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-blue-600">
                      Login
                    </Link>
                    <Link to="/register" className="text-gray-700 hover:text-blue-600">
                      Register
                    </Link>
                    <Link to="/vendor-login" className="text-gray-700 hover:text-blue-600">
                      Vendor Login
                    </Link>
                    <Link to="/vendor-register" className="text-gray-700 hover:text-blue-600">
                      Vendor Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
      {!hideNavbar && (
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-500">
              © 2026 KaamDo. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;