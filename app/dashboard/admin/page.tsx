'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllUsers, verifyHauler } from '@/app/actions/user';
import { getAllLoadsAdmin } from '@/app/actions/load';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/types';
import { CheckCircle2, ShieldCheck, Truck, Users, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'loads'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const usersData = await getAllUsers();
    const loadsData = await getAllLoadsAdmin();
    setUsers(JSON.parse(JSON.stringify(usersData)));
    setLoads(JSON.parse(JSON.stringify(loadsData)));
    setLoading(false);
  };

  const handleVerify = async (userId: string) => {
    const res = await verifyHauler(userId);
    if (res.success) {
      toast.success("User verified successfully");
      fetchData();
    } else {
      toast.error(res.error || "Failed to verify user");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-yellow-400 w-8 h-8" />
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Admin Panel</h1>
            </div>
            <p className="text-gray-400 font-medium">System God View: Monitor users and manage the loadboard ecosystem.</p>
          </div>
          
          <div className="flex bg-neutral-900 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === 'users' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Users size={16} /> Users
            </button>
            <button 
              onClick={() => setActiveTab('loads')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === 'loads' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Truck size={16} /> Loads
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {activeTab === 'users' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-gray-500 text-xs uppercase tracking-widest font-black">
                      <th className="py-5 px-8">Company / Email</th>
                      <th className="py-5 px-8">Role</th>
                      <th className="py-5 px-8">Status</th>
                      <th className="py-5 px-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 px-8">
                          <div className="font-bold text-lg text-white">{user.profile?.companyName || "N/A"}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </td>
                        <td className="py-6 px-8">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            user.role === UserRole.ADMIN ? 'bg-purple-400/20 text-purple-400' : 
                            user.role === UserRole.HAULER ? 'bg-blue-400/20 text-blue-400' : 'bg-orange-400/20 text-orange-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-2">
                            {user.profile?.verified ? (
                              <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded">
                                <CheckCircle2 size={12} /> Verified
                              </div>
                            ) : (
                              <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                Pending
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-8 text-right">
                          {!user.profile?.verified && user.role === UserRole.HAULER && (
                            <Button
                              onClick={() => handleVerify(user._id)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                              Verify Hauler
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-gray-500 text-xs uppercase tracking-widest font-black">
                      <th className="py-5 px-8">Breeder</th>
                      <th className="py-5 px-8">Load Info</th>
                      <th className="py-5 px-8">Route</th>
                      <th className="py-5 px-8">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loads.map((load) => (
                      <tr key={load._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 px-8">
                          <div className="font-bold text-white mb-1">{load.breederId?.profile?.companyName || "Unknown"}</div>
                          <div className="text-xs text-gray-500 italic lowercase">{load.breederId?.email}</div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="font-bold text-lg text-yellow-400">{load.animalType}</div>
                          <div className="text-xs text-gray-400">{load.quantity} Head</div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="text-sm font-semibold">{load.pickupLocation}</div>
                          <div className="text-xs text-gray-500">to {load.deliveryLocation}</div>
                        </td>
                        <td className="py-6 px-8">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            load.status === 'active' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
                          }`}>
                            {load.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
