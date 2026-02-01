import { useState } from 'react';
import {
  GitBranch, Activity, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Filter, Download, RefreshCw, ChevronDown, ChevronRight,
  ArrowRight, Zap, Target, Shuffle, XCircle
} from 'lucide-react';

interface ProcessNode {
  id: string;
  name: string;
  shortName: string;
  system: string;
  avgDuration: number;
  transactions: number;
  x: number;
  y: number;
}

interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  count: number;
  percentage: number;
  avgDays: number;
  isMainPath: boolean;
  isDeviation: boolean;
}

interface ProcessVariant {
  id: string;
  path: string[];
  count: number;
  percentage: number;
  avgDuration: number;
  isStandard: boolean;
  conformance: 'compliant' | 'minor_deviation' | 'major_deviation';
}

interface ProcessStats {
  totalTransactions: number;
  uniqueVariants: number;
  avgCycleTime: number;
  conformanceRate: number;
  mainPathUsage: number;
}

const processNodes: ProcessNode[] = [
  { id: 'start', name: 'Start', shortName: 'Start', system: '', avgDuration: 0, transactions: 1247, x: 50, y: 200 },
  { id: 'request', name: 'Request Intake', shortName: 'Request', system: 'SAP Ariba', avgDuration: 3.2, transactions: 1247, x: 180, y: 200 },
  { id: 'budget_check', name: 'Budget Check', shortName: 'Budget', system: 'SAP Ariba', avgDuration: 1.5, transactions: 1198, x: 310, y: 120 },
  { id: 'sourcing', name: 'Sourcing', shortName: 'Sourcing', system: 'SAP Ariba', avgDuration: 12.5, transactions: 1142, x: 440, y: 200 },
  { id: 'negotiation', name: 'Negotiation', shortName: 'Negotiate', system: 'SAP Ariba', avgDuration: 5.8, transactions: 892, x: 440, y: 320 },
  { id: 'contracting', name: 'Contracting', shortName: 'Contract', system: 'Simplicontract', avgDuration: 18.3, transactions: 1089, x: 570, y: 200 },
  { id: 'legal_review', name: 'Legal Review', shortName: 'Legal', system: 'Simplicontract', avgDuration: 8.2, transactions: 756, x: 570, y: 80 },
  { id: 'vendor_onboard', name: 'Vendor Onboarding', shortName: 'Onboard', system: 'Vendor Portal', avgDuration: 8.7, transactions: 1034, x: 700, y: 200 },
  { id: 'compliance', name: 'Compliance Check', shortName: 'Compliance', system: 'Vendor Portal', avgDuration: 4.5, transactions: 1034, x: 700, y: 320 },
  { id: 'pr_creation', name: 'PR Creation', shortName: 'PR', system: 'Oracle Fusion', avgDuration: 2.1, transactions: 1189, x: 830, y: 200 },
  { id: 'po_creation', name: 'PO Creation', shortName: 'PO', system: 'Oracle Fusion', avgDuration: 1.8, transactions: 1156, x: 960, y: 200 },
  { id: 'goods_receipt', name: 'Goods Receipt', shortName: 'GR', system: 'Oracle EBS', avgDuration: 5.2, transactions: 1098, x: 1090, y: 200 },
  { id: 'invoice', name: 'Invoice Processing', shortName: 'Invoice', system: 'Oracle EBS', avgDuration: 3.4, transactions: 1078, x: 1220, y: 200 },
  { id: 'payment', name: 'Payment', shortName: 'Payment', system: 'Oracle EBS', avgDuration: 2.8, transactions: 1045, x: 1350, y: 200 },
  { id: 'end', name: 'End', shortName: 'End', system: '', avgDuration: 0, transactions: 1045, x: 1450, y: 200 },
];

