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
      className={`group relative inline-flex items-center h-8 w-16 shrink-0 cursor-pointer rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A84F] ${
        isDark
          ? 'bg-[#0D1527] border border-white/20 shadow-inner'
          : 'bg-[#FAF8F2] border border-[#14213D]/20 shadow-inner'
      } ${className}`}
    >
      {/* Both Sun and Moon icons clearly visible on the track */}
      <span className="w-full flex items-center justify-between px-1 text-xs pointer-events-none select-none">
        <Sun
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            !isDark
              ? 'text-[#D4A84F] opacity-100 scale-105'
              : 'text-gray-400 opacity-70 scale-95'
          }`}
        />
        <Moon
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isDark
              ? 'text-[#D4A84F] opacity-100 scale-105'
              : 'text-gray-400 opacity-70 scale-95'
          }`}
        />
      </span>

      {/* Sliding Knob with active icon in Warm Gold */}
      <span
        className={`absolute top-1 left-1 flex items-center justify-center w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ease-out ${
          isDark
            ? 'translate-x-8 bg-[#14213D] text-[#D4A84F] border border-[#D4A84F]/40'
            : 'translate-x-0 bg-white text-[#D4A84F] border border-[#D4A84F]/40'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[#D4A84F] fill-[#D4A84F]/20" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#D4A84F] fill-[#D4A84F]/20" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
