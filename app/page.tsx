'use client';

import React, { useState, useEffect } from 'react';
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
