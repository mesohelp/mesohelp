import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import InstructionCard from '../components/InstructionCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const CategoryView = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { instructions, setInstructions, isAdmin, loading } = useContext(AppContext);
  
  const [localInstructions, setLocalInstructions] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    // If global loading finished and we STILL have 0 instructions globally, let's fetch locally
    // Also covers the case where direct navigation misses the global state
    if (!loading && instructions.length === 0) {
      const fetchLocal = async () => {
        setLocalLoading(true);
        try {
          const q = query(collection(db, 'instructions'), where("category", "==", categoryName));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLocalInstructions(data);
        } catch (error) {
          console.error("Eroare la preluarea locală: ", error);
        } finally {
          setLocalLoading(false);
        }
      };
      fetchLocal();
    }
  }, [loading, instructions.length, categoryName]);

  const displayInstructions = instructions.length > 0 
    ? instructions.filter(i => i.category === categoryName)
    : localInstructions;

  const isLoading = loading || localLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)] w-full">
        <Loader2 className="w-10 h-10 text-[#1D5337] animate-spin" />
      </div>
    );
  }

  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [backupInstructions, setBackupInstructions] = useState([]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 hover:bg-gray-50 transition-all shadow-sm text-[#0A2B1C] select-none [-webkit-touch-callout:none] active:scale-[0.97] w-fit">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A2B1C]">Instrucțiuni {categoryName}</h1>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            {isReordering ? (
              <>
                <button 
                  onClick={() => {
                    setInstructions(backupInstructions);
                    setIsReordering(false);
                  }} 
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 select-none bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                >
                  Anulează
                </button>
                <button 
                  onClick={() => setIsReordering(false)} 
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 select-none bg-[#1D5337] text-white hover:bg-[#16402a]"
                >
                  Salvează Ordinea
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setBackupInstructions([...instructions]);
                  setIsReordering(true);
                }} 
                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 select-none bg-white border border-gray-200 text-[#0A2B1C] hover:bg-gray-50"
              >
                Reordonare (Drag & Drop)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayInstructions.length > 0 ? displayInstructions.map((inst, index) => (
          <InstructionCard 
            key={inst.id} 
            instruction={inst} 
            isReordering={isReordering}
            dragProps={{
              draggable: isReordering,
              onDragStart: () => setDraggedIndex(index),
              onDragOver: (e) => e.preventDefault(),
              onDrop: (e) => {
                e.preventDefault();
                if (draggedIndex === null || draggedIndex === index) return;
                const newItems = [...instructions];
                const draggedGlobalIndex = newItems.findIndex(i => i.id === displayInstructions[draggedIndex].id);
                const dropGlobalIndex = newItems.findIndex(i => i.id === displayInstructions[index].id);
                const [draggedItem] = newItems.splice(draggedGlobalIndex, 1);
                newItems.splice(dropGlobalIndex, 0, draggedItem);
                setInstructions(newItems);
                setDraggedIndex(null);
              }
            }}
          />
        )) : (
          <p className="text-gray-500 col-span-full">Nu există instrucțiuni în această categorie.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryView;
