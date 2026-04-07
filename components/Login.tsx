
import React, { useState } from 'react';
import { Student } from '../types';

interface LoginProps {
  onStart: (student: Student) => void;
}

const Login: React.FC<LoginProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && studentNumber.trim()) {
      onStart({ name, studentNumber });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a1c3d]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-[#e94b76]">
        <h1 className="text-4xl font-black mb-2 text-center text-[#e94b76] uppercase tracking-tighter">Type Trainer</h1>
        <p className="text-gray-500 mb-8 text-center font-medium">Hoi! Typ je naam en je leerlingnummer.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1a1c3d] uppercase tracking-wide mb-2">Je naam</label>
            <input
              type="text"
              required
              className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-[#e94b76]/20 focus:border-[#e94b76] focus:outline-none transition-all font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hoe heet je?"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1a1c3d] uppercase tracking-wide mb-2">Leerlingnummer</label>
            <input
              type="text"
              required
              className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-[#e94b76]/20 focus:border-[#e94b76] focus:outline-none transition-all font-medium"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              placeholder="Typ hier je leerlingnummer..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#45408a] hover:bg-[#363270] text-white font-bold py-4 rounded-2xl transition-all shadow-lg transform hover:scale-105 active:scale-95 text-lg"
          >
            Start de training
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
