'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, MapPin, Clock, Navigation, AlertCircle, Calendar, Users,
  DollarSign, FileText, Droplets, TrendingUp, Mail, Search,
  CheckCircle, Send, Download, Activity, BarChart3, Settings, Menu, X
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
  { id: 1, time: '10:30 AM', customer: 'Anderson Family', address: '4521 82 Ave NW', type: 'Emergency', tech: 'Mike Rodriguez', value: '$485', status: 'in-progress' },
  { id: 2, time: '2:00 PM', customer: 'Downtown Office', address: '10234 Jasper Ave', type: 'Maintenance', tech: 'Danny Chen', value: '$350', status: 'in-progress' },
  { id: 3, time: '3:30 PM', customer: 'West End Residence', address: '15234 Stony Plain Rd', type: 'Installation', tech: 'Steve Martinez', value: '$4,850', status: 'scheduled' },
  { id: 4, time: '4:00 PM', customer: 'Southside Commercial', address: '7234 Gateway Blvd', type: 'Quote', tech: 'Carlos Diaz', value: '$0', status: 'scheduled' },
  { id: 5, time: '5:30 PM', customer: 'Mill Woods Family', address: '7234 99 St NW', type: 'Repair', tech: 'James Wilson', value: '$280', status: 'scheduled' }
];

const INVOICES = [
  { id: 'INV-1047', customer: 'Johnson Residence', amount: '$485', status: 'paid', date: 'Nov 25, 2025' },
  { id: 'INV-1046', customer: 'Smith Commercial', amount: '$1,240', status: 'sent', date: 'Nov 24, 2025' },
  { id: 'INV-1045', customer: 'Davis Family', amount: '$320', status: 'overdue', date: 'Nov 20, 2025' },
  { id: 'INV-1044', customer: 'Wilson HVAC Supply', amount: '$85', status: 'paid', date: 'Nov 23, 2025' }
];

const REFRIGERANTS = [
  { type: 'R-410A', stock: 148, used: 12, cost: 8.50, threshold: 50, color: '#3B82F6' },
  { type: 'R-22', stock: 34, used: 3, cost: 45.00, threshold: 20, color: '#EF4444' },
  { type: 'R-134a', stock: 67, used: 8, cost: 12.00, threshold: 30, color: '#10B981' },
  { type: 'R-404A', stock: 89, used: 5, cost: 18.50, threshold: 40, color: '#F59E0B' }
];

const CUSTOMERS = [
  { name: 'Johnson Family', address: '8423 Gateway Blvd', phone: '(780) 555-0142', lastService: 'Nov 25, 2025', jobs: 8, value: '$2,840' },
  { name: 'Downtown Office Tower', address: '10234 Jasper Ave', phone: '(780) 555-0198', lastService: 'Nov 24, 2025', jobs: 24, value: '$12,450' },
  { name: 'Anderson Family', address: '4521 82 Ave NW', phone: '(780) 555-0223', lastService: 'Nov 20, 2025', jobs: 6, value: '$1,980' }
];

