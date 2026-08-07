import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FileText, Search, Settings, Shield, LogOut, User, Home, Loader2 } from 'lucide-react';

const Navbar = () => {
  const { searchQuery, setSearchQuery, isAdmin, logout, authLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/' && location.pathname !== '/search' && e.target.value) {
       navigate('/'); 
    }
  };

  const handleLogoClick = () => {
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-[#F5F4EF] border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between w-full px-4 md:px-8 py-3">
        
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="select-none [-webkit-touch-callout:none] flex items-center gap-3 group shrink-0">
          <div className="p-1">
            <FileText size={28} className="text-[#1D5337] group-hover:brightness-110 transition-all" />
          </div>
          <span className="text-xl font-extrabold text-[#0A2B1C] tracking-tight hidden sm:block">
            MesoHelp
          </span>
        </Link>

        {/* Search Bar */}
        {location.pathname !== '/login' && (
          <div className="flex-1 min-w-[150px] max-w-2xl mx-4 md:mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search size={20} />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 text-[#0A2B1C] placeholder-gray-500 px-4 py-2 pl-10 rounded-lg focus:border-[#1D5337] focus:ring-2 focus:ring-[#1D5337]/50 transition-all duration-300 outline-none"
              placeholder="Caută în toate instrucțiunile..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}

        {/* User Roles & Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0 h-10">
          
          {authLoading ? (
            <div className="flex items-center justify-center p-2 text-[#1D5337]">
               <Loader2 size={20} className="animate-spin" />
            </div>
          ) : isAdmin ? (
            <>
              <Link 
                to="/"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-[#1D5337] text-white shadow-inner' : 'text-[#1D5337] hover:bg-[#1D5337] hover:text-white'}`}
                title="Acasă"
              >
                <Home size={20} />
              </Link>

              <Link 
                to="/dashboard"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/dashboard' ? 'bg-[#1D5337] text-white shadow-inner' : 'text-[#1D5337] hover:bg-[#1D5337] hover:text-white'}`}
                title="Dashboard"
              >
                <Settings size={20} />
              </Link>
              
              <div 
                className="p-2 text-[#1D5337] bg-transparent cursor-default"
                title="Rol: Administrator"
              >
                <Shield size={20} />
              </div>

              <button
                onClick={handleLogout}
                className="select-none [-webkit-touch-callout:none] p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Deconectare"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-[#1D5337] text-white shadow-inner' : 'text-[#1D5337] hover:bg-[#1D5337] hover:text-white'}`}
                title="Acasă"
              >
                <Home size={20} />
              </Link>

              <Link
                to="/login"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/login' ? 'bg-[#1D5337] text-white shadow-inner' : 'text-[#1D5337] hover:bg-[#1D5337] hover:text-white'}`}
                title="Conectare Admin"
              >
                <User size={20} />
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
