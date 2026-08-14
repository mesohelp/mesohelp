import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ title, icon }) => {
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
      className="w-full h-auto flex flex-row md:flex-col items-center md:justify-center p-4 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-[0_0_15px_rgba(181,18,27,0.25)] hover:border-mesored transition-all duration-300 border border-transparent group select-none [-webkit-touch-callout:none] touch-none active:scale-[0.97] [-webkit-tap-highlight-color:transparent]"
    >
      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-mesobg flex items-center justify-center shrink-0 md:group-hover:bg-mesolight text-mesored transition-colors relative z-10">
        {icon}
      </div>
      <div className="text-left md:text-center flex-1 md:flex-none relative z-10">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 transition-colors">{title}</h2>
      </div>
    </div>
  );
};

export default CategoryCard;
