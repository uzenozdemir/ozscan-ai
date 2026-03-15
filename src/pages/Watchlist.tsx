import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Plus, Bell, BellOff, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { brands, getScoreColor, watchlistItems as initialWatchlist } from '../data';
import type { WatchlistItem } from '../types';

export default function Watchlist() {
  const { t } = useTranslation();
  const [items, setItems] = useState<WatchlistItem[]>(initialWatchlist);
  const [showAdd, setShowAdd] = useState(false);

  const toggleAlert = (brandId: string) => {
    setItems(prev => prev.map(item =>
      item.brandId === brandId ? { ...item, emailAlerts: !item.emailAlerts } : item
    ));
  };

  const removeItem = (brandId: string) => {
    setItems(prev => prev.filter(item => item.brandId !== brandId));
  };

  const addBrand = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (!brand || items.find(i => i.brandId === brandId)) return;
    setItems(prev => [...prev, {
      brandId: brand.id,
      brandName: brand.name,
      addedDate: new Date().toISOString().split('T')[0],
      alertThreshold: 5,
      emailAlerts: true,
      lastScore: brand.esgScore - 2,
      currentScore: brand.esgScore,
    }]);
    setShowAdd(false);
  };

  const availableBrands = brands.filter(b => !items.find(i => i.brandId === b.id));

  const stats = {
    total: items.length,
    alertsOn: items.filter(i => i.emailAlerts).length,
    avgScore: items.length > 0 ? Math.round(items.reduce((a, b) => a + b.currentScore, 0) / items.length) : 0,
    improved: items.filter(i => i.currentScore > i.lastScore).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-emerald-glow" />
            {t('myWatchlist')}
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">Track brands and get alerts when their ESG scores change</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="oz-btn px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          {t('addBrand')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Watching', value: stats.total, color: '#10b981' },
          { label: 'Alerts Active', value: stats.alertsOn, color: '#3b82f6' },
          { label: 'Avg Score', value: stats.avgScore, color: '#f59e0b' },
          { label: 'Improved', value: stats.improved, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-obsidian-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add Brand Dropdown */}
      {showAdd && availableBrands.length > 0 && (
        <div className="glass-card rounded-xl p-4 animate-scale-in">
          <h3 className="text-sm font-semibold text-white mb-3">{t('addBrand')}</h3>
          <div className="flex flex-wrap gap-2">
            {availableBrands.map(b => (
              <button
                key={b.id}
                onClick={() => addBrand(b.id)}
                className="px-4 py-2 rounded-lg text-sm bg-obsidian-700 text-obsidian-300 border border-obsidian-600 hover:border-emerald-glow/30 hover:text-white transition-all"
              >
                {b.logo} {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Items */}
      <div className="space-y-3">
        {items.map(item => {
          const brand = brands.find(b => b.id === item.brandId);
          const change = item.currentScore - item.lastScore;
          return (
            <div key={item.brandId} className="glass-card glass-card-hover rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{brand?.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{item.brandName}</h3>
                    <span className="text-[10px] text-obsidian-500">{brand?.industry}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-obsidian-400">Added: {item.addedDate}</span>
                    <span className="text-obsidian-600">•</span>
                    <span className="text-xs text-obsidian-400">{t('threshold')}: ±{item.alertThreshold}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold" style={{ color: getScoreColor(item.currentScore) }}>{item.currentScore}</span>
                  <div className="flex items-center gap-0.5 justify-center">
                    {change > 0 ? <TrendingUp className="w-3 h-3 text-emerald-glow" /> :
                     change < 0 ? <TrendingDown className="w-3 h-3 text-red-alert" /> :
                     <Minus className="w-3 h-3 text-obsidian-400" />}
                    <span className={`text-[10px] font-semibold ${change > 0 ? 'text-emerald-glow' : change < 0 ? 'text-red-alert' : 'text-obsidian-400'}`}>
                      {change > 0 ? '+' : ''}{change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(item.brandId)}
                    className={`p-2 rounded-lg transition-all ${item.emailAlerts ? 'bg-emerald-glow/10 text-emerald-bright' : 'bg-obsidian-700 text-obsidian-400'}`}
                    title={t('emailAlerts')}
                  >
                    {item.emailAlerts ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => removeItem(item.brandId)}
                    className="p-2 rounded-lg bg-obsidian-700 text-obsidian-400 hover:text-red-alert hover:bg-red-alert/10 transition-all"
                    title={t('remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="glass-card rounded-xl p-10 text-center">
          <Eye className="w-12 h-12 text-obsidian-500 mx-auto mb-3" />
          <p className="text-obsidian-400">{t('noData')}</p>
          <p className="text-xs text-obsidian-500 mt-1">Add brands to your watchlist to track their ESG scores</p>
        </div>
      )}
    </div>
  );
}
