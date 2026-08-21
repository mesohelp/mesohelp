import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import CategoryCard from '../components/CategoryCard';
import InstructionCard from '../components/InstructionCard';
import { DeviceTablet, Desktop, Monitor } from '@phosphor-icons/react';

const Home = () => {
  const { searchQuery, instructions, setInstructions } = useContext(AppContext);
  
  useEffect(() => {
    const prefetchData = async () => {
      try {
        const response = await fetch(`https://support.mesopotamia.ro/date.json?t=${Date.now()}`);
        if (!response.ok) return;
        const allData = await response.json();
        
        if (Array.isArray(allData)) {
          if (setInstructions) {
            setInstructions(allData);
          }
          const categories = {};
          allData.forEach(inst => {
            const rawCat = inst.category;
            const cat = rawCat === 'KDS' ? 'OMS/ORB' : rawCat;
            if (cat) {
              if (!categories[cat]) categories[cat] = [];
              categories[cat].push(inst);
            }
          });
          
          Object.keys(categories).forEach(cat => {
            const cacheKey = `meso_inst_${cat}`;
            const sortedCatList = [...categories[cat]].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            localStorage.setItem(cacheKey, JSON.stringify(sortedCatList));
          });
        }
      } catch (error) {
        console.warn("Silent pre-fetching failed:", error);
      }
    };
    
    prefetchData();
  }, [setInstructions]);
  
  const safeSearchQuery = (searchQuery || "").toLowerCase();
  const filteredInstructions = (instructions || [])
    .slice()
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    .filter(inst => 
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
    <div className="flex flex-col justify-start items-center w-full h-auto bg-transparent px-4 pb-8 pt-4 md:pt-8">
      <div className="flex flex-col w-full max-w-5xl h-auto">
        <p className="text-center text-gray-500 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
          Alege o categorie de mai jos pentru a vizualiza ghidurile tehnice și instrucțiunile de utilizare.
        </p>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 animate-slide-up">
          <CategoryCard 
            title="Kiosk" 
            icon={<DeviceTablet className="w-8 h-8 md:w-12 md:h-12 text-mesored transition-colors" weight="regular" />}
          />
          <CategoryCard 
            title="Casă" 
            icon={<Desktop className="w-8 h-8 md:w-12 md:h-12 text-mesored transition-colors" weight="regular" />}
          />
          <CategoryCard 
            title="OMS/ORB" 
            icon={<Monitor className="w-8 h-8 md:w-12 md:h-12 text-mesored transition-colors" weight="regular" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
