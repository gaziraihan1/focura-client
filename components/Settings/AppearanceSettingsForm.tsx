'use client';

import { useState, useEffect } from 'react';
import { Monitor, Sun, Moon, Save, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact', description: 'Less spacing, more content on screen' },
  { value: 'default', label: 'Default', description: 'Balanced spacing for comfortable viewing' },
  { value: 'comfortable', label: 'Comfortable', description: 'More spacing, easier to scan' },
];

export function AppearanceSettingsForm() {
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState('default');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedDensity = localStorage.getItem('density') || 'default';
    const savedSidebar = localStorage.getItem('sidebarCollapsed') === 'true';
    setDensity(savedDensity);
    setSidebarCollapsed(savedSidebar);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('density', density);
      localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
      toast.success('Appearance settings saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Theme */}
      <div className="rounded-2xl border border-border bg-card p-6">
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
              theme === 'light'
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
              theme === 'dark'
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
      <div className="rounded-2xl border border-border bg-card p-6">
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
                onChange={(e) => setDensity(e.target.value)}
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

      {/* Sidebar */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
            <span className="text-lg">📐</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Sidebar</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure sidebar behavior
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sidebarCollapsed}
            onChange={(e) => setSidebarCollapsed(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
          />
          <div>
            <p className="text-sm font-medium">Collapsed by default</p>
            <p className="text-xs text-muted-foreground">
              Start with sidebar collapsed for more workspace
            </p>
          </div>
        </label>
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
