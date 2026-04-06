import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { storage } from '../utils/storage';

const Admin: React.FC = () => {
  const user = storage.getUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res: any = await api.adminGetUsers();
        if (mounted) setUsers(res.users || res || []);
      } catch (err: any) {
        alert('Admin access required');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete user?')) return;
    try {
      await api.adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('Deleted');
    } catch (e: any) {
      alert(e?.message || 'Delete failed');
    }
  };

  if (!user?.isAdmin) {
    return (
      <Layout>
        <div className="p-6">You do not have access to the admin panel.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Admin Panel</h1>
        <p className="text-stone-500">Manage users and market prices</p>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-2xl">Loading...</div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="font-bold mb-4">Users</h2>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-bold">{u.name || u.email}</div>
                  <div className="text-sm text-stone-500">{u.email}</div>
                </div>
                <div>
                  <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Admin;
