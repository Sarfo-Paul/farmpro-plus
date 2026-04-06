import React from 'react';
import Layout from '../components/Layout';
import WeatherCard from '../components/WeatherCard';
import MarketPrices from '../components/MarketPrices';
import RecentRecords from '../components/RecentRecords';
import StatCards from '../components/StatCards';
import { Plus, Calendar, Settings } from 'lucide-react';
import { storage } from '../utils/storage';
import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const user = storage.getUser();

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4" />
            {today.toLocaleDateString('en-US', options)}
          </div>
          <h1 className="text-4xl font-black text-stone-900 leading-tight tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-stone-500 font-medium">Welcome back{user?.name ? `, ${user.name}` : ''}! Here's what's happening on your farm today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all shadow-sm">
            <Settings className="w-6 h-6" />
          </button>
          <Link 
            to="/add" 
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-200/50"
          >
            <Plus className="w-5 h-5" />
            New Record
          </Link>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <RecentRecords />
          
          <div className="bg-emerald-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-emerald-200/50">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-24 -mt-24"></div>
            <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Optimize Your Harvest</h3>
                <p className="text-emerald-100 mb-6 leading-relaxed">Based on your recent activity, we recommend increasing irrigation in Section B due to the predicted dry spell next week.</p>
                <Link to="/analytics" className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all">View Analytics</Link>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
                <div className="w-32 h-32 bg-emerald-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-700/50">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                        <Plus className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-8">
          <WeatherCard />
          <MarketPrices />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
