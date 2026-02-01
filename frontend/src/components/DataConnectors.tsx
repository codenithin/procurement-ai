import { useState } from 'react';
import {
  Database, Server, Shield, Zap, RefreshCw, CheckCircle, AlertTriangle,
  Lock, Cloud, Activity, Clock, Download,
  ChevronDown, ChevronRight, Settings, Play, Pause, Eye, XCircle,
  Cpu, HardDrive, Network, Filter, BarChart3
} from 'lucide-react';

interface Connector {
  id: string;
  name: string;
  type: 'api' | 'etl' | 'webhook' | 'batch';
  source: string;
  target: string;
  status: 'healthy' | 'warning' | 'error' | 'inactive';
  protocol: string;
  encryption: string;
  authMethod: string;
  frequency: string;
  lastSync: string;
  recordsPerDay: number;
  avgLatency: number;
  errorRate: number;
  dataTypes: string[];
}

interface SystemNode {
  id: string;
  name: string;
  shortName: string;
  type: 'source' | 'middleware' | 'target' | 'datalake';
  vendor: string;
  icon: 'database' | 'server' | 'cloud';
  status: 'online' | 'degraded' | 'offline';
  x: number;
  y: number;
  color: string;
  description: string;
  endpoints: number;
  dataVolume: string;
}

interface ETLPipeline {
  id: string;
  name: string;
  source: string;
  target: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  recordsProcessed: number;
  duration: number;
  transformations: string[];
}

const systemNodes: SystemNode[] = [
  {
    id: 'ariba',
    name: 'SAP Ariba',
    shortName: 'Ariba',
    type: 'source',
    vendor: 'SAP',
    icon: 'cloud',
    status: 'online',
    x: 100,
    y: 100,
    color: '#0070f3',
    description: 'Sourcing, Procurement, Contracts',
    endpoints: 12,
    dataVolume: '2.5GB/day'
  },
  {
    id: 'simplicontract',
    name: 'Simplicontract',
    shortName: 'Simpli',
    type: 'source',
    vendor: 'Simplicontract',
    icon: 'cloud',
    status: 'online',
    x: 100,
    y: 280,
    color: '#10b981',
    description: 'Contract Lifecycle Management',
    endpoints: 8,
    dataVolume: '850MB/day'
  },
  {
    id: 'vendor_portal',
    name: 'Vendor Portal',
    shortName: 'Portal',
    type: 'source',
    vendor: 'Flipkart',
    icon: 'server',
    status: 'online',
    x: 100,
    y: 460,
    color: '#f59e0b',
    description: 'Vendor Onboarding & Compliance',
    endpoints: 6,
    dataVolume: '450MB/day'
  },
  {
    id: 'integration_hub',
    name: 'Integration Hub',
    shortName: 'Hub',
    type: 'middleware',
    vendor: 'Flipkart',
    icon: 'server',
    status: 'online',
    x: 400,
    y: 280,
    color: '#8b5cf6',
    description: 'API Gateway & ETL Orchestration',
    endpoints: 45,
    dataVolume: '12GB/day'
  },
  {
    id: 'datalake',
    name: 'Procurement Data Lake',
    shortName: 'Lake',
    type: 'datalake',
    vendor: 'AWS',
    icon: 'database',
    status: 'online',
    x: 650,
    y: 180,
    color: '#ec4899',
    description: 'Unified Data Repository',
    endpoints: 20,
    dataVolume: '50TB total'
  },
  {
    id: 'fusion',
    name: 'Oracle Fusion',
    shortName: 'Fusion',
    type: 'target',
    vendor: 'Oracle',
    icon: 'cloud',
    status: 'online',
    x: 900,
    y: 100,
    color: '#ef4444',
    description: 'ERP - PR/PO Management',
    endpoints: 15,
    dataVolume: '3.2GB/day'
  },
  {
    id: 'ebs',
    name: 'Oracle EBS',
    shortName: 'EBS',
    type: 'target',
    vendor: 'Oracle',
    icon: 'database',
    status: 'degraded',
    x: 900,
    y: 280,
    color: '#f97316',
    description: 'Financials - Invoice & Payment',
    endpoints: 18,
    dataVolume: '4.1GB/day'
  },
  {
    id: 'ai_engine',
    name: 'AI/ML Engine',
    shortName: 'AI',
    type: 'target',
    vendor: 'Flipkart',
    icon: 'server',
    status: 'online',
    x: 900,
    y: 460,
    color: '#6366f1',
    description: 'Process Mining & Analytics',
    endpoints: 8,
    dataVolume: '1.8GB/day'
  }
];