export default function FlowPlatformDemo() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTech, setSelectedTech] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
   const [mounted, setMounted] = useState(false);
  const [revenue, setRevenue] = useState(8450);
  const [techPositions, setTechPositions] = useState<Record<number, number>>({});
  const [gpsUpdates, setGpsUpdates] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTechPositions(prev => {
        const updated = { ...prev };
        TECHS.forEach(tech => {
          if (tech.route && tech.route.length > 1) {
            updated[tech.id] = ((prev[tech.id] || 0) + 1) % tech.route.length;
          }
        });
        return updated;
      });
      setRevenue(prev => prev + Math.random() * 20);
      setGpsUpdates(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

// Initialize map once when GPS view is active
  useEffect(() => {
    if (currentView !== 'gps' || mapRef.current) return;
    
    const container = document.getElementById('map-container');
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const map = L.map('map-container', {
          center: [53.5444, -113.4909],
          zoom: 12,
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        TECHS.forEach((tech) => {
          const position = techPositions[tech.id] || 0;
          const currentPos = tech.route[position % tech.route.length];

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

        timeoutId = setTimeout(() => {
          if (map) map.invalidateSize();
        }, 100);

      } catch (error) {
        console.error('Map error:', error);
      }
    };

    timeoutId = setTimeout(() => initMap(), 50);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentView]);

  // Update truck positions
  useEffect(() => {
    if (!mapRef.current) return;
    
    TECHS.forEach((tech) => {
      const marker = markersRef.current[tech.id];
      if (marker && tech.route) {
        const position = techPositions[tech.id] || 0;
        const currentPos = tech.route[position % tech.route.length];
        marker.setLatLng([currentPos.lat, currentPos.lng]);
      }
    });
  }, [techPositions]);

  // Cleanup map when leaving GPS view
  useEffect(() => {
    return () => {
      if (currentView !== 'gps' && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [currentView]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-route': return 'bg-blue-500';
      case 'on-site': return 'bg-green-500';
      case 'available': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const Sidebar = () => (
    <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          HVACflow
        </h1>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'gps', label: 'GPS Tracking', icon: Navigation },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'refrigerant', label: 'Refrigerant', icon: Droplets },
          { id: 'customers', label: 'Customers', icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentView(id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">${revenue.toFixed(0)}</div>
          <div className="text-blue-100 text-sm">Today's Revenue</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold">8</div>
          <div className="text-green-100 text-sm">Active Jobs</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-purple-100 text-sm">Completed Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold">{gpsUpdates}</div>
          <div className="text-orange-100 text-sm">GPS Updates</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Insight</h3>
            <p className="text-sm text-slate-400">Generated from today's activity</p>
          </div>
        </div>
        <p className="text-slate-300">
          Found 8 customers due for seasonal maintenance. Automated reminders sent. 3 already booked appointments. Potential revenue: $2,850
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {JOBS.map(job => (
                <div key={job.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{job.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          job.status === 'in-progress' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="text-white font-medium">{job.customer}</div>
                      <div className="text-sm text-slate-400">{job.address}</div>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-slate-400">{job.type}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{job.tech}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-green-400 font-medium">{job.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4">
            <h3 className="font-semibold text-white mb-3">Active Technicians</h3>
            <div className="space-y-2">
              {TECHS.map(tech => (
                <div key={tech.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: tech.color + '20' }}>
                    <Truck className="w-4 h-4" style={{ color: tech.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{tech.name}</div>
                    <div className="text-xs text-slate-400">{tech.status === 'en-route' ? 'En Route' : tech.status === 'on-site' ? 'On Site' : 'Available'}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(tech.status)}`}></div>
                </div>
              ))}
            </div>
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

  const ScheduleView = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Job Schedule</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            New Job
          </button>
        </div>
        
        <div className="space-y-3">
          {JOBS.map(job => (
            <div key={job.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-medium text-white">{job.time}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'in-progress' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-white mb-1">{job.customer}</div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-slate-600/50 rounded-full text-slate-300">{job.type}</span>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">{job.tech}</span>
                    </div>
                    <span className="text-green-400 font-semibold">{job.value}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-medium text-blue-300 mb-1">AI Scheduling Suggestion</div>
              <p className="text-sm text-blue-400/80">
                Reroute Mike Rodriguez to Smith Commercial first - he's 8 minutes closer from current location. Saves 15 minutes total drive time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InvoicesView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white">$2,130</div>
          <div className="text-slate-400 text-sm">Outstanding (2 overdue)</div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">$42,850</div>
          <div className="text-slate-400 text-sm">Paid this month (+18%)</div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">8 days</div>
          <div className="text-slate-400 text-sm">Avg payment time (-2 days)</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Invoices</h2>
        <div className="space-y-3">
          {INVOICES.map(invoice => (
            <div key={invoice.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-slate-400">{invoice.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                      invoice.status === 'sent' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="text-white font-medium">{invoice.customer}</div>
                  <div className="text-sm text-slate-400">{invoice.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xl font-semibold text-white">{invoice.amount}</div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-medium text-blue-300 mb-1">AI-Generated Invoice Ready</div>
              <p className="text-sm text-blue-400/80">
                From Mike's notes: "Replaced capacitor, tested all functions, system running normally" → Auto-generated $180 invoice ready to send to Johnson Residence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RefrigerantView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REFRIGERANTS.map((ref, idx) => {
          const percentage = (ref.stock / (ref.stock + ref.used)) * 100;
          const isLow = ref.stock < ref.threshold;
          
          return (
            <div key={idx} className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: ref.color + '20' }}>
                    <Droplets className="w-5 h-5" style={{ color: ref.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{ref.type}</div>
                    <div className="text-xs text-slate-400">${ref.cost}/lb</div>
                  </div>
                </div>
                {isLow && (
                  <div className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">Low</div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stock</span>
                  <span className="text-white font-medium">{ref.stock} lbs</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: ref.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Used today: {ref.used} lbs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Usage Log</h2>
        <div className="space-y-2">
          {[
            { tech: 'Mike Rodriguez', job: 'Johnson Residence', type: 'R-410A', amount: '3.2 lbs', time: '2:45 PM' },
            { tech: 'Danny Chen', job: 'Office Tower', type: 'R-134a', amount: '5.1 lbs', time: '1:30 PM' },
            { tech: 'Steve Martinez', job: 'West End Install', type: 'R-410A', amount: '8.7 lbs', time: '11:20 AM' },
          ].map((log, idx) => (
            <div key={idx} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white font-medium">{log.tech}</div>
                  <div className="text-sm text-slate-400">{log.job}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{log.amount}</div>
                  <div className="text-sm text-slate-400">{log.type} • {log.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-medium text-green-300">EPA Compliance: 100%</div>
              <div className="text-sm text-green-400/80">Monthly 608 report ready for download</div>
            </div>
            <button className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
              Generate EPA Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomersView = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Add Customer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="text-2xl font-bold text-white">247</div>
            <div className="text-slate-400 text-sm">Total Customers (+12 this month)</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-slate-400 text-sm">Active (36%)</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="text-2xl font-bold text-white">$3,240</div>
            <div className="text-slate-400 text-sm">Avg Lifetime Value</div>
          </div>
        </div>

        <div className="space-y-3">
          {CUSTOMERS.map((customer, idx) => (
            <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-white mb-1">{customer.name}</div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Last service: {customer.lastService}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{customer.jobs} total jobs</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-green-400 font-medium">Lifetime: {customer.value}</span>
                  </div>
                </div>
                <button className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      
      <div className="lg:ml-64">
        <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-semibold">
                  {currentView === 'dashboard' && 'Dashboard'}
                  {currentView === 'gps' && 'GPS Tracking'}
                  {currentView === 'schedule' && 'Schedule & Dispatch'}
                  {currentView === 'invoices' && 'Smart Invoicing'}
                  {currentView === 'refrigerant' && 'Refrigerant Tracking'}
                  {currentView === 'customers' && 'Customer Management'}
                </h2>
                <p className="text-sm text-slate-400">{currentTime.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
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
