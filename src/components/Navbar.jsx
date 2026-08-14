import { useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FileText, MagnifyingGlass, Gear, Shield, SignOut, User, House, Spinner } from '@phosphor-icons/react';

const Navbar = () => {
  const { searchQuery, setSearchQuery, isAdmin, logout, authLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  let searchPlaceholder = "Caută în toate instrucțiunile...";
  const currentPath = decodeURIComponent(location.pathname.toLowerCase());
  
  if (currentPath.includes('kds')) {
    searchPlaceholder = "Caută instrucțiuni pentru KDS...";
  } else if (currentPath.includes('kiosk')) {
    searchPlaceholder = "Caută instrucțiuni pentru Kiosk...";
  } else if (currentPath.includes('casa') || currentPath.includes('casă')) {
    searchPlaceholder = "Caută instrucțiuni pentru Casă...";
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between w-full px-4 md:px-8 py-3">
        
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="select-none [-webkit-touch-callout:none] flex items-center gap-3 group shrink-0">
          <div className="p-1">
            <FileText size={28} weight="duotone" className="text-mesored group-hover:brightness-110 transition-all" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
            MesoHelp
          </span>
        </Link>

        {/* Search Bar */}
        {location.pathname !== '/login' && (
          <div className="flex-1 min-w-[150px] max-w-xl mx-4 lg:mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <MagnifyingGlass size={20} weight="duotone" />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 px-4 py-2 pl-10 rounded-lg focus:border-mesored focus:ring-2 focus:ring-mesored/50 transition-all duration-300 outline-none"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}

        {/* User Roles & Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0 h-10">
          
          {authLoading ? (
            <div className="flex items-center justify-center p-2 text-mesored">
               <Spinner size={20} weight="duotone" className="animate-spin" />
            </div>
          ) : isAdmin ? (
            <>
              <Link 
                to="/"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Acasă"
              >
                <House size={20} weight="duotone" />
              </Link>

              <Link 
                to="/dashboard"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/dashboard' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Dashboard"
              >
                <Gear size={20} weight="duotone" />
              </Link>
              
              <div 
                className="p-2 text-mesored bg-transparent cursor-default"
                title="Rol: Administrator"
              >
                <Shield size={20} weight="duotone" />
              </div>

              <button
                onClick={handleLogout}
                className="select-none [-webkit-touch-callout:none] p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Deconectare"
              >
                <SignOut size={20} weight="duotone" />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Acasă"
              >
                <House size={20} weight="duotone" />
              </Link>

              <Link
                to="/login"
                className={`select-none [-webkit-touch-callout:none] p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/login' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Conectare Admin"
              >
                <User size={20} weight="duotone" />
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
