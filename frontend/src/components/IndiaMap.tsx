import React, { useState, useEffect, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface IndiaStateRisk {
  id: string;
  state: string;
  stateCode: string;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high' | 'severe';
  riskScore: number;
  supplierCount: number;
  warehouseCount: number;
  spendAmount: number;
  factors: RiskFactor[];
  keyCategories: string[];
}

interface IndiaMapProps {
  stateRisks: IndiaStateRisk[];
  selectedState: IndiaStateRisk | null;
  onStateClick: (state: IndiaStateRisk | null) => void;
}

// India GeoJSON URL with official Survey of India boundaries (includes J&K and Ladakh as separate UTs)
const INDIA_TOPO_JSON = "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/india.geojson";

// Mapping of GeoJSON state names to our state codes
const stateNameToCode: Record<string, string> = {
  "Jammu and Kashmir": "JK",
  "Jammu & Kashmir": "JK",
  "Himachal Pradesh": "HP",
  "Punjab": "PB",
  "Haryana": "HR",
  "Delhi": "DL",
  "NCT of Delhi": "DL",
  "Rajasthan": "RJ",
  "Uttar Pradesh": "UP",
  "Bihar": "BR",
  "West Bengal": "WB",
  "Assam": "AS",
  "Gujarat": "GJ",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Telangana": "TS",
  "Andhra Pradesh": "AP",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Tamil Nadu": "TN",
  "Odisha": "OR",
  "Orissa": "OR",
  "Jharkhand": "JH",
  "Chhattisgarh": "CG",
  "Uttarakhand": "UK",
  "Uttaranchal": "UK",
  "Goa": "GA",
  "Sikkim": "SK",
  "Arunachal Pradesh": "AR",
  "Nagaland": "NL",
  "Manipur": "MN",
  "Mizoram": "MZ",
  "Tripura": "TR",
  "Meghalaya": "ML",
  "Ladakh": "LA",
  "Chandigarh": "CH",
  "Puducherry": "PY",
  "Pondicherry": "PY",
  "Andaman and Nicobar Islands": "AN",
  "Andaman and Nicobar": "AN",
  "Dadra and Nagar Haveli": "DN",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  "Daman and Diu": "DD",
  "Lakshadweep": "LD"
};

const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low': return '#22c55e';
    case 'moderate': return '#3b82f6';
    case 'elevated': return '#f59e0b';
    case 'high': return '#f97316';
    case 'severe': return '#ef4444';
    default: return '#d1d5db';
  }
};

// Major Indian cities with coordinates
const majorCities = [
  { name: "Delhi", coordinates: [77.1025, 28.7041] as [number, number] },
  { name: "Mumbai", coordinates: [72.8777, 19.0760] as [number, number] },
  { name: "Bengaluru", coordinates: [77.5946, 12.9716] as [number, number] },
  { name: "Kolkata", coordinates: [88.3639, 22.5726] as [number, number] },
  { name: "Chennai", coordinates: [80.2707, 13.0827] as [number, number] },
  { name: "Hyderabad", coordinates: [78.4867, 17.3850] as [number, number] },
  { name: "Ahmedabad", coordinates: [72.5714, 23.0225] as [number, number] },
  { name: "Pune", coordinates: [73.8567, 18.5204] as [number, number] },
];

const IndiaMap: React.FC<IndiaMapProps> = memo(({ stateRisks, selectedState, onStateClick }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(INDIA_TOPO_JSON)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch map data');
        return response.json();
      })
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading India map:', err);
        setError('Failed to load map');
        setLoading(false);
      });
  }, []);

  const getStateRisk = (stateName: string) => {
    const stateCode = stateNameToCode[stateName];
    return stateRisks.find(s => s.id === stateCode || s.stateCode === stateCode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading India Map...</p>
        </div>
      </div>
    );
  }

  if (error || !geoData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Map data unavailable</p>
          <p className="text-sm">Please check your internet connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [82, 22]
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.st_nm || geo.properties.NAME_1 || geo.properties.name;
                const stateRisk = getStateRisk(stateName);
                const stateCode = stateNameToCode[stateName];
                const isSelected = selectedState?.id === stateCode;
                const fillColor = stateRisk ? getRiskColor(stateRisk.riskLevel) : '#d1d5db';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke={isSelected ? '#4f46e5' : '#ffffff'}
                    strokeWidth={isSelected ? 2 : 0.5}
                    style={{
                      default: {
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: stateRisk ? `${fillColor}cc` : '#9ca3af',
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: stateRisk ? `${fillColor}99` : '#6b7280',
                        outline: 'none',
                      },
                    }}
                    onClick={() => {
                      if (stateRisk) {
                        onStateClick(isSelected ? null : stateRisk);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Major Cities Markers */}
          {majorCities.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={3} fill="#1e40af" stroke="#fff" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={-8}
                style={{
                  fontFamily: "system-ui",
                  fontSize: "8px",
                  fill: "#374151",
                  fontWeight: 500,
                }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-xs text-gray-600">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-xs text-gray-600">Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span className="text-xs text-gray-600">Elevated</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span className="text-xs text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-xs text-gray-600">Severe</span>
        </div>
      </div>
    </div>
  );
});

IndiaMap.displayName = 'IndiaMap';

export default IndiaMap;
