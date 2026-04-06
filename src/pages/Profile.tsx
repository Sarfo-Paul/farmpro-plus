import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { storage } from '../utils/storage';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(storage.getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res: any = await api.me();
        if (res?.user) {
          if (mounted) setUser(res.user);
          storage.saveUser({ id: String(res.user.id), name: res.user.name, email: res.user.email, isAdmin: res.user.isAdmin });
        }
      } catch (e) {
        // use local storage fallback
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Profile</h1>
        <p className="text-stone-500">Your account details</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-2xl">
        <div className="mb-4">
          <label className="text-sm text-stone-500">Name</label>
          <div className="text-lg font-bold">{user?.name || '—'}</div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-stone-500">Email</label>
          <div className="text-lg font-bold">{user?.email || '—'}</div>
        </div>
        <div className="flex gap-3">
          <Link to="/settings" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">Edit Settings</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
