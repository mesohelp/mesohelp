import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import InstructionForm from '../components/InstructionForm';
import { Shield, Plus, Pencil, Trash, Spinner, DotsSixVertical, ArrowsDownUp, Check, X, Funnel, CaretDown } from '@phosphor-icons/react';

const CATEGORY_OPTIONS = ["Toate", "Kiosk", "Casă", "KDS"];

const AdminDashboard = () => {
  const { instructions, deleteInstruction, saveInstructionOrder, loading, searchQuery } = useContext(AppContext);
  
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, instructionId: null });

  // 1. Filtrarea pe Categorii cu Custom Dropdown
  const [selectedCategory, setSelectedCategory] = useState("Toate");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 2. Modul de Reordonare (Drag & Drop)
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [reorderedList, setReorderedList] = useState([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Filter instructions based on category
  const categoryInstructions = selectedCategory && selectedCategory !== "Toate"
    ? instructions.filter(item => item.category === selectedCategory)
    : instructions;

  // Sorted instructions by orderIndex
  const sortedInstructions = [...categoryInstructions].sort(
    (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
  );

  // If search query is present and not reordering, filter by title
  const displayedInstructions = isReordering
    ? reorderedList
    : sortedInstructions.filter(item =>
        item.title?.toLowerCase().includes((searchQuery || '').toLowerCase())
      );

  // Sync reorderedList when category changes or reordering mode is entered
  const startReordering = () => {
    const list = [...categoryInstructions].sort(
      (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
    );
    setReorderedList(list);
    setIsReordering(true);
  };

  const cancelReordering = () => {
    setIsReordering(false);
    setReorderedList([]);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // 3. Salvarea Ordinii Globale (Backend & Context)
  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      await saveInstructionOrder(reorderedList);
      setIsReordering(false);
      setReorderedList([]);
      setDraggedIndex(null);
      setDragOverIndex(null);
    } catch (error) {
      console.error("Eroare la salvarea ordinii:", error);
      alert("A apărut o eroare la salvarea noii ordini.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e, index) => {
    if (!isReordering) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    if (e.dataTransfer.setData) {
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleDragOver = (e, index) => {
    if (!isReordering) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    if (!isReordering) return;
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...reorderedList];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setReorderedList(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)] w-full">
        <Spinner className="w-10 h-10 text-mesored animate-spin" weight="duotone" />
      </div>
    );
  }

  const handleEdit = (id) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    deleteInstruction(deleteModal.instructionId); 
    setDeleteModal({ isOpen: false, instructionId: null });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrare</h1>
          <p className="text-gray-500 mt-1">Gestionează articolele din baza de cunoștințe</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleNew} className="flex items-center gap-2 bg-mesored hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm active:scale-[0.98]">
            <Plus size={20} weight="duotone" />
            Instrucțiune Nouă
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-8 animate-slide-up">
          <InstructionForm 
            key={editingId || 'new'}
            instructionId={editingId} 
            onClose={() => setIsFormOpen(false)} 
          />
        </div>
      )}

      {/* Control Bar: Filtrare Categorii & Butoane Reordonare */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
        {/* Custom Dropdown Filtrare Categorie */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Funnel size={18} weight="duotone" className="text-mesored" />
            <span>Categorie:</span>
          </div>

          <div className="relative">
            <button
              type="button"
              disabled={isReordering}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center justify-between gap-3 bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-xl px-4 py-2 shadow-sm transition-all outline-none ${
                isReordering 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer focus:ring-2 focus:ring-mesored/40 focus:border-mesored'
              }`}
            >
              <span>{selectedCategory}</span>
              <CaretDown 
                size={14} 
                weight="bold" 
                className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-mesored' : ''}`} 
              />
            </button>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && !isReordering && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden animate-fade-in">
                  {CATEGORY_OPTIONS.map(cat => (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                        setIsReordering(false);
                        setReorderedList([]);
                      }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                        selectedCategory === cat 
                          ? 'bg-red-50 text-mesored font-semibold' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && (
                        <Check size={16} weight="bold" className="text-mesored" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Butoane Reordonare (Apar DOAR când o categorie specifică este selectată) */}
        {selectedCategory !== "Toate" && (
          <div className="flex items-center gap-2">
            {isReordering ? (
              <>
                <button 
                  type="button"
                  onClick={cancelReordering}
                  disabled={isSavingOrder}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
                >
                  <X size={16} weight="bold" />
                  Anulează
                </button>
                <button 
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={isSavingOrder}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-mesored text-white hover:bg-red-800 active:scale-[0.98] disabled:opacity-70"
                >
                  {isSavingOrder ? (
                    <>
                      <Spinner size={16} weight="bold" className="animate-spin" />
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <Check size={16} weight="bold" />
                      Salvează Ordinea
                    </>
                  )}
                </button>
              </>
            ) : (
              <button 
                type="button"
                onClick={startReordering}
                disabled={categoryInstructions.length <= 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                title={categoryInstructions.length <= 1 ? "Sunt necesare cel puțin 2 instrucțiuni pentru reordonare" : "Activează reordonarea prin Drag & Drop"}
              >
                <ArrowsDownUp size={16} weight="duotone" className="text-mesored" />
                Reordonare
              </button>
            )}
          </div>
        )}
      </div>

      {isReordering && (
        <div className="mb-3 px-4 py-2.5 bg-red-50 border border-mesored/20 text-mesored rounded-xl text-sm flex items-center gap-2">
          <ArrowsDownUp size={18} weight="duotone" />
          <span>Trageți de rândurile tabelului pentru a schimba ordinea instrucțiunilor din categoria <strong>{selectedCategory}</strong>, apoi apăsați <strong>Salvează Ordinea</strong>.</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
              <tr>
                {isReordering && <th className="px-4 py-4 w-12 text-center">#</th>}
                <th className="px-6 py-4 font-semibold">Titlu</th>
                <th className="px-6 py-4 font-semibold w-32">Categorie</th>
                <th className="px-6 py-4 font-semibold w-32">Data</th>
                <th className="px-6 py-4 font-semibold w-32 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedInstructions.map((inst, index) => (
                <tr 
                  key={inst.id} 
                  draggable={isReordering}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-colors ${
                    isReordering 
                      ? 'cursor-grab active:cursor-grabbing hover:bg-red-50/50 select-none' 
                      : 'hover:bg-gray-50/50'
                  } ${draggedIndex === index ? 'opacity-30 bg-red-100' : ''} ${
                    dragOverIndex === index && draggedIndex !== index ? 'border-t-2 border-mesored bg-red-50/30' : ''
                  }`}
                >
                  {isReordering && (
                    <td className="px-4 py-4 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-1">
                        <DotsSixVertical size={20} weight="bold" className="text-gray-400 hover:text-mesored transition-colors" />
                        <span className="text-xs font-bold text-gray-500">{index + 1}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{inst.title}</span>
                      {inst.videoUrl && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-mesolight text-mesored border border-mesored/20">VIDEO</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">{inst.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {new Date(inst.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {isReordering ? (
                      <span className="text-xs text-gray-400 italic">Mod reordonare</span>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(inst.id)} className="inline-flex p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Editează">
                          <Pencil size={16} weight="duotone" />
                        </button>
                        <button onClick={() => setDeleteModal({ isOpen: true, instructionId: inst.id })} className="inline-flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Șterge">
                          <Trash size={16} weight="duotone" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {displayedInstructions.length === 0 && (
                <tr>
                  <td colSpan={isReordering ? 5 : 4} className="text-center py-8 text-gray-500">
                    {searchQuery 
                      ? "Nu a fost găsită nicio instrucțiune conform căutării." 
                      : selectedCategory !== "Toate" 
                        ? `Nu există instrucțiuni în categoria ${selectedCategory}.` 
                        : "Nu există instrucțiuni disponibile."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmare Ștergere</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Ești sigur că vrei să ștergi această instrucțiune? Această acțiune este ireversibilă și va fi eliminată definitiv din baza de cunoștințe.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, instructionId: null })} 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium text-sm"
              >
                Anulează
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm shadow-md shadow-red-200"
              >
                Da, șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
