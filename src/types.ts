export interface Brand {
  id: string;
  name: string;
  logo: string;
  industry: string;
  country: string;
  esgScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  supplyChainTransparency: number;
  carbonFootprint: number;
  laborEthics: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  certificates: string[];
  lastUpdated: string;
  sentiment: number;
  newsHighlights: NewsItem[];
  history: ScoreHistory[];
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface ScoreHistory {
  month: string;
  esg: number;
  environmental: number;
  social: number;
  governance: number;
}

export interface PricingTier {
  name: string;
  nameKey: string;
  price: string;
  priceNum: number;
  period: string;
  credits: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  cta: string;
}

export interface WatchlistItem {
  brandId: string;
  brandName: string;
  addedDate: string;
  alertThreshold: number;
  emailAlerts: boolean;
  lastScore: number;
  currentScore: number;
}

export interface AnalysisResult {
  brandName: string;
  overallScore: number;
  breakdown: {
    environmental: number;
    social: number;
    governance: number;
    supplyChain: number;
    carbonFootprint: number;
    laborEthics: number;
  };
  insights: string[];
  risks: string[];
  certifications: string[];
  recommendation: string;
}

export interface ScrapedData {
  url: string;
  platform: string;
  productName: string;
  sellerName: string;
  sellerRating: number;
  reviewCount: number;
  reviews: ScrapedReview[];
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  overallSentiment: number;
  esgIndicators: {
    sustainableMaterials: boolean;
    ethicalLabor: boolean;
    ecoPackaging: boolean;
    carbonNeutral: boolean;
  };
}

export interface ScrapedReview {
  text: string;
  rating: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
  author: string;
}

export type Page = 'dashboard' | 'analysis' | 'comparison' | 'watchlist' | 'analytics' | 'history' | 'pricing' | 'extension' | 'scraper' | 'auth';
