import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Keyboard, Zap, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-2rem)]">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-slate-900 dark:text-white">
          <Keyboard className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          <span>TypingQuest</span>
        </div>
        <ThemeToggle />
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              The ultimate tool to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                master your keyboard
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Compete against time, track your accuracy, and improve your WPM with our modern, distraction-free typing engine.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/game" 
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
            >
              Start Typing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left"
          >
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />}
              title="Lightning Fast"
              desc="Zero latency input engine designed for speed typists."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />}
              title="Real-time Stats"
              desc="Track WPM, accuracy, and error rates as you type."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-purple-500 dark:text-purple-400" />}
              title="Track Progress"
              desc="Analyze your typing habits and improve steadily over time."
            />
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} TypingQuest. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md transition-colors hover:bg-white/60 dark:hover:bg-slate-800/60 shadow-sm">
      <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-900/50 w-fit rounded-xl">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}