const processEdges: ProcessEdge[] = [
  // Main happy path
  { id: 'e1', source: 'start', target: 'request', count: 1247, percentage: 100, avgDays: 0, isMainPath: true, isDeviation: false },
  { id: 'e2', source: 'request', target: 'budget_check', count: 1198, percentage: 96.1, avgDays: 0.5, isMainPath: true, isDeviation: false },
  { id: 'e3', source: 'budget_check', target: 'sourcing', count: 1142, percentage: 95.3, avgDays: 1.2, isMainPath: true, isDeviation: false },
  { id: 'e4', source: 'sourcing', target: 'contracting', count: 845, percentage: 74.0, avgDays: 2.1, isMainPath: true, isDeviation: false },
  { id: 'e5', source: 'contracting', target: 'vendor_onboard', count: 756, percentage: 69.4, avgDays: 3.5, isMainPath: true, isDeviation: false },
  { id: 'e6', source: 'vendor_onboard', target: 'pr_creation', count: 892, percentage: 86.3, avgDays: 1.8, isMainPath: true, isDeviation: false },
  { id: 'e7', source: 'pr_creation', target: 'po_creation', count: 1156, percentage: 97.2, avgDays: 0.8, isMainPath: true, isDeviation: false },
  { id: 'e8', source: 'po_creation', target: 'goods_receipt', count: 1098, percentage: 95.0, avgDays: 4.5, isMainPath: true, isDeviation: false },
  { id: 'e9', source: 'goods_receipt', target: 'invoice', count: 1078, percentage: 98.2, avgDays: 1.2, isMainPath: true, isDeviation: false },
  { id: 'e10', source: 'invoice', target: 'payment', count: 1045, percentage: 96.9, avgDays: 2.1, isMainPath: true, isDeviation: false },
  { id: 'e11', source: 'payment', target: 'end', count: 1045, percentage: 100, avgDays: 0, isMainPath: true, isDeviation: false },

  // Alternate paths and deviations
  { id: 'e12', source: 'request', target: 'sourcing', count: 49, percentage: 3.9, avgDays: 0.3, isMainPath: false, isDeviation: true }, // Skip budget check
  { id: 'e13', source: 'sourcing', target: 'negotiation', count: 297, percentage: 26.0, avgDays: 1.5, isMainPath: false, isDeviation: false }, // Go to negotiation
  { id: 'e14', source: 'negotiation', target: 'contracting', count: 244, percentage: 82.2, avgDays: 2.8, isMainPath: false, isDeviation: false },
  { id: 'e15', source: 'contracting', target: 'legal_review', count: 333, percentage: 30.6, avgDays: 2.2, isMainPath: false, isDeviation: false }, // Legal review path
  { id: 'e16', source: 'legal_review', target: 'vendor_onboard', count: 278, percentage: 83.5, avgDays: 6.5, isMainPath: false, isDeviation: false },
  { id: 'e17', source: 'vendor_onboard', target: 'compliance', count: 142, percentage: 13.7, avgDays: 1.2, isMainPath: false, isDeviation: false }, // Compliance path
  { id: 'e18', source: 'compliance', target: 'pr_creation', count: 142, percentage: 100, avgDays: 3.2, isMainPath: false, isDeviation: false },
  { id: 'e19', source: 'budget_check', target: 'request', count: 56, percentage: 4.7, avgDays: 1.8, isMainPath: false, isDeviation: true }, // Rework loop
  { id: 'e20', source: 'legal_review', target: 'contracting', count: 55, percentage: 16.5, avgDays: 4.5, isMainPath: false, isDeviation: true }, // Legal rejection loop
  { id: 'e21', source: 'po_creation', target: 'pr_creation', count: 58, percentage: 5.0, avgDays: 2.1, isMainPath: false, isDeviation: true }, // PO rejection
  { id: 'e22', source: 'negotiation', target: 'sourcing', count: 53, percentage: 17.8, avgDays: 3.2, isMainPath: false, isDeviation: true }, // Renegotiation
];

