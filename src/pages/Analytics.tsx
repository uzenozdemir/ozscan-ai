import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, Legend,
} from 'recharts';
import { brands, getScoreColor, industryBenchmarks } from '../data';

export default function Analytics() {
  const { t } = useTranslation();

  const rankingData = [...brands].sort((a, b) => b.esgScore - a.esgScore).map(b => ({
    name: b.name,
    score: b.esgScore,
    logo: b.logo,
  }));

  const distData = [
    { name: 'Excellent (80+)', value: brands.filter(b => b.esgScore >= 80).length, color: '#10b981' },
    { name: 'Good (60-79)', value: brands.filter(b => b.esgScore >= 60 && b.esgScore < 80).length, color: '#f59e0b' },
    { name: 'Fair (40-59)', value: brands.filter(b => b.esgScore >= 40 && b.esgScore < 60).length, color: '#f97316' },
    { name: 'Poor (<40)', value: brands.filter(b => b.esgScore < 40).length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const trendData = brands[0].history.map((_, idx) => {
    const point: Record<string, string | number> = { month: brands[0].history[idx].month };
    brands.forEach(b => { point[b.name] = b.history[idx].esg; });
    return point;
  });

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-glow" />
          {t('portfolioAnalytics')}
        </h1>
        <p className="text-sm text-obsidian-400 mt-1">Comprehensive ESG portfolio intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rankings */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{t('brandRankings')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rankingData}>
              <XAxis dataKey="name" tick={{ fill: '#5a5a7a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#15151f', border: '1px solid #2a2a3e', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={32}>
                {rankingData.map((entry, i) => (
                  <Cell key={i} fill={getScoreColor(entry.score)} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{t('scoreDistribution')}</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={distData} innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {distData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {distData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-obsidian-400">{d.name}</span>
                  <span className="text-xs font-bold text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">{t('trendAnalysis')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="month" tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#15151f', border: '1px solid #2a2a3e', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {brands.map((b, i) => (
              <Line key={b.id} type="monotone" dataKey={b.name} stroke={colors[i]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Industry Benchmarks */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">{t('industryBenchmarks')}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={industryBenchmarks} layout="vertical">
            <XAxis type="number" tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis type="category" dataKey="industry" tick={{ fill: '#5a5a7a', fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={{ backgroundColor: '#15151f', border: '1px solid #2a2a3e', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={16}>
              {industryBenchmarks.map((entry, i) => (
                <Cell key={i} fill={getScoreColor(entry.avgScore)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
