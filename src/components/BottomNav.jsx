import { Link, useLocation } from 'react-router-dom';
import { House, DeviceTablet, Desktop, Monitor } from '@phosphor-icons/react';

const CATEGORIES = [
  { name: 'Acasă', path: '/', icon: House },
  { name: 'Kiosk', path: `/category/${encodeURIComponent('Kiosk')}`, icon: DeviceTablet },
  { name: 'Casă', path: `/category/${encodeURIComponent('Casă')}`, icon: Desktop },
  { name: 'OMS/ORB', path: `/category/${encodeURIComponent('OMS/ORB')}`, icon: Monitor }
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
        const Icon = cat.icon;
        
        return (
          <Link
            key={cat.name}
            to={cat.path}
            className={`
              flex flex-col items-center justify-center p-2 transition-colors duration-200
              ${isActive ? 'text-mesored' : 'text-gray-500 hover:text-mesored'}
            `}
          >
            <Icon size={24} weight="regular" />
            <span className="text-[10px] font-medium mt-1">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
