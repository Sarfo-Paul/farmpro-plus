import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';
import api from '../utils/api';
import { FarmRecord } from '../types';
import { Save, X, Calendar, DollarSign, Sprout, ClipboardList } from 'lucide-react';

const AddRecord: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<FarmRecord, 'id'>>({
    cropName: '',
    plantingDate: new Date().toISOString().split('T')[0],
    harvestDate: '',
    cost: 0,
    expectedRevenue: 0,
    status: 'Planned',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map frontend form to backend record shape
      const payload = {
        crop: formData.cropName,
        date: formData.plantingDate,
        quantity: 1,
        price: formData.expectedRevenue || formData.cost || 0,
        notes: formData.notes,
        location: 'Field A',
      };
      await api.createRecord(payload);
    } catch (err) {
      // fallback to local storage
      const newRecord: FarmRecord = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      const currentRecords = storage.getRecords();
      storage.saveRecords([...currentRecords, newRecord]);
    }
    navigate('/records');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'expectedRevenue' ? Number(value) : value,
    }));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10">
        <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                <ClipboardList className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-stone-900 leading-tight mb-2 tracking-tight">Create Farm Record</h1>
            <p className="text-stone-500 max-w-md font-medium">Keep track of your investment and monitor your crops from planting to harvest.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600"></div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-500 mb-3 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" /> CROP NAME
              </label>
              <input
                required
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleChange}
                placeholder="e.g. Premium Hybrid Maize"
                className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-stone-900 font-bold placeholder:text-stone-300 placeholder:font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-500 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" /> PLANTING DATE
              </label>
              <input
                required
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-500 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" /> EST. HARVEST DATE
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-500 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> INVESTMENT COST (GH₵)
              </label>
              <input
                required
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-500 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> EXPECTED REVENUE (GH₵)
              </label>
              <input
                required
                type="number"
                name="expectedRevenue"
                value={formData.expectedRevenue}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-500 mb-3">CURRENT STATUS</label>
              <div className="flex flex-wrap gap-3">
                {['Planned', 'Growing', 'Harvested'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: status as FarmRecord['status'] }))}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      formData.status === status
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50'
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-500 mb-3">ADDITIONAL NOTES</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-medium text-stone-900"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-200/50"
            >
              <Save className="w-6 h-6" /> Save Record
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center bg-stone-100 text-stone-500 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-stone-200 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddRecord;
