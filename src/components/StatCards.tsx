import React, { useEffect, useState } from 'react';
import { Sprout, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react';
import { storage } from '../utils/storage';

const StatCards: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const user = storage.getUser();
        const res: any = await (await import('../utils/api')).default.getRecords({ userId: user?.id });
        const mapped = (res.records || res).map((r: any) => ({
          id: String(r.id),
          cropName: r.crop,
          plantingDate: new Date(r.date).toISOString(),
          harvestDate: '',
          cost: r.price ?? 0,
          expectedRevenue: (r.price ?? 0) * (r.quantity ?? 1),
          status: 'Growing',
          notes: r.notes || '',
        }));
        if (mounted) setRecords(mapped);
      } catch (e) {
        if (mounted) setRecords(storage.getRecords());
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalCrops = records.length;
  const growingCrops = records.filter(r => r.status === 'Growing').length;
  const totalCost = records.reduce((sum, r) => sum + Number(r.cost), 0);
  const totalRev = records.reduce((sum, r) => sum + Number(r.expectedRevenue), 0);

  const stats = [
    { label: 'Active Crops', value: growingCrops, icon: Sprout, color: 'bg-emerald-50 text-emerald-600', trend: `${totalCrops} Total` },
    { label: 'Total Investment', value: `GH₵${totalCost.toLocaleString()}`, icon: DollarSign, color: 'bg-stone-50 text-stone-600', trend: 'Last 12 mo' },
    { label: 'Est. Revenue', value: `GH₵${totalRev.toLocaleString()}`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600', trend: '+12.5%' },
    { label: 'Projects', value: totalCrops, icon: CalendarCheck, color: 'bg-amber-50 text-amber-600', trend: 'On track' },
  ];

  if (loading) return <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 animate-pulse">Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-lg transition-all hover:scale-105">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{stat.trend}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-900 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
