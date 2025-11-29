import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom truck icon
const createTruckIcon = (color: string) => {
  const iconHtml = renderToStaticMarkup(
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: color + '40',
      border: `3px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-truck-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Component to update marker positions
function MarkerUpdater({ techs, techPositions }: any) {
  const map = useMap();
  
  useEffect(() => {
    // Markers will update through React's re-render
  }, [techPositions]);

  return null;
}

interface MapComponentProps {
  techs: any[];
  techPositions: {[key: number]: number};
  selectedTech: number | null;
  onTechSelect: (id: number | null) => void;
}

export default function MapComponent({ techs, techPositions, selectedTech, onTechSelect }: MapComponentProps) {
  const mapRef = useRef<any>(null);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={[53.5461, -113.4938]} // Edmonton center
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerUpdater techs={techs} techPositions={techPositions} />

        {techs.map((tech) => {
          const position = techPositions[tech.id] || 0;
          const currentPos = tech.route[position % tech.route.length];
          
          return (
            <Marker
              key={tech.id}
              position={[currentPos.lat, currentPos.lng]}
              icon={createTruckIcon(tech.color)}
              eventHandlers={{
                click: () => onTechSelect(tech.id === selectedTech ? null : tech.id),
              }}
            >
              <Popup>
                <div style={{ color: tech.color, fontWeight: 'bold', marginBottom: '4px' }}>
                  {tech.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  {tech.truck}
                </div>
                {tech.customer && (
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{tech.customer}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{tech.currentJob}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{tech.jobType}</div>
                    {tech.eta && tech.eta > 0 && (
                      <div style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 500, marginTop: '8px' }}>
                        ETA: {tech.eta} min
                      </div>
                    )}
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
