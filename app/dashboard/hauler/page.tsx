'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAvailableLoads, submitInterest } from '@/app/actions/load';
import { Button } from '@/components/ui/button';
import { Search, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function HaulerDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    const data = await getAvailableLoads();
    setLoads(data);
    setLoading(false);
  };

  const handleInterest = async (id: string) => {
    const res = await submitInterest(id);
    if (res.success) {
      toast.success("Interest sent to breeder! They have been notified.");
      fetchLoads();
    } else {
      toast.error(res.error || "Failed to submit interest");
    }
  };

  const filteredLoads = loads.filter(load => 
    load.animalType.toLowerCase().includes(filter.toLowerCase()) ||
    load.pickupLocation.toLowerCase().includes(filter.toLowerCase()) ||
    load.deliveryLocation.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-yellow-400 uppercase tracking-tighter">Hauler Dashboard</h1>
          <p className="text-gray-400 mt-2 font-medium">Browse available loads and express interest.</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by animal type or location..." 
                className="w-full bg-black/50 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-yellow-400 transition-all font-medium"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-yellow-400/20 transform hover:-translate-y-1">
              Search Loadboard
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No loads found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLoads.map((load) => (
                <div key={load._id} className="bg-black/50 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-yellow-400/10 text-yellow-400 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-yellow-400/20">
                      {load.animalType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-4">{load.breederId?.profile?.companyName || "Private Breeder"}</h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-600">Pickup</div>
                        <div className="font-semibold text-white">{load.pickupLocation}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                        <CheckCircle size={16} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-600">Delivery</div>
                        <div className="font-semibold text-white">{load.deliveryLocation}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      {load.quantity} Head
                    </div>
                    <Button 
                      onClick={() => handleInterest(load._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      I'm Interested
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
