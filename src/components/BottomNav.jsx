import { Link, useLocation } from 'react-router-dom';
import { House, Desktop, Monitor } from '@phosphor-icons/react';

const KioskIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={1.5} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-6 h-6 mb-1"
  >
    <rect x="6" y="2" width="12" height="13" rx="1" />
    <path d="M7 15h10v7H7z" />
    <path d="M10 19h4" />
  </svg>
);

const OmsOrbIcon = () => (
  <div className="relative w-7 h-7 flex items-center justify-center mb-1 text-inherit">
    <Monitor className="absolute top-0 right-0 w-4 h-4" weight="regular" color="currentColor" />
    <Monitor className="absolute bottom-0 left-0 w-4 h-4" weight="regular" color="currentColor" />
  </div>
);

const CATEGORIES = [
  { name: 'Acasă', path: '/', icon: () => <House size={24} weight="regular" className="mb-1" /> },
  { name: 'Kiosk', path: `/category/${encodeURIComponent('Kiosk')}`, icon: KioskIcon },
  { name: 'Casă', path: `/category/${encodeURIComponent('Casă')}`, icon: () => <Desktop size={24} weight="regular" className="mb-1" /> },
  { name: 'OMS/ORB', path: `/category/${encodeURIComponent('OMS/ORB')}`, icon: OmsOrbIcon }
];

const BottomNav = () => {
  const location = useLocation();
  const currentPath = decodeURIComponent(location.pathname);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center pb-safe pt-2 pb-2 md:hidden">
      {CATEGORIES.map(cat => {
        const decodedCatPath = decodeURIComponent(cat.path);
        const isActive = currentPath === decodedCatPath || 
          (cat.name === 'OMS/ORB' && (currentPath === '/category/KDS' || currentPath.toLowerCase() === '/category/oms-orb' || currentPath === '/category/OMS/ORB'));
        const IconComponent = cat.icon;
        
        return (
          <Link
            key={cat.name}
            to={cat.path}
            className={`
              flex flex-col items-center justify-center p-2 transition-colors duration-200 cursor-pointer select-none
              ${isActive ? 'text-mesored' : 'text-gray-500 hover:text-mesored'}
            `}
          >
            <IconComponent />
            <span className="text-[10px] font-medium leading-none">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
