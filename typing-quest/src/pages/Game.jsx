import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, RotateCcw, Trophy, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import useTypingGame from '../hooks/useTypingGame';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import clsx from 'clsx'; 

export default function Game() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  
  const { 
    text, 
    timeLeft,
    elapsedTime,
    gameState, 
    userInput, 
    wpm,
    accuracy,
    timeOption,
    setTimeOption,
    difficulty,
    setDifficulty,
    resetGame, 
    handleKeyPress 
  } = useTypingGame();

  useEffect(() => {
    inputRef.current?.focus();
  }, [gameState, difficulty, timeOption]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (gameState === 'end') {
      const timer = setTimeout(() => {
        navigate('/results', { state: { wpm, accuracy } });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, navigate, wpm, accuracy]);

  const handleInput = (e) => {
    const value = e.target.value;
    const char = value.slice(-1); 

    if (char) {
      handleKeyPress({ key: char });
    }

    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Escape') {
      handleKeyPress(e);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-4 relative outline-none flex-1"
      onClick={focusInput}
    >
      <div className="absolute top-6 right-8 z-20">
        <ThemeToggle />
      </div>

      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 h-0 w-0"
        autoFocus
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        autoComplete="off" 
        autoCorrect="off"
        autoCapitalize="off"
      />

      <motion.div 
        className="mb-8 flex flex-col md:flex-row gap-6 bg-white/40 dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-md shadow-sm"
        animate={{ opacity: gameState === 'run' ? 0.5 : 1 }}
      >
        <div className="flex bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-1 transition-colors">
          {[15, 30, 60].map((t) => (
            <button
              key={t}
              onClick={(e) => { e.stopPropagation(); setTimeOption(t); }}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                timeOption === t 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {t}s
            </button>
          ))}
          <button
              onClick={(e) => { e.stopPropagation(); setTimeOption(0); }}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center",
                timeOption === 0 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <InfinityIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-1 transition-colors">
          {['easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              onClick={(e) => { e.stopPropagation(); setDifficulty(d); }}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                difficulty === d 
                  ? "bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-500/20" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center gap-12 mb-12 text-slate-500 dark:text-slate-300 font-mono text-xl transition-colors">
        <div className="flex items-center gap-3">
          <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className={timeLeft < 10 && timeOption !== 0 ? "text-red-500 dark:text-red-400" : ""}>
            {timeOption === 0 ? elapsedTime : timeLeft}s
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          <span>{wpm} WPM</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            resetGame();
            inputRef.current?.focus();
          }}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Restart"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="relative max-w-3xl w-full text-3xl md:text-4xl leading-relaxed font-mono tracking-wide break-words text-center cursor-text select-none">
        {text.split('').map((char, index) => {
          let color = "text-slate-400 dark:text-slate-600"; 
          
          if (index < userInput.length) {
            color = char === userInput[index] 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-red-500 bg-red-500/10"; 
          }

          const isCurrent = index === userInput.length;

          return (
            <span key={index} className={`relative transition-colors duration-100 ${color}`}>
              {isCurrent && (
                <motion.span
                  layoutId="cursor"
                  className="absolute -left-1 top-0 bottom-0 w-[2px] bg-blue-600 dark:bg-blue-400"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {char}
            </span>
          );
        })}
      </div>

      <p className="mt-12 text-slate-400 dark:text-slate-500 text-sm flex items-center gap-2 transition-colors">
        <Sparkles className="w-4 h-4" />
        {timeOption === 0 ? 'Zen Mode' : 'Race against time'}
      </p>
    </div>
  );
}