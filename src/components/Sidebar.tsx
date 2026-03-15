import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Search, GitCompare, Eye, BarChart3, Clock,
  CreditCard, Chrome, Globe, Menu, X, LogOut, ChevronLeft,
  ChevronRight, Zap, Link2, Languages
} from 'lucide-react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems: { page: Page; icon: typeof LayoutDashboard; labelKey: string; badge?: string }[] = [
    { page: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
    { page: 'analysis', icon: Search, labelKey: 'analysis' },
    { page: 'scraper', icon: Link2, labelKey: 'scraper', badge: 'NEW' },
    { page: 'comparison', icon: GitCompare, labelKey: 'comparison' },
    { page: 'watchlist', icon: Eye, labelKey: 'watchlist' },
    { page: 'analytics', icon: BarChart3, labelKey: 'analytics' },
    { page: 'history', icon: Clock, labelKey: 'history' },
    { page: 'pricing', icon: CreditCard, labelKey: 'pricing' },
    { page: 'extension', icon: Chrome, labelKey: 'extension' },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-obsidian-600/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-glow to-emerald-deep flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-glow/20">
            Oz
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold oz-gradient-text">OzScan AI</h1>
              <p className="text-[10px] text-obsidian-400 tracking-wider uppercase">Original & Deep</p>
            </div>
          )}
        </div>
      </div>

      {/* Credits */}
      {isAuthenticated && !collapsed && (
        <div className="mx-3 mt-3 p-3 rounded-lg glass-card animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-obsidian-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-glow" />
              {t('credits')}
            </span>
            <span className="text-xs font-bold text-emerald-glow">
              {user?.plan === 'elite' ? '∞' : user?.credits}/{user?.plan === 'elite' ? '∞' : user?.maxCredits}
            </span>
          </div>
          <div className="w-full h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-glow to-emerald-bright transition-all duration-500"
              style={{ width: user?.plan === 'elite' ? '100%' : `${((user?.credits || 0) / (user?.maxCredits || 1)) * 100}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] text-obsidian-400 uppercase tracking-wide">
            {user?.plan} plan
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 mt-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ page, icon: Icon, labelKey, badge }) => (
          <button
            key={page}
            onClick={() => handleNav(page)}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === page
                ? 'active bg-emerald-glow/10 text-emerald-bright'
                : 'text-obsidian-400 hover:text-white hover:bg-obsidian-700/50'
            }`}
            title={collapsed ? t(labelKey) : undefined}
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1 text-left">{t(labelKey)}</span>
            )}
            {!collapsed && badge && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-glow/20 text-emerald-bright rounded-full">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Language Picker */}
      <div className="px-3 mb-2 relative">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-obsidian-400 hover:text-white hover:bg-obsidian-700/50 transition-all"
        >
          <Languages className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{currentLang.flag} {currentLang.label}</span>
              <Globe className="w-3.5 h-3.5" />
            </>
          )}
        </button>
        {langOpen && (
          <div className="absolute bottom-12 left-3 right-3 bg-obsidian-700 border border-obsidian-600 rounded-lg shadow-xl z-50 overflow-hidden animate-scale-in">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-emerald-glow/10 text-emerald-bright'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-600/50'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User / Auth */}
      <div className="p-3 border-t border-obsidian-600/50">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-glow to-purple-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-obsidian-400 truncate">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={logout} className="text-obsidian-400 hover:text-red-alert transition-colors" title={t('signOut')}>
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleNav('auth')}
            className="w-full oz-btn text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {!collapsed && t('signIn')}
            {collapsed && <LogOut className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Collapse toggle - desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center p-2 mx-3 mb-3 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-700/50 transition-all"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg glass-card text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-obsidian-900 border-r border-obsidian-600/50 z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 p-1 text-obsidian-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block flex-shrink-0 bg-obsidian-900 border-r border-obsidian-600/50 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