const connectors: Connector[] = [
  {
    id: 'c1',
    name: 'Ariba Sourcing API',
    type: 'api',
    source: 'ariba',
    target: 'integration_hub',
    status: 'healthy',
    protocol: 'REST/HTTPS',
    encryption: 'TLS 1.3',
    authMethod: 'OAuth 2.0 + API Key',
    frequency: 'Real-time',
    lastSync: '2024-01-30 10:45:23',
    recordsPerDay: 12500,
    avgLatency: 145,
    errorRate: 0.02,
    dataTypes: ['Sourcing Events', 'RFx', 'Auctions', 'Suppliers']
  },
  {
    id: 'c2',
    name: 'Ariba Contracts ETL',
    type: 'etl',
    source: 'ariba',
    target: 'integration_hub',
    status: 'healthy',
    protocol: 'SFTP + REST',
    encryption: 'AES-256',
    authMethod: 'Certificate + OAuth',
    frequency: 'Every 15 min',
    lastSync: '2024-01-30 10:30:00',
    recordsPerDay: 8500,
    avgLatency: 2500,
    errorRate: 0.01,
    dataTypes: ['Contracts', 'Amendments', 'Terms']
  },
  {
    id: 'c3',
    name: 'Simplicontract Webhook',
    type: 'webhook',
    source: 'simplicontract',
    target: 'integration_hub',
    status: 'healthy',
    protocol: 'REST/HTTPS',
    encryption: 'TLS 1.3',
    authMethod: 'HMAC + JWT',
    frequency: 'Event-driven',
    lastSync: '2024-01-30 10:44:12',
    recordsPerDay: 3200,
    avgLatency: 85,
    errorRate: 0.03,
    dataTypes: ['Contract Events', 'Approvals', 'E-Signatures']
  },
  {
    id: 'c4',
    name: 'Simplicontract Batch',
    type: 'batch',
    source: 'simplicontract',
    target: 'integration_hub',
    status: 'healthy',
    protocol: 'SFTP',
    encryption: 'PGP + AES-256',
    authMethod: 'SSH Key',
    frequency: 'Daily 2AM',
    lastSync: '2024-01-30 02:15:00',
    recordsPerDay: 5800,
    avgLatency: 45000,
    errorRate: 0.005,
    dataTypes: ['Full Contract Sync', 'Document Archive']
  },
  {
    id: 'c5',
    name: 'Vendor Portal API',
    type: 'api',
    source: 'vendor_portal',
    target: 'integration_hub',
    status: 'healthy',
    protocol: 'GraphQL/HTTPS',
    encryption: 'TLS 1.3',
    authMethod: 'OAuth 2.0',
    frequency: 'Real-time',
    lastSync: '2024-01-30 10:45:01',
    recordsPerDay: 4500,
    avgLatency: 120,
    errorRate: 0.01,
    dataTypes: ['Vendor Data', 'Compliance Docs', 'Onboarding Status']
  },
  {
    id: 'c6',
    name: 'Data Lake Ingestion',
    type: 'etl',
    source: 'integration_hub',
    target: 'datalake',
    status: 'healthy',
    protocol: 'Kafka + S3',
    encryption: 'AES-256 at rest',
    authMethod: 'IAM Roles',
    frequency: 'Streaming',
    lastSync: '2024-01-30 10:45:25',
    recordsPerDay: 125000,
    avgLatency: 500,
    errorRate: 0.001,
    dataTypes: ['All Procurement Data', 'Events', 'Metrics']
  },
  {
    id: 'c7',
    name: 'Oracle Fusion API',
    type: 'api',
    source: 'integration_hub',
    target: 'fusion',
    status: 'healthy',
    protocol: 'REST/HTTPS',
    encryption: 'TLS 1.3',
    authMethod: 'OAuth 2.0 + SAML',
    frequency: 'Real-time',
    lastSync: '2024-01-30 10:44:58',
    recordsPerDay: 18500,
    avgLatency: 280,
    errorRate: 0.04,
    dataTypes: ['Purchase Requisitions', 'Purchase Orders', 'Receipts']
  },
  {
    id: 'c8',
    name: 'Oracle EBS ETL',
    type: 'etl',
    source: 'integration_hub',
    target: 'ebs',
    status: 'warning',
    protocol: 'JDBC + REST',
    encryption: 'TLS 1.2',
    authMethod: 'DB Auth + API Key',
    frequency: 'Every 30 min',
    lastSync: '2024-01-30 10:15:00',
    recordsPerDay: 22000,
    avgLatency: 3500,
    errorRate: 0.12,
    dataTypes: ['Invoices', 'Payments', 'GL Entries']
  },
  {
    id: 'c9',
    name: 'AI Engine Feed',
    type: 'api',
    source: 'datalake',
    target: 'ai_engine',
    status: 'healthy',
    protocol: 'gRPC/HTTPS',
    encryption: 'TLS 1.3',
    authMethod: 'mTLS',
    frequency: 'On-demand + Batch',
    lastSync: '2024-01-30 10:40:00',
    recordsPerDay: 85000,
    avgLatency: 95,
    errorRate: 0.008,
    dataTypes: ['Training Data', 'Inference Requests', 'Analytics']
  }
];

