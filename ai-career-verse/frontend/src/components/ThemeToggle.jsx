import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-all duration-500 group overflow-hidden"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1E2738, #2D3748)'
          : 'linear-gradient(135deg, #E0E7FF, #BFDBFE)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
          theme === 'dark'
            ? 'left-0.5 bg-charcoal-card'
            : 'left-[calc(100%-1.625rem)] bg-white'
        }`}
      >
        {theme === 'dark' ? (
          <Moon size={13} className="text-aura-purple" />
        ) : (
          <Sun size={13} className="text-amber-500" />
        )}
      </div>
    </button>
  );
}
