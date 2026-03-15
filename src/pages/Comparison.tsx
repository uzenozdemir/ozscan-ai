import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitCompare, Trophy, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { brands, getScoreColor } from '../data';
import ESGScoreRing from '../components/ESGScoreRing';

export default function Comparison() {
  const { t } = useTranslation();
  const [brandAId, setBrandAId] = useState(brands[0].id);
  const [brandBId, setBrandBId] = useState(brands[1].id);

  const brandA = brands.find(b => b.id === brandAId) || brands[0];
  const brandB = brands.find(b => b.id === brandBId) || brands[1];
  const winner = brandA.esgScore >= brandB.esgScore ? brandA : brandB;
  const loser = winner === brandA ? brandB : brandA;

  const radarData = [
    { metric: t('environmental'), A: brandA.environmentalScore, B: brandB.environmentalScore },
    { metric: t('social'), A: brandA.socialScore, B: brandB.socialScore },
    { metric: t('governance'), A: brandA.governanceScore, B: brandB.governanceScore },
    { metric: t('supplyChain'), A: brandA.supplyChainTransparency, B: brandB.supplyChainTransparency },
    { metric: t('carbonFootprint'), A: brandA.carbonFootprint, B: brandB.carbonFootprint },
    { metric: t('laborEthics'), A: brandA.laborEthics, B: brandB.laborEthics },
  ];

  const metrics = [
    { key: 'environmental', a: brandA.environmentalScore, b: brandB.environmentalScore },
    { key: 'social', a: brandA.socialScore, b: brandB.socialScore },
    { key: 'governance', a: brandA.governanceScore, b: brandB.governanceScore },
    { key: 'supplyChain', a: brandA.supplyChainTransparency, b: brandB.supplyChainTransparency },
    { key: 'carbonFootprint', a: brandA.carbonFootprint, b: brandB.carbonFootprint },
    { key: 'laborEthics', a: brandA.laborEthics, b: brandB.laborEthics },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-emerald-glow" />
          {t('compareBrands')}
        </h1>
        <p className="text-sm text-obsidian-400 mt-1">Side-by-side ESG comparison powered by OzScan AI</p>
      </div>

      {/* Brand Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <label className="text-xs text-obsidian-400 mb-2 block">{t('selectBrandA')}</label>
          <select
            value={brandAId}
            onChange={e => setBrandAId(e.target.value)}
            className="oz-input w-full py-2.5 px-3 rounded-lg text-sm text-white bg-obsidian-800"
          >
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.logo} {b.name}</option>
            ))}
          </select>
        </div>
        <div className="glass-card rounded-xl p-4">
          <label className="text-xs text-obsidian-400 mb-2 block">{t('selectBrandB')}</label>
          <select
            value={brandBId}
            onChange={e => setBrandBId(e.target.value)}
            className="oz-input w-full py-2.5 px-3 rounded-lg text-sm text-white bg-obsidian-800"
          >
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.logo} {b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Winner Banner */}
      {brandAId !== brandBId && (
        <div className="glass-card rounded-xl p-5 border border-emerald-glow/30 animate-scale-in">
          <div className="flex items-center justify-center gap-4">
            <Trophy className="w-8 h-8 text-gold-accent" />
            <div className="text-center">
              <p className="text-xs text-obsidian-400 uppercase tracking-wider">{t('winner')}</p>
              <p className="text-xl font-bold text-white mt-1">{winner.logo} {winner.name}</p>
              <p className="text-sm mt-1">
                <span style={{ color: getScoreColor(winner.esgScore) }} className="font-bold">{winner.esgScore}</span>
                <span className="text-obsidian-400"> vs </span>
                <span style={{ color: getScoreColor(loser.esgScore) }} className="font-bold">{loser.esgScore}</span>
                <span className="text-emerald-glow text-xs ml-2">
                  (+{winner.esgScore - loser.esgScore} pts)
                </span>
              </p>
            </div>
            <Trophy className="w-8 h-8 text-gold-accent" />
          </div>
        </div>
      )}

      {/* Score Rings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 flex flex-col items-center">
          <span className="text-2xl mb-2">{brandA.logo}</span>
          <ESGScoreRing score={brandA.esgScore} size={130} strokeWidth={10} label={brandA.name} />
          <div className="flex items-center gap-1 mt-2">
            {brandA.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-glow" /> : <TrendingDown className="w-3.5 h-3.5 text-red-alert" />}
            <span className={`text-xs ${brandA.trend === 'up' ? 'text-emerald-glow' : 'text-red-alert'}`}>
              {brandA.trendValue > 0 ? '+' : ''}{brandA.trendValue}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {brandA.certificates.map(c => (
              <span key={c} className="px-1.5 py-0.5 text-[9px] rounded-full bg-emerald-glow/10 text-emerald-bright">
                <Award className="w-2.5 h-2.5 inline" /> {c}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 flex flex-col items-center">
          <span className="text-2xl mb-2">{brandB.logo}</span>
          <ESGScoreRing score={brandB.esgScore} size={130} strokeWidth={10} label={brandB.name} />
          <div className="flex items-center gap-1 mt-2">
            {brandB.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-glow" /> : <TrendingDown className="w-3.5 h-3.5 text-red-alert" />}
            <span className={`text-xs ${brandB.trend === 'up' ? 'text-emerald-glow' : 'text-red-alert'}`}>
              {brandB.trendValue > 0 ? '+' : ''}{brandB.trendValue}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {brandB.certificates.map(c => (
              <span key={c} className="px-1.5 py-0.5 text-[9px] rounded-full bg-emerald-glow/10 text-emerald-bright">
                <Award className="w-2.5 h-2.5 inline" /> {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">{t('headToHead')}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#2a2a3e" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#5a5a7a', fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name={brandA.name} dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            <Radar name={brandB.name} dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#5a5a7a' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Bars */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Metric-by-Metric Comparison</h3>
        <div className="space-y-4">
          {metrics.map(m => {
            const aWins = m.a > m.b;
            return (
              <div key={m.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold" style={{ color: getScoreColor(m.a) }}>{m.a}</span>
                  <span className="text-xs text-obsidian-400">{t(m.key)}</span>
                  <span className="text-xs font-bold" style={{ color: getScoreColor(m.b) }}>{m.b}</span>
                </div>
                <div className="flex gap-1 h-3">
                  <div className="flex-1 flex justify-end">
                    <div
                      className="h-full rounded-l-full transition-all duration-1000"
                      style={{
                        width: `${m.a}%`,
                        backgroundColor: aWins ? '#10b981' : '#3d3d5c',
                        opacity: aWins ? 1 : 0.5,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-full rounded-r-full transition-all duration-1000"
                      style={{
                        width: `${m.b}%`,
                        backgroundColor: !aWins ? '#3b82f6' : '#3d3d5c',
                        opacity: !aWins ? 1 : 0.5,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 pt-3 border-t border-obsidian-600/30">
          <div className="flex items-center gap-2 text-xs text-obsidian-400">
            <div className="w-3 h-3 rounded-full bg-emerald-glow" />
            {brandA.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-obsidian-400">
            <div className="w-3 h-3 rounded-full bg-blue-info" />
            {brandB.name}
          </div>
        </div>
      </div>
    </div>
  );
}
