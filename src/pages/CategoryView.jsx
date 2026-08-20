import { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import InstructionCard from '../components/InstructionCard';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CategoryView = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { instructions, setInstructions, saveInstructionOrder, isAdmin, loading, searchQuery } = useContext(AppContext);
  
  const cacheKey = `meso_inst_${categoryName}`;
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  };

  const [localInstructions, setLocalInstructions] = useState(getCachedData);
  const [localLoading, setLocalLoading] = useState(() => getCachedData().length === 0);
  
  const [isReordering, setIsReordering] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [backupInstructions, setBackupInstructions] = useState([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Ref-uri pentru Drag & Drop în timp real
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    const cachedData = getCachedData();
    setLocalInstructions(cachedData);
    
    const fetchData = async () => {
      if (cachedData.length === 0) {
        setLocalLoading(true);
      }
      try {
        const response = await fetch(`https://support.mesopotamia.ro/date.json?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`Eroare HTTP: ${response.status}`);
        }
        const allData = await response.json();
        if (Array.isArray(allData)) {
          setInstructions(allData);
          const filtered = allData
            .filter(i => i?.category === categoryName)
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
          setLocalInstructions(filtered);
          localStorage.setItem(cacheKey, JSON.stringify(filtered));
        }
      } catch (err) {
        console.error("Eroare la preluarea datelor din JSON: ", err);
        if (cachedData.length === 0) {
          setLocalInstructions([]);
        }
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  // Keep localInstructions in sync when instructions change in context and not reordering
  useEffect(() => {
    if (instructions && instructions.length > 0 && !isReordering) {
      const filtered = instructions
        .filter(i => i?.category === categoryName)
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      if (filtered.length > 0) {
        setLocalInstructions(filtered);
      }
    }
  }, [instructions, categoryName, isReordering]);

  const safeSearchQuery = (searchQuery || "").toLowerCase();
  
  const baseInstructions = isReordering
    ? localInstructions
    : (instructions?.length > 0 
        ? [...instructions.filter(i => i?.category === categoryName)].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        : localInstructions);

  const displayInstructions = baseInstructions?.filter(inst =>
    inst?.title?.toLowerCase().includes(safeSearchQuery) || 
    inst?.content?.toLowerCase().includes(safeSearchQuery)
  ) || [];

  // Handlers pentru Reordonare Drag & Drop în timp real
  const handleStartReorder = () => {
    const initialList = (instructions?.length > 0
      ? instructions.filter(i => i?.category === categoryName)
      : localInstructions
    ).slice().sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    setBackupInstructions(initialList);
    setLocalInstructions(initialList);
    setIsReordering(true);
  };

  const handleCancelReorder = () => {
    setLocalInstructions(backupInstructions);
    setIsReordering(false);
    handleDragEnd();
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      if (saveInstructionOrder) {
        await saveInstructionOrder(localInstructions);
      }
      localStorage.setItem(cacheKey, JSON.stringify(localInstructions));
      setIsReordering(false);
      handleDragEnd();
    } catch (error) {
      console.error("Eroare la salvarea ordinii în CategoryView:", error);
      alert("A apărut o eroare la salvarea ordinii.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (e, index, item) => {
    if (!isReordering) return;
    dragItem.current = index;
    setDraggedCardId(item.id);
    e.dataTransfer.effectAllowed = 'move';
    if (e.dataTransfer.setData) {
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleDragEnter = (e, index) => {
    if (!isReordering) return;
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;

    dragOverItem.current = index;

    // Rescriere în timp real a array-ului local (swap/move element)
    const updatedList = [...localInstructions];
    const [draggedElement] = updatedList.splice(dragItem.current, 1);
    updatedList.splice(index, 0, draggedElement);

    dragItem.current = index;
    setLocalInstructions(updatedList);
  };

  const handleDragOver = (e) => {
    if (!isReordering) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedCardId(null);
  };

  const isLoading = loading || localLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-5rem)] w-full">
        <Loader2 className="w-10 h-10 text-mesored animate-spin mb-4" />
        <span className="text-gray-500 font-medium">Se încarcă instrucțiunile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 hover:bg-gray-50 transition-all shadow-sm text-gray-900 select-none [-webkit-touch-callout:none] active:scale-[0.97] w-fit">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Instrucțiuni {categoryName}</h1>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            {isReordering ? (
              <>
                <button 
                  onClick={handleCancelReorder} 
                  disabled={isSavingOrder}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 select-none bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Anulează
                </button>
                <button 
                  onClick={handleSaveOrder} 
                  disabled={isSavingOrder}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 select-none bg-mesored text-white hover:bg-red-800 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSavingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvează Ordinea
                </button>
              </>
            ) : (
              <button 
                onClick={handleStartReorder} 
                disabled={displayInstructions.length <= 1}
                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 select-none bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reordonare (Drag & Drop)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayInstructions?.length > 0 ? displayInstructions.map((inst, index) => (
          <InstructionCard 
            key={inst.id} 
            instruction={inst} 
            isReordering={isReordering}
            isDragging={draggedCardId === inst.id}
            dragProps={{
              draggable: isReordering,
              onDragStart: (e) => handleDragStart(e, index, inst),
              onDragEnter: (e) => handleDragEnter(e, index),
              onDragOver: handleDragOver,
              onDragEnd: handleDragEnd,
              onDrop: (e) => {
                e.preventDefault();
                handleDragEnd();
              }
            }}
          />
        )) : searchQuery ? (
          <div className="text-center py-10 text-gray-500 col-span-full flex justify-center w-full">Nu am găsit nicio instrucțiune care să conțină acest termen.</div>
        ) : (
          <div className="text-center py-10 text-gray-500 col-span-full flex justify-center w-full">Momentan nu există instrucțiuni pentru această categorie.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;
