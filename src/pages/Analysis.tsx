import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Search, Zap, Shield, Loader2, AlertTriangle, Award,
  CheckCircle2, TrendingUp, TrendingDown, Leaf, Users, Building2
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { brands, getScoreColor, getScoreLabel } from '../data';
import ESGScoreRing from '../components/ESGScoreRing';
import type { Brand, AnalysisResult } from '../types';

function generateAnalysis(brand: Brand): AnalysisResult {
  return {
    brandName: brand.name,
    overallScore: brand.esgScore,
    breakdown: {
      environmental: brand.environmentalScore,
      social: brand.socialScore,
      governance: brand.governanceScore,
      supplyChain: brand.supplyChainTransparency,
      carbonFootprint: brand.carbonFootprint,
      laborEthics: brand.laborEthics,
    },
    insights: [
      `${brand.name} shows ${brand.trend === 'up' ? 'improving' : brand.trend === 'down' ? 'declining' : 'stable'} ESG performance over the past 6 months.`,
      `Supply chain transparency score of ${brand.supplyChainTransparency}/100 ${brand.supplyChainTransparency > 60 ? 'exceeds' : 'falls below'} industry average.`,
      `Carbon footprint rating of ${brand.carbonFootprint}/100 indicates ${brand.carbonFootprint > 60 ? 'above-average' : 'below-average'} environmental stewardship.`,
      `Community sentiment stands at ${brand.sentiment}%, reflecting ${brand.sentiment > 70 ? 'strong public trust' : 'room for improvement in public perception'}.`,
    ],
    risks: brand.esgScore < 50
      ? ['High supply chain opacity risk', 'Potential labor rights violations', 'Excessive carbon emissions', 'Limited third-party auditing']
      : brand.esgScore < 70
        ? ['Moderate supply chain concerns', 'Carbon reduction targets not fully met', 'Limited certifications coverage']
        : ['Minor reporting gaps', 'Some regional compliance variations'],
    certifications: brand.certificates,
    recommendation: brand.esgScore >= 80
      ? 'This brand demonstrates industry-leading sustainability practices. Recommended for ESG-conscious consumers.'
      : brand.esgScore >= 60
        ? 'This brand shows moderate sustainability efforts with room for improvement. Monitor ongoing initiatives.'
        : 'Exercise caution. This brand has significant sustainability gaps that require attention.',
  };
}

