import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface FlowNode {
  id: string;
  name: string;
  shortName: string;
  system: string;
  x: number;
  y: number;
  avgTime: string;
  transactions: number;
  status: 'healthy' | 'warning' | 'critical';
  errorRate?: number;
  throughput?: string;
}

interface FlowConnection {
  from: string;
  to: string;
  label: string;
  type: 'sync' | 'async';
  avgLatency: string;
  status: 'normal' | 'slow' | 'critical';
}

interface BottleneckData {
  stage: string;
  avgDays: number;
  targetDays: number;
  variance: number;
  transactions: number;
  bottleneckCount: number;
}

const mockNodes: FlowNode[] = [
  { id: 'start', name: 'Request Intake', shortName: 'Intake', system: 'SAP Ariba', x: 80, y: 200, avgTime: '3.2 days', transactions: 156, status: 'healthy', errorRate: 0.5, throughput: '52/week' },
  { id: 'sourcing', name: 'Sourcing', shortName: 'Sourcing', system: 'SAP Ariba', x: 280, y: 100, avgTime: '12.5 days', transactions: 142, status: 'warning', errorRate: 2.1, throughput: '35/week' },
  { id: 'contracting', name: 'Contracting', shortName: 'Contract', system: 'Simplicontract', x: 480, y: 200, avgTime: '18.3 days', transactions: 128, status: 'critical', errorRate: 4.8, throughput: '22/week' },
  { id: 'vendor', name: 'Vendor Onboarding', shortName: 'Onboard', system: 'Vendor Portal', x: 280, y: 300, avgTime: '8.7 days', transactions: 98, status: 'healthy', errorRate: 1.2, throughput: '28/week' },
  { id: 'prpo', name: 'PR/PO Creation', shortName: 'PR/PO', system: 'Oracle Fusion', x: 680, y: 150, avgTime: '5.4 days', transactions: 185, status: 'healthy', errorRate: 0.8, throughput: '62/week' },
  { id: 'payment', name: 'Payment Processing', shortName: 'Payment', system: 'Oracle EBS', x: 880, y: 200, avgTime: '7.2 days', transactions: 172, status: 'warning', errorRate: 1.9, throughput: '48/week' },
];

const mockConnections: FlowConnection[] = [
  { from: 'start', to: 'sourcing', label: '2.1 days', type: 'sync', avgLatency: '2.1 days', status: 'normal' },
  { from: 'start', to: 'vendor', label: '1.5 days', type: 'async', avgLatency: '1.5 days', status: 'normal' },
  { from: 'sourcing', to: 'contracting', label: '4.8 days', type: 'sync', avgLatency: '4.8 days', status: 'critical' },
  { from: 'vendor', to: 'contracting', label: '3.2 days', type: 'async', avgLatency: '3.2 days', status: 'slow' },
  { from: 'contracting', to: 'prpo', label: '2.3 days', type: 'sync', avgLatency: '2.3 days', status: 'normal' },
  { from: 'prpo', to: 'payment', label: '1.8 days', type: 'sync', avgLatency: '1.8 days', status: 'normal' },
];

const mockBottleneckData: BottleneckData[] = [
  { stage: 'Request Intake', avgDays: 3.2, targetDays: 3, variance: 6.7, transactions: 156, bottleneckCount: 8 },
  { stage: 'Sourcing', avgDays: 12.5, targetDays: 10, variance: 25.0, transactions: 142, bottleneckCount: 24 },
  { stage: 'Contracting', avgDays: 18.3, targetDays: 12, variance: 52.5, transactions: 128, bottleneckCount: 45 },
  { stage: 'Vendor Onboarding', avgDays: 8.7, targetDays: 7, variance: 24.3, transactions: 98, bottleneckCount: 12 },
  { stage: 'PR/PO Creation', avgDays: 5.4, targetDays: 5, variance: 8.0, transactions: 185, bottleneckCount: 15 },
  { stage: 'Payment', avgDays: 7.2, targetDays: 5, variance: 44.0, transactions: 172, bottleneckCount: 31 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return { bg: 'bg-emerald-500', border: 'border-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-700' };
    case 'warning': return { bg: 'bg-amber-500', border: 'border-amber-500', ring: 'ring-amber-200', text: 'text-amber-700' };
    case 'critical': return { bg: 'bg-red-500', border: 'border-red-500', ring: 'ring-red-200', text: 'text-red-700' };
    default: return { bg: 'bg-gray-500', border: 'border-gray-500', ring: 'ring-gray-200', text: 'text-gray-700' };
  }
};

const getConnectionColor = (status: string) => {
  switch (status) {
    case 'normal': return 'stroke-blue-400';
    case 'slow': return 'stroke-amber-500';
    case 'critical': return 'stroke-red-500';
    default: return 'stroke-gray-400';
  }
};