const processVariants: ProcessVariant[] = [
  {
    id: 'v1',
    path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 542,
    percentage: 43.5,
    avgDuration: 45.2,
    isStandard: true,
    conformance: 'compliant'
  },
  {
    id: 'v2',
    path: ['Request', 'Budget', 'Sourcing', 'Negotiate', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 198,
    percentage: 15.9,
    avgDuration: 52.8,
    isStandard: false,
    conformance: 'compliant'
  },
  {
    id: 'v3',
    path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Legal', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 156,
    percentage: 12.5,
    avgDuration: 58.4,
    isStandard: false,
    conformance: 'compliant'
  },
  {
    id: 'v4',
    path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Onboard', 'Compliance', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 89,
    percentage: 7.1,
    avgDuration: 51.6,
    isStandard: false,
    conformance: 'compliant'
  },
  {
    id: 'v5',
    path: ['Request', 'Sourcing', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 49,
    percentage: 3.9,
    avgDuration: 38.5,
    isStandard: false,
    conformance: 'minor_deviation'
  },
  {
    id: 'v6',
    path: ['Request', 'Budget', 'Request', 'Budget', 'Sourcing', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 56,
    percentage: 4.5,
    avgDuration: 62.3,
    isStandard: false,
    conformance: 'minor_deviation'
  },
  {
    id: 'v7',
    path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Legal', 'Contract', 'Legal', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 42,
    percentage: 3.4,
    avgDuration: 78.9,
    isStandard: false,
    conformance: 'major_deviation'
  },
  {
    id: 'v8',
    path: ['Request', 'Budget', 'Sourcing', 'Negotiate', 'Sourcing', 'Negotiate', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'],
    count: 38,
    percentage: 3.0,
    avgDuration: 72.4,
    isStandard: false,
    conformance: 'major_deviation'
  },
];

const processStats: ProcessStats = {
  totalTransactions: 1247,
  uniqueVariants: 23,
  avgCycleTime: 52.4,
  conformanceRate: 78.9,
  mainPathUsage: 43.5
};

const getNodeById = (id: string) => processNodes.find(n => n.id === id);

const getConformanceColor = (conformance: string) => {
  switch (conformance) {
    case 'compliant': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
    case 'minor_deviation': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
    case 'major_deviation': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
  }
};

export default function ProcessDiscovery() {
  const [selectedVariant, setSelectedVariant] = useState<ProcessVariant | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'variants' | 'stats'>('map');
  const [showDeviations, setShowDeviations] = useState(true);

  const getEdgeStyle = (edge: ProcessEdge) => {
    const thickness = Math.max(2, Math.min(12, edge.percentage / 10));
    let color = '#60a5fa'; // Blue for main path

    if (edge.isDeviation) {
      color = '#f87171'; // Red for deviations
    } else if (!edge.isMainPath) {
      color = '#a78bfa'; // Purple for alternate paths
    }

    const opacity = edge.isMainPath ? 1 : 0.7;

    return { strokeWidth: thickness, stroke: color, opacity };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <GitBranch className="text-indigo-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Process Discovery</h2>
              <p className="text-sm text-gray-500">AI-generated as-is procurement lifecycle map</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'map' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                Process Map
              </button>
              <button
                onClick={() => setViewMode('variants')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'variants' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                Variants
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'stats' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                Statistics
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <RefreshCw size={16} /> Rediscover
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Transactions</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{processStats.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Shuffle size={16} className="text-purple-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Unique Variants</p>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">{processStats.uniqueVariants}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Avg Cycle Time</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{processStats.avgCycleTime} days</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Conformance</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{processStats.conformanceRate}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Happy Path</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{processStats.mainPathUsage}%</p>
        </div>
      </div>

      {viewMode === 'map' && (
        <div className="p-4">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showDeviations}
                  onChange={(e) => setShowDeviations(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                Show Deviations
              </label>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-blue-400 rounded"></div>
                <span className="text-gray-600">Main Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-purple-400 rounded"></div>
                <span className="text-gray-600">Alternate Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-red-400 rounded"></div>
                <span className="text-gray-600">Deviation/Rework</span>
              </div>
            </div>
          </div>

          {/* Process Map */}
          <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg border overflow-x-auto" style={{ height: '450px' }}>
            <svg className="absolute inset-0" style={{ width: '1500px', height: '450px' }}>
              <defs>
                <marker id="arrow-main" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                </marker>
                <marker id="arrow-alt" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa" />
                </marker>
                <marker id="arrow-dev" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#f87171" />
                </marker>
              </defs>

              {/* Draw edges */}
              {processEdges
                .filter(edge => showDeviations || !edge.isDeviation)
                .map((edge) => {
                  const sourceNode = getNodeById(edge.source);
                  const targetNode = getNodeById(edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const style = getEdgeStyle(edge);
                  const markerId = edge.isDeviation ? 'arrow-dev' : edge.isMainPath ? 'arrow-main' : 'arrow-alt';

                  // Calculate curved path
                  const startX = sourceNode.x + 40;
                  const startY = sourceNode.y + 20;
                  const endX = targetNode.x;
                  const endY = targetNode.y + 20;

                  let path: string;
                  if (edge.source === edge.target.replace('_', '')) {
                    // Self-loop (rework)
                    path = `M ${startX} ${startY - 15} C ${startX + 50} ${startY - 60} ${endX - 50} ${endY - 60} ${endX} ${endY - 15}`;
                  } else if (Math.abs(startY - endY) < 30 && startX < endX) {
                    // Forward horizontal
                    path = `M ${startX} ${startY} L ${endX} ${endY}`;
                  } else if (startX > endX) {
                    // Backward loop
                    const loopY = Math.max(startY, endY) + 60;
                    path = `M ${startX} ${startY + 10} Q ${startX + 30} ${loopY} ${(startX + endX) / 2} ${loopY} Q ${endX - 30} ${loopY} ${endX} ${endY + 10}`;
                  } else {
                    // Curved up/down
                    const midX = (startX + endX) / 2;
                    path = `M ${startX} ${startY} C ${midX} ${startY} ${midX} ${endY} ${endX} ${endY}`;
                  }

                  return (
                    <g key={edge.id}>
                      <path
                        d={path}
                        fill="none"
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth}
                        opacity={style.opacity}
                        markerEnd={`url(#${markerId})`}
                        strokeDasharray={edge.isDeviation ? '8,4' : 'none'}
                      />
                      {/* Edge label */}
                      {edge.percentage >= 10 && (
                        <text
                          x={(startX + endX) / 2}
                          y={(startY + endY) / 2 - 8}
                          textAnchor="middle"
                          className="text-[10px] fill-gray-500 font-medium"
                        >
                          {edge.count} ({edge.percentage}%)
                        </text>
                      )}
                    </g>
                  );
                })}
            </svg>

            {/* Draw nodes */}
            {processNodes.map((node) => (
              <div
                key={node.id}
                className="absolute cursor-pointer transition-transform hover:scale-105"
                style={{ left: node.x, top: node.y }}
              >
                {node.id === 'start' || node.id === 'end' ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    node.id === 'start' ? 'bg-emerald-500' : 'bg-blue-500'
                  } text-white shadow-lg`}>
                    {node.id === 'start' ? <Zap size={16} /> : <CheckCircle size={16} />}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-2 min-w-[80px]">
                    <div className="text-xs font-bold text-gray-800 text-center">{node.shortName}</div>
                    <div className="text-[10px] text-gray-500 text-center">{node.system}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-[10px] font-medium text-blue-600">{node.transactions}</span>
                      <span className="text-[10px] text-gray-400">|</span>
                      <span className="text-[10px] font-medium text-amber-600">{node.avgDuration}d</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'variants' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Process Variants ({processVariants.length} shown of {processStats.uniqueVariants})</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <Filter size={14} /> Filter
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {processVariants.map((variant, index) => {
              const conformanceColors = getConformanceColor(variant.conformance);
              const isExpanded = selectedVariant?.id === variant.id;

              return (
                <div
                  key={variant.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    isExpanded ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${conformanceColors.bg}`}
                    onClick={() => setSelectedVariant(isExpanded ? null : variant)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">Variant {index + 1}</span>
                          {variant.isStandard && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Standard
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${conformanceColors.bg} ${conformanceColors.text}`}>
                            {variant.conformance.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <span className="text-gray-500">Count:</span>
                          <span className="ml-2 font-semibold text-gray-800">{variant.count}</span>
                          <span className="ml-1 text-gray-400">({variant.percentage}%)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500">Avg Duration:</span>
                          <span className="ml-2 font-semibold text-amber-600">{variant.avgDuration} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Path visualization */}
                    <div className="flex items-center gap-1 mt-3 overflow-x-auto">
                      {variant.path.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            variant.conformance === 'compliant' ? 'bg-white border' :
                            variant.conformance === 'minor_deviation' ? 'bg-amber-50 border border-amber-200' :
                            'bg-red-50 border border-red-200'
                          }`}>
                            {step}
                          </span>
                          {stepIndex < variant.path.length - 1 && (
                            <ArrowRight size={12} className="mx-1 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Total Steps</p>
                          <p className="text-lg font-bold text-gray-800">{variant.path.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Rework Loops</p>
                          <p className="text-lg font-bold text-gray-800">
                            {variant.path.length - new Set(variant.path).size}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Time vs Standard</p>
                          <p className={`text-lg font-bold ${
                            variant.avgDuration > 52.4 ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                            {variant.avgDuration > 52.4 ? '+' : ''}{(variant.avgDuration - 52.4).toFixed(1)} days
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">% of Total</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-indigo-500"
                                style={{ width: `${variant.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-lg font-bold text-gray-800">{variant.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'stats' && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Conformance Analysis */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Conformance Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-500" />
                    <span className="text-sm text-gray-700">Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: '78.9%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-12 text-right">78.9%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    <span className="text-sm text-gray-700">Minor Deviation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: '12.8%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-12 text-right">12.8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle size={18} className="text-red-500" />
                    <span className="text-sm text-gray-700">Major Deviation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-red-500" style={{ width: '8.3%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-12 text-right">8.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottleneck Stages */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bottleneck Stages</h3>
              <div className="space-y-3">
                {[
                  { stage: 'Contracting', days: 18.3, target: 12, variance: 52.5 },
                  { stage: 'Sourcing', days: 12.5, target: 10, variance: 25.0 },
                  { stage: 'Legal Review', days: 8.2, target: 5, variance: 64.0 },
                  { stage: 'Vendor Onboarding', days: 8.7, target: 7, variance: 24.3 },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-800">{item.days}d</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.variance > 50 ? 'bg-red-100 text-red-700' :
                        item.variance > 20 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        +{item.variance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rework Analysis */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rework Analysis</h3>
              <div className="space-y-3">
                {[
                  { loop: 'Budget Check → Request', count: 56, impact: '+1.8 days' },
                  { loop: 'Legal Review → Contracting', count: 55, impact: '+4.5 days' },
                  { loop: 'PO Creation → PR Creation', count: 58, impact: '+2.1 days' },
                  { loop: 'Negotiation → Sourcing', count: 53, impact: '+3.2 days' },
                ].map((item) => (
                  <div key={item.loop} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={14} className="text-red-500" />
                      <span className="text-sm text-gray-700">{item.loop}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{item.count} cases</span>
                      <span className="text-sm font-medium text-red-600">{item.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <TrendingUp size={16} className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Optimization Opportunity</p>
                      <p className="text-xs text-blue-600 mt-1">43.5% of transactions follow the happy path. Legal review adds avg 8.2 days for 30.6% of contracts.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Process Deviation</p>
                      <p className="text-xs text-amber-600 mt-1">3.9% of requests skip budget check. Consider enforcing mandatory budget approval.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Best Practice</p>
                      <p className="text-xs text-emerald-600 mt-1">PR to PO conversion has 97.2% efficiency. GR to Invoice maintains 98.2% flow rate.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
