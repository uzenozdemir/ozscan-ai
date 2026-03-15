import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Check, Star, Zap, Shield, Crown, X, Loader2 } from 'lucide-react';
import { pricingTiers } from '../data';

export default function Pricing() {
  const { t } = useTranslation();
  const { user, isAuthenticated, upgradePlan } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const getAdjustedPrice = (price: number) => {
    if (annual) return (price * 12 * 0.8).toFixed(2);
    return price.toFixed(2);
  };

  const handleCheckout = (planName: string) => {
    if (planName === 'free') return;
    setCheckoutPlan(planName);
  };

  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      if (checkoutPlan === 'pro') upgradePlan('pro');
      if (checkoutPlan === 'elite') upgradePlan('elite');
      setProcessing(false);
      setCheckoutPlan(null);
    }, 2000);
  };

  const tierIcons = [Zap, Star, Crown];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-glow" />
          {t('choosePlan')}
        </h1>
        <p className="text-sm text-obsidian-400 mt-1">Scale your sustainability intelligence with OzScan AI</p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? 'text-white' : 'text-obsidian-400'}`}>{t('monthly')}</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`w-12 h-6 rounded-full p-0.5 transition-colors ${annual ? 'bg-emerald-glow' : 'bg-obsidian-600'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className={`text-sm ${annual ? 'text-white' : 'text-obsidian-400'}`}>
          {t('annual')}
          <span className="ml-1 text-xs text-emerald-glow font-semibold">{t('save20')}</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {pricingTiers.map((tier, idx) => {
          const Icon = tierIcons[idx];
          const isCurrentPlan = isAuthenticated && user?.plan === tier.nameKey;
          return (
            <div
              key={tier.name}
              className={`glass-card rounded-2xl p-6 relative ${
                tier.highlighted ? 'border-2 border-emerald-glow/50 shadow-lg shadow-emerald-glow/10' : ''
              } ${isCurrentPlan ? 'ring-2 ring-emerald-glow/30' : ''}`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold bg-emerald-glow text-white rounded-full">
                  {tier.badge}
                </span>
              )}
              {isCurrentPlan && (
                <span className="absolute -top-3 right-4 px-3 py-1 text-[10px] font-bold bg-blue-info text-white rounded-full">
                  {t('currentPlan')}
                </span>
              )}
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-obsidian-700 flex items-center justify-center mx-auto mb-3">
                  <Icon className={`w-6 h-6 ${idx === 0 ? 'text-obsidian-400' : idx === 1 ? 'text-emerald-glow' : 'text-gold-accent'}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-black text-white">
                    ${tier.priceNum === 0 ? '0' : getAdjustedPrice(tier.priceNum)}
                  </span>
                  <span className="text-sm text-obsidian-400">
                    {annual ? '/yr' : tier.period}
                  </span>
                </div>
                <p className="text-xs text-obsidian-400 mt-1">{tier.credits}</p>
              </div>
              <div className="space-y-2 mb-5">
                {tier.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-glow flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-obsidian-300">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCheckout(tier.nameKey)}
                disabled={isCurrentPlan}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isCurrentPlan
                    ? 'bg-obsidian-700 text-obsidian-400 cursor-not-allowed'
                    : tier.highlighted
                      ? 'oz-btn text-white'
                      : 'bg-obsidian-700 text-white hover:bg-obsidian-600 border border-obsidian-500'
                }`}
              >
                {isCurrentPlan ? t('currentPlan') : tier.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <div className="glass-card rounded-xl p-5 max-w-4xl mx-auto">
        <h3 className="text-sm font-semibold text-white mb-4">{t('features')} Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-obsidian-600/30">
                <th className="text-left text-xs text-obsidian-400 py-2 px-3">Feature</th>
                <th className="text-center text-xs text-obsidian-400 py-2 px-3">Ücretsiz</th>
                <th className="text-center text-xs text-emerald-glow py-2 px-3">Pro</th>
                <th className="text-center text-xs text-gold-accent py-2 px-3">Elite</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                ['Monthly Credits', '5', '50', '∞'],
                ['ESG Score Breakdown', '✅', '✅', '✅'],
                ['AI Deep Analysis', '❌', '✅', '✅'],
                ['Brand Comparison', '❌', '✅', '✅'],
                ['URL Scraping', '❌', '✅', '✅'],
                ['History Tracking', '❌', '✅', '✅'],
                ['PDF Reports', '❌', '❌', '✅'],
                ['Watchlist Alerts', '❌', '❌', '✅'],
                ['API Access', '❌', '❌', '✅'],
                ['Real-time Monitoring', '❌', '❌', '✅'],
              ].map(([feature, ...tiers]) => (
                <tr key={feature} className="border-b border-obsidian-700/20">
                  <td className="py-2 px-3 text-obsidian-300">{feature}</td>
                  {tiers.map((v, i) => (
                    <td key={i} className="py-2 px-3 text-center">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => !processing && setCheckoutPlan(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Checkout</h3>
              {!processing && (
                <button onClick={() => setCheckoutPlan(null)} className="text-obsidian-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-4 rounded-lg bg-obsidian-800/50 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">{checkoutPlan === 'pro' ? 'Pro Plan' : 'Elite Plan'}</span>
                <span className="text-lg font-bold text-emerald-glow">
                  ${checkoutPlan === 'pro' ? getAdjustedPrice(3.99) : getAdjustedPrice(9.99)}
                  <span className="text-xs text-obsidian-400">{annual ? '/yr' : '/mo'}</span>
                </span>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-obsidian-400">Card Number</label>
                <input placeholder="4242 4242 4242 4242" className="oz-input w-full py-2.5 px-3 rounded-lg text-sm text-white mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-obsidian-400">Expiry</label>
                  <input placeholder="12/28" className="oz-input w-full py-2.5 px-3 rounded-lg text-sm text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-obsidian-400">CVC</label>
                  <input placeholder="123" className="oz-input w-full py-2.5 px-3 rounded-lg text-sm text-white mt-1" />
                </div>
              </div>
            </div>
            <button
              onClick={processPayment}
              disabled={processing}
              className="oz-btn w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Complete Payment
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-obsidian-500">
              <span>🔒 Stripe Secured</span>
              <span>•</span>
              <span>🏦 Iyzico Compatible</span>
              <span>•</span>
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
