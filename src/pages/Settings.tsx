import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { storage } from '../utils/storage';

const Settings: React.FC = () => {
  const user = storage.getUser();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await api.updateMe({ name: name || undefined, password: password || undefined });
      if (res?.user) {
        storage.saveUser({ id: String(res.user.id), name: res.user.name, email: res.user.email, isAdmin: res.user.isAdmin });
        alert('Settings updated');
        setPassword('');
      }
    } catch (err: any) {
      alert(err?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-stone-500">Manage your account</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-2xl">
        <div className="mb-4">
          <label className="text-sm text-stone-500">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-2 p-3 border rounded-lg" />
        </div>

        <div className="mb-4">
          <label className="text-sm text-stone-500">New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-2 p-3 border rounded-lg" />
        </div>

        <div>
          <button disabled={loading} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold">Save Changes</button>
        </div>
      </form>
    </Layout>
  );
};

export default Settings;
