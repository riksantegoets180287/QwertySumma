
import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Student, GameState, Task, TaskAttempt, SessionSummary } from './types';
import { generateTasks } from './game/generator';
import Login from './components/Login';
import HelpOverlay from './components/HelpOverlay';
import ResultsScreen from './components/ResultsScreen';

const TOTAL_TASKS = 50;

const WelcomePopup: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1a1c3d]/80 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 border-t-8 border-[#e94b76]">
      <div className="w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-[#e94b76] bg-slate-50 shadow-inner flex items-center justify-center">
        <span className="text-8xl select-none" role="img" aria-label="Keyboard">
          ⌨️
        </span>
      </div>
      <h2 className="text-3xl font-bold text-[#1a1c3d] mb-4">Hoi! Welkom</h2>
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        Welkom bij het toetsenbord oefenspel. Je gaat oefenen om letters, tekens en cijfers op jouw toetsenbord te typen. Succes!
      </p>
      <button
        onClick={onConfirm}
        className="w-full py-4 bg-[#45408a] hover:bg-[#363270] text-white font-bold text-xl rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
      >
        Start de oefening
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  // Global State
  const [student, setStudent] = useState<Student | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.LOGIN);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<TaskAttempt[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  
  // UI State
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'neutral' }>({ text: '', type: 'neutral' });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Game
  const startSession = (s: Student) => {
    const newTasks = generateTasks();
    setStudent(s);
    setTasks(newTasks);
    setCurrentIndex(0);
    setAttempts([]);
    setUserInput('');
    setFeedback({ text: 'Typ het teken na om te starten.', type: 'neutral' });
    setGameState(GameState.PLAYING);
    setShowWelcome(true);
    setSummary({
      startTimestampISO: new Date().toISOString(),
      endTimestampISO: '',
      totalErrors: 0,
      totalSkipped: 0,
      correctOnFirstTryCount: 0,
      totalAttempts: 0
    });
  };

  const handleLogout = () => {
    setStudent(null);
    setGameState(GameState.LOGIN);
    setTasks([]);
    setAttempts([]);
    setShowWelcome(false);
  };

  const currentTaskAttempt = useRef<{
    attempts: number;
    errors: number;
    history: string[];
    isFirstTry: boolean;
  }>({ attempts: 0, errors: 0, history: [], isFirstTry: true });

  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e94b76', '#45408a', '#1a1c3d']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e94b76', '#45408a', '#1a1c3d']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const nextTask = useCallback((skipped = false) => {
    const target = tasks[currentIndex].character;
    const finalAttempt: TaskAttempt = {
      index: currentIndex + 1,
      target: target,
      firstTryCorrect: skipped ? false : currentTaskAttempt.current.isFirstTry,
      attempts: currentTaskAttempt.current.attempts,
      errors: currentTaskAttempt.current.errors,
      skipped: skipped,
      typedHistory: currentTaskAttempt.current.history.slice(-3)
    };

    setAttempts(prev => [...prev, finalAttempt]);
    
    // Update summary counters
    setSummary(prev => {
      if (!prev) return null;
      return {
        ...prev,
        totalErrors: prev.totalErrors + currentTaskAttempt.current.errors,
        totalSkipped: prev.totalSkipped + (skipped ? 1 : 0),
        correctOnFirstTryCount: prev.correctOnFirstTryCount + (finalAttempt.firstTryCorrect && !skipped ? 1 : 0),
        totalAttempts: prev.totalAttempts + currentTaskAttempt.current.attempts
      };
    });

    // Reset attempt tracker
    currentTaskAttempt.current = { attempts: 0, errors: 0, history: [], isFirstTry: true };

    if (currentIndex < TOTAL_TASKS - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setFeedback({ text: 'Goed gedaan! Op naar de volgende.', type: 'neutral' });
      setIsProcessing(false);
    } else {
      // Game End
      setSummary(prev => {
        if (!prev) return null;
        return { ...prev, endTimestampISO: new Date().toISOString() };
      });
      setGameState(GameState.RESULTS);
    }
  }, [currentIndex, tasks]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing || showWelcome) return;
    const val = e.target.value;
    if (!val) return;

    setUserInput(val);
    const char = val.slice(-1);
    const target = tasks[currentIndex].character;

    currentTaskAttempt.current.attempts++;
    currentTaskAttempt.current.history.push(char);

    if (char === target) {
      setFeedback({ text: 'Heel goed!', type: 'success' });
      setIsProcessing(true);
      triggerConfetti();
      setTimeout(() => {
        nextTask(false);
      }, 1000); 
    } else {
      setFeedback({ text: 'Niet erg, probeer het nog een keer.', type: 'error' });
      currentTaskAttempt.current.errors++;
      currentTaskAttempt.current.isFirstTry = false;
      setIsProcessing(true);
      setTimeout(() => {
        setUserInput('');
        setIsProcessing(false);
        inputRef.current?.focus();
      }, 400);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING && !showWelcome && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentIndex, isProcessing, showWelcome]);

  if (gameState === GameState.LOGIN) {
    return <Login onStart={startSession} />;
  }

  if (gameState === GameState.RESULTS && student && summary) {
    return (
      <ResultsScreen 
        student={student} 
        summary={summary} 
        attempts={attempts} 
        onReset={handleLogout} 
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 select-none overflow-hidden" onKeyDown={handleKeyDown}>
      {/* Welcome Popup */}
      {showWelcome && <WelcomePopup onConfirm={() => setShowWelcome(false)} />}

      {/* Header */}
      <header className="h-16 bg-[#1a1c3d] px-6 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Type Trainer</h1>
          <div className="h-6 w-px bg-white/20" />
          <p className="text-white/80 font-medium">
            {student?.name} — <span className="text-white/60">{student?.studentNumber}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-4 py-2 bg-[#45408a] text-white font-bold rounded-lg hover:bg-[#363270] transition-colors shadow-sm"
          >
            Hulp nodig?
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            Stoppen
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12 relative">
        
        {/* Progress Bar */}
        <div className="absolute top-8 w-full max-w-2xl px-8">
          <div className="flex justify-between text-xs font-bold text-[#1a1c3d] mb-2 uppercase tracking-widest">
            <span>Voortgang</span>
            <span>{currentIndex + 1} / {TOTAL_TASKS}</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-[#e94b76] transition-all duration-500 shadow-lg"
              style={{ width: `${((currentIndex + 1) / TOTAL_TASKS) * 100}%` }}
            />
          </div>
        </div>

        {/* Typing Area */}
        <div className="flex items-center gap-12">
          {/* Target Card */}
          <div className="flex flex-col items-center">
             <div className="text-sm font-bold text-[#e94b76] mb-3 uppercase tracking-widest">Kijk hier</div>
             <div className="w-64 h-64 bg-white rounded-3xl shadow-xl border-4 border-slate-100 flex items-center justify-center">
                <span className="text-9xl font-mono font-bold text-[#1a1c3d]">
                  {tasks[currentIndex]?.character}
                </span>
             </div>
          </div>

          <div className="text-4xl text-slate-300 font-light">→</div>

          {/* Input Card */}
          <div className="flex flex-col items-center">
             <div className="text-sm font-bold text-[#e94b76] mb-3 uppercase tracking-widest">Typ hier</div>
             <div className={`w-64 h-64 bg-white rounded-3xl shadow-xl border-4 transition-colors flex items-center justify-center relative ${
               feedback.type === 'success' ? 'border-green-400 bg-green-50' : 
               feedback.type === 'error' ? 'border-[#e94b76] bg-red-50' : 'border-slate-100'
             }`}>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={1}
                  value={userInput}
                  onChange={handleInput}
                  disabled={isProcessing || showWelcome}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full bg-transparent text-center text-9xl font-mono font-bold text-[#1a1c3d] focus:outline-none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                
                {/* Caps Lock Indicator */}
                {capsLockActive && (
                  <div className="absolute bottom-4 bg-[#e94b76] text-white text-[10px] px-2 py-1 rounded font-bold uppercase animate-pulse">
                    Grote letters staan aan!
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Feedback and Control Area */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
           <div className={`text-xl font-bold px-8 py-3 rounded-full shadow-sm transition-all text-center min-h-[60px] flex items-center ${
             feedback.type === 'success' ? 'text-white bg-green-500' : 
             feedback.type === 'error' ? 'text-white bg-[#e94b76]' : 'text-[#1a1c3d] bg-slate-200'
           }`}>
             {feedback.text}
           </div>

           <button
             onClick={() => nextTask(true)}
             className="text-slate-400 hover:text-[#e94b76] font-bold transition-colors underline underline-offset-4"
           >
             Vraag overslaan
           </button>
        </div>
      </main>

      {/* Overlays */}
      {isHelpOpen && (
        <HelpOverlay 
          onClose={() => setIsHelpOpen(false)} 
          currentTarget={tasks[currentIndex]} 
        />
      )}
    </div>
  );
};

export default App;
