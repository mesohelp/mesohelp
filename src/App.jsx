import { useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import InstructionDetail from './pages/InstructionDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { AppContext } from './context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, authLoading } = useContext(AppContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-5rem)]">
        <Loader2 className="w-10 h-10 text-mesored animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Se verifică autentificarea...</p>
      </div>
    );
  }

  if (!authLoading && !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-mesobg">
        <Navbar />
        <main className="flex-1 w-full overflow-x-hidden pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryView />} />
            <Route path="/category/OMS/ORB" element={<CategoryView />} />
            <Route path="/category/oms-orb" element={<Navigate to={`/category/${encodeURIComponent('OMS/ORB')}`} replace />} />
            <Route path="/kds" element={<Navigate to={`/category/${encodeURIComponent('OMS/ORB')}`} replace />} />
            <Route path="/oms-orb" element={<Navigate to={`/category/${encodeURIComponent('OMS/ORB')}`} replace />} />
            <Route path="/instruction/:id" element={<InstructionDetail />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
