import { useTranslation } from 'react-i18next';
import { Shield, Lock, Globe, Code2 } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-obsidian-600/30 bg-obsidian-900/50">
      {/* Disclaimer */}
      <div className="px-4 md:px-8 py-4 border-b border-obsidian-700/30">
        <div className="flex items-start gap-3 max-w-4xl">
          <Shield className="w-4 h-4 text-gold-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-obsidian-400 leading-relaxed">
            <span className="text-gold-accent font-semibold">⚠️ {t('appName')} Legal Disclaimer: </span>
            {t('disclaimer')}
          </p>
        </div>
      </div>

      {/* Links & Credit */}
      <div className="px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: brand + developer */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-glow to-emerald-deep flex items-center justify-center text-white text-[9px] font-black">
                Oz
              </div>
              <span className="text-sm font-semibold oz-gradient-text">OzScan AI</span>
            </div>
            <span className="text-obsidian-500">|</span>
            <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
              <Code2 className="w-3 h-3 text-emerald-glow" />
              <span>{t('leadDeveloper')}</span>
            </div>
          </div>

          {/* Center: badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-obsidian-700/50 text-[10px] text-obsidian-400">
              <Lock className="w-3 h-3 text-emerald-glow" />
              <span>JWT Secured</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-obsidian-700/50 text-[10px] text-obsidian-400">
              <Globe className="w-3 h-3 text-blue-info" />
              <span>{t('gdprCompliance')}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-obsidian-700/50 text-[10px] text-obsidian-400">
              <Shield className="w-3 h-3 text-gold-accent" />
              <span>256-bit SSL</span>
            </div>
          </div>

          {/* Right: links + copyright */}
          <div className="flex items-center gap-4 text-xs text-obsidian-400">
            <button className="hover:text-emerald-bright transition-colors">{t('privacyPolicy')}</button>
            <button className="hover:text-emerald-bright transition-colors">{t('termsOfService')}</button>
            <span>© {year} OzScan AI. {t('allRightsReserved')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
