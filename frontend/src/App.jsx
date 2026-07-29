import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicSite from './components/PublicSite.jsx';
import AdminApp from './admin/AdminApp.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </Router>
  );
}
