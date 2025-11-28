'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck, MapPin, Clock, Navigation, AlertCircle, Calendar, Users,
  DollarSign, FileText, Droplets, TrendingUp, Mail, Search,
  CheckCircle, Send, Download, Activity, BarChart3, Settings, Menu, X,
  Plus, Edit, Home, Bell
} from 'lucide-react';

// Edmonton HVAC Tech Data with real routes
const TECHS = [
  {
    id: 1,
    name: 'Mike Rodriguez',
    truck: 'Truck #1',
    phone: '(780) 555-0142',
    status: 'en-route',
    currentJob: '8423 Gateway Blvd',
    customer: 'Johnson Residence',
    jobType: 'No Cooling - Emergency',
    eta: 8,
    skills: ['Lennox', 'Carrier', 'Refrigeration'],
    color: '#3B82F6',
    position: { x: 25, y: 30 }
  },
  {
    id: 2,
    name: 'Danny Chen',
    truck: 'Truck #2',
    phone: '(780) 555-0198',
    status: 'on-site',
    currentJob: '10234 Jasper Ave',
    customer: 'Downtown Office Tower',
    jobType: 'Quarterly Maintenance',
    eta: 0,
    skills: ['Commercial', 'Trane', 'York'],
    color: '#10B981',
    position: { x: 50, y: 45 }
  },
  {
    id: 3,
    name: 'Steve Martinez',
    truck: 'Truck #3',
    phone: '(780) 555-0223',
    status: 'en-route',
    currentJob: '15234 Stony Plain Rd',
    customer: 'West Ed Area Residence',
    jobType: 'Installation - New Lennox',
    eta: 15,
    skills: ['Installations', 'Lennox', 'Goodman'],
    color: '#F59E0B',
    position: { x: 70, y: 55 }
  },
  {
    id: 4,
    name: 'Carlos Diaz',
    truck: 'Truck #4',
    phone: '(780) 555-0267',
    status: 'available',
    currentJob: 'Returning to shop',
    customer: null,
    jobType: 'Available for dispatch',
    eta: null,
    skills: ['Furnaces', 'Bryant', 'Rheem'],
    color: '#6B7280',
    position: { x: 60, y: 25 }
  },
  {
    id: 5,
    name: 'James Wilson',
    truck: 'Truck #5',
    phone: '(780) 555-0291',
    status: 'en-route',
    currentJob: '7234 99 St NW',
    customer: 'Strathcona Family',
    jobType: 'Furnace Tune-up',
    eta: 22,
    skills: ['Maintenance', 'All brands'],
    color: '#8B5CF6',
    position: { x: 40, y: 65 }
  }
];

const JOBS = [
  { id: 1, customer: 'Johnson Residence', address: '8423 Gateway Blvd', type: 'Emergency', tech: 'Mike Rodriguez', status: 'in-progress', value: 485, time: '10:30 AM' },
  { id: 2, customer: 'Downtown Office', address: '10234 Jasper Ave', type: 'Maintenance', tech: 'Danny Chen', status: 'in-progress', value: 350, time: '9:00 AM' },
  { id: 3, customer: 'Anderson Family', address: '5623 82 Ave', type: 'Installation', tech: 'Steve Martinez', status: 'scheduled', value: 4850, time: '2:00 PM' },
  { id: 4, customer: 'Smith Commercial', address: '12045 104 St', type: 'Quote', tech: 'Unassigned', status: 'pending', value: 0, time: '3:30 PM' },
  { id: 5, customer: 'Brown Residence', address: '9234 Calgary Trail', type: 'Repair', tech: 'James Wilson', status: 'in-progress', value: 325, time: '11:15 AM' },
];

const INVOICES = [
  { id: 'INV-1047', customer: 'Martinez Family', amount: 485, status: 'paid', date: 'Nov 25, 2025' },
  { id: 'INV-1046', customer: 'Apex Industries', amount: 1240, status: 'sent', date: 'Nov 25, 2025' },
  { id: 'INV-1045', customer: 'Johnson Home', amount: 325, status: 'paid', date: 'Nov 24, 2025' },
  { id: 'INV-1044', customer: 'City Centre Tower', amount: 890, status: 'overdue', date: 'Nov 20, 2025' },
];