const etlPipelines: ETLPipeline[] = [
  {
    id: 'p1',
    name: 'Ariba Full Sync',
    source: 'SAP Ariba',
    target: 'Data Lake',
    schedule: 'Daily 1:00 AM',
    lastRun: '2024-01-30 01:00:00',
    nextRun: '2024-01-31 01:00:00',
    status: 'completed',
    recordsProcessed: 450000,
    duration: 45,
    transformations: ['Schema Mapping', 'Data Cleansing', 'Deduplication', 'Enrichment']
  },
  {
    id: 'p2',
    name: 'Contract Reconciliation',
    source: 'Simplicontract',
    target: 'Oracle Fusion',
    schedule: 'Every 4 hours',
    lastRun: '2024-01-30 08:00:00',
    nextRun: '2024-01-30 12:00:00',
    status: 'completed',
    recordsProcessed: 12500,
    duration: 8,
    transformations: ['Field Mapping', 'Validation', 'Currency Conversion']
  },
  {
    id: 'p3',
    name: 'Invoice Processing',
    source: 'Multiple',
    target: 'Oracle EBS',
    schedule: 'Every 30 min',
    lastRun: '2024-01-30 10:30:00',
    nextRun: '2024-01-30 11:00:00',
    status: 'running',
    recordsProcessed: 2850,
    duration: 12,
    transformations: ['3-Way Match', 'Tax Calculation', 'GL Coding', 'Approval Routing']
  },
  {
    id: 'p4',
    name: 'Vendor Master Sync',
    source: 'Vendor Portal',
    target: 'All Systems',
    schedule: 'Real-time + Daily Full',
    lastRun: '2024-01-30 02:00:00',
    nextRun: '2024-01-31 02:00:00',
    status: 'completed',
    recordsProcessed: 8500,
    duration: 22,
    transformations: ['MDM Merge', 'Compliance Check', 'Risk Scoring', 'Distribution']
  },
  {
    id: 'p5',
    name: 'Analytics Aggregation',
    source: 'Data Lake',
    target: 'AI Engine',
    schedule: 'Hourly',
    lastRun: '2024-01-30 10:00:00',
    nextRun: '2024-01-30 11:00:00',
    status: 'scheduled',
    recordsProcessed: 0,
    duration: 0,
    transformations: ['Feature Engineering', 'Aggregation', 'Model Input Prep']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'online':
    case 'completed':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' };
    case 'warning':
    case 'degraded':
    case 'running':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' };
    case 'error':
    case 'offline':
    case 'failed':
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' };
    case 'inactive':
    case 'scheduled':
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-500' };
  }
};

const getConnectorTypeStyle = (type: string) => {
  switch (type) {
    case 'api': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'API' };
    case 'etl': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'ETL' };
    case 'webhook': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Webhook' };
    case 'batch': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Batch' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: type };
  }
};

