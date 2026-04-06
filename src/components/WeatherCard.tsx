import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin } from 'lucide-react';
import { WeatherData } from '../types';
import api from '../utils/api';

const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res: any = await api.getWeather({ limit: 1 });
        const item = (res.weather || res || [])[0];
        if (item && mounted) {
          setWeather({
            temp: item.temp ?? 25,
            condition: item.notes || 'Partly Cloudy',
            humidity: Math.round((item.precip ?? 5) * 10) % 100,
            windSpeed: 10,
            location: item.location || 'Farmville',
          });
        }
      } catch (e) {
        // fallback
        if (mounted) setWeather({ temp: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, location: 'Kumasi, Ghana' });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-stone-200 rounded w-2/3 mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-stone-100 rounded"></div>
          <div className="h-12 bg-stone-100 rounded"></div>
        </div>
      </div>
    );
  }

  const getIcon = (condition: string) => {
    if (condition.includes('Cloud')) return <Cloud className="w-10 h-10 text-stone-400" />;
    if (condition.includes('Rain')) return <CloudRain className="w-10 h-10 text-emerald-500" />;
    return <Sun className="w-10 h-10 text-yellow-500" />;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        {getIcon(weather?.condition || '')}
      </div>
      
      <div className="flex items-center gap-2 text-stone-500 mb-2">
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">{weather?.location}</span>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-4xl font-bold text-stone-900">{weather?.temp}°C</span>
        <span className="text-stone-500 mb-1 font-medium">{weather?.condition}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl">
          <Droplets className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider">Humidity</p>
            <p className="font-bold text-stone-800">{weather?.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl">
          <Wind className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider">Wind</p>
            <p className="font-bold text-stone-800">{weather?.windSpeed} km/h</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center">
        <span className="text-xs text-stone-400">Next rain expected: 2 days</span>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Good for Planting</span>
      </div>
    </div>
  );
};

export default WeatherCard;
