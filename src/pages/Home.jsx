import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import CategoryCard from '../components/CategoryCard';
import InstructionCard from '../components/InstructionCard';
import { Tablet, Monitor, Loader2 } from 'lucide-react';

const Home = () => {
  const { searchQuery, instructions, loading } = useContext(AppContext);
  
  const safeSearchQuery = (searchQuery || "").toLowerCase();
  const filteredInstructions = (instructions || []).filter(inst => 
    inst?.title?.toLowerCase().includes(safeSearchQuery) || 
    inst?.content?.toLowerCase().includes(safeSearchQuery)
  );

  if (searchQuery) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Rezultate căutare: "{searchQuery}"</h2>
        {(filteredInstructions || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(filteredInstructions || []).map(inst => (
              <InstructionCard key={inst.id} instruction={inst} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">Nu am găsit nicio instrucțiune care să conțină acest termen.</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center w-full h-[calc(100dvh-80px)] overflow-hidden bg-transparent px-4">
      <div className="flex flex-col w-full max-w-5xl gap-8 md:gap-16 mt-8 md:mt-16 h-auto">
        
        <div className="w-full text-center animate-slide-up">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Cum te putem ajuta?</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Alege o categorie de mai jos pentru a vizualiza ghidurile tehnice și instrucțiunile de utilizare.</p>
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <CategoryCard 
            title="Kiosk" 
            icon={<Tablet className="w-8 h-8 md:w-12 md:h-12 text-mesored transition-colors" strokeWidth={1.5} />}
            count={instructions.filter(i=>i.category==='Kiosk').length}
            loading={loading}
          />
          <CategoryCard 
            title="Casă" 
            icon={<Monitor className="w-8 h-8 md:w-12 md:h-12 text-mesored transition-colors" strokeWidth={1.5} />}
            count={instructions.filter(i=>i.category==='Casă').length}
            loading={loading}
          />
          <CategoryCard 
            title="KDS" 
            icon={
              <div className="flex gap-1">
                <Monitor className="w-6 h-6 md:w-8 md:h-8 text-mesored transition-colors" strokeWidth={1.5} />
                <Monitor className="w-6 h-6 md:w-8 md:h-8 text-mesored transition-colors" strokeWidth={1.5} />
              </div>
            }
            count={instructions.filter(i=>i.category==='KDS').length}
            loading={loading}
          />
        </div>

      </div>
    </div>
  );
};

export default Home;
