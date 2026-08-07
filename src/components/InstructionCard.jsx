import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';

const InstructionCard = ({ instruction, isReordering, dragProps }) => {
  const navigate = useNavigate();

  const handleDelayedNavigation = (e) => {
    if (isReordering) {
      e.preventDefault();
      return;
    }
    setTimeout(() => {
      navigate(`/instruction/${instruction.id}`);
    }, 200);
  };

  return (
    <div 
      {...dragProps}
      role="button"
      onClick={handleDelayedNavigation} 
      className={`select-none [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent] touch-pan-y bg-white border border-gray-200 rounded-2xl p-6 flex flex-col h-full md:hover:shadow-xl md:hover:bg-[#1D5337] md:hover:border-[#1D5337] active:scale-[0.97] transition-all duration-200 group ${isReordering ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[#1D5337] opacity-90' : 'cursor-pointer'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-gray-100 md:group-hover:bg-[#16402a] text-xs font-semibold text-gray-600 md:group-hover:text-white rounded-full transition-colors">
          {instruction.category}
        </span>
        {instruction.videoUrl && (
          <div className="text-[#1D5337] bg-gray-100 md:group-hover:bg-[#16402a] md:group-hover:text-white p-1.5 rounded-lg transition-colors">
            <Video size={16} />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 md:group-hover:text-white transition-colors line-clamp-2">
        {instruction.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow md:group-hover:text-white/80 transition-colors">
        {instruction.content}
      </p>
      <div className="text-xs text-gray-400 mt-auto font-medium md:group-hover:text-white/70 transition-colors">
        Adăugat pe: {new Date(instruction.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default InstructionCard;
