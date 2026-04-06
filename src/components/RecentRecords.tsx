import React, { useEffect, useState } from 'react';
import { MoreVertical, Calendar, TrendingUp } from 'lucide-react';
import { storage } from '../utils/storage';
import { format } from 'date-fns';
import api from '../utils/api';

const RecentRecords: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
        try {
        const user = storage.getUser();
        const res: any = await api.getRecords({ limit: 4, userId: user?.id });
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
        if (mounted) setRecords(mapped.slice(0, 4));
      } catch (e) {
        // fallback to local storage if API fails
        if (mounted) setRecords(storage.getRecords().slice(0, 4));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 animate-pulse">Loading...</div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-stone-200 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <p className="text-stone-500 font-medium mb-4">No farm records yet</p>
        <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200/50">
          Start Tracking
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-stone-900">Recent Activity</h3>
        <button className="text-stone-400 hover:text-stone-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-stone-50 hover:bg-white border border-transparent hover:border-stone-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                {record.cropName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-stone-900">{record.cropName}</p>
                <p className="text-xs text-stone-500 font-medium">
                  Planted: {format(new Date(record.plantingDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="text-right flex items-center gap-6">
              <div className="hidden sm:block">
                <p className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter inline-block ${
                  record.status === 'Growing' ? 'bg-amber-100 text-amber-700' :
                  record.status === 'Harvested' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {record.status}
                </p>
              </div>
              <div>
                <p className="font-bold text-emerald-700">GH₵{record.expectedRevenue}</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 font-medium uppercase">
                  Est. Rev.
                  <TrendingUp className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRecords;
