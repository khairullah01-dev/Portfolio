import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const PublicSite = lazy(() => import('./components/PublicSite.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

function AppLoading() {
  return (
  <div 
    className="flex min-h-screen items-center justify-center bg-white text-slate-800" 
    role="status" 
    aria-live="polite"
  >
    <div className="flex items-center space-x-2">
      <span className="text-sm font-semibold tracking-wide">Loading</span>
      <div className="flex space-x-1.5 pt-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600"></div>
      </div>
    </div>
  </div>
  
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<AppLoading />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
