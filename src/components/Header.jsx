import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FileText, Search, Settings, User, Shield } from 'lucide-react';

const Header = () => {
  const { isAdmin, setIsAdmin, searchQuery, setSearchQuery } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/' && location.pathname !== '/search' && e.target.value) {
       navigate('/'); 
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" onClick={() => setSearchQuery("")} className="flex items-center gap-2 group">
          <div className="bg-brand-600 text-white p-2 rounded-xl group-hover:bg-brand-700 transition-colors">
            <FileText size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
            Tech<span className="text-brand-600">Base</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 rounded-2xl py-3 pl-10 pr-4 text-sm transition-all duration-300 outline-none"
            placeholder="Caută în toate instrucțiunile..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Role Toggle & Admin Link */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <Settings size={20} />
              Dashboard
            </Link>
          )}
          
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!isAdmin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={18} />
              <span className="hidden sm:block">User</span>
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isAdmin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Shield size={18} />
              <span className="hidden sm:block">Admin</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
