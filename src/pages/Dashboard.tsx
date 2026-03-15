import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, BarChart3, Search, Zap, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { brands, getScoreColor, industryBenchmarks } from '../data';
import ESGScoreRing from '../components/ESGScoreRing';
import type { Page } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const avgScore = Math.round(brands.reduce((a, b) => a + b.esgScore, 0) / brands.length);
  const topBrands = [...brands].sort((a, b) => b.esgScore - a.esgScore).slice(0, 4);
  const trendData = brands[0].history;
  const allNews = brands.flatMap(b => b.newsHighlights.map(n => ({ ...n, brand: b.name }))).slice(0, 5);

  const stats = [
    { label: t('totalBrands'), value: brands.length, icon: Search, color: '#10b981' },
    { label: t('avgScore'), value: avgScore, icon: BarChart3, color: '#f59e0b' },
    { label: t('analysisRun'), value: 47, icon: TrendingUp, color: '#3b82f6' },
    { label: t('creditsLeft'), value: user?.plan === 'elite' ? '∞' : (user?.credits ?? 5), icon: Zap, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('welcomeBack')}{user ? `, ${user.name}` : ''} 👋</h1>
          <p className="text-sm text-obsidian-400 mt-1">{t('tagline')}</p>
        </div>
        <button
          onClick={() => onNavigate('analysis')}
          className="oz-btn px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 self-start"
        >
          <Search className="w-4 h-4" />
          {t('scanBrand')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="glass-card bento-item rounded-xl p-4" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white animate-counter">{s.value}</p>
            <p className="text-xs text-obsidian-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Rated */}
        <div className="glass-card bento-item rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-glow" />
            {t('topRated')}
          </h3>
          <div className="space-y-3">
            {topBrands.map((brand, i) => (
              <div key={brand.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-obsidian-700/30 transition-colors cursor-pointer" onClick={() => onNavigate('analysis')}>
                <span className="text-lg w-8 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}</span>
                <span className="text-xl">{brand.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{brand.name}</p>
                  <p className="text-[11px] text-obsidian-400">{brand.industry}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: getScoreColor(brand.esgScore) }}>{brand.esgScore}</span>
                  <div className="flex items-center gap-0.5 justify-end">
                    {brand.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-glow" /> :
                     brand.trend === 'down' ? <TrendingDown className="w-3 h-3 text-red-alert" /> :
                     <Minus className="w-3 h-3 text-obsidian-400" />}
                    <span className={`text-[10px] ${brand.trend === 'up' ? 'text-emerald-glow' : brand.trend === 'down' ? 'text-red-alert' : 'text-obsidian-400'}`}>
                      {brand.trendValue > 0 ? '+' : ''}{brand.trendValue}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Pulse */}
        <div className="glass-card bento-item rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-info" />
            {t('communityPulse')}
          </h3>
          <div className="space-y-3">
            {brands.map(brand => (
              <div key={brand.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-obsidian-400">{brand.logo} {brand.name}</span>
                  <span className="text-xs font-semibold" style={{ color: getScoreColor(brand.sentiment) }}>{brand.sentiment}%</span>
                </div>
                <div className="w-full h-2 bg-obsidian-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${brand.sentiment}%`,
                      background: `linear-gradient(90deg, ${getScoreColor(brand.sentiment)}80, ${getScoreColor(brand.sentiment)})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESG Score Ring */}
        <div className="glass-card bento-item rounded-xl p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-white mb-4">{t('avgScore')}</h3>
          <ESGScoreRing score={avgScore} size={140} strokeWidth={10} label="Average" />
          <div className="grid grid-cols-3 gap-4 mt-5 w-full">
            {[
              { label: t('environmental'), val: Math.round(brands.reduce((a, b) => a + b.environmentalScore, 0) / brands.length), color: '#10b981' },
              { label: t('social'), val: Math.round(brands.reduce((a, b) => a + b.socialScore, 0) / brands.length), color: '#3b82f6' },
              { label: t('governance'), val: Math.round(brands.reduce((a, b) => a + b.governanceScore, 0) / brands.length), color: '#8b5cf6' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.val}</p>
                <p className="text-[10px] text-obsidian-400">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ESG Trends */}
        <div className="glass-card bento-item rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{t('esgTrends')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="esgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#15151f', border: '1px solid #2a2a3e', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="esg" stroke="#10b981" fill="url(#esgGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="environmental" stroke="#34d399" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
              <Area type="monotone" dataKey="social" stroke="#3b82f6" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Benchmarks */}
        <div className="glass-card bento-item rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{t('industryBenchmarks')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={industryBenchmarks} layout="vertical">
              <XAxis type="number" tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="industry" tick={{ fill: '#5a5a7a', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#15151f', border: '1px solid #2a2a3e', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={14}>
                {industryBenchmarks.map((entry, i) => (
                  <Cell key={i} fill={getScoreColor(entry.avgScore)} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live News */}
      <div className="glass-card bento-item rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">{t('liveNewsFeed')}</h3>
        <div className="space-y-2">
          {allNews.map((news, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-obsidian-700/30 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                news.sentiment === 'positive' ? 'bg-emerald-glow' :
                news.sentiment === 'negative' ? 'bg-red-alert' : 'bg-gold-accent'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{news.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-obsidian-400">{news.brand}</span>
                  <span className="text-obsidian-500">•</span>
                  <span className="text-[10px] text-obsidian-400">{news.source}</span>
                  <span className="text-obsidian-500">•</span>
                  <span className="text-[10px] text-obsidian-400">{news.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
