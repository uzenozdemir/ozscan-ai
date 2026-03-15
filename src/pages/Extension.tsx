import { useTranslation } from 'react-i18next';
import { Chrome, ShoppingCart, Eye, BarChart3, Smartphone, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function Extension() {
  const { t } = useTranslation();

  const steps = [
    { icon: Chrome, title: 'Install Extension', desc: 'Add OzScan AI to your Chrome browser with one click' },
    { icon: ShoppingCart, title: 'Shop Normally', desc: 'Browse your favorite e-commerce sites as usual' },
    { icon: Eye, title: 'Auto-Detection', desc: 'Extension auto-detects products and seller pages' },
    { icon: BarChart3, title: 'ESG Overlay', desc: 'See sustainability scores without leaving the page' },
  ];

  const supportedSites = [
    { name: 'Amazon', icon: '🛒', status: 'ready' },
    { name: 'Trendyol', icon: '🛍️', status: 'ready' },
    { name: 'Zara', icon: '👗', status: 'ready' },
    { name: 'H&M', icon: '🧥', status: 'ready' },
    { name: 'Nike', icon: '👟', status: 'beta' },
    { name: 'LC Waikiki', icon: '👕', status: 'beta' },
    { name: 'Shein', icon: '👚', status: 'planned' },
    { name: 'ASOS', icon: '👠', status: 'planned' },
  ];

  const features = [
    { icon: Zap, title: 'Instant ESG Scores', desc: 'Get real-time sustainability ratings for any product' },
    { icon: Shield, title: 'Privacy First', desc: 'No data collection. All analysis happens securely' },
    { icon: Globe, title: 'Multi-language', desc: 'Works in TR, EN, DE, FR across all supported sites' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-glow/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-glow to-emerald-deep flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-glow/30 animate-float">
            <Chrome className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">OzScan AI {t('browserExtension')}</h1>
          <p className="text-obsidian-400 max-w-lg mx-auto mb-6">{t('extensionDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="oz-btn px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 justify-center">
              <Chrome className="w-5 h-5" />
              {t('installChrome')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-3 rounded-xl bg-obsidian-700 text-white font-medium border border-obsidian-500 hover:bg-obsidian-600 transition-all flex items-center gap-2 justify-center">
              <Smartphone className="w-5 h-5" />
              Mobile App — {t('comingSoon')}
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-xl font-bold text-white text-center mb-6">{t('howItWorks')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="glass-card bento-item rounded-xl p-5 text-center relative">
              <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-emerald-glow/20 text-emerald-bright text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-obsidian-700 flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-6 h-6 text-emerald-glow" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-xs text-obsidian-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Sites */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Supported E-Commerce Sites</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {supportedSites.map(site => (
            <div key={site.name} className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-700/50 transition-colors">
              <span className="text-xl">{site.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{site.name}</p>
                <span className={`text-[10px] font-medium ${
                  site.status === 'ready' ? 'text-emerald-bright' :
                  site.status === 'beta' ? 'text-gold-accent' : 'text-obsidian-400'
                }`}>
                  {site.status === 'ready' ? '● Ready' : site.status === 'beta' ? '● Beta' : '○ Planned'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extension Preview */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Extension Preview — ESG Overlay</h3>
        <div className="bg-obsidian-800 rounded-lg p-4 border border-obsidian-600/50">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-obsidian-600/30">
            <div className="w-3 h-3 rounded-full bg-red-alert" />
            <div className="w-3 h-3 rounded-full bg-gold-accent" />
            <div className="w-3 h-3 rounded-full bg-emerald-glow" />
            <span className="text-[10px] text-obsidian-500 ml-2">www.amazon.com/product/organic-cotton-shirt</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-obsidian-700 rounded" />
              <div className="h-3 w-1/2 bg-obsidian-700 rounded" />
              <div className="h-20 w-full bg-obsidian-700 rounded" />
              <div className="h-3 w-2/3 bg-obsidian-700 rounded" />
            </div>
            <div className="w-48 bg-obsidian-900 rounded-lg p-3 border border-emerald-glow/30 shadow-lg shadow-emerald-glow/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-emerald-glow flex items-center justify-center text-[8px] font-black text-white">Oz</div>
                <span className="text-[10px] font-bold text-white">OzScan AI</span>
              </div>
              <div className="text-center py-2">
                <div className="text-2xl font-black text-emerald-glow">72</div>
                <div className="text-[9px] text-obsidian-400">ESG Score</div>
              </div>
              <div className="space-y-1">
                {[{ l: 'Env', v: 70 }, { l: 'Social', v: 75 }, { l: 'Gov', v: 71 }].map(m => (
                  <div key={m.l}>
                    <div className="flex justify-between text-[9px] text-obsidian-400">
                      <span>{m.l}</span><span>{m.v}</span>
                    </div>
                    <div className="h-1 bg-obsidian-700 rounded-full">
                      <div className="h-full bg-emerald-glow rounded-full" style={{ width: `${m.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[8px] text-emerald-bright text-center">✓ Verified by OzScan AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div key={i} className="glass-card bento-item rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-emerald-glow/10 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-emerald-glow" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-xs text-obsidian-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
