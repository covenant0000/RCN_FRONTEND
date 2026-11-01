import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative inline-flex items-center h-8 w-15 shrink-0 cursor-pointer rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isDark
          ? 'bg-neutral-900 border border-neutral-700/80 shadow-inner'
          : 'bg-gray-200/90 border border-gray-300/80 shadow-inner'
      } ${className}`}
    >
      {/* Background ambient icons */}
      <span className="absolute inset-0 flex items-center justify-between px-2 text-xs pointer-events-none select-none">
        <Sun
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isDark ? 'opacity-35 text-gray-500 scale-90' : 'opacity-0 scale-75'
          }`}
        />
        <Moon
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isDark ? 'opacity-0 scale-75' : 'opacity-40 text-gray-500 scale-90'
          }`}
        />
      </span>

      {/* Sliding Knob Thumb */}
      <span
        className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ease-out ${
          isDark
            ? 'translate-x-7 bg-black text-accent border border-neutral-700'
            : 'translate-x-0 bg-white text-amber-500 border border-gray-200'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-accent/20 rotate-0 transition-transform duration-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-amber-500/20 rotate-0 transition-transform duration-300" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;

