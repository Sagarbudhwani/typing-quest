import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCcw, Home } from 'lucide-react';

export default function Results() {
  const { state } = useLocation();
  const wpm = state?.wpm || 0;
  const accuracy = state?.accuracy || 0;

  return (
    // CLEANED: Removed background, added flex centering
    <div className="flex flex-col items-center justify-center p-4 min-h-[90vh]">
      
      {/* Result Card: Kept bg-white/slate so text is readable on top of animation */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-white/80 dark:bg-slate-800/80 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-slate-200 dark:border-slate-700 text-center max-w-md w-full transition-colors"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Quest Complete</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl transition-colors">
            <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">{wpm}</div>
            <div className="text-slate-500 text-xs uppercase font-bold">WPM</div>
          </div>
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl transition-colors">
            <div className="text-4xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">{accuracy}%</div>
            <div className="text-slate-500 text-xs uppercase font-bold">Accuracy</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          
          <Link 
            to="/game" 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            <RefreshCcw className="w-5 h-5" />
            Play Again
          </Link>
        </div>
      </motion.div>
    </div>
  );
}