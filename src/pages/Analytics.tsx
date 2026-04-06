import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';

const Analytics: React.FC = () => {
  const [data, setData] = useState<Array<{ date: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const user = storage.getUser();
        const api = (await import('../utils/api')).default;
        const res: any = await api.getRecords({ limit: 100, userId: user?.id });
        const recs = (res.records || res) || [];
        // aggregate revenue by day
        const map: Record<string, number> = {};
        recs.forEach((r: any) => {
          const d = new Date(r.date).toISOString().slice(0, 10);
          const rev = (r.price ?? 0) * (r.quantity ?? 1);
          map[d] = (map[d] || 0) + rev;
        });
        const out = Object.keys(map).sort().map(d => ({ date: d, revenue: map[d] }));
        if (mounted) setData(out);
      } catch (e) {
        // fallback to local storage
        const recs = storage.getRecords();
        const map: Record<string, number> = {};
        recs.forEach((r: any) => {
          const d = new Date(r.plantingDate || r.date).toISOString().slice(0,10);
          const rev = (r.expectedRevenue ?? 0);
          map[d] = (map[d] || 0) + rev;
        });
        const out = Object.keys(map).sort().map(d => ({ date: d, revenue: map[d] }));
        if (mounted) setData(out);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const max = Math.max(0, ...(data.map(d => d.revenue)));

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Analytics</h1>
        <p className="text-stone-500">Simple revenue over time for your records</p>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-2xl">Loading...</div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="w-full h-48">
            <svg viewBox={`0 0 ${data.length || 1} 100`} preserveAspectRatio="none" className="w-full h-48">
              {data.map((d, i) => {
                const x = i;
                const y = max ? 100 - Math.round((d.revenue / max) * 100) : 100;
                return <circle key={i} cx={x + 0.5} cy={y} r={0.6} fill="#16a34a" />;
              })}
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {data.slice(-6).reverse().map((d, idx) => (
              <div key={idx} className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-sm text-stone-500">{d.date}</div>
                <div className="font-bold">GH₵{Math.round(d.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;
