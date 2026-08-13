import { Link, useLocation } from 'react-router-dom';
import { House, DeviceTablet, Desktop, HardDrives } from '@phosphor-icons/react';

const CATEGORIES = [
  { name: 'Acasă', path: '/', icon: House },
  { name: 'Kiosk', path: '/category/Kiosk', icon: DeviceTablet },
  { name: 'Casă', path: '/category/Casă', icon: Desktop },
  { name: 'KDS', path: '/category/KDS', icon: HardDrives }
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center pb-safe pt-2 pb-2 md:hidden">
      {CATEGORIES.map(cat => {
        // Fix for active state: exact match for Home, includes for others or exact match
        const isActive = decodeURIComponent(location.pathname) === cat.path;
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
            <Icon size={24} weight="duotone" />
            <span className="text-[10px] font-medium mt-1">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