export default function Analysis() {
  const { t } = useTranslation();
  const { useCredit, user } = useAuth();
  const [query, setQuery] = useState('');
  const [scanType, setScanType] = useState<'quick' | 'deep'>('quick');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [creditError, setCreditError] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return brands.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleScan = (brand: Brand) => {
    if (!useCredit()) {
      setCreditError(true);
      setTimeout(() => setCreditError(false), 3000);
      return;
    }
    setSelectedBrand(brand);
    setScanning(true);
    setResult(null);
    setShowDropdown(false);
    setQuery(brand.name);
    const delay = scanType === 'deep' ? 3000 : 1500;
    setTimeout(() => {
      setResult(generateAnalysis(brand));
      setScanning(false);
    }, delay);
  };

  const radarData = result ? [
    { metric: t('environmental'), value: result.breakdown.environmental },
    { metric: t('social'), value: result.breakdown.social },
    { metric: t('governance'), value: result.breakdown.governance },
    { metric: t('supplyChain'), value: result.breakdown.supplyChain },
    { metric: t('carbonFootprint'), value: result.breakdown.carbonFootprint },
    { metric: t('laborEthics'), value: result.breakdown.laborEthics },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-emerald-glow" />
          {t('analysis')}
        </h1>
        <p className="text-sm text-obsidian-400 mt-1">Powered by OzScan AI Deep Analysis Engine</p>
      </div>

      {/* Search & Controls */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder={t('searchPlaceholder')}
              className="oz-input w-full pl-10 pr-4 py-3 rounded-lg text-sm text-white placeholder-obsidian-500"
            />
            {showDropdown && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-obsidian-700 border border-obsidian-600 rounded-lg shadow-xl z-20 overflow-hidden animate-scale-in">
                {filtered.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => handleScan(brand)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-obsidian-600/50 transition-colors"
                  >
                    <span className="text-lg">{brand.logo}</span>
                    <span className="font-medium">{brand.name}</span>
                    <span className="text-xs text-obsidian-400 ml-auto">{brand.industry}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setScanType('quick')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scanType === 'quick' ? 'bg-emerald-glow/20 text-emerald-bright border border-emerald-glow/30' : 'bg-obsidian-700 text-obsidian-400 border border-obsidian-600'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              {t('quickScan')}
            </button>
            <button
              onClick={() => setScanType('deep')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scanType === 'deep' ? 'bg-blue-info/20 text-blue-400 border border-blue-info/30' : 'bg-obsidian-700 text-obsidian-400 border border-obsidian-600'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-1" />
              {t('deepScan')}
            </button>
          </div>
        </div>

        {/* Quick brand buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {brands.map(b => (
            <button
              key={b.id}
              onClick={() => handleScan(b)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-obsidian-700/50 text-obsidian-400 border border-obsidian-600/50 hover:border-emerald-glow/30 hover:text-white transition-all"
            >
              {b.logo} {b.name}
            </button>
          ))}
        </div>

        {creditError && (
          <div className="mt-3 p-3 rounded-lg bg-red-alert/10 border border-red-alert/30 text-red-400 text-sm animate-scale-in">
            ⚠️ No credits remaining. Please upgrade your plan to continue scanning.
          </div>
        )}

        {/* Credits info */}
        <div className="mt-3 flex items-center gap-2 text-xs text-obsidian-400">
          <Zap className="w-3 h-3 text-emerald-glow" />
          <span>{t('credits')}: {user?.plan === 'elite' ? '∞' : (user?.credits ?? 5)} remaining</span>
          <span className="text-obsidian-600">•</span>
          <span>{scanType === 'deep' ? '1 credit per scan' : '1 credit per scan'}</span>
        </div>
      </div>

      {/* Scanning Animation */}
      {scanning && (
        <div className="glass-card rounded-xl p-10 text-center animate-scale-in">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-obsidian-600 border-t-emerald-glow animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-8 h-8 text-emerald-glow" />
            </div>
          </div>
          <p className="text-white font-medium mt-4">{t('scanning')}</p>
          <p className="text-xs text-obsidian-400 mt-1 flex items-center justify-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            {scanType === 'deep' ? 'Running deep ESG analysis with supply chain verification...' : 'Running quick ESG assessment...'}
          </p>
          <div className="mt-4 w-64 mx-auto h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-glow to-emerald-bright rounded-full shimmer-bg" style={{ width: '70%' }} />
          </div>
        </div>
      )}

      {/* Results */}
      {result && !scanning && (
        <div className="space-y-4 animate-fade-in">
          {/* Score Header */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ESGScoreRing score={result.overallScore} size={160} strokeWidth={12} label={getScoreLabel(result.overallScore)} />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-3xl">{selectedBrand?.logo}</span>
                  <h2 className="text-2xl font-bold text-white">{result.brandName}</h2>
                  {selectedBrand?.trend === 'up' ? <TrendingUp className="w-5 h-5 text-emerald-glow" /> : selectedBrand?.trend === 'down' ? <TrendingDown className="w-5 h-5 text-red-alert" /> : null}
                </div>
                <p className="text-sm text-obsidian-400 mt-1">{selectedBrand?.industry} • {selectedBrand?.country}</p>
                <p className="text-sm mt-3" style={{ color: getScoreColor(result.overallScore) }}>
                  {getScoreLabel(result.overallScore)} — {result.overallScore}/100
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.certifications.length > 0 ? result.certifications.map(c => (
                    <span key={c} className="px-2 py-1 text-[10px] rounded-full bg-emerald-glow/10 text-emerald-bright border border-emerald-glow/20">
                      <Award className="w-3 h-3 inline mr-0.5" />{c}
                    </span>
                  )) : (
                    <span className="px-2 py-1 text-[10px] rounded-full bg-red-alert/10 text-red-400 border border-red-alert/20">
                      No certifications
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Radar */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">ESG Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2a3e" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#5a5a7a', fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    dataKey="value"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Breakdown */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">{t('overallScore')} Breakdown</h3>
              <div className="space-y-3">
                {[
                  { key: 'environmental', icon: Leaf, value: result.breakdown.environmental },
                  { key: 'social', icon: Users, value: result.breakdown.social },
                  { key: 'governance', icon: Building2, value: result.breakdown.governance },
                  { key: 'supplyChain', icon: Shield, value: result.breakdown.supplyChain },
                  { key: 'carbonFootprint', icon: Leaf, value: result.breakdown.carbonFootprint },
                  { key: 'laborEthics', icon: Users, value: result.breakdown.laborEthics },
                ].map(item => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-obsidian-400 flex items-center gap-1.5">
                        <item.icon className="w-3 h-3" style={{ color: getScoreColor(item.value) }} />
                        {t(item.key)}
                      </span>
                      <span className="text-xs font-bold" style={{ color: getScoreColor(item.value) }}>{item.value}/100</span>
                    </div>
                    <div className="w-full h-2 bg-obsidian-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.value}%`, backgroundColor: getScoreColor(item.value) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights & Risks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-glow" />
                {t('aiInsights')}
              </h3>
              <div className="space-y-2">
                {result.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-obsidian-800/30">
                    <span className="text-emerald-glow text-xs mt-0.5">●</span>
                    <p className="text-xs text-obsidian-300 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gold-accent" />
                {t('riskFactors')}
              </h3>
              <div className="space-y-2">
                {result.risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-obsidian-800/30">
                    <span className="text-gold-accent text-xs mt-0.5">▲</span>
                    <p className="text-xs text-obsidian-300 leading-relaxed">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="glass-card rounded-xl p-5 border-l-4" style={{ borderLeftColor: getScoreColor(result.overallScore) }}>
            <h3 className="text-sm font-semibold text-white mb-2">🎯 {t('recommendation')}</h3>
            <p className="text-sm text-obsidian-300 leading-relaxed">{result.recommendation}</p>
          </div>

          {/* News */}
          {selectedBrand && selectedBrand.newsHighlights.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">📰 Recent News Coverage</h3>
              <div className="space-y-2">
                {selectedBrand.newsHighlights.map((news, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-obsidian-700/30 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      news.sentiment === 'positive' ? 'bg-emerald-glow' : news.sentiment === 'negative' ? 'bg-red-alert' : 'bg-gold-accent'
                    }`} />
                    <div>
                      <p className="text-sm text-white">{news.title}</p>
                      <p className="text-[10px] text-obsidian-400 mt-0.5">{news.source} • {news.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
