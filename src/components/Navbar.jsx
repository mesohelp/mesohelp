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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between w-full px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 gap-2">
        
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="select-none [-webkit-touch-callout:none] flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="p-0.5 sm:p-1">
            <FileText weight="duotone" className="w-6 h-6 sm:w-7 sm:h-7 text-mesored group-hover:brightness-110 transition-all" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
            MesoHelp
          </span>
        </Link>

        {/* Search Bar */}
        {location.pathname !== '/login' && (
          <div className="flex-1 w-full min-w-0 max-w-xl mx-1 sm:mx-4 lg:mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none text-gray-500">
              <MagnifyingGlass weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-10 rounded-lg focus:border-mesored focus:ring-2 focus:ring-mesored/50 transition-all duration-300 outline-none truncate"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}

        {/* User Roles & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0 h-10">
          
          {authLoading ? (
            <div className="flex items-center justify-center p-1.5 sm:p-2 text-mesored">
               <Spinner weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
            </div>
          ) : isAdmin ? (
            <>
              <Link 
                to="/"
                className={`select-none [-webkit-touch-callout:none] p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Acasă"
              >
                <House weight="duotone" className="w-5 h-5" />
              </Link>

              <Link 
                to="/dashboard"
                className={`select-none [-webkit-touch-callout:none] p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/dashboard' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Dashboard"
              >
                <Gear weight="duotone" className="w-5 h-5" />
              </Link>
              
              <div 
                className="p-1.5 sm:p-2 text-mesored bg-transparent cursor-default"
                title="Rol: Administrator"
              >
                <Shield weight="duotone" className="w-5 h-5" />
              </div>

              <button
                onClick={handleLogout}
                className="select-none [-webkit-touch-callout:none] p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Deconectare"
              >
                <SignOut weight="duotone" className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/"
                className={`select-none [-webkit-touch-callout:none] p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Acasă"
              >
                <House weight="duotone" className="w-5 h-5" />
              </Link>

              <Link
                to="/login"
                className={`select-none [-webkit-touch-callout:none] p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${location.pathname === '/login' ? 'bg-mesored text-white shadow-inner' : 'text-mesored hover:bg-mesored hover:text-white'}`}
                title="Conectare Admin"
              >
                <User weight="duotone" className="w-5 h-5" />
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
