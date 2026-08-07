import { useState, useContext, useEffect } from 'react';
import { Shield, User, Lock, Mail } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { login, isAdmin, authLoading } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/dashboard');
    }
  }, [authLoading, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (err) {
        setError('Autentificarea a eșuat. Vă rugăm să verificați credențialele.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 flex flex-col pt-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="bg-meso-dark text-meso-lime p-3 rounded-2xl shadow-lg mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-meso-dark tracking-tight">
          Autentificare <span className="text-meso-dark/80">Admin</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 mb-8">
          Acces restricționat panou de administrare
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-meso-dark/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-meso-dark focus:border-meso-dark sm:text-sm outline-none transition-all"
                  placeholder="Introduceți emailul"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Parolă
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-meso-dark focus:border-meso-dark sm:text-sm outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-meso-dark bg-meso-lime hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meso-dark transition-all"
              >
                Autentificare Administrator
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
