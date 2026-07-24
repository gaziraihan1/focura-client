'use client';

import { useState, useEffect } from 'react';
import { Monitor, Sun, Moon, Save, Loader2, PanelLeftClose, Sparkles, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact', description: 'Less spacing, more content on screen' },
  { value: 'default', label: 'Default', description: 'Balanced spacing for comfortable viewing' },
  { value: 'comfortable', label: 'Comfortable', description: 'More spacing, easier to scan' },
];

export function AppearanceSettingsForm() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [density, setDensity] = useState('default');
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedDensity = localStorage.getItem('density') || 'default';
    setDensity(savedDensity);
    // Apply density class to document
    document.documentElement.setAttribute('data-density', savedDensity);
  }, []);

  const handleDensityChange = (value: string) => {
    setDensity(value);
    document.documentElement.setAttribute('data-density', value);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('density', density);
      document.documentElement.setAttribute('data-density', density);
      toast.success('Appearance settings saved');
    } finally {
      setSaving(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-3 w-40 rounded bg-muted" />
              </div>
            </div>
            <div className="h-20 rounded-xl bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Theme */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
            <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Theme</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred color scheme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              resolvedTheme === 'light'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <Sun className="w-6 h-6" />
            <span className="text-sm font-medium">Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              resolvedTheme === 'dark'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-sm font-medium">Dark</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              theme === 'system'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <Monitor className="w-6 h-6" />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </div>

      {/* Density */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
            <span className="text-lg">📏</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Density</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control spacing and content density
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {DENSITY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                density === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <input
                type="radio"
                name="density"
                value={option.value}
                checked={density === option.value}
                onChange={(e) => handleDensityChange(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <div>
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sidebar - Coming Soon */}
      <div className="rounded-2xl border border-border bg-card p-4 relative overflow-hidden">
        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
            <Sparkles className="w-3 h-3" />
            Coming Soon
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
            <PanelLeftClose className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Sidebar Customization</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalize your sidebar layout and behavior
            </p>
          </div>
        </div>

        {/* Preview of upcoming features */}
        <div className="space-y-3 opacity-60">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collapsed by default</p>
              <p className="text-xs text-muted-foreground/70">Start with sidebar collapsed for more workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pin favorite pages</p>
              <p className="text-xs text-muted-foreground/70">Quick access to your most-used pages</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Custom sections</p>
              <p className="text-xs text-muted-foreground/70">Organize sidebar with custom groups and dividers</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-violet-500/5 to-pink-500/5 border border-violet-500/10">
          <p className="text-sm text-muted-foreground text-center">
            Sidebar customization is under development. Stay tuned for powerful layout options!
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
