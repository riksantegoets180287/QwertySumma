
import React from 'react';
import { Student, SessionSummary, TaskAttempt } from '../types';
import { exportResultsToPdf } from '../pdf/exportPdf';

interface ResultsScreenProps {
  student: Student;
  summary: SessionSummary;
  attempts: TaskAttempt[];
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ student, summary, attempts, onReset }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 pb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center shrink-0 border-t-8 border-[#e94b76]">
          <h1 className="text-4xl font-black text-[#e94b76] mb-2 uppercase">Goed gedaan!</h1>
          <p className="text-xl text-slate-600 mb-8">{student.name}, je bent helemaal klaar.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <span className="block text-3xl font-black text-[#45408a]">{summary.correctOnFirstTryCount}/50</span>
              <span className="text-xs uppercase text-indigo-400 font-bold tracking-widest">Meteen goed</span>
            </div>
            <div className="p-5 bg-pink-50 rounded-2xl border border-pink-100">
              <span className="block text-3xl font-black text-[#e94b76]">{summary.totalErrors}</span>
              <span className="text-xs uppercase text-pink-400 font-bold tracking-widest">Foutjes</span>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-3xl font-black text-[#1a1c3d]">{summary.totalSkipped}</span>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-widest">Skip</span>
            </div>
            <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
              <span className="block text-3xl font-black text-green-600">
                {Math.round((summary.correctOnFirstTryCount / 50) * 100)}%
              </span>
              <span className="text-xs uppercase text-green-400 font-bold tracking-widest">Je score</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => exportResultsToPdf(student, summary, attempts)}
              className="px-8 py-3 bg-[#45408a] hover:bg-[#363270] text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              Resultaat opslaan (PDF)
            </button>
            <button
              onClick={onReset}
              className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-[#1a1c3d] font-bold rounded-xl transition-all"
            >
              Opnieuw / Stoppen
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100">
          <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-black text-[#1a1c3d] uppercase text-sm tracking-widest">Jouw resultaten per toets</h3>
            <span className="text-xs font-bold text-[#e94b76]">Nummer: {student.studentNumber}</span>
          </div>
          <div className="p-5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-[#45408a] text-xs uppercase tracking-tighter">
                  <th className="py-3 px-4">Nr</th>
                  <th className="py-3 px-4">Teken</th>
                  <th className="py-3 px-4">1e keer?</th>
                  <th className="py-3 px-4">Beurten</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attempts.map((att) => (
                  <tr key={att.index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-400 font-mono text-sm">{att.index}</td>
                    <td className="py-4 px-4 font-mono font-black text-xl text-[#1a1c3d]">'{att.target}'</td>
                    <td className="py-4 px-4">
                      {att.firstTryCorrect ? (
                        <span className="text-green-600 font-bold text-sm">JA</span>
                      ) : (
                        <span className="text-[#e94b76] font-bold text-sm">NEE</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-600">{att.attempts}</td>
                    <td className="py-4 px-4 text-xs font-bold uppercase tracking-tight">
                      {att.skipped ? (
                        <span className="text-slate-400">Overgeslagen</span>
                      ) : (
                        att.attempts > 1 ? (
                          <span className="text-[#e94b76]">{att.errors} Foutjes</span>
                        ) : (
                          <span className="text-green-600">Perfect!</span>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
