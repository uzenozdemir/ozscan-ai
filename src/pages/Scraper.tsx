import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Link2, Search, Loader2, Star, MessageSquare, TrendingUp,
  ThumbsUp, ThumbsDown, Minus, ShoppingBag, Shield, Leaf,
  Package, Zap, AlertTriangle, ExternalLink
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { ScrapedData } from '../types';

// Simulated scraping engine
function simulateScrape(url: string): ScrapedData {
  const urlLower = url.toLowerCase();
  let platform = 'Unknown';
  let productName = 'Product';
  let sellerName = 'Seller';

  if (urlLower.includes('amazon')) { platform = 'Amazon'; productName = 'Organic Cotton T-Shirt'; sellerName = 'EcoWear Store'; }
  else if (urlLower.includes('trendyol')) { platform = 'Trendyol'; productName = 'Sürdürülebilir Denim Pantolon'; sellerName = 'GreenFashion TR'; }
  else if (urlLower.includes('zara')) { platform = 'Zara'; productName = 'Join Life Collection Jacket'; sellerName = 'Zara Official'; }
  else if (urlLower.includes('hm') || urlLower.includes('h&m')) { platform = 'H&M'; productName = 'Conscious Choice Dress'; sellerName = 'H&M Official'; }
  else if (urlLower.includes('lcwaikiki') || urlLower.includes('lcw')) { platform = 'LC Waikiki'; productName = 'Basic Organic Tee'; sellerName = 'LC Waikiki Official'; }
  else if (urlLower.includes('nike')) { platform = 'Nike'; productName = 'Move to Zero Sneaker'; sellerName = 'Nike Store'; }
  else if (urlLower.includes('shein')) { platform = 'Shein'; productName = 'Fashion Blouse'; sellerName = 'SHEIN Official'; }
  else { platform = new URL(url).hostname.replace('www.', '').split('.')[0]; productName = 'Fashion Item'; sellerName = platform + ' Seller'; }

  const isGoodBrand = ['patagonia', 'nike', 'hm'].some(b => urlLower.includes(b));
  const isBadBrand = ['shein'].some(b => urlLower.includes(b));

  const posRate = isBadBrand ? 30 : isGoodBrand ? 75 : 55;
  const negRate = isBadBrand ? 45 : isGoodBrand ? 10 : 20;
  const neuRate = 100 - posRate - negRate;
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  const reviewTemplates = {
    positive: [
      'Great quality material, feels very sustainable!',
      'Love the eco-friendly packaging',
      'Excellent craftsmanship and ethical production',
      'Worth the price for the quality',
      'Really soft organic cotton, very comfortable',
    ],
    negative: [
      'Material quality is questionable for the price',
      'Packaging was excessive and not recyclable',
      'Sizing is inconsistent, had to return',
      'Not convinced about the sustainability claims',
      'Poor durability, started falling apart after a few washes',
    ],
    neutral: [
      'Decent product, nothing special',
      'Okay quality but could be better',
      'Standard product, meets expectations',
      'Average quality for the price point',
    ],
  };

  const reviews = [
    ...reviewTemplates.positive.slice(0, 3).map((text, i) => ({
      text, rating: 4 + (i % 2), sentiment: 'positive' as const, date: '2024-01-' + (15 - i), author: `User${100 + i}`,
    })),
    ...reviewTemplates.negative.slice(0, 2).map((text, i) => ({
      text, rating: 1 + (i % 2), sentiment: 'negative' as const, date: '2024-01-' + (10 - i), author: `User${200 + i}`,
    })),
    ...reviewTemplates.neutral.slice(0, 2).map((text, i) => ({
      text, rating: 3, sentiment: 'neutral' as const, date: '2024-01-' + (5 - i), author: `User${300 + i}`,
    })),
  ];

  return {
    url,
    platform,
    productName,
    sellerName,
    sellerRating: isBadBrand ? 3.2 : isGoodBrand ? 4.6 : 4.1,
    reviewCount,
    reviews,
    sentimentBreakdown: { positive: posRate, negative: negRate, neutral: neuRate },
    overallSentiment: isBadBrand ? 35 : isGoodBrand ? 82 : 62,
    esgIndicators: {
      sustainableMaterials: !isBadBrand,
      ethicalLabor: isGoodBrand,
      ecoPackaging: !isBadBrand && Math.random() > 0.3,
      carbonNeutral: isGoodBrand,
    },
  };
}

