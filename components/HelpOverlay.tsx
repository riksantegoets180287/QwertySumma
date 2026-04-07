
import React, { useEffect } from 'react';
import { Task } from '../types';

interface HelpOverlayProps {
  onClose: () => void;
  currentTarget?: Task;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose, currentTarget }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1c3d]/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-t-8 border-[#e94b76]">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h2 className="text-2xl font-black text-[#1a1c3d] uppercase tracking-tight">Hulp nodig?</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-[#e94b76] text-3xl font-bold p-2 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          <section>
            <h3 className="text-xl font-black mb-3 text-[#e94b76] uppercase tracking-wide">Wat moet je doen?</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              Typ precies na wat je in het linker vak ziet. 
              Gebruik de <strong className="text-[#45408a]">Shift</strong> toets voor grote letters en tekens. 
              Kijk goed naar de tip hieronder!
            </p>
          </section>

          {currentTarget && (
            <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-bold mb-3 text-[#45408a]">De opdracht van nu:</h3>
              <div className="flex items-center gap-6">
                <div className="bg-white px-6 py-3 rounded-xl border-2 border-indigo-200 text-3xl font-mono font-black text-[#1a1c3d]">
                  '{currentTarget.character}'
                </div>
                <p className="italic text-slate-600 font-bold">{currentTarget.hint}</p>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl font-black mb-4 text-[#e94b76] uppercase tracking-wide">Handige toetsen:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>Shift + 1-9</span> <span className="font-bold text-[#45408a]">!@#$%^&*(</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>[ en ]</span> <span className="font-bold text-[#45408a]">[ ]</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>Shift + [ / ]</span> <span className="font-bold text-[#45408a]">{"{ }"}</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>; en Shift + ;</span> <span className="font-bold text-[#45408a]">; :</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>\ en Shift + \</span> <span className="font-bold text-[#45408a]">\ |</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>, en Shift + ,</span> <span className="font-bold text-[#45408a]">, &lt;</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>. en Shift + .</span> <span className="font-bold text-[#45408a]">. &gt;</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>/ en Shift + /</span> <span className="font-bold text-[#45408a]">/ ?</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>- en Shift + -</span> <span className="font-bold text-[#45408a]">- _</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-1"><span>= en Shift + =</span> <span className="font-bold text-[#45408a]">= +</span></div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-[#45408a] hover:bg-[#363270] text-white font-bold rounded-xl transition-all shadow-md transform hover:scale-105"
          >
            Ik snap het!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;
