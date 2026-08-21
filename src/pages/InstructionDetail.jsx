import { useContext, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Link2, Video, Loader2 } from 'lucide-react';

const InstructionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { instructions, loading } = useContext(AppContext);
  
  // 1. Navigare condiționată: verifică dacă utilizatorul a venit dintr-o referință
  const isFromRef = Boolean(location.state?.fromReference);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)] w-full">
        <Loader2 className="w-10 h-10 text-mesored animate-spin" />
      </div>
    );
  }

  const instruction = instructions.find(i => i.id === id);

  if (!instruction) return <div className="p-8 text-center text-xl">Instrucțiunea nu a fost găsită.</div>;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return url;
  };

  const renderVideo = (url) => {
    if (!url) return null;
    const isVideoElement = url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm');
    if (isVideoElement) {
      return <video src={url} controls className="w-full h-full object-contain" />;
    }
    return (
      <iframe 
        className="w-full h-full"
        src={getEmbedUrl(url)} 
        title="Video Player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen>
      </iframe>
    );
  };

  // 3. Interceptarea link-urilor din interiorul conținutului HTML (SPA Routing)
  const handleContentClick = (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href) {
        const isInternal = href.startsWith('/') || href.startsWith('#') || !href.startsWith('http') || href.includes(window.location.host);
        if (isInternal) {
          e.preventDefault();
          let targetPath = href;
          if (href.startsWith('http')) {
            try {
              const parsed = new URL(href);
              targetPath = parsed.pathname + parsed.search + parsed.hash;
            } catch {
              targetPath = href;
            }
          }
          navigate(targetPath, { state: { fromReference: true } });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const hasSections = instruction.sections && instruction.sections.length > 0;

  const htmlContainerClasses = "max-w-none text-gray-700 leading-relaxed text-base md:text-lg [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_p]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-mesored [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_a]:bg-red-700 [&_a]:text-white [&_a]:px-3 [&_a]:py-1 [&_a]:rounded-md [&_a]:no-underline [&_a]:inline-block [&_a]:text-sm [&_a]:font-medium [&_a]:shadow-sm [&_a]:hover:bg-red-800 [&_a]:transition-colors [&_a]:cursor-pointer [&_a]:my-0.5";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-slide-up">
      {/* 1. Buton Înapoi Inteligent (Smart Back Button) */}
      <div className="flex items-center justify-between mb-6">
        {isFromRef ? (
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-all shadow-sm text-gray-700 hover:text-gray-900 select-none [-webkit-touch-callout:none] active:scale-[0.97] text-sm font-medium"
            title="Înapoi la instrucțiunea anterioară"
          >
            <ArrowLeft className="w-4 h-4 text-mesored" />
            <span>Înapoi la instrucțiunea anterioară</span>
          </button>
        ) : (
          <button 
            onClick={() => instruction?.category ? navigate(`/category/${encodeURIComponent(instruction.category === 'KDS' ? 'OMS/ORB' : instruction.category)}`) : navigate(-1)} 
            className="flex items-center justify-center bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 hover:bg-gray-50 transition-all shadow-sm text-gray-900 select-none [-webkit-touch-callout:none] active:scale-[0.97] w-fit"
            title={instruction?.category ? `Înapoi la categoria ${instruction.category === 'KDS' ? 'OMS/ORB' : instruction.category}` : "Înapoi"}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 md:p-10 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-sm font-semibold text-gray-700 rounded-full">
              {instruction.category === 'KDS' ? 'OMS/ORB' : instruction.category}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(instruction.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight break-words hyphens-auto">
            {instruction.title}
          </h1>

          {/* 2. Secțiunea „Vezi și:” Mutată SUS (imediat sub Titlu/Dată) */}
          {instruction.relatedInstructions && instruction.relatedInstructions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-mesored" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Vezi și:</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {instruction.relatedInstructions.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => {
                      navigate(`/instruction/${rel.id}`, { state: { fromReference: true } });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group inline-flex items-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-mesolight text-gray-800 hover:text-mesored border border-gray-200 hover:border-mesored/30 rounded-xl transition-all shadow-xs active:scale-[0.98] text-sm font-medium text-left"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-mesored shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="truncate max-w-xs">{rel.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-mesored group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-8 md:p-10 space-y-8">
          {hasSections ? (
            instruction.sections.map((section, index) => {
              if (section.type === 'text') {
                return (
                  <div 
                    key={section.id || index} 
                    onClick={handleContentClick}
                    className={htmlContainerClasses}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                );
              }
              if (section.type === 'image') {
                return (
                  <div key={section.id || index} className="w-full">
                    <div className="w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 p-2">
                      <img src={section.content} alt={`Imagine ${index}`} className="w-full h-auto rounded-xl" />
                    </div>
                    {section.description && (
                      <p className="mt-3 text-gray-600 text-sm italic border-l-4 border-mesored pl-3 py-1 bg-gray-50 rounded-r-lg">
                        {section.description}
                      </p>
                    )}
                  </div>
                );
              }
              if (section.type === 'video') {
                return (
                  <div key={section.id || index} className="w-full">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gray-200 shadow-inner">
                      {renderVideo(section.content)}
                    </div>
                    {section.description && (
                      <p className="mt-3 text-gray-600 text-sm italic border-l-4 border-mesored pl-3 py-1 bg-gray-50 rounded-r-lg">
                        {section.description}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <>
              {instruction.content && (
                <div 
                  onClick={handleContentClick}
                  className={`${htmlContainerClasses} mb-10`}
                  dangerouslySetInnerHTML={{ __html: instruction.content }}
                />
              )}
              {instruction.videoUrl && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Video size={20} />
                    Video Demonstrativ
                  </h3>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-inner">
                    {renderVideo(instruction.videoUrl)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Buton de revenire la finalul instrucțiunii */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            {isFromRef ? (
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-mesored font-medium text-sm transition-colors py-2 px-3 rounded-xl hover:bg-gray-50 active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4 text-mesored" />
                <span>Înapoi la instrucțiunea anterioară</span>
              </button>
            ) : (
              <button
                onClick={() => instruction?.category ? navigate(`/category/${encodeURIComponent(instruction.category === 'KDS' ? 'OMS/ORB' : instruction.category)}`) : navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-mesored font-medium text-sm transition-colors py-2 px-3 rounded-xl hover:bg-gray-50 active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4 text-mesored" />
                <span>Înapoi la categoria {instruction?.category === 'KDS' ? 'OMS/ORB' : instruction.category}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionDetail;