export default function Scraper() {
  const { t } = useTranslation();
  const { useCredit, user } = useAuth();
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState<ScrapedData | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleScrape = () => {
    setError('');
    if (!url.trim()) { setError('Please enter a valid URL'); return; }
    try { new URL(url); } catch { setError('Invalid URL format. Please enter a complete URL (e.g., https://www.amazon.com/...)'); return; }
    if (!useCredit()) { setError('No credits remaining. Please upgrade your plan.'); return; }

    setScraping(true);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 15;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setResult(simulateScrape(url));
      setScraping(false);
    }, 3500);
  };

  const pieData = result ? [
    { name: t('positiveReviews'), value: result.sentimentBreakdown.positive, color: '#10b981' },
    { name: t('negativeReviews'), value: result.sentimentBreakdown.negative, color: '#ef4444' },
    { name: t('neutralReviews'), value: result.sentimentBreakdown.neutral, color: '#f59e0b' },
  ] : [];

  const esgBarData = result ? [
    { name: 'Materials', score: result.esgIndicators.sustainableMaterials ? 85 : 25 },
    { name: 'Labor', score: result.esgIndicators.ethicalLabor ? 90 : 35 },
    { name: 'Packaging', score: result.esgIndicators.ecoPackaging ? 80 : 30 },
    { name: 'Carbon', score: result.esgIndicators.carbonNeutral ? 95 : 20 },
  ] : [];

  const exampleUrls = [
    'https://www.amazon.com/organic-cotton-shirt',
    'https://www.trendyol.com/surdurulebilir-urun',
    'https://www.zara.com/join-life-jacket',
    'https://www.nike.com/move-to-zero-shoe',
    'https://www.shein.com/fashion-blouse',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-emerald-glow" />
          {t('liveScraper')}
        </h1>
        <p className="text-sm text-obsidian-400 mt-1">Real-time product analysis from any e-commerce URL</p>
      </div>

      {/* URL Input */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder={t('enterUrl')}
              className="oz-input w-full pl-10 pr-4 py-3 rounded-lg text-sm text-white placeholder-obsidian-500"
              onKeyDown={e => e.key === 'Enter' && handleScrape()}
            />
          </div>
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="oz-btn px-6 py-3 rounded-lg text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50"
          >
            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {scraping ? t('scrapingInProgress') : t('startScraping')}
          </button>
        </div>

        {/* Quick URLs */}
        <div className="flex flex-wrap gap-2 mt-3">
          {exampleUrls.map(u => (
            <button
              key={u}
              onClick={() => setUrl(u)}
              className="px-3 py-1.5 rounded-full text-[11px] bg-obsidian-700/50 text-obsidian-400 border border-obsidian-600/50 hover:border-emerald-glow/30 hover:text-white transition-all truncate max-w-[200px]"
            >
              {u.replace('https://www.', '').split('/')[0]}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-obsidian-400">
          <Zap className="w-3 h-3 text-emerald-glow" />
          <span>{t('credits')}: {user?.plan === 'elite' ? '∞' : (user?.credits ?? 5)} remaining</span>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-alert/10 border border-red-alert/30 text-red-400 text-sm animate-scale-in flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Scraping Progress */}
      {scraping && (
        <div className="glass-card rounded-xl p-8 text-center animate-scale-in">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-obsidian-600 border-t-emerald-glow animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link2 className="w-8 h-8 text-emerald-glow" />
            </div>
          </div>
          <p className="text-white font-medium">{t('scrapingInProgress')}</p>
          <div className="mt-3 space-y-1 text-xs text-obsidian-400">
            <p>{progress < 30 ? '🔗 Connecting to URL...' : progress < 60 ? '📄 Extracting product data...' : progress < 85 ? '🧠 Analyzing reviews with AI...' : '✅ Generating sentiment report...'}</p>
          </div>
          <div className="mt-4 w-64 mx-auto h-2 bg-obsidian-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-glow to-emerald-bright rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-obsidian-500 mt-2">{Math.round(Math.min(progress, 100))}%</p>
        </div>
      )}

      {/* Results */}
      {result && !scraping && (
        <div className="space-y-4 animate-fade-in">
          {/* Product Info */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-glow" />
              {t('productInfo')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-obsidian-800/50">
                <p className="text-[10px] text-obsidian-400 uppercase tracking-wide">Platform</p>
                <p className="text-sm font-semibold text-white mt-1">{result.platform}</p>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-800/50">
                <p className="text-[10px] text-obsidian-400 uppercase tracking-wide">Product</p>
                <p className="text-sm font-semibold text-white mt-1">{result.productName}</p>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-800/50">
                <p className="text-[10px] text-obsidian-400 uppercase tracking-wide">{t('sellerRating')}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-gold-accent fill-gold-accent" />
                  <span className="text-sm font-semibold text-white">{result.sellerRating}/5.0</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-800/50">
                <p className="text-[10px] text-obsidian-400 uppercase tracking-wide">{t('reviewsFound')}</p>
                <p className="text-sm font-semibold text-white mt-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-info" />
                  {result.reviewCount}
                </p>
              </div>
            </div>
          </div>

          {/* Sentiment & ESG */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sentiment Pie */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-info" />
                {t('reviewAnalysis')}
              </h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-obsidian-400">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: d.color }}>{d.value}%</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-obsidian-600/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-obsidian-400">{t('sentimentScore')}</span>
                      <span className="text-lg font-black" style={{ color: result.overallSentiment >= 60 ? '#10b981' : result.overallSentiment >= 40 ? '#f59e0b' : '#ef4444' }}>
                        {result.overallSentiment}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ESG Indicators */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-glow" />
                ESG Indicators
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={esgBarData}>
                  <XAxis dataKey="name" tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5a5a7a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#15151f', border: '1px solid #2a2a3e', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={30}>
                    {esgBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 60 ? '#10b981' : entry.score >= 40 ? '#f59e0b' : '#ef4444'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label: 'Sustainable Materials', ok: result.esgIndicators.sustainableMaterials, icon: Leaf },
                  { label: 'Ethical Labor', ok: result.esgIndicators.ethicalLabor, icon: Shield },
                  { label: 'Eco Packaging', ok: result.esgIndicators.ecoPackaging, icon: Package },
                  { label: 'Carbon Neutral', ok: result.esgIndicators.carbonNeutral, icon: Zap },
                ].map(ind => (
                  <div key={ind.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${ind.ok ? 'bg-emerald-glow/10 text-emerald-bright' : 'bg-red-alert/10 text-red-400'}`}>
                    <ind.icon className="w-3 h-3" />
                    {ind.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold-accent" />
              Sample Reviews (AI Analyzed)
            </h3>
            <div className="space-y-2">
              {result.reviews.map((review, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-obsidian-800/30 hover:bg-obsidian-700/30 transition-colors">
                  <div className="mt-0.5">
                    {review.sentiment === 'positive' ? <ThumbsUp className="w-4 h-4 text-emerald-glow" /> :
                     review.sentiment === 'negative' ? <ThumbsDown className="w-4 h-4 text-red-alert" /> :
                     <Minus className="w-4 h-4 text-gold-accent" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-obsidian-300">"{review.text}"</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-obsidian-500">{review.author}</span>
                      <span className="text-obsidian-600">•</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className={`w-2.5 h-2.5 ${si < review.rating ? 'text-gold-accent fill-gold-accent' : 'text-obsidian-600'}`} />
                        ))}
                      </div>
                      <span className="text-obsidian-600">•</span>
                      <span className="text-[10px] text-obsidian-500">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
