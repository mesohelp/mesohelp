import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import InstructionForm from '../components/InstructionForm';
import { Shield, Plus, Pencil, Trash, Spinner } from '@phosphor-icons/react';

const AdminDashboard = () => {
  const { instructions, deleteInstruction, loading, searchQuery } = useContext(AppContext);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)] w-full">
        <Spinner className="w-10 h-10 text-mesored animate-spin" weight="duotone" />
      </div>
    );
  }
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, instructionId: null });

  const filteredInstructions = instructions.filter(item => item.title?.toLowerCase().includes((searchQuery || '').toLowerCase()));

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
          <button onClick={handleNew} className="flex items-center gap-2 bg-mesored hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
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

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Titlu</th>
                <th className="px-6 py-4 font-semibold w-32">Categorie</th>
                <th className="px-6 py-4 font-semibold w-32">Data</th>
                <th className="px-6 py-4 font-semibold w-32 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInstructions.map(inst => (
                <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inst.title}
                    {inst.videoUrl && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-mesolight text-mesored border border-mesored/20">VIDEO</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">{inst.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {new Date(inst.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(inst.id)} className="inline-flex p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Editează">
                      <Pencil size={16} weight="duotone" />
                    </button>
                    <button onClick={() => setDeleteModal({ isOpen: true, instructionId: inst.id })} className="inline-flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Șterge">
                      <Trash size={16} weight="duotone" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInstructions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">Nu a fost găsită nicio instrucțiune conform căutării.</td>
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
