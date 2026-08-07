import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CategoryCard = ({ title, icon, count, loading }) => {
  const navigate = useNavigate();

  const handleDelayedNavigation = () => {
    setTimeout(() => {
      navigate(`/category/${title}`);
    }, 200);
  };

  return (
    <div 
      role="button"
      onClick={handleDelayedNavigation} 
      className="w-full h-auto flex flex-row md:flex-col items-center md:justify-center p-4 md:p-8 bg-white rounded-2xl shadow-sm md:hover:shadow-md md:hover:bg-[#1D5337] transition-all border border-gray-100 group select-none [-webkit-touch-callout:none] touch-none active:scale-[0.97] [-webkit-tap-highlight-color:transparent]"
    >
      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#F5F4EF] flex items-center justify-center shrink-0 md:group-hover:bg-white text-[#1D5337] transition-colors relative z-10">
        {icon}
      </div>
      <div className="text-left md:text-center flex-1 md:flex-none relative z-10">
        <h2 className="text-lg md:text-2xl font-bold text-[#0A2B1C] md:group-hover:text-white transition-colors">{title}</h2>
        {loading ? (
          <div className="flex items-center md:justify-center mt-1 text-gray-500 md:group-hover:text-gray-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            <span className="text-xs md:text-sm">Se calculează...</span>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:group-hover:text-gray-200 transition-colors">{count} instrucțiuni disponibile</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
