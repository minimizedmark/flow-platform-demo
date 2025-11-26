'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, MapPin, Clock, Navigation, AlertCircle, 
  DollarSign, FileText, Droplets, Calendar, Users,
  CheckCircle, TrendingUp, PhoneCall, Mail, Search,
  Plus, Download, Send, Edit, Trash2, Filter, Home,
  Settings, LogOut, Bell, Menu, X, ChevronRight,
  BarChart3, Activity
} from 'lucide-react';

// Edmonton HVAC Tech Data
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
    route: [
      { lat: 53.5100, lng: -113.4800 },
      { lat: 53.5150, lng: -113.4750 },
      { lat: 53.5200, lng: -113.4700 },
      { lat: 53.5250, lng: -113.4650 },
      { lat: 53.5300, lng: -113.4600 },
    ]
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
    route: [
      { lat: 53.5444, lng: -113.4909 },
    ]
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
    route: [
      { lat: 53.5280, lng: -113.5100 },
      { lat: 53.5300, lng: -113.5200 },
      { lat: 53.5320, lng: -113.5300 },
      { lat: 53.5340, lng: -113.5400 },
      { lat: 53.5360, lng: -113.5500 },
    ]
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
    route: [
      { lat: 53.5700, lng: -113.4200 },
      { lat: 53.5650, lng: -113.4300 },
      { lat: 53.5600, lng: -113.4400 },
    ]
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
    route: [
      { lat: 53.5200, lng: -113.5000 },
      { lat: 53.5230, lng: -113.4950 },
      { lat: 53.5260, lng: -113.4900 },
      { lat: 53.5290, lng: -113.4850 },
      { lat: 53.5320, lng: -113.4800 },
    ]
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
  const [techPositions, setTechPositions] = useState<{[key: number]: number}>({});
  const [updates, setUpdates] = useState(0);
  const [revenue, setRevenue] = useState(8450);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            const currentPos = newPositions[tech.id] || 0;
            newPositions[tech.id] = (currentPos + 1) % 5;
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
                <div className="font-bold text-white">Flow</div>
                <div className="text-xs text-slate-400">Platform</div>
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

      <div className="p-3 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span>Settings</span>}
        </button>
      </div>
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
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View Details →
            </button>
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

