import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Video, Image as ImageIcon, Type, Trash2, Loader2 } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Media files are now uploaded via the custom PHP API
const Font = Quill.import('formats/font');
const customFonts = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'tahoma', 'times-new-roman', 'verdana'];
Font.whitelist = customFonts;
Quill.register(Font, true);

const Size = Quill.import('attributors/style/size');
const customSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];
Size.whitelist = customSizes;
Quill.register(Size, true);

const quillModules = {
  toolbar: [
    [{ 'font': customFonts }, { 'size': customSizes }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['clean']
  ]
};

const CATEGORIES = ['Kiosk', 'Casă', 'KDS'];

const InstructionForm = ({ instructionId, onClose }) => {
  const { instructions, addInstruction, updateInstruction } = useContext(AppContext);
  
  const inst = instructionId ? instructions.find(i => i.id === instructionId) : null;
  
  const [title, setTitle] = useState(inst ? inst.title : '');
  const [category, setCategory] = useState(inst ? inst.category : 'Kiosk');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isReorderingSections, setIsReorderingSections] = useState(false);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  
  const [sections, setSections] = useState(() => {
    if (inst) {
      if (inst.sections && inst.sections.length > 0) {
        return inst.sections;
      }
      const initialSections = [];
      if (inst.content) {
        initialSections.push({ id: Date.now(), type: 'text', content: inst.content });
      }
      if (inst.videoUrl) {
        initialSections.push({ id: Date.now() + 1, type: 'video', content: inst.videoUrl });
      }
      if (initialSections.length === 0) {
        initialSections.push({ id: Date.now(), type: 'text', content: '' });
      }
      return initialSections;
    }
    return [{ id: Date.now(), type: 'text', content: '' }];
  });

  const addSection = (type) => {
    setSections([...sections, { id: Date.now(), type, content: '', description: '' }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id, newContent) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const updateSectionDescription = (id, newDesc) => {
    setSections(sections.map(s => s.id === id ? { ...s, description: newDesc } : s));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSections(sections.map(s => s.id === id ? { ...s, file: file, content: previewUrl } : s));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const updatedSections = await Promise.all(sections.map(async (section) => {
        if ((section.type === 'image' || section.type === 'video') && section.file) {
          try {
            const file = section.file;
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('https://support.mesopotamia.ro/upload.php', {
              method: 'POST',
              body: formData
            });
            
            if (!response.ok) {
              throw new Error(`Upload failed cu status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.url) {
              throw new Error('Eroare: URL-ul lipsește din răspunsul serverului.');
            }
            
            return {
              id: section.id,
              type: section.type,
              content: data.url,
              description: section.description || ''
            };
          } catch (uploadError) {
            console.error(`Eroare la încărcarea fișierului pentru secțiunea ${section.id}:`, uploadError);
            throw new Error(`Nu am putut încărca fișierul. Detalii: ${uploadError.message}`);
          }
        }
        
        const { file, ...rest } = section;
        return rest;
      }));

      const payload = { title, category, sections: updatedSections };
      
      if (instructionId) {
        await updateInstruction(instructionId, payload);
      } else {
        await addInstruction(payload);
      }
      onClose();
    } catch (error) {
      console.error("Error saving instruction:", error);
      alert(error.message || "A apărut o eroare la salvarea datelor. Verificați conexiunea.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {instructionId ? 'Editează Instrucțiunea' : 'Creează o Instrucțiune Nouă'}
        </h2>
        <button type="button" onClick={() => setShowCancelModal(true)} className="p-1 text-gray-400 hover:text-gray-800 transition-colors" title="Închide" aria-label="Închide">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Titlu</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:bg-white focus:border-mesored focus:ring-2 focus:ring-mesored/50 transition-all outline-none"
              placeholder="Ex: Cum se schimbă rola..."
            />
          </div>
          <div className="space-y-1.5 relative">
            <label className="block text-sm font-semibold text-gray-700">Categorie</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-left focus:bg-white focus:border-mesored focus:ring-2 focus:ring-mesored/50 transition-all outline-none flex justify-between items-center"
              >
                <span>{category}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform text-gray-500 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isCategoryDropdownOpen && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto overflow-x-hidden">
                  {CATEGORIES.map(cat => (
                    <li 
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${category === cat ? 'bg-mesobg font-semibold text-gray-900' : 'text-gray-700'}`}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {isCategoryDropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsCategoryDropdownOpen(false)}
              ></div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className={`relative p-4 border border-gray-200 rounded-xl bg-gray-50 group transition-all ${isReorderingSections ? 'cursor-grab opacity-90 ring-2 ring-blue-400' : ''}`}
              draggable={isReorderingSections}
              onDragStart={() => setDraggedSectionIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedSectionIndex === null || draggedSectionIndex === index) return;
                const newSections = [...sections];
                const [draggedItem] = newSections.splice(draggedSectionIndex, 1);
                newSections.splice(index, 0, draggedItem);
                setSections(newSections);
                setDraggedSectionIndex(null);
              }}
            >
              <button 
                type="button" 
                onClick={() => removeSection(section.id)}
                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Șterge secțiunea"
              >
                <Trash2 size={18} />
              </button>
              
              <div className={isReorderingSections ? 'pointer-events-none' : ''}>
                {section.type === 'text' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Bloc Text</label>
                    <ReactQuill 
                    theme="snow"
                    value={section.content}
                    onChange={(content) => updateSection(section.id, content)}
                    modules={quillModules}
                    className="bg-white rounded-lg border border-gray-200 overflow-visible"
                  />
                </div>
              )}

              {section.type === 'image' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Imagine</label>
                  {!section.content ? (
                    <>
                      <input 
                        type="file" 
                        id={`file-${section.id}`} 
                        accept="image/jpeg, image/png, image/webp, image/gif" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, section.id)} 
                      />
                      <label htmlFor={`file-${section.id}`} className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mesored hover:bg-white transition-colors">
                        <span className="text-gray-500 font-medium">Apasă pentru a încărca o imagine</span>
                      </label>
                    </>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white p-2 text-center">
                      <img src={section.content} alt="Preview" className="max-h-64 object-contain inline-block w-auto" />
                    </div>
                  )}
                  <input type="text" placeholder="Adaugă o descriere opțională..." value={section.description || ''} onChange={(e) => updateSectionDescription(section.id, e.target.value)} className="w-full mt-3 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-mesored focus:ring-2 focus:ring-mesored/50" />
                </div>
              )}

              {section.type === 'video' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Video</label>
                  {!section.content ? (
                    <>
                      <input 
                        type="file" 
                        id={`file-${section.id}`} 
                        accept="video/mp4, video/webm" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, section.id)} 
                      />
                      <label htmlFor={`file-${section.id}`} className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mesored hover:bg-white transition-colors">
                        <span className="text-gray-500 font-medium">Apasă pentru a încărca un video (.mp4, .webm)</span>
                      </label>
                    </>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-black">
                      <video src={section.content} controls className="w-full h-48 object-contain" />
                    </div>
                  )}
                  <input type="text" placeholder="Adaugă o descriere opțională..." value={section.description || ''} onChange={(e) => updateSectionDescription(section.id, e.target.value)} className="w-full mt-3 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-mesored focus:ring-2 focus:ring-mesored/50" />
                </div>
              )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600 mr-2">Adaugă Secțiune:</span>
          <button type="button" onClick={() => addSection('text')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
            <Type size={16} /> Text
          </button>
          <button type="button" onClick={() => addSection('image')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
            <ImageIcon size={16} /> Imagine
          </button>
          <button type="button" onClick={() => addSection('video')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
            <Video size={16} /> Video
          </button>
          <button type="button" onClick={() => setIsReorderingSections(!isReorderingSections)} className="ml-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">
            {isReorderingSections ? 'Termină Reordonarea' : 'Reordonare Secțiuni'}
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => setShowCancelModal(true)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Anulează
          </button>
          <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-medium bg-mesored text-white hover:bg-red-800 shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2">
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            {instructionId ? 'Salvează Modificările' : 'Salvează Instrucțiunea'}
          </button>
        </div>
      </form>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Modificări nesalvate</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Ești sigur că vrei să închizi? Modificările făcute nu vor fi salvate și se vor pierde.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium text-sm">
                Înapoi la editare
              </button>
              <button onClick={() => { setShowCancelModal(false); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm shadow-md shadow-red-200">
                Da, închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionForm;
