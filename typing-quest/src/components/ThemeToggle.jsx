import { Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full transition-all duration-300 
        hover:bg-slate-200 dark:hover:bg-slate-800 
        text-slate-700 dark:text-blue-400
        hover:scale-110 active:scale-95"
      title="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );
}