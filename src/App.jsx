import { useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
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
        <Loader2 className="w-10 h-10 text-[#1D5337] animate-spin mb-4" />
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
    <BrowserRouter basename="/mesohelp/">
      <Navbar />
      <main className="bg-[#F5F4EF] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<CategoryView />} />
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
    </BrowserRouter>
  );
}

export default App;
