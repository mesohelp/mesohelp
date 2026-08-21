import { Link, useLocation } from 'react-router-dom';

const CATEGORIES = ['Kiosk', 'Casă', 'OMS/ORB'];

const CategoryTabs = () => {
  const location = useLocation();
  const currentCategory = decodeURIComponent(location.pathname.replace('/category/', ''));

  return (
    <div className="flex border-b border-gray-200 mb-8 overflow-x-auto shadow-sm">
      {CATEGORIES.map(cat => {
        const isActive = currentCategory === cat || (cat === 'OMS/ORB' && (currentCategory === 'KDS' || currentCategory.toLowerCase() === 'oms-orb'));
        
        return (
          <Link
            key={cat}
            to={`/category/${encodeURIComponent(cat)}`}
            className={`
              px-8 py-4 text-sm whitespace-nowrap transition-all duration-300
              ${isActive 
                ? 'border-t-4 border-mesored bg-mesolight text-mesored font-bold' 
                : 'border-t-4 border-transparent bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