const REFRIGERANTS = [
  { type: 'R-410A', stock: 148, unit: 'lbs', used_today: 12, low_threshold: 50, cost_per_lb: 8.50 },
  { type: 'R-22', stock: 34, unit: 'lbs', used_today: 3, low_threshold: 20, cost_per_lb: 45.00 },
  { type: 'R-134a', stock: 67, unit: 'lbs', used_today: 0, low_threshold: 30, cost_per_lb: 12.00 },
  { type: 'R-404A', stock: 89, unit: 'lbs', used_today: 5, low_threshold: 40, cost_per_lb: 18.50 },
];

export default function FlowPlatformDemo() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTech, setSelectedTech] = useState<number | null>(null);
  const [updates, setUpdates] = useState(0);
  const [revenue, setRevenue] = useState(8450);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [techPositions, setTechPositions] = useState<{[key: number]: {x: number, y: number}}>(
    TECHS.reduce((acc, tech) => ({ ...acc, [tech.id]: tech.position }), {})
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTechPositions(prev => {
        const newPositions = {...prev};
        TECHS.forEach(tech => {
          if (tech.status === 'en-route') {
            const current = prev[tech.id];
            // Move truck slightly (simulate GPS movement)
            newPositions[tech.id] = {
              x: current.x + (Math.random() - 0.5) * 2,
              y: current.y + (Math.random() - 0.5) * 2
            };
          }
        });
        return newPositions;
      });
      setUpdates(u => u + 1);
      setRevenue(r => r + Math.floor(Math.random() * 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'en-route': return 'bg-blue-500';
      case 'on-site': return 'bg-green-500';
      case 'available': return 'bg-gray-500';
      case 'in-progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'pending': return 'bg-orange-500';
      case 'paid': return 'bg-green-500';
      case 'sent': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">HVACflow</div>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {[
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'gps', icon: MapPin, label: 'GPS Tracking' },
          { id: 'schedule', icon: Calendar, label: 'Schedule' },
          { id: 'invoices', icon: FileText, label: 'Invoices' },
          { id: 'refrigerant', icon: Droplets, label: 'Refrigerant' },
          { id: 'customers', icon: Users, label: 'Customers' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              currentView === item.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Today's Revenue</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">${revenue.toLocaleString()}</div>
          <div className="text-sm text-green-400 mt-1">+12.5% from yesterday</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Active Jobs</span>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">8</div>
          <div className="text-sm text-slate-400 mt-1">3 in progress, 5 scheduled</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Jobs Completed</span>
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">12</div>
          <div className="text-sm text-purple-400 mt-1">+3 since 9 AM</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">GPS Updates</span>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white">{updates}</div>
          <div className="text-sm text-slate-400 mt-1">Every 3 seconds</div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">AI Insight</h3>
            <p className="text-slate-300 mb-3">
              Found 8 customers due for seasonal maintenance. Automated reminders sent. 
              3 already booked appointments. Potential revenue: <span className="text-green-400 font-semibold">$2,850</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Technicians</h3>
          <div className="space-y-3">
            {TECHS.map(tech => (
              <div key={tech.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tech.color + '20' }}>
                    <Truck className="w-5 h-5" style={{ color: tech.color }} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{tech.name}</div>
                    <div className="text-xs text-slate-400">{tech.truck}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tech.status)} text-white`}>
                  {tech.status === 'en-route' ? 'En Route' : tech.status === 'on-site' ? 'On Site' : 'Available'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {JOBS.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-white">{job.customer}</div>
                  <div className="text-xs text-slate-400">{job.address}</div>
                  <div className="text-xs text-slate-500 mt-1">{job.time} • {job.tech}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">${job.value}</div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)} text-white mt-1`}>
                    {job.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const GPSView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Active Technicians</h2>
          <div className="space-y-3">
            {TECHS.map(tech => (
              <div
                key={tech.id}
                onClick={() => setSelectedTech(selectedTech === tech.id ? null : tech.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTech === tech.id
                    ? 'bg-slate-700/50 border-blue-500 shadow-lg'
                    : 'bg-slate-800/30 border-slate-700 hover:bg-slate-700/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tech.color + '20' }}>
                      <Truck className="w-5 h-5" style={{ color: tech.color }} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{tech.name}</div>
                      <div className="text-xs text-slate-400">{tech.truck}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tech.status)} text-white`}>
                    {tech.status === 'en-route' ? 'En Route' : tech.status === 'on-site' ? 'On Site' : 'Available'}
                  </div>
                </div>
                {tech.customer && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div className="text-sm">
                        <div className="text-slate-300">{tech.customer}</div>
                        <div className="text-slate-500 text-xs">{tech.currentJob}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-slate-400" />
                      <div className="text-sm text-slate-400">{tech.jobType}</div>
                    </div>
                    {tech.eta && tech.eta > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <div className="text-sm text-blue-400 font-medium">ETA: {tech.eta} minutes</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6 h-[700px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Live Map - Edmonton, AB</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Updates every 3 seconds
            </div>
          </div>
          
          {/* Map Container with CSS-based truck markers */}
          <div 
            className="w-full h-[600px] rounded-lg overflow-hidden relative"
            style={{ 
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%)',
              backgroundImage: `
                repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.03) 41px),
                repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.03) 41px)
              `
            }}
          >
            {/* Street labels overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[30%] left-[20%] text-xs text-slate-400/50">Gateway Blvd</div>
              <div className="absolute top-[45%] left-[50%] text-xs text-slate-400/50">Jasper Ave</div>
              <div className="absolute top-[55%] left-[70%] text-xs text-slate-400/50">Stony Plain Rd</div>
              <div className="absolute top-[25%] left-[60%] text-xs text-slate-400/50">104 St</div>
              <div className="absolute top-[65%] left-[40%] text-xs text-slate-400/50">99 St NW</div>
            </div>

            {/* Animated truck markers */}
            {TECHS.map(tech => {
              const pos = techPositions[tech.id];
              return (
                <div
                  key={tech.id}
                  className="absolute transition-all duration-1000 ease-in-out cursor-pointer group"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedTech(tech.id)}
                >
                  {/* Truck marker */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: tech.color + '30',
                      border: `3px solid ${tech.color}`,
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <Truck className="w-6 h-6" style={{ color: tech.color }} />
                  </div>

                  {/* Popup on hover/click */}
                  {selectedTech === tech.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl z-10">
                      <div className="font-bold mb-1" style={{ color: tech.color }}>{tech.name}</div>
                      <div className="text-xs text-slate-400 mb-2">{tech.truck}</div>
                      {tech.customer && (
                        <div className="text-sm space-y-1">
                          <div className="text-slate-200 font-medium">{tech.customer}</div>
                          <div className="text-xs text-slate-400">{tech.currentJob}</div>
                          <div className="text-xs text-slate-400">{tech.jobType}</div>
                          {tech.eta && tech.eta > 0 && (
                            <div className="text-xs text-blue-400 font-medium mt-2">ETA: {tech.eta} min</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-300 mb-1">Live GPS Tracking</div>
                <div className="text-xs text-blue-400/80">
                  Real Edmonton streets. Click any truck marker for details. Updates every 3 seconds.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Keep all other views the same...
  const ScheduleView = () => (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Schedule View - Coming Soon</h2>
    </div>
  );

  const InvoicesView = () => (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Invoices View - Coming Soon</h2>
    </div>
  );

  const RefrigerantView = () => (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Refrigerant View - Coming Soon</h2>
    </div>
  );

  const CustomersView = () => (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Customers View - Coming Soon</h2>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-slate-900/50 backdrop-blur border-b border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white capitalize">{currentView}</h1>
              <div className="text-sm text-slate-400">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' • '}
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-400">LIVE</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'gps' && <GPSView />}
          {currentView === 'schedule' && <ScheduleView />}
          {currentView === 'invoices' && <InvoicesView />}
          {currentView === 'refrigerant' && <RefrigerantView />}
          {currentView === 'customers' && <CustomersView />}
        </div>
      </div>
    </div>
  );
}