export default function BottleneckFlowChart() {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'table'>('flow');

  const getNodeById = (id: string) => mockNodes.find(n => n.id === id);

  // Calculate path for curved connections
  const getPath = (conn: FlowConnection) => {
    const from = getNodeById(conn.from);
    const to = getNodeById(conn.to);
    if (!from || !to) return '';

    const startX = from.x + 50;
    const startY = from.y + 25;
    const endX = to.x;
    const endY = to.y + 25;

    // Calculate control points for curved line
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const offset = conn.type === 'async' ? 30 : 0;

    return `M ${startX} ${startY} Q ${midX} ${midY - offset} ${endX} ${endY}`;
  };

  // Get label position for connection
  const getLabelPosition = (conn: FlowConnection) => {
    const from = getNodeById(conn.from);
    const to = getNodeById(conn.to);
    if (!from || !to) return { x: 0, y: 0 };

    return {
      x: (from.x + 50 + to.x) / 2,
      y: (from.y + 25 + to.y + 25) / 2 - (conn.type === 'async' ? 20 : 5)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Transaction Flow Map</h2>
            <p className="text-sm text-gray-500">Procurement lifecycle bottleneck analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('flow')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'flow' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
              >
                Flow View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center gap-6 text-xs">
        <span className="font-medium text-gray-700">Status:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600">Healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Critical</span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="font-medium text-gray-700">Connection:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-0.5 bg-blue-400"></div>
          <span className="text-gray-600">Sync</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-0.5 bg-blue-400 border-dashed" style={{ borderTop: '2px dashed #60a5fa' }}></div>
          <span className="text-gray-600">Async</span>
        </div>
      </div>

      {viewMode === 'flow' ? (
        <div className="p-4">
          {/* Flow Diagram */}
          <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border" style={{ height: '420px' }}>
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                </marker>
                <marker id="arrowhead-warning" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                </marker>
                <marker id="arrowhead-critical" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                </marker>
              </defs>

              {/* Connections */}
              {mockConnections.map((conn, idx) => {
                const labelPos = getLabelPosition(conn);
                const markerId = conn.status === 'critical' ? 'arrowhead-critical' :
                                 conn.status === 'slow' ? 'arrowhead-warning' : 'arrowhead';
                return (
                  <g key={idx}>
                    <path
                      d={getPath(conn)}
                      fill="none"
                      className={getConnectionColor(conn.status)}
                      strokeWidth={conn.status === 'critical' ? 3 : 2}
                      strokeDasharray={conn.type === 'async' ? '8,4' : 'none'}
                      markerEnd={`url(#${markerId})`}
                    />
                    <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
                      <rect
                        x="-28"
                        y="-10"
                        width="56"
                        height="20"
                        rx="4"
                        fill="white"
                        stroke={conn.status === 'critical' ? '#ef4444' : conn.status === 'slow' ? '#f59e0b' : '#e5e7eb'}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-xs font-medium ${
                          conn.status === 'critical' ? 'fill-red-600' :
                          conn.status === 'slow' ? 'fill-amber-600' : 'fill-gray-600'
                        }`}
                      >
                        {conn.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {mockNodes.map((node) => {
              const colors = getStatusColor(node.status);
              return (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all hover:scale-105 ${
                    selectedNode?.id === node.id ? 'scale-105' : ''
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                >
                  <div className={`relative flex flex-col items-center`}>
                    {/* Node circle */}
                    <div className={`w-16 h-16 rounded-full ${colors.bg} ${colors.ring} ring-4 flex items-center justify-center shadow-lg`}>
                      <div className="text-center">
                        <div className="text-white text-xs font-bold">{node.transactions}</div>
                        <div className="text-white text-[10px] opacity-80">txns</div>
                      </div>
                    </div>

                    {/* Status indicator */}
                    {node.status !== 'healthy' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                        {node.status === 'critical' ? (
                          <AlertTriangle size={12} className="text-red-500" />
                        ) : (
                          <Clock size={12} className="text-amber-500" />
                        )}
                      </div>
                    )}

                    {/* Label */}
                    <div className="mt-2 text-center">
                      <div className="text-sm font-semibold text-gray-800">{node.shortName}</div>
                      <div className="text-xs text-gray-500">{node.system}</div>
                      <div className={`text-xs font-medium ${colors.text}`}>{node.avgTime}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Start Label */}
            <div className="absolute left-2 top-[185px] bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">
              START
            </div>

            {/* End Label */}
            <div className="absolute right-2 top-[185px] bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
              END
            </div>
          </div>

          {/* Node Details Panel */}
          {selectedNode && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedNode.name}</h3>
                  <p className="text-sm text-gray-500">System: {selectedNode.system}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedNode.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                  selectedNode.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Avg Processing Time</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNode.avgTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transactions</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNode.transactions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Error Rate</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNode.errorRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Throughput</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNode.throughput}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bottlenecks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockBottleneckData.map((row, idx) => {
                const status = row.variance > 40 ? 'critical' : row.variance > 20 ? 'warning' : 'healthy';
                const colors = getStatusColor(status);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.bg}`}></div>
                        <span className="font-medium text-gray-800">{row.stage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.avgDays} days</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{row.targetDays} days</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div
                            className={`h-2 rounded-full ${colors.bg}`}
                            style={{ width: `${Math.min(row.variance, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${colors.text}`}>+{row.variance.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.transactions}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.bottleneckCount > 30 ? 'bg-red-100 text-red-700' :
                        row.bottleneckCount > 15 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {row.bottleneckCount} cases
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {status === 'healthy' ? (
                          <CheckCircle size={16} className="text-emerald-500" />
                        ) : status === 'warning' ? (
                          <Clock size={16} className="text-amber-500" />
                        ) : (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${colors.text}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-sm font-medium text-red-700">Critical Bottleneck</span>
              </div>
              <p className="text-2xl font-bold text-red-600">Contracting</p>
              <p className="text-xs text-red-600">52.5% over target</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-amber-700">Avg Cycle Time</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">55.3 days</p>
              <p className="text-xs text-amber-600">Target: 42 days</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Total Bottlenecks</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">135</p>
              <p className="text-xs text-blue-600">Across all stages</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">On-Track Rate</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">72.4%</p>
              <p className="text-xs text-emerald-600">+3.2% vs last month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
