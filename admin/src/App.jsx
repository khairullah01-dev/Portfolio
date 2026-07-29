import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from './auth/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectsManager from './pages/ProjectsManager.jsx';
import StatsManager from './pages/StatsManager.jsx';
import MessagesManager from './pages/MessagesManager.jsx';
import ContactManager from './pages/ContactManager.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { API_BASE_URL } from './config/api.js';

// Configure Axios
axios.defaults.baseURL = API_BASE_URL;

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('adminToken')));

  const login = useCallback((newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setToken(null);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token
      axios.get('/auth/profile')
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [logout, token]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-800">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#132247] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm font-medium tracking-wide text-slate-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <Router basename="/admin">
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              token ? (
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<ProjectsManager />} />
                    <Route path="/stats" element={<StatsManager />} />
                    <Route path="/messages" element={<MessagesManager />} />
                    <Route path="/contact" element={<ContactManager />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
