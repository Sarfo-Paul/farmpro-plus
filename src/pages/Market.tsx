import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { MarketPrice } from '../types';

const Market: React.FC = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res: any = await api.adminGetMarketPrices();
        const list = (res.prices || res).map((p: any) => ({ crop: p.crop, price: p.price, unit: '50kg Bag', trend: 'stable' }));
        if (mounted) setPrices(list);
      } catch (e) {
        // fallback: try public endpoint
        try {
          const res: any = await api.getMarketPrices({ limit: 100 });
          const list = (res.prices || res).map((p: any) => ({ crop: p.crop, price: p.price, unit: '50kg Bag', trend: 'stable' }));
          if (mounted) setPrices(list);
        } catch (_e) {
          if (mounted) setPrices([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Market Prices</h1>
        <p className="text-stone-500">All current market prices</p>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">Loading...</div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <table className="w-full text-left">
            <thead>
              <tr className="text-stone-500 text-sm border-b">
                <th className="py-3">Crop</th>
                <th className="py-3">Unit</th>
                <th className="py-3">Price (GH₵)</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p, idx) => (
                <tr key={idx} className="hover:bg-emerald-50">
                  <td className="py-3 font-bold text-stone-900">{p.crop}</td>
                  <td className="py-3 text-stone-500">{p.unit}</td>
                  <td className="py-3 font-bold">GH₵{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Market;
