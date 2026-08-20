import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Video, Loader2 } from 'lucide-react';

const InstructionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { instructions, loading } = useContext(AppContext);
  
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

  const hasSections = instruction.sections && instruction.sections.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-slide-up">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center justify-center bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 hover:bg-gray-50 transition-all shadow-sm text-gray-900 mb-6 select-none [-webkit-touch-callout:none] active:scale-[0.97] w-fit"
        title="Înapoi"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 md:p-10 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-sm font-semibold text-gray-700 rounded-full">
              {instruction.category}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(instruction.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {instruction.title}
          </h1>
        </div>
        
        <div className="p-8 md:p-10 space-y-8">
          {hasSections ? (
            instruction.sections.map((section, index) => {
              if (section.type === 'text') {
                return (
                  <div 
                    key={section.id || index} 
                    className="max-w-none text-gray-700 leading-relaxed text-base md:text-lg [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_p]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-mesored [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_a]:text-mesored [&_a]:underline"
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
                  className="max-w-none text-gray-700 leading-relaxed mb-10 text-base md:text-lg [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_p]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-mesored [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_a]:text-mesored [&_a]:underline"
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
        </div>
      </div>
    </div>
  );
};

export default InstructionDetail;
