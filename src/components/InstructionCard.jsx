import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';

const InstructionCard = ({ instruction, isReordering, isDragging, dragProps }) => {
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
      className={`select-none [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent] touch-pan-y bg-white rounded-2xl p-6 flex flex-col h-full shadow-sm hover:shadow-[0_0_15px_rgba(181,18,27,0.25)] hover:border-mesored active:scale-[0.97] transition-all duration-300 group ${
        isDragging 
          ? 'opacity-50 border-dashed border-2 border-red-500 scale-[1.02] shadow-md ring-2 ring-red-200' 
          : 'border border-transparent'
      } ${
        isReordering 
          ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-mesored opacity-90' 
          : 'cursor-pointer'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-gray-100 md:group-hover:bg-mesolight text-xs font-semibold text-gray-600 md:group-hover:text-mesored rounded-full transition-colors">
          {instruction.category === 'KDS' ? 'OMS/ORB' : instruction.category}
        </span>
        {instruction.videoUrl && (
          <div className="text-mesored bg-mesolight p-1.5 rounded-lg transition-colors">
            <Video size={16} />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors line-clamp-2 break-words">
        {instruction.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow transition-colors break-words">
        {instruction.content}
      </p>
      <div className="text-xs text-gray-400 mt-auto font-medium transition-colors">
        Adăugat pe: {new Date(instruction.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default InstructionCard;
