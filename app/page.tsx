'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Handshake, BarChart3, Briefcase, ExternalLink, MousePointer2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { signupUser } from './actions/user';
import { postLoad, getAvailableLoads } from './actions/load';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { UserRole } from '@/lib/types';

const US_STATES = [
  "Alabama (AL)", "Alaska (AK)", "Arizona (AZ)", "Arkansas (AR)", "California (CA)", "Colorado (CO)", "Connecticut (CT)", "Delaware (DE)", "Florida (FL)", "Georgia (GA)",
  "Hawaii (HI)", "Idaho (ID)", "Illinois (IL)", "Indiana (IN)", "Iowa (IA)", "Kansas (KS)", "Kentucky (KY)", "Louisiana (LA)", "Maine (ME)", "Maryland (MD)",
  "Massachusetts (MA)", "Michigan (MI)", "Minnesota (MN)", "Mississippi (MS)", "Missouri (MO)", "Montana (MT)", "Nebraska (NE)", "Nevada (NV)", "New Hampshire (NH)", "New Jersey (NJ)",
  "New Mexico (NM)", "New York (NY)", "North Carolina (NC)", "North Dakota (ND)", "Ohio (OH)", "Oklahoma (OK)", "Oregon (OR)", "Pennsylvania (PA)", "Rhode Island (RI)", "South Carolina (SC)",
  "South Dakota (SD)", "Tennessee (TN)", "Texas (TX)", "Utah (UT)", "Vermont (VT)", "Virginia (VA)", "Washington (WA)", "West Virginia (WV)", "Wisconsin (WI)", "Wyoming (WY)"
];

const LOAD_TYPES = ["Sheep", "Pig", "Horse", "Goat", "Cattle", "Buffalo"];

