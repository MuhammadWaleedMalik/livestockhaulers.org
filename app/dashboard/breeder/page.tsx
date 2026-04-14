'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getMyLoads, toggleLoadStatus, deleteLoad } from '@/app/actions/load';
import { Button } from '@/components/ui/button';
import { LoadStatus } from '@/lib/types';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function BreederDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    const data = await getMyLoads();
    setLoads(data);
    setLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: LoadStatus) => {
    const newStatus = currentStatus === LoadStatus.ACTIVE ? LoadStatus.FILLED : LoadStatus.ACTIVE;
    const res = await toggleLoadStatus(id, newStatus);
    if (res.success) {
      toast.success(`Load marked as ${newStatus}`);
      fetchLoads();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this load?")) {
      const res = await deleteLoad(id);
      if (res.success) {
        toast.success("Load deleted successfully");
        fetchLoads();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-yellow-400 uppercase tracking-tighter">Breeder Dashboard</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage your posted loads and track hauler interest.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-yellow-400 rounded-full" />
              My Active Posts
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
              </div>
            ) : loads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                You haven't posted any loads yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest font-black">
                      <th className="pb-4 px-4">Animal Type</th>
                      <th className="pb-4 px-4">From → To</th>
                      <th className="pb-4 px-4">Status</th>
                      <th className="pb-4 px-4">Interests</th>
                      <th className="pb-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loads.map((load) => (
                      <tr key={load._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4">
                          <div className="font-bold text-lg">{load.animalType}</div>
                          <div className="text-xs text-gray-400">{load.quantity} Head</div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="text-sm font-semibold">{load.pickupLocation}</div>
                          <div className="text-xs text-gray-500">to {load.deliveryLocation}</div>
                        </td>
                        <td className="py-6 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            load.status === LoadStatus.ACTIVE ? 'bg-yellow-400/20 text-yellow-400' : 'bg-green-400/20 text-green-400'
                          }`}>
                            {load.status}
                          </span>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-400/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                              {load.interestCount || 0}
                            </span>
                            <span className="text-xs text-gray-500">Clicks</span>
                          </div>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => handleToggleStatus(load._id, load.status)}
                              className={`p-2 rounded-full transition-all ${
                                load.status === LoadStatus.ACTIVE ? 'bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black' : 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                              }`}
                              title={load.status === LoadStatus.ACTIVE ? "Mark as Filled" : "Mark as Active"}
                            >
                              {load.status === LoadStatus.ACTIVE ? <CheckCircle size={18} /> : <Clock size={18} />}
                            </Button>
                            <Button
                              onClick={() => handleDelete(load._id)}
                              className="p-2 rounded-full bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-black transition-all"
                              title="Delete Post"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
