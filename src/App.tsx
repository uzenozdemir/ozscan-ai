import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Comparison from './pages/Comparison';
import Watchlist from './pages/Watchlist';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Pricing from './pages/Pricing';
import Extension from './pages/Extension';
import Scraper from './pages/Scraper';
import Auth from './pages/Auth';
import type { Page } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'analysis': return <Analysis />;
      case 'comparison': return <Comparison />;
      case 'watchlist': return <Watchlist />;
      case 'analytics': return <Analytics />;
      case 'history': return <History />;
      case 'pricing': return <Pricing />;
      case 'extension': return <Extension />;
      case 'scraper': return <Scraper />;
      case 'auth': return <Auth onNavigate={setCurrentPage} />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-obsidian-950">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