const GPSView = () => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const initMap = async () => {
        const L = (await import('leaflet')).default;
        
        // Fix for default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const map = L.map('map-container').setView([53.5444, -113.4909], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        TECHS.forEach((tech) => {
          const position = techPositions[tech.id] || 0;
          const currentPos = tech.route ? tech.route[position % tech.route.length] : { lat: 53.5444, lng: -113.4909 };

          const icon = L.divIcon({
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: ${tech.color}30;
                border: 3px solid ${tech.color};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${tech.color}" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
            `,
            className: 'custom-truck-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          const marker = L.marker([currentPos.lat, currentPos.lng], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <div style="font-weight: bold; margin-bottom: 4px; color: ${tech.color};">${tech.name}</div>
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">${tech.truck}</div>
                ${tech.customer ? `
                  <div style="font-size: 13px; margin-top: 8px;">
                    <strong style="color: #e2e8f0;">${tech.customer}</strong><br/>
                    <span style="font-size: 11px; color: #64748b;">${tech.currentJob}</span><br/>
                    <span style="font-size: 11px; color: #94a3b8;">${tech.jobType}</span>
                  </div>
                  ${tech.eta ? `<div style="margin-top: 8px; color: #3b82f6; font-weight: bold;">ETA: ${tech.eta} min</div>` : ''}
                ` : `
                  <div style="font-size: 13px; color: #64748b;">${tech.jobType}</div>
                `}
              </div>
            `);

          markersRef.current[tech.id] = marker;
        });
      };

      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      TECHS.forEach((tech) => {
        const marker = markersRef.current[tech.id];
        if (marker && tech.route) {
          const position = techPositions[tech.id] || 0;
          const currentPos = tech.route[position % tech.route.length];
          marker.setLatLng([currentPos.lat, currentPos.lng]);
        }
      });
    }
  }, [techPositions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Active Technicians</h2>
          <div className="space-y-3">
            {TECHS.map(tech => (
              <div
                key={tech.id}
                onClick={() => {
                  setSelectedTech(tech.id);
                  const marker = markersRef.current[tech.id];
                  if (marker && mapRef.current) {
                    marker.openPopup();
                    const position = techPositions[tech.id] || 0;
                    const currentPos = tech.route ? tech.route[position % tech.route.length] : { lat: 53.5444, lng: -113.4909 };
                    mapRef.current.setView([currentPos.lat, currentPos.lng], 15);
                  }
                }}
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
          
          <div 
            id="map-container" 
            className="w-full h-[600px] rounded-lg overflow-hidden"
            style={{ background: '#1e293b' }}
          ></div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-300 mb-1">Live GPS Tracking</div>
                <div className="text-xs text-blue-400/80">
                  Real Edmonton streets. Click any truck marker for details. In production, connects to actual GPS devices with 2-3 second updates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const ScheduleView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Schedule</h2>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="space-y-4">
          {JOBS.map(job => (
            <div key={job.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition">
              <div className="flex-shrink-0">
                <div className="text-sm font-semibold text-slate-400">{job.time}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">{job.customer}</div>
                <div className="text-sm text-slate-400">{job.address}</div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-slate-500">{job.type}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{job.tech}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-white">${job.value}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)} text-white mt-1`}>
                    {job.status}
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">AI Scheduling Suggestion</h3>
            <p className="text-slate-300 text-sm mb-3">
              Reroute Mike Rodriguez to Smith Commercial (12045 104 St) instead. He's 8 minutes closer than Steve, 
              and has Carrier certification needed for the job. Saves 15 minutes drive time.
            </p>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Apply Suggestion →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
 const InvoicesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Invoices</h2>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="text-sm text-slate-400 mb-1">Total Outstanding</div>
          <div className="text-3xl font-bold text-white">$2,130</div>
          <div className="text-sm text-orange-400 mt-1">2 overdue</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="text-sm text-slate-400 mb-1">Paid This Month</div>
          <div className="text-3xl font-bold text-white">$42,850</div>
          <div className="text-sm text-green-400 mt-1">+18% vs last month</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="text-sm text-slate-400 mb-1">Avg Payment Time</div>
          <div className="text-3xl font-bold text-white">8 days</div>
          <div className="text-sm text-blue-400 mt-1">-2 days improvement</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="space-y-4">
          {INVOICES.map(invoice => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-semibold text-white">{invoice.id}</div>
                  <div className="text-sm text-slate-400">{invoice.customer}</div>
                  <div className="text-xs text-slate-500 mt-1">{invoice.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-white">${invoice.amount}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)} text-white mt-1`}>
                    {invoice.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-slate-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-slate-400 hover:text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">AI-Generated Invoice Ready</h3>
            <p className="text-slate-300 text-sm mb-3">
              From Mike's job notes: "Replaced failed 45µF capacitor on Carrier unit, tested operation, system cooling normally."
              Auto-generated invoice with parts ($45) + labor ($135) = $180 + tax. Ready to send.
            </p>
            <div className="flex gap-3">
              <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                Review & Send →
              </button>
              <button className="text-slate-400 hover:text-slate-300 text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RefrigerantView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Refrigerant Tracking</h2>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
          <Download className="w-4 h-4" />
          EPA Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REFRIGERANTS.map(ref => (
          <div key={ref.type} className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className={`w-5 h-5 ${ref.stock < ref.low_threshold ? 'text-red-400' : 'text-blue-400'}`} />
                <h3 className="font-semibold text-white">{ref.type}</h3>
              </div>
              {ref.stock < ref.low_threshold && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-400">Current Stock</div>
                <div className="text-2xl font-bold text-white">{ref.stock} {ref.unit}</div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Used Today</span>
                <span className="text-white font-medium">{ref.used_today} {ref.unit}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Cost/lb</span>
                <span className="text-white font-medium">${ref.cost_per_lb}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-700">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${ref.stock < ref.low_threshold ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${(ref.stock / (ref.low_threshold * 2)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {ref.stock < ref.low_threshold ? 'Low stock - reorder soon' : 'Stock level good'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Usage</h3>
        <div className="space-y-3">
          {[
            { tech: 'Mike Rodriguez', job: 'Johnson Residence', type: 'R-410A', amount: 3, time: '10:45 AM' },
            { tech: 'Danny Chen', job: 'Downtown Office', type: 'R-410A', amount: 2, time: '9:30 AM' },
            { tech: 'James Wilson', job: 'Brown Residence', type: 'R-22', amount: 1.5, time: '11:20 AM' },
            { tech: 'Steve Martinez', job: 'West Ed Install', type: 'R-410A', amount: 8, time: '2:15 PM' },
          ].map((usage, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div>
                <div className="font-medium text-white">{usage.tech}</div>
                <div className="text-sm text-slate-400">{usage.job}</div>
                <div className="text-xs text-slate-500 mt-1">{usage.time}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">{usage.amount} lbs</div>
                <div className="text-sm text-slate-400">{usage.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">EPA Compliance Active</h3>
            <p className="text-slate-300 text-sm mb-3">
              All refrigerant usage automatically logged. Monthly EPA 608 report generation ready. 
              Current compliance: <span className="text-green-400 font-semibold">100%</span>
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Generate Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Customers</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search customers..."
              className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            <Plus className="w-4 h-4" />
            New Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="text-sm text-slate-400 mb-1">Total Customers</div>
          <div className="text-3xl font-bold text-white">247</div>
          <div className="text-sm text-green-400 mt-1">+12 this month</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="text-sm text-slate-400 mb-1">Active This Month</div>
          <div className="text-3xl font-bold text-white">89</div>
          <div className="text-sm text-blue-400 mt-1">36% of total</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="text-sm text-slate-400 mb-1">Avg Lifetime Value</div>
          <div className="text-3xl font-bold text-white">$3,240</div>
          <div className="text-sm text-purple-400 mt-1">Per customer</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="space-y-3">
          {[
            { name: 'Johnson Family', address: '8423 Gateway Blvd', phone: '(780) 555-1234', lastService: '2 weeks ago', jobs: 8, value: 2840 },
            { name: 'Downtown Office Tower', address: '10234 Jasper Ave', phone: '(780) 555-5678', lastService: 'Today', jobs: 24, value: 12450 },
            { name: 'Anderson Family', address: '5623 82 Ave', phone: '(780) 555-9012', lastService: '1 month ago', jobs: 6, value: 1980 },
            { name: 'Smith Commercial', address: '12045 104 St', phone: '(780) 555-3456', lastService: '3 days ago', jobs: 15, value: 8200 },
            { name: 'Brown Residence', address: '9234 Calgary Trail', phone: '(780) 555-7890', lastService: 'Today', jobs: 4, value: 1450 },
          ].map((customer, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{customer.name}</div>
                  <div className="text-sm text-slate-400">{customer.address}</div>
                  <div className="text-xs text-slate-500 mt-1">{customer.phone}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">${customer.value.toLocaleString()}</div>
                <div className="text-sm text-slate-400">{customer.jobs} jobs</div>
                <div className="text-xs text-slate-500 mt-1">Last: {customer.lastService}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
              <button className="relative text-slate-400 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
