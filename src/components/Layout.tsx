import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isVendor = !!localStorage.getItem('vendorName');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' ||
    location.pathname === '/vendor-login' || location.pathname === '/vendor-register';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('vendorName');
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = (path: string, mobile: boolean = false) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
    if (mobile) {
      return `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`;
    }
    return `font-semibold transition-all duration-300 pb-1 border-b-2 ${isActive
      ? 'text-blue-600 border-blue-600'
      : 'text-slate-500 border-transparent hover:text-blue-600 hover:border-blue-300'
      }`;
  };

  const desktopLinks = (
    <div className="hidden md:flex space-x-6 items-center">
      {token ? (
        <>
          {!isVendor && (
            <>
              <Link to="/user-dashboard" className={navLinkClass('/user-dashboard')}>
                Dashboard
              </Link>
              <Link to="/create-job" className={navLinkClass('/create-job')}>
                Create Job
              </Link>
            </>
          )}
          {isVendor && (
            <>
              <Link to="/vendor-jobs" className={navLinkClass('/vendor-jobs')}>
                Available Jobs
              </Link>
              <Link to="/assigned-jobs" className={navLinkClass('/assigned-jobs')}>
                Assigned Jobs
              </Link>
              <Link to="/job-history" className={navLinkClass('/job-history')}>
                Job History
              </Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold shadow-sm hover:bg-red-100 hover:text-red-700 hover:shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/vendor-register" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
            Become a Vendor
          </Link>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );

  const mobileLinks = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden overflow-hidden bg-white border-b border-gray-200 shadow-lg"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {token ? (
              <>
                {!isVendor && (
                  <>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/user-dashboard" className={navLinkClass('/user-dashboard', true)}>
                      Dashboard
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/create-job" className={navLinkClass('/create-job', true)}>
                      Create Job
                    </Link>
                  </>
                )}
                {isVendor && (
                  <>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/vendor-jobs" className={navLinkClass('/vendor-jobs', true)}>
                      Available Jobs
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/assigned-jobs" className={navLinkClass('/assigned-jobs', true)}>
                      Assigned Jobs
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/job-history" className={navLinkClass('/job-history', true)}>
                      Job History
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left mt-4 block px-3 py-2 rounded-md justify-start flex items-center gap-2 bg-red-50 text-red-600 font-bold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-4">
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/vendor-register" className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  Become a Vendor
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  Login
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/register" className="block px-3 py-2 text-center text-base font-medium bg-blue-600 text-white rounded-lg shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {!hideNavbar && (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b-0 border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="text-3xl font-extrabold text-gradient tracking-tight transition-transform hover:scale-105 duration-300">
                KaamDo
              </Link>

              {/* Desktop Menu */}
              {desktopLinks}

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu Dropdown */}
          {mobileLinks}
        </header>
      )}
      <main className={`flex-1 flex flex-col ${!hideNavbar ? 'pt-20' : ''}`}>
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