import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Cloud, TrendingUp, BookOpen, ArrowRight, ShieldCheck, PieChart, Phone } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-stone-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Tractor className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold text-stone-900 tracking-tight">FarmTrack Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-stone-600 font-medium hover:text-emerald-600 transition-colors">Features</a>
            <a href="#about" className="text-stone-600 font-medium hover:text-emerald-600 transition-colors">About</a>
            <Link to="/login" className="text-stone-900 font-bold hover:text-emerald-600 transition-colors">Login</Link>
            <Link to="/register" className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-200/50">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
              <ShieldCheck className="w-4 h-4" /> Trusted by 5,000+ farmers
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-stone-900 leading-[1.1] mb-6">
              Empowering Farmers with <span className="text-emerald-600">Smart Data</span>.
            </h1>
            <p className="text-xl text-stone-600 mb-10 max-w-lg leading-relaxed">
              Take full control of your farm. Track crops, monitor market prices, and get real-time weather alerts—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200/50">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center justify-center gap-2 bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
            <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-stone-100 rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-stone-50 rounded-3xl p-4">
                        <PieChart className="w-8 h-8 text-emerald-600 mb-2" />
                        <div className="h-2 bg-stone-200 rounded w-full mb-1"></div>
                        <div className="h-2 bg-stone-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-32 bg-stone-50 rounded-3xl p-4">
                        <Cloud className="w-8 h-8 text-blue-500 mb-2" />
                        <div className="h-2 bg-stone-200 rounded w-full mb-1"></div>
                        <div className="h-2 bg-stone-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-40 col-span-2 bg-stone-900 rounded-3xl p-6 flex flex-col justify-end">
                        <p className="text-stone-400 text-xs font-bold uppercase mb-1">Harvest Forecast</p>
                        <p className="text-white text-3xl font-bold">+12,500 kg</p>
                        <div className="mt-4 flex gap-1 items-end h-12">
                            {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                                <div key={i} style={{height: `${h}%`}} className="flex-1 bg-emerald-500 rounded-t-sm"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Powerful Tools for Modern Farmers</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">Everything you need to optimize your yield and manage your agricultural operations efficiently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Cloud, title: 'Smart Weather', desc: 'Hyper-local weather forecasts and planting window alerts for your exact location.' },
              { icon: TrendingUp, title: 'Market Insights', desc: 'Real-time commodity prices and market trends to help you sell at the best time.' },
              { icon: BookOpen, title: 'Farm Ledger', desc: 'Professional record keeping for crops, expenses, and harvests to track your profit.' },
              { icon: Phone, title: 'SMS Notifications', desc: 'Get critical alerts via SMS even without internet access in your farm.' },
              { icon: PieChart, title: 'Yield Prediction', desc: 'AI-driven insights to predict your harvest volume based on historical data.' },
              { icon: ShieldCheck, title: 'Secure Data', desc: 'Your farm data is encrypted and backed up securely in the cloud.' },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-stone-50 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors shadow-sm">
                  <f.icon className="w-8 h-8 text-emerald-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{f.title}</h3>
                <p className="text-stone-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-emerald-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Farm?</h2>
          <p className="text-emerald-100 mb-10 text-lg max-w-xl mx-auto">Join thousands of farmers who are already making smarter decisions with FarmTrack Pro.</p>
          <Link to="/register" className="inline-block bg-white text-emerald-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all hover:scale-105">
            Get Started Now
          </Link>
          <p className="mt-8 text-emerald-400 font-medium italic">"Developed by Paul Sarfo with a passion for agriculture"</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Tractor className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-stone-900">FarmTrack Pro</span>
          </div>
          <p className="text-stone-500 text-sm">© 2024 FarmTrack Pro. All rights reserved. Built with love by Paul Sarfo.</p>
          <div className="flex gap-6 text-stone-400">
            <a href="#" className="hover:text-stone-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
