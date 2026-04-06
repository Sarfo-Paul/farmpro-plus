import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketPrice } from '../types';
import api from '../utils/api';

const MarketPrices: React.FC = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res: any = await api.getMarketPrices({ limit: 6 });
        const list = (res.prices || res).map((p: any) => ({
          crop: p.crop,
          price: p.price,
          unit: '50kg Bag',
          trend: 'stable' as 'up' | 'down' | 'stable',
        }));
        if (mounted) setPrices(list.slice(0, 4));
      } catch (e) {
        // fallback static
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-stone-900">Current Market Prices</h3>
        <Link to="/market" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {prices.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-emerald-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold group-hover:scale-110 transition-transform">
                {item.crop.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-stone-900">{item.crop}</p>
                <p className="text-xs text-stone-500">{item.unit}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-stone-900">GH₵{item.price}</p>
              <div className="flex items-center justify-end gap-1">
                {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                  item.trend === 'up' ? 'text-emerald-600' : 
                  item.trend === 'down' ? 'text-red-500' : 'text-stone-400'
                }`}>
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPrices;
