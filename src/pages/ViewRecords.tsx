import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';
import { FarmRecord } from '../types';
import { format } from 'date-fns';
import { Search, Trash2, Edit, ChevronRight, TrendingUp, TrendingDown, Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ViewRecords: React.FC = () => {
  const [records, setRecords] = useState<FarmRecord[]>(storage.getRecords());
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FarmRecord['status'] | 'All'>('All');

  useEffect(() => {
    let mounted = true;
    (async () => {
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
        // keep local
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const numeric = Number(id);
      if (!Number.isNaN(numeric)) {
        await (await import('../utils/api')).default.deleteRecord(numeric);
      }
    } catch (e) {
      // ignore
    }
    const updated = records.filter(r => r.id !== id);
    storage.saveRecords(updated);
    setRecords(updated);
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-stone-900 leading-tight tracking-tight">Your Farm Ledger</h1>
          <p className="text-stone-500 font-medium">A complete history of all your farming activities.</p>
        </div>
        <Link 
            to="/add" 
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200/50"
          >
            <Plus className="w-5 h-5" />
            Add New Record
          </Link>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search crop name..."
            className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-medium text-stone-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {['All', 'Planned', 'Growing', 'Harvested'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 md:flex-none px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                filter === f
                  ? 'bg-emerald-900 text-white'
                  : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const profit = record.expectedRevenue - record.cost;
            const profitMargin = ((profit / record.cost) * 100).toFixed(1);

            return (
              <div key={record.id} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-stone-100 hover:shadow-xl hover:border-emerald-100 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 -mr-16 -mt-16 transition-opacity"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-emerald-900 text-white rounded-[24px] flex flex-col items-center justify-center font-bold shadow-lg shadow-emerald-100">
                      <span className="text-[10px] uppercase opacity-60">Status</span>
                      <Package className="w-6 h-6 mt-1" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">{record.cropName}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="text-sm font-bold text-stone-400 flex items-center gap-1.5 uppercase tracking-tighter">
                          Planted: <span className="text-stone-700 font-black">{format(new Date(record.plantingDate), 'MMM d, yyyy')}</span>
                        </span>
                        <div className="w-1 h-1 rounded-full bg-stone-300 hidden md:block"></div>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          record.status === 'Growing' ? 'bg-amber-100 text-amber-700' :
                          record.status === 'Harvested' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="text-right md:text-left">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Investment</p>
                      <p className="text-lg font-black text-stone-900">GH₵{record.cost.toLocaleString()}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Expected Rev.</p>
                      <p className="text-lg font-black text-emerald-700">GH₵{record.expectedRevenue.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col items-end md:items-start">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Est. Profit</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-black text-stone-900">GH₵{profit.toLocaleString()}</p>
                        <div className={`flex items-center text-xs font-bold ${Number(profitMargin) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                           {Number(profitMargin) >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                           {profitMargin}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-6 md:pt-0 border-t md:border-t-0 border-stone-50">
                    <button className="flex-1 md:flex-none p-4 rounded-2xl bg-stone-50 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="flex-1 md:flex-none p-4 rounded-2xl bg-stone-50 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="flex-1 md:flex-none p-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-stone-200">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <Search className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">No records found</h2>
            <p className="text-stone-500 mb-8 max-w-xs mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilter('All');}}
              className="text-emerald-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewRecords;
