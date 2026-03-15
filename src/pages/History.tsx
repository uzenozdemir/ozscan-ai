import { useTranslation } from 'react-i18next';
import { Clock, Download, Search, Eye } from 'lucide-react';
import { analysisHistory, getScoreColor } from '../data';

export default function History() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-glow" />
            {t('analysisHistory')}
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">Complete log of all your OzScan AI analyses</p>
        </div>
        <button className="oz-btn px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 self-start">
          <Download className="w-4 h-4" />
          {t('exportData')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-glow">{analysisHistory.length}</p>
          <p className="text-xs text-obsidian-400 mt-1">Total Analyses</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-blue-info">{analysisHistory.filter(a => a.type === 'Deep Scan').length}</p>
          <p className="text-xs text-obsidian-400 mt-1">Deep Scans</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-gold-accent">
            {Math.round(analysisHistory.reduce((a, b) => a + b.score, 0) / analysisHistory.length)}
          </p>
          <p className="text-xs text-obsidian-400 mt-1">Avg Score</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-obsidian-600/30">
                <th className="text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider px-5 py-3">#</th>
                <th className="text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider px-5 py-3">{t('brand')}</th>
                <th className="text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider px-5 py-3">{t('date')}</th>
                <th className="text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider px-5 py-3">{t('score')}</th>
                <th className="text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider px-5 py-3">{t('type')}</th>
                <th className="text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider px-5 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {analysisHistory.map((item) => (
                <tr key={item.id} className="border-b border-obsidian-700/20 hover:bg-obsidian-700/20 transition-colors">
                  <td className="px-5 py-3 text-xs text-obsidian-500">{item.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-obsidian-400" />
                      <span className="text-sm font-medium text-white">{item.brand}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-obsidian-400">{item.date}</td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold" style={{ color: getScoreColor(item.score) }}>{item.score}/100</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      item.type === 'Deep Scan' ? 'bg-blue-info/10 text-blue-400' :
                      item.type === 'PDF Report' ? 'bg-purple-accent/10 text-purple-400' :
                      item.type === 'Comparison' ? 'bg-gold-accent/10 text-gold-accent' :
                      'bg-emerald-glow/10 text-emerald-bright'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-lg text-obsidian-400 hover:text-emerald-bright hover:bg-emerald-glow/10 transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