const getNodeIcon = (icon: string) => {
  switch (icon) {
    case 'database': return <Database size={24} />;
    case 'server': return <Server size={24} />;
    case 'cloud': return <Cloud size={24} />;
    default: return <Server size={24} />;
  }
};

export default function DataConnectors() {
  const [viewMode, setViewMode] = useState<'architecture' | 'connectors' | 'pipelines' | 'security'>('architecture');
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(new Set());

  const togglePipeline = (id: string) => {
    const newExpanded = new Set(expandedPipelines);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPipelines(newExpanded);
  };

  const healthyConnectors = connectors.filter(c => c.status === 'healthy').length;
  const totalRecordsPerDay = connectors.reduce((sum, c) => sum + c.recordsPerDay, 0);
  const avgErrorRate = connectors.reduce((sum, c) => sum + c.errorRate, 0) / connectors.length;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Network className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Data Connectors & Integration</h2>
              <p className="text-sm text-gray-500">Secure APIs, ETL processes, and data pipelines</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('architecture')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'architecture' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setViewMode('connectors')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'connectors' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                Connectors
              </button>
              <button
                onClick={() => setViewMode('pipelines')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'pipelines' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                ETL Pipelines
              </button>
              <button
                onClick={() => setViewMode('security')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'security' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                Security
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <RefreshCw size={16} /> Sync All
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Connectors</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{connectors.length}</p>
          <p className="text-xs text-emerald-600">{healthyConnectors} healthy</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-purple-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Systems</p>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">{systemNodes.length}</p>
          <p className="text-xs text-gray-500">integrated</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Records/Day</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{(totalRecordsPerDay / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Avg Latency</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {Math.round(connectors.filter(c => c.type === 'api').reduce((sum, c) => sum + c.avgLatency, 0) / connectors.filter(c => c.type === 'api').length)}ms
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Error Rate</p>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{(avgErrorRate * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-indigo-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Encryption</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-1">100%</p>
          <p className="text-xs text-gray-500">TLS secured</p>
        </div>
      </div>

      {viewMode === 'architecture' && (
        <div className="p-4">
          {/* Legend */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-blue-400 rounded"></div>
                <span className="text-gray-600">API (Real-time)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-purple-400 rounded" style={{ borderStyle: 'dashed' }}></div>
                <span className="text-gray-600">ETL (Batch)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-green-400 rounded"></div>
                <span className="text-gray-600">Webhook</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">Degraded</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg">
              <Download size={14} /> Export Diagram
            </button>
          </div>

          {/* Architecture Diagram */}
          <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border overflow-auto" style={{ height: '580px' }}>
            <svg className="absolute inset-0" style={{ width: '1050px', height: '580px' }}>
              <defs>
                <marker id="arrow-api" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrow-etl" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                </marker>
                <marker id="arrow-webhook" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
              </defs>

              {/* Connection Lines */}
              {/* Ariba to Hub */}
              <path d="M 240 130 L 380 260" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrow-api)" />
              <path d="M 240 150 L 380 270" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="8,4" fill="none" markerEnd="url(#arrow-etl)" />

              {/* Simplicontract to Hub */}
              <path d="M 240 300 L 380 290" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow-webhook)" />
              <path d="M 240 320 L 380 300" stroke="#f97316" strokeWidth="2" strokeDasharray="8,4" fill="none" markerEnd="url(#arrow-etl)" />

              {/* Vendor Portal to Hub */}
              <path d="M 240 480 L 380 310" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrow-api)" />

              {/* Hub to Data Lake */}
              <path d="M 530 270 L 630 210" stroke="#8b5cf6" strokeWidth="4" fill="none" markerEnd="url(#arrow-etl)" />

              {/* Hub to Fusion */}
              <path d="M 530 260 L 880 130" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrow-api)" />

              {/* Hub to EBS */}
              <path d="M 530 290 L 880 300" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8,4" fill="none" markerEnd="url(#arrow-etl)" />

              {/* Data Lake to AI */}
              <path d="M 750 230 L 880 450" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrow-api)" />

              {/* Security Layer Indicators */}
              <rect x="270" y="100" width="100" height="30" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
              <text x="320" y="120" textAnchor="middle" className="text-[10px] fill-amber-700 font-medium">TLS 1.3 + OAuth</text>

              <rect x="560" y="230" width="80" height="25" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
              <text x="600" y="247" textAnchor="middle" className="text-[10px] fill-green-700 font-medium">Kafka + S3</text>

              <rect x="750" y="100" width="90" height="25" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
              <text x="795" y="117" textAnchor="middle" className="text-[10px] fill-blue-700 font-medium">mTLS + SAML</text>
            </svg>

            {/* System Nodes */}
            {systemNodes.map((node) => {
              const statusColor = getStatusColor(node.status);
              return (
                <div
                  key={node.id}
                  className="absolute bg-white rounded-xl shadow-lg border-2 p-4 cursor-pointer hover:shadow-xl transition-shadow"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: '140px',
                    borderColor: node.color
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${node.color}20` }}>
                      <div style={{ color: node.color }}>{getNodeIcon(node.icon)}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${statusColor.dot}`}></div>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm">{node.shortName}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{node.vendor}</p>
                  <div className="mt-2 pt-2 border-t space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">Endpoints:</span>
                      <span className="font-medium text-gray-700">{node.endpoints}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">Volume:</span>
                      <span className="font-medium text-gray-700">{node.dataVolume}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Labels for Data Flow */}
            <div className="absolute left-[50px] top-[50px] text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Source Systems
            </div>
            <div className="absolute left-[370px] top-[50px] text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Middleware
            </div>
            <div className="absolute left-[620px] top-[50px] text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Data Storage
            </div>
            <div className="absolute left-[870px] top-[50px] text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Target Systems
            </div>
          </div>
        </div>
      )}

      {viewMode === 'connectors' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">API & ETL Connectors</h3>
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
            {connectors.map((connector) => {
              const statusColor = getStatusColor(connector.status);
              const typeStyle = getConnectorTypeStyle(connector.type);
              const isSelected = selectedConnector?.id === connector.id;

              return (
                <div
                  key={connector.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedConnector(isSelected ? null : connector)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-gray-400">
                          {isSelected ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${statusColor.dot}`}></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">{connector.name}</span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeStyle.bg} ${typeStyle.text}`}>
                                {typeStyle.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {systemNodes.find(n => n.id === connector.source)?.name} → {systemNodes.find(n => n.id === connector.target)?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Protocol</p>
                          <p className="font-medium text-gray-700">{connector.protocol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Frequency</p>
                          <p className="font-medium text-gray-700">{connector.frequency}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Records/Day</p>
                          <p className="font-medium text-blue-600">{connector.recordsPerDay.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Latency</p>
                          <p className={`font-medium ${connector.avgLatency > 1000 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {connector.avgLatency}ms
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Error Rate</p>
                          <p className={`font-medium ${connector.errorRate > 0.05 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {(connector.errorRate * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Security</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Lock size={14} className="text-green-500" />
                              <span className="text-sm">{connector.encryption}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield size={14} className="text-blue-500" />
                              <span className="text-sm">{connector.authMethod}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Last Sync</h4>
                          <p className="text-sm text-gray-700">{connector.lastSync}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {connector.status === 'healthy' ? (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <CheckCircle size={12} /> Sync successful
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1">
                                <AlertTriangle size={12} /> Issues detected
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Data Types</h4>
                          <div className="flex flex-wrap gap-1">
                            {connector.dataTypes.map((dt, idx) => (
                              <span key={idx} className="px-2 py-0.5 text-xs bg-white border rounded">
                                {dt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye size={14} /> View Logs
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Settings size={14} /> Configure
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                            <RefreshCw size={14} /> Sync Now
                          </button>
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

      {viewMode === 'pipelines' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">ETL Pipelines</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              <Play size={16} /> Run All Pipelines
            </button>
          </div>

          <div className="space-y-4">
            {etlPipelines.map((pipeline) => {
              const statusColor = getStatusColor(pipeline.status);
              const isExpanded = expandedPipelines.has(pipeline.id);

              return (
                <div key={pipeline.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => togglePipeline(pipeline.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-gray-400">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="flex items-center gap-3">
                          {pipeline.status === 'running' ? (
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <RefreshCw size={16} className="text-amber-600 animate-spin" />
                            </div>
                          ) : pipeline.status === 'completed' ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <CheckCircle size={16} className="text-emerald-600" />
                            </div>
                          ) : pipeline.status === 'failed' ? (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                              <XCircle size={16} className="text-red-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Clock size={16} className="text-gray-600" />
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-800">{pipeline.name}</span>
                            <p className="text-xs text-gray-500">
                              {pipeline.source} → {pipeline.target}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Schedule</p>
                          <p className="font-medium text-gray-700">{pipeline.schedule}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Last Run</p>
                          <p className="font-medium text-gray-700">{pipeline.lastRun.split(' ')[1]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Records</p>
                          <p className="font-medium text-blue-600">{pipeline.recordsProcessed.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-medium text-gray-700">{pipeline.duration} min</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor.bg} ${statusColor.text}`}>
                          {pipeline.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Transformations</h4>
                          <div className="space-y-2">
                            {pipeline.transformations.map((t, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                                  {idx + 1}
                                </div>
                                <span className="text-sm text-gray-700">{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Schedule Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Last Run:</span>
                              <span className="text-gray-700">{pipeline.lastRun}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Next Run:</span>
                              <span className="text-gray-700">{pipeline.nextRun}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Avg Duration:</span>
                              <span className="text-gray-700">{pipeline.duration} minutes</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye size={14} /> View Logs
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Pause size={14} /> Pause
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-lg">
                            <Play size={14} /> Run Now
                          </button>
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

      {viewMode === 'security' && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Encryption Standards */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={20} className="text-green-500" />
                <h3 className="text-lg font-semibold text-gray-800">Encryption Standards</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-medium text-green-800">TLS 1.3</span>
                    </div>
                    <span className="text-sm text-green-600">8 connectors</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Latest transport layer security for all API connections</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-800">AES-256</span>
                    </div>
                    <span className="text-sm text-blue-600">All ETL pipelines</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Data at rest encryption for all stored data</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-purple-600" />
                      <span className="font-medium text-purple-800">PGP Encryption</span>
                    </div>
                    <span className="text-sm text-purple-600">Batch transfers</span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">End-to-end encryption for file transfers</p>
                </div>
              </div>
            </div>

            {/* Authentication Methods */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">Authentication Methods</h3>
              </div>
              <div className="space-y-3">
                {[
                  { method: 'OAuth 2.0', count: 5, description: 'Industry-standard token-based auth' },
                  { method: 'mTLS (Mutual TLS)', count: 2, description: 'Certificate-based mutual authentication' },
                  { method: 'API Keys + HMAC', count: 3, description: 'Signed request authentication' },
                  { method: 'SAML 2.0', count: 2, description: 'Enterprise SSO integration' },
                  { method: 'IAM Roles', count: 1, description: 'Cloud-native identity management' },
                ].map((auth, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{auth.method}</p>
                      <p className="text-xs text-gray-500">{auth.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {auth.count} connectors
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance & Audit */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">Compliance & Audit</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-indigo-600">100%</p>
                    <p className="text-xs text-indigo-600">Audit Trail Coverage</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">SOC 2</p>
                    <p className="text-xs text-green-600">Type II Compliant</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>All data transfers logged with timestamps</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>90-day retention for audit logs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Real-time anomaly detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>GDPR & data residency compliance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Security */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={20} className="text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-800">Infrastructure Security</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-amber-50 rounded-lg text-center">
                    <HardDrive size={24} className="text-amber-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-amber-800">VPC Isolated</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <Shield size={24} className="text-red-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-red-800">WAF Protected</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <Network size={24} className="text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-blue-800">Private Link</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">IP Whitelisting</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-white border rounded font-mono">10.0.0.0/8</span>
                    <span className="px-2 py-1 text-xs bg-white border rounded font-mono">172.16.0.0/12</span>
                    <span className="px-2 py-1 text-xs bg-white border rounded font-mono">192.168.0.0/16</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Rate Limiting: 1000 req/min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>DDoS Protection: Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-600" />
              <h4 className="font-semibold text-amber-800">Recent Security Events</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-gray-700">Oracle EBS connector TLS certificate expires in 30 days</span>
                </div>
                <span className="text-gray-500">2024-01-30</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-gray-700">SAP Ariba OAuth tokens rotated successfully</span>
                </div>
                <span className="text-gray-500">2024-01-29</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-gray-700">Penetration test completed - no critical findings</span>
                </div>
                <span className="text-gray-500">2024-01-25</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