export default function Home() {
  const [view, setView] = useState('home');
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [loadingLoads, setLoadingLoads] = useState(false);

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRole.BREEDER);
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Load Form States
  const [loadTitle, setLoadTitle] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');

  useEffect(() => {
    if (view === 'find-a-load') {
      fetchLoads();
    }
  }, [view]);

  const fetchLoads = async () => {
    setLoadingLoads(true);
    const loads = await getAvailableLoads();
    setAvailableLoads(JSON.parse(JSON.stringify(loads)));
    setLoadingLoads(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully!");
      window.location.href = '/dashboard';
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('companyName', companyName);
    formData.append('phone', phone);
    formData.append('address', address);

    const result = await signupUser(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created! Please log in.");
      setView('login');
    }
  };

  const handlePostLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', loadTitle || `${animalType} Load`);
    formData.append('animalType', animalType);
    formData.append('quantity', quantity);
    formData.append('pickupLocation', `${pickupCity}, ${pickupState}`);
    formData.append('deliveryLocation', `${deliveryCity}, ${deliveryState}`);

    const result = await postLoad(formData);
    if (result.error) {
      toast.error(result.error);
      if (result.error.includes("Authentication")) {
        setView('login');
      }
    } else {
      toast.success("Load posted successfully!");
      setView('find-a-load');
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      <Header setView={setView} view={view} />

      <main>
        {view === 'home' ? (
          <div className="flex flex-col bg-black overflow-hidden relative font-sans">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] md:min-h-[800px] flex flex-col justify-center border-b-[20px] border-yellow-400">
              <div className="absolute inset-0">
                <Image src="/how-it-works-hero.png" alt="Truck Background" fill className="object-cover object-center translate-y-20 scale-125 saturate-50" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
                <div className="mb-6">
                  <span className="text-white font-medium tracking-wide text-xs md:text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg backdrop-blur">Livestock Hauling Logistics, <span className="text-yellow-400 font-bold">Simplified</span></span>
                </div>

                <div className="pl-6 md:pl-8 border-l-[6px] md:border-l-[10px] border-yellow-400 mb-8 md:mb-10 py-2">
                  <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black text-white leading-none tracking-tight">We Connect</h1>
                  <h1 className="text-5xl sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem] font-black leading-[1.05] tracking-tight text-white"><span className="text-yellow-400">Haulers</span> & Breeders</h1>
                </div>

                <p className="text-gray-300 max-w-2xl text-base md:text-xl lg:text-xl mb-12 hidden md:block leading-relaxed font-light">
                  Livestock Haulers Hub was created for a simple purpose:
                  To give livestock haulers and livestock breeders a reliable and easy way to transport their animals. Find rates matching your needs securely through us!
                </p>

                <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                  <button onClick={() => setView('post-a-load')} className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-10 py-4 md:px-12 md:py-5 text-[11px] md:text-sm transition-all rounded shadow-[0_0_30px_rgba(250,204,21,0.2)] uppercase tracking-widest transform hover:-translate-y-1">
                    Hire a Hauler
                  </button>
                  <button onClick={() => setView('find-a-load')} className="bg-black/40 backdrop-blur border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-black px-10 py-4 md:px-12 md:py-5 text-[11px] md:text-sm transition-all rounded uppercase tracking-widest transform hover:-translate-y-1">
                    Find a Load
                  </button>
                </div>
              </div>
            </section>

            {/* How It Works Snippet */}
            <section className="bg-white py-20 md:py-32 relative z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <div className="inline-block relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 w-1.5 h-12 bg-yellow-400" />
                  <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-indigo-950 tracking-tight">How It Works</h2>
                </div>

                <p className="max-w-4xl text-gray-500 mx-auto mt-8 mb-10 text-base md:text-lg leading-relaxed font-medium px-4">
                  Livestock Haulers Hub was created for a simple purpose: To give livestock breeders and livestock haulers a secure and easy way to transport their animals. Whether transporting your first goat to a petting zoo or a whole herd across state lines, we want you to reach your destination.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 justify-center mb-16 font-black text-[11px] uppercase tracking-widest text-indigo-950">
                  <button onClick={() => setView('post-a-load')} className="hover:text-yellow-500 transition-colors flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 shadow-sm">Post a Load <div className="bg-orange-100 rounded-full p-1"><ChevronRight className="w-4 h-4 text-orange-400" /></div></button>
                  <button onClick={() => setView('find-a-load')} className="hover:text-yellow-500 transition-colors flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 shadow-sm">Find a Load <div className="bg-orange-100 rounded-full p-1"><ChevronRight className="w-4 h-4 text-orange-400" /></div></button>
                </div>

                <div className="w-full max-w-5xl relative aspect-[21/9] md:aspect-[2.5/1] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setView('how-it-works')}>
                  <Image src="/how-it-works-hero.png" alt="Road Background" fill className="object-cover opacity-80 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors duration-500 group-hover:bg-black/40">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mt-12">
                      <div className="absolute -left-32 -right-32 top-1/2 h-[2px] bg-yellow-400 rounded-full blur-[0.5px] opacity-80 z-0 hidden md:block" />
                      <div className="absolute inset-0 bg-yellow-400 rotate-45 rounded-xl shadow-[0_-20px_60px_rgba(250,204,21,0.2)] border-[5px] border-black flex items-center justify-center z-10">
                        <div className="-rotate-45 flex flex-col items-center justify-center h-full w-full">
                          <div className="text-xl md:text-3xl font-black text-black leading-none tracking-tight">Livestock</div>
                          <div className="text-[10px] md:text-[11px] font-bold text-black tracking-widest uppercase mt-1">HaulersHub.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : view === 'login' ? (
          <section className="min-h-screen flex bg-white font-sans text-neutral-900 border-b-2 mt-12">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
              <div className="w-full max-w-md mt-16 lg:mt-0">
                <h1 className="text-3xl font-bold text-indigo-950 mb-2">Login to Your Account</h1>
                <p className="text-gray-500 mb-8 text-sm">Welcome back to The Hub!</p>
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent transition-all" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent transition-all" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 rounded-full mt-6 transition-colors shadow-lg shadow-black/10 text-sm">
                    Log In
                  </button>
                  <div className="mt-4 flex flex-col gap-1">
                    <p className="text-[11px] text-gray-600">Dont have an account? <span className="font-bold text-indigo-950 cursor-pointer hover:underline" onClick={() => setView('signup')}>Register</span></p>
                  </div>
                </form>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900 pt-20">
              <Image src="/how-it-works-hero.png" alt="Road Background" fill className="object-cover opacity-60 mix-blend-overlay grayscale contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 to-black/80" />
            </div>
          </section>
        ) : view === 'signup' ? (
          <section className="min-h-screen flex bg-white font-sans text-neutral-900 border-b-2 mt-12">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
              <div className="w-full max-w-md mt-16 lg:mt-0">
                <h1 className="text-3xl font-bold text-indigo-950 mb-2">Create Your Account</h1>
                <p className="text-gray-500 mb-8 text-sm">Join the network of professional haulers and breeders.</p>
                <form className="space-y-4" onSubmit={handleSignup}>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setRole(UserRole.BREEDER)}
                      className={`py-3 rounded-lg border-2 font-bold text-xs transition-all ${role === UserRole.BREEDER ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      I AM A BREEDER
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRole(UserRole.HAULER)}
                      className={`py-3 rounded-lg border-2 font-bold text-xs transition-all ${role === UserRole.HAULER ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      I AM A HAULER
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 rounded-full mt-6 transition-colors shadow-lg shadow-black/10 text-sm">
                    Create Account
                  </button>
                  <p className="text-[11px] text-gray-600 text-center mt-4">Already have an account? <span className="font-bold text-indigo-950 cursor-pointer hover:underline" onClick={() => setView('login')}>Log In</span></p>
                </form>
              </div>
            </div>
          </section>
        ) : view === 'post-a-load' ? (
          <section className="min-h-screen bg-white font-sans pt-32 pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-indigo-950 mb-6">Post a Load</h1>
              <div className="bg-white text-left max-w-3xl mx-auto">
                <form className="space-y-6" onSubmit={handlePostLoad}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Origin City</label>
                      <input type="text" className="w-full px-4 py-3 rounded border border-gray-100 focus:ring-1 focus:ring-indigo-900" value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Origin State</label>
                      <select className="w-full px-4 py-3 rounded border border-gray-100 bg-white" value={pickupState} onChange={(e) => setPickupState(e.target.value)} required>
                        <option value="">Select State</option>
                        {US_STATES.map(state => <option key={`orig-${state}`} value={state}>{state}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Destination City</label>
                      <input type="text" className="w-full px-4 py-3 rounded border border-gray-100 focus:ring-1 focus:ring-indigo-900" value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Destination State</label>
                      <select className="w-full px-4 py-3 rounded border border-gray-100 bg-white" value={deliveryState} onChange={(e) => setDeliveryState(e.target.value)} required>
                        <option value="">Select State</option>
                        {US_STATES.map(state => <option key={`dest-${state}`} value={state}>{state}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Load Type</label>
                      <select className="w-full px-4 py-3 rounded border border-gray-100 bg-white" value={animalType} onChange={(e) => setAnimalType(e.target.value)} required>
                        <option value="">-- select a Load Type --</option>
                        {LOAD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Total Headcount</label>
                      <input type="number" className="w-full px-4 py-3 rounded border border-gray-100 focus:ring-1 focus:ring-indigo-900" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#17053B] hover:bg-[#0d0224] text-white px-8 py-4 rounded-full font-bold transition-colors text-sm uppercase tracking-widest">
                    Post Load to Loadboard
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : view === 'find-a-load' ? (
          <section className="min-h-screen bg-white font-sans pt-32 pb-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 mt-8">
                <h1 className="text-3xl md:text-5xl font-bold text-indigo-950 mb-4 tracking-tight">Active Loadboard</h1>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Real-time data from breeders across the country</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-[35%]">
                  <div className="sticky top-32">
                    <h3 className="text-2xl font-black text-indigo-950 mb-3">Filter Search</h3>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" placeholder="City or State" className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-100 rounded-lg focus:border-yellow-400 transition-colors bg-gray-50/50 font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[65%] flex flex-col">
                  {loadingLoads ? (
                    <div className="text-center py-12 text-indigo-950 font-bold">Loading Loads...</div>
                  ) : availableLoads.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No active loads available at this moment.</div>
                  ) : (
                    availableLoads.map((load) => (
                      <div key={load._id} className="border-t-2 border-gray-50 py-8 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-gray-50/50 -mx-6 px-6 rounded-2xl transition-all group">
                        <div className="flex flex-col gap-1.5 flex-grow">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-indigo-950 tracking-tight">{load.breederId?.profile?.companyName || "Verified Breeder"}</h3>
                            <span className="bg-green-100/50 text-green-700 text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-sm border border-green-200/50">
                              {load.animalType}
                            </span>
                          </div>
                          <div className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">
                            {load.quantity} Head
                          </div>
                          <div className="text-indigo-950 text-sm font-semibold mt-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                            <span>{load.pickupLocation}</span>
                            <span className="text-gray-300 mx-1">&rarr;</span>
                            <span>{load.deliveryLocation}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 md:mt-0 pt-2">
                          <button 
                            onClick={() => setView('login')}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            Mark Interest
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : view === 'how-it-works' ? (
          <div className="flex flex-col bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center border-b-[15px] border-yellow-400">
              <div className="absolute inset-0">
                <Image src="/how-it-works-hero.png" alt="How it works" fill className="object-cover saturate-50 contrast-125" priority />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4">How it Works</h1>
                <p className="text-yellow-400 text-lg md:text-xl font-bold tracking-widest uppercase">The Haulers Hub Experience</p>
              </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-gray-50">
                      <Image src="/how-it-works-step1.png" alt="Step 1" fill className="object-cover" />
                    </div>
                    <span className="text-yellow-400 font-black text-6xl mb-4 opacity-30">01</span>
                    <h3 className="text-2xl font-black text-indigo-950 mb-4 uppercase tracking-tight">Breeders Post Loads</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      List your livestock hauling needs including animal type, quantity, and destination. Reach hundreds of professional haulers instantly.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-gray-50">
                      <Image src="/how-it-works-step2.png" alt="Step 2" fill className="object-cover" />
                    </div>
                    <span className="text-yellow-400 font-black text-6xl mb-4 opacity-30">02</span>
                    <h3 className="text-2xl font-black text-indigo-950 mb-4 uppercase tracking-tight">Haulers Express Interest</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Professional haulers review the loadboard and mark their interest in available loads that match their routes and equipment.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-gray-50">
                      <Image src="/how-it-works-step3.png" alt="Step 3" fill className="object-cover" />
                    </div>
                    <span className="text-yellow-400 font-black text-6xl mb-4 opacity-30">03</span>
                    <h3 className="text-2xl font-black text-indigo-950 mb-4 uppercase tracking-tight">Successful Delivery</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Once connected, finalize the details and get your livestock moved safely. Build relationships with trusted hauling professionals.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="bg-black py-20 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight">Ready to <span className="text-yellow-400">Join the Hub?</span></h2>
              <div className="flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('signup')} className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-12 py-5 rounded uppercase tracking-widest transition-all transform hover:scale-105">
                  Get Started Now
                </button>
                <button onClick={() => setView('contact')} className="border-2 border-white/20 hover:border-yellow-400 text-white hover:text-yellow-400 font-black px-12 py-5 rounded uppercase tracking-widest transition-all">
                  Contact Support
                </button>
              </div>
            </section>
          </div>
        ) : view === 'workflow' ? (
          <div className="bg-black min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <span className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-400/20">System Scan</span>
                <h1 className="text-5xl md:text-7xl font-black text-white mt-6 mb-4 tracking-tighter">Operational <span className="text-yellow-400">Workflow</span></h1>
                <p className="text-white/40 text-lg md:text-xl font-light max-w-2xl mx-auto">Complete transparency from the first post to the final delivery.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-12 hover:bg-white/[0.02] transition-colors">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-8">
                    <Search className="text-black w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">1. Discovery Stage</h3>
                  <p className="text-white/40 leading-relaxed font-medium">
                    Breeders publish their requirements on the global loadboard. Haulers utilize advanced filters to find loads that optimize their current routes and minimize empty miles.
                  </p>
                </div>
                <div className="p-12 hover:bg-white/[0.02] transition-colors">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-8">
                    <MousePointer2 className="text-black w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">2. Connection Protocol</h3>
                  <p className="text-white/40 leading-relaxed font-medium">
                    When a hauler matches a load, they "Mark Interest". This creates a direct secure handshake signal to the breeder, initiating the professional engagement process.
                  </p>
                </div>
                <div className="p-12 hover:bg-white/[0.02] transition-colors">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-8">
                    <Handshake className="text-black w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">3. Verification & Logistics</h3>
                  <p className="text-white/40 leading-relaxed font-medium">
                    Both parties finalize rates and schedules. The platform ensures all profiles are verified, maintaining a high standard of trust and reliability within the livestock community.
                  </p>
                </div>
                <div className="p-12 hover:bg-white/[0.02] transition-colors">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-8">
                    <BarChart3 className="text-black w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">4. Execution & Growth</h3>
                  <p className="text-white/40 leading-relaxed font-medium">
                    Hauling is completed and feedback is recorded. Successful haulers build their reputation on the platform, leading to more opportunities and business growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : view === 'partnerships' ? (
          <div className="bg-white min-h-screen">
            <section className="relative h-[80vh] flex items-center border-b-[20px] border-black">
              <div className="absolute inset-0">
                <Image src="/partnership-hero.png" alt="Partnerships" fill className="object-cover" />
                <div className="absolute inset-0 bg-indigo-950/40" />
              </div>
              <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-3xl">
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight">Powering <span className="text-black bg-yellow-400 px-4">Success</span> Together</h1>
                  <p className="text-xl text-white font-bold mb-10 leading-relaxed">
                    Join our network of elite industry partners. We work with livestock associations, insurance providers, and equipment manufacturers to provide the best tools for the community.
                  </p>
                  <button onClick={() => setView('contact')} className="bg-black text-white font-black px-12 py-5 rounded uppercase tracking-widest hover:bg-neutral-800 transition-all">
                    Apply for Partnership
                  </button>
                </div>
              </div>
            </section>

            <section className="py-24">
              <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-black text-indigo-950 mb-8 uppercase tracking-tight">Why Partner with Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-16">
                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h4 className="text-xl font-black text-indigo-950 mb-3">Market Access</h4>
                    <p className="text-gray-500 font-medium">Direct access to thousands of professional livestock haulers and breeders across North America.</p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h4 className="text-xl font-black text-indigo-950 mb-3">Brand Integrity</h4>
                    <p className="text-gray-500 font-medium">Associate your brand with the industry's most reliable and secure logistics platform.</p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h4 className="text-xl font-black text-indigo-950 mb-3">Data Insights</h4>
                    <p className="text-gray-500 font-medium">Gain valuable insights into livestock movement trends and market demands.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : view === 'contact' ? (
          <div className="bg-gray-50 min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                <div className="bg-indigo-950 p-12 text-white md:w-[40%]">
                  <h2 className="text-3xl font-black mb-8 uppercase tracking-tight">Get In <span className="text-yellow-400">Touch</span></h2>
                  <p className="text-indigo-200 font-medium mb-12">Our team is ready to assist you with any questions about the platform or your hauling needs.</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-yellow-400" /></div>
                      <span className="text-sm font-bold">123 Hauler Way, Texas, USA</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Briefcase className="w-5 h-5 text-yellow-400" /></div>
                      <span className="text-sm font-bold">support@haulershub.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-12 md:w-[60%] bg-white">
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! We will contact you soon."); setView('home'); }}>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">First Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-950 transition-all" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Last Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-950 transition-all" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                      <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-950 transition-all" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Subject</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-950 transition-all bg-white" required>
                        <option value="">Select a reason</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="partnership">Partnership Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Message</label>
                      <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-950 transition-all" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg">
                      Send Signal
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section className="min-h-screen flex items-center justify-center pt-20">
            <h1 className="text-white text-4xl font-black">Section Coming Soon</h1>
          </section>
        )}
      </main>

      <Footer setView={setView} />
    </div>
  );
}
