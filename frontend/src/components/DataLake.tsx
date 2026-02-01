import { useState } from 'react';
import {
  Database, Layers, FileText, Search, Filter, Download, RefreshCw,
  CheckCircle, AlertTriangle, Clock, HardDrive, Cpu, BarChart3,
  ChevronDown, ChevronRight, Eye, Settings, Play, Zap, Shield,
  GitBranch, Box, Table, FileCode, Archive, TrendingUp, Activity
} from 'lucide-react';

interface DataZone {
  id: string;
  name: string;
  description: string;
  type: 'raw' | 'processed' | 'curated' | 'archive';
  storageSize: string;
  objectCount: number;
  lastUpdated: string;
  retentionDays: number;
  encryption: string;
  accessLevel: string;
}

interface DataSet {
  id: string;
  name: string;
  source: string;
  zone: string;
  format: string;
  schema: string;
  size: string;
  records: number;
  lastIngested: string;
  updateFrequency: string;
  qualityScore: number;
  owner: string;
  tags: string[];
  columns: number;
  partitionKey?: string;
}

interface DataPipeline {
  id: string;
  name: string;
  sourceZone: string;
  targetZone: string;
  type: 'etl' | 'streaming' | 'batch' | 'ml';
  status: 'active' | 'paused' | 'failed';
  lastRun: string;
  avgDuration: number;
  recordsProcessed: number;
  schedule: string;
}

interface DataQualityRule {
  id: string;
  dataset: string;
  rule: string;
  type: 'completeness' | 'accuracy' | 'consistency' | 'timeliness' | 'uniqueness';
  passRate: number;
  lastChecked: string;
  status: 'pass' | 'warning' | 'fail';
}

const dataZones: DataZone[] = [
  {
    id: 'raw',
    name: 'Raw Zone',
    description: 'Landing zone for ingested data in original format',
    type: 'raw',
    storageSize: '12.5 TB',
    objectCount: 2450000,
    lastUpdated: '2024-01-30 10:45:00',
    retentionDays: 90,
    encryption: 'AES-256',
    accessLevel: 'Data Engineers'
  },
  {
    id: 'processed',
    name: 'Processed Zone',
    description: 'Cleaned, validated, and transformed data',
    type: 'processed',
    storageSize: '8.2 TB',
    objectCount: 1850000,
    lastUpdated: '2024-01-30 10:30:00',
    retentionDays: 180,
    encryption: 'AES-256',
    accessLevel: 'Data Engineers, Analysts'
  },
  {
    id: 'curated',
    name: 'Curated Zone',
    description: 'Business-ready datasets for analytics and reporting',
    type: 'curated',
    storageSize: '3.8 TB',
    objectCount: 450000,
    lastUpdated: '2024-01-30 10:00:00',
    retentionDays: 365,
    encryption: 'AES-256',
    accessLevel: 'All Authorized Users'
  },
  {
    id: 'archive',
    name: 'Archive Zone',
    description: 'Historical data for compliance and long-term storage',
    type: 'archive',
    storageSize: '25.5 TB',
    objectCount: 8500000,
    lastUpdated: '2024-01-29 02:00:00',
    retentionDays: 2555,
    encryption: 'AES-256 + Glacier',
    accessLevel: 'Restricted'
  }
];

const dataSets: DataSet[] = [
  {
    id: 'ds1',
    name: 'procurement_transactions',
    source: 'SAP Ariba',
    zone: 'curated',
    format: 'Parquet',
    schema: 'procurement.transactions',
    size: '2.1 GB',
    records: 1247000,
    lastIngested: '2024-01-30 10:45:00',
    updateFrequency: 'Real-time',
    qualityScore: 98.5,
    owner: 'procurement_team',
    tags: ['PII', 'Financial', 'Critical'],
    columns: 45,
    partitionKey: 'transaction_date'
  },
  {
    id: 'ds2',
    name: 'vendor_master',
    source: 'Vendor Portal',
    zone: 'curated',
    format: 'Parquet',
    schema: 'procurement.vendors',
    size: '850 MB',
    records: 248000,
    lastIngested: '2024-01-30 02:00:00',
    updateFrequency: 'Daily',
    qualityScore: 99.2,
    owner: 'vendor_mgmt',
    tags: ['MDM', 'Critical'],
    columns: 62,
    partitionKey: 'vendor_category'
  },
  {
    id: 'ds3',
    name: 'contracts_raw',
    source: 'Simplicontract',
    zone: 'raw',
    format: 'JSON',
    schema: 'raw.contracts',
    size: '1.8 GB',
    records: 89000,
    lastIngested: '2024-01-30 10:30:00',
    updateFrequency: 'Every 15 min',
    qualityScore: 95.8,
    owner: 'legal_team',
    tags: ['Legal', 'Sensitive'],
    columns: 78
  },
  {
    id: 'ds4',
    name: 'invoices_processed',
    source: 'Oracle EBS',
    zone: 'processed',
    format: 'Delta',
    schema: 'finance.invoices',
    size: '4.2 GB',
    records: 2850000,
    lastIngested: '2024-01-30 10:15:00',
    updateFrequency: 'Every 30 min',
    qualityScore: 97.3,
    owner: 'finance_team',
    tags: ['Financial', 'Audit'],
    columns: 52,
    partitionKey: 'invoice_date'
  },
  {
    id: 'ds5',
    name: 'purchase_orders',
    source: 'Oracle Fusion',
    zone: 'curated',
    format: 'Parquet',
    schema: 'procurement.purchase_orders',
    size: '1.5 GB',
    records: 1156000,
    lastIngested: '2024-01-30 10:40:00',
    updateFrequency: 'Real-time',
    qualityScore: 98.9,
    owner: 'procurement_team',
    tags: ['Financial', 'Critical'],
    columns: 38,
    partitionKey: 'po_date'
  },
  {
    id: 'ds6',
    name: 'sourcing_events',
    source: 'SAP Ariba',
    zone: 'processed',
    format: 'Parquet',
    schema: 'procurement.sourcing',
    size: '980 MB',
    records: 425000,
    lastIngested: '2024-01-30 08:00:00',
    updateFrequency: 'Every 4 hours',
    qualityScore: 96.5,
    owner: 'sourcing_team',
    tags: ['Sourcing', 'Bidding'],
    columns: 55,
    partitionKey: 'event_date'
  },
  {
    id: 'ds7',
    name: 'process_mining_events',
    source: 'Integration Hub',
    zone: 'curated',
    format: 'Delta',
    schema: 'analytics.process_events',
    size: '3.5 GB',
    records: 15800000,
    lastIngested: '2024-01-30 10:45:00',
    updateFrequency: 'Streaming',
    qualityScore: 99.1,
    owner: 'analytics_team',
    tags: ['Analytics', 'ML'],
    columns: 28,
    partitionKey: 'event_timestamp'
  },
  {
    id: 'ds8',
    name: 'compliance_docs',
    source: 'Vendor Portal',
    zone: 'archive',
    format: 'PDF/Binary',
    schema: 'compliance.documents',
    size: '8.5 GB',
    records: 185000,
    lastIngested: '2024-01-30 02:00:00',
    updateFrequency: 'Daily',
    qualityScore: 94.2,
    owner: 'compliance_team',
    tags: ['Compliance', 'Documents', 'Archive'],
    columns: 12
  }
];

const dataPipelines: DataPipeline[] = [
  {
    id: 'pl1',
    name: 'Ariba Raw to Processed',
    sourceZone: 'Raw Zone',
    targetZone: 'Processed Zone',
    type: 'etl',
    status: 'active',
    lastRun: '2024-01-30 10:30:00',
    avgDuration: 12,
    recordsProcessed: 125000,
    schedule: 'Every 15 min'
  },
  {
    id: 'pl2',
    name: 'Transaction Curation',
    sourceZone: 'Processed Zone',
    targetZone: 'Curated Zone',
    type: 'etl',
    status: 'active',
    lastRun: '2024-01-30 10:00:00',
    avgDuration: 25,
    recordsProcessed: 85000,
    schedule: 'Hourly'
  },
  {
    id: 'pl3',
    name: 'Real-time Event Stream',
    sourceZone: 'Raw Zone',
    targetZone: 'Curated Zone',
    type: 'streaming',
    status: 'active',
    lastRun: '2024-01-30 10:45:00',
    avgDuration: 0,
    recordsProcessed: 15000,
    schedule: 'Continuous'
  },
  {
    id: 'pl4',
    name: 'ML Feature Engineering',
    sourceZone: 'Curated Zone',
    targetZone: 'ML Feature Store',
    type: 'ml',
    status: 'active',
    lastRun: '2024-01-30 10:00:00',
    avgDuration: 45,
    recordsProcessed: 250000,
    schedule: 'Hourly'
  },
  {
    id: 'pl5',
    name: 'Archive Migration',
    sourceZone: 'Processed Zone',
    targetZone: 'Archive Zone',
    type: 'batch',
    status: 'active',
    lastRun: '2024-01-30 02:00:00',
    avgDuration: 120,
    recordsProcessed: 500000,
    schedule: 'Daily 2 AM'
  },
  {
    id: 'pl6',
    name: 'Invoice Reconciliation',
    sourceZone: 'Multiple',
    targetZone: 'Curated Zone',
    type: 'etl',
    status: 'paused',
    lastRun: '2024-01-30 08:00:00',
    avgDuration: 35,
    recordsProcessed: 0,
    schedule: 'Every 4 hours'
  }
];

const dataQualityRules: DataQualityRule[] = [
  { id: 'dq1', dataset: 'procurement_transactions', rule: 'Transaction ID not null', type: 'completeness', passRate: 100, lastChecked: '2024-01-30 10:45:00', status: 'pass' },
  { id: 'dq2', dataset: 'procurement_transactions', rule: 'Amount within valid range', type: 'accuracy', passRate: 99.8, lastChecked: '2024-01-30 10:45:00', status: 'pass' },
  { id: 'dq3', dataset: 'vendor_master', rule: 'Email format validation', type: 'accuracy', passRate: 98.5, lastChecked: '2024-01-30 02:00:00', status: 'pass' },
  { id: 'dq4', dataset: 'vendor_master', rule: 'No duplicate vendor IDs', type: 'uniqueness', passRate: 100, lastChecked: '2024-01-30 02:00:00', status: 'pass' },
  { id: 'dq5', dataset: 'invoices_processed', rule: 'Invoice date not future', type: 'accuracy', passRate: 99.2, lastChecked: '2024-01-30 10:15:00', status: 'pass' },
  { id: 'dq6', dataset: 'invoices_processed', rule: 'Three-way match consistency', type: 'consistency', passRate: 94.5, lastChecked: '2024-01-30 10:15:00', status: 'warning' },
  { id: 'dq7', dataset: 'contracts_raw', rule: 'Contract start before end', type: 'accuracy', passRate: 99.9, lastChecked: '2024-01-30 10:30:00', status: 'pass' },
  { id: 'dq8', dataset: 'process_mining_events', rule: 'Event timestamp freshness', type: 'timeliness', passRate: 99.5, lastChecked: '2024-01-30 10:45:00', status: 'pass' },
  { id: 'dq9', dataset: 'purchase_orders', rule: 'PO amount matches line items', type: 'consistency', passRate: 97.8, lastChecked: '2024-01-30 10:40:00', status: 'pass' },
  { id: 'dq10', dataset: 'compliance_docs', rule: 'Document expiry tracking', type: 'timeliness', passRate: 88.5, lastChecked: '2024-01-30 02:00:00', status: 'warning' }
];

const getZoneColor = (type: string) => {
  switch (type) {
    case 'raw': return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', accent: '#3b82f6' };
    case 'processed': return { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', accent: '#8b5cf6' };
    case 'curated': return { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700', accent: '#10b981' };
    case 'archive': return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', accent: '#6b7280' };
    default: return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', accent: '#6b7280' };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pass':
    case 'active':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'warning':
    case 'paused':
      return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'fail':
    case 'failed':
      return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
  }
};

const getFormatIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case 'parquet': return <Box size={14} className="text-purple-500" />;
    case 'delta': return <GitBranch size={14} className="text-blue-500" />;
    case 'json': return <FileCode size={14} className="text-amber-500" />;
    case 'pdf/binary': return <FileText size={14} className="text-red-500" />;
    default: return <Table size={14} className="text-gray-500" />;
  }
};

export default function DataLake() {
  const [viewMode, setViewMode] = useState<'overview' | 'catalog' | 'pipelines' | 'quality'>('overview');
  const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const totalStorage = dataZones.reduce((sum, z) => sum + parseFloat(z.storageSize), 0);
  const totalRecords = dataSets.reduce((sum, d) => sum + d.records, 0);
  const avgQuality = dataSets.reduce((sum, d) => sum + d.qualityScore, 0) / dataSets.length;

  const filteredDatasets = dataSets.filter(d =>
    (selectedZone === null || d.zone === selectedZone) &&
    (searchTerm === '' || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Database className="text-emerald-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Procurement Data Lake</h2>
              <p className="text-sm text-gray-500">Centralized raw data storage for processing and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'overview' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('catalog')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'catalog' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600'
                }`}
              >
                Data Catalog
              </button>
              <button
                onClick={() => setViewMode('pipelines')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'pipelines' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600'
                }`}
              >
                Pipelines
              </button>
              <button
                onClick={() => setViewMode('quality')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'quality' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600'
                }`}
              >
                Data Quality
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <HardDrive size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Total Storage</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalStorage.toFixed(1)} TB</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Data Zones</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{dataZones.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Table size={16} className="text-purple-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Datasets</p>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">{dataSets.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-amber-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Total Records</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{(totalRecords / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Avg Quality</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{avgQuality.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-indigo-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Active Pipelines</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{dataPipelines.filter(p => p.status === 'active').length}</p>
        </div>
      </div>

      {viewMode === 'overview' && (
        <div className="p-4">
          {/* Data Lake Architecture */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Lake Architecture</h3>
            <div className="relative bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border p-6" style={{ height: '400px' }}>
              {/* Data Flow Arrows */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker id="arrow-flow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                  </marker>
                </defs>
                {/* Ingestion to Raw */}
                <path d="M 150 100 L 280 100" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                <path d="M 150 200 L 280 150" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                <path d="M 150 300 L 280 200" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                {/* Raw to Processed */}
                <path d="M 420 150 L 520 150" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                {/* Processed to Curated */}
                <path d="M 660 150 L 760 150" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                {/* Processed to Archive */}
                <path d="M 590 200 L 590 280" stroke="#6b7280" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#arrow-flow)" />
                {/* Curated to Consumers */}
                <path d="M 900 100 L 1000 80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                <path d="M 900 150 L 1000 150" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-flow)" />
                <path d="M 900 200 L 1000 220" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-flow)" />
              </svg>

              {/* Source Systems */}
              <div className="absolute left-4 top-12 space-y-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Data Sources</div>
                {['SAP Ariba', 'Simplicontract', 'Oracle Systems', 'Vendor Portal'].map((source, idx) => (
                  <div key={source} className="bg-white rounded-lg border shadow-sm p-2 w-32" style={{ marginTop: idx === 0 ? 0 : '8px' }}>
                    <p className="text-xs font-medium text-gray-700">{source}</p>
                  </div>
                ))}
              </div>

              {/* Data Zones */}
              {dataZones.map((zone, idx) => {
                const colors = getZoneColor(zone.type);
                const positions = [
                  { left: '280px', top: '60px', width: '140px' },
                  { left: '520px', top: '60px', width: '140px' },
                  { left: '760px', top: '60px', width: '140px' },
                  { left: '520px', top: '280px', width: '140px' }
                ];
                return (
                  <div
                    key={zone.id}
                    className={`absolute ${colors.bg} border-2 ${colors.border} rounded-xl p-3 cursor-pointer hover:shadow-lg transition-shadow`}
                    style={{ ...positions[idx], height: zone.type === 'archive' ? '80px' : '180px' }}
                    onClick={() => setSelectedZone(zone.type)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {zone.type === 'raw' && <Box size={16} className={colors.text} />}
                      {zone.type === 'processed' && <Cpu size={16} className={colors.text} />}
                      {zone.type === 'curated' && <CheckCircle size={16} className={colors.text} />}
                      {zone.type === 'archive' && <Archive size={16} className={colors.text} />}
                      <span className={`font-bold text-sm ${colors.text}`}>{zone.name}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600">{zone.storageSize}</p>
                      <p className="text-gray-500">{(zone.objectCount / 1000000).toFixed(1)}M objects</p>
                      {zone.type !== 'archive' && (
                        <p className="text-gray-500">{zone.retentionDays}d retention</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Data Consumers */}
              <div className="absolute right-4 top-12 space-y-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Data Consumers</div>
                {[
                  { name: 'BI & Reporting', icon: BarChart3 },
                  { name: 'AI/ML Models', icon: Cpu },
                  { name: 'APIs & Apps', icon: Zap },
                  { name: 'Data Science', icon: GitBranch }
                ].map((consumer, idx) => (
                  <div key={consumer.name} className="bg-white rounded-lg border shadow-sm p-2 w-32 flex items-center gap-2" style={{ marginTop: idx === 0 ? 0 : '8px' }}>
                    <consumer.icon size={14} className="text-blue-500" />
                    <p className="text-xs font-medium text-gray-700">{consumer.name}</p>
                  </div>
                ))}
              </div>

              {/* Processing Labels */}
              <div className="absolute left-[200px] top-[260px] text-xs text-gray-500 font-medium">
                Ingestion
              </div>
              <div className="absolute left-[450px] top-[260px] text-xs text-gray-500 font-medium">
                ETL/Transform
              </div>
              <div className="absolute left-[700px] top-[260px] text-xs text-gray-500 font-medium">
                Curation
              </div>
            </div>
          </div>

          {/* Zone Details */}
          <div className="grid grid-cols-4 gap-4">
            {dataZones.map((zone) => {
              const colors = getZoneColor(zone.type);
              return (
                <div key={zone.id} className={`border rounded-lg p-4 ${colors.bg} ${colors.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-bold ${colors.text}`}>{zone.name}</h4>
                    <Shield size={16} className={colors.text} />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{zone.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Storage:</span>
                      <span className="font-medium">{zone.storageSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Objects:</span>
                      <span className="font-medium">{zone.objectCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Retention:</span>
                      <span className="font-medium">{zone.retentionDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Encryption:</span>
                      <span className="font-medium text-green-600">{zone.encryption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Access:</span>
                      <span className="font-medium text-xs">{zone.accessLevel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'catalog' && (
        <div className="p-4">
          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedZone || ''}
                  onChange={(e) => setSelectedZone(e.target.value || null)}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Zones</option>
                  <option value="raw">Raw Zone</option>
                  <option value="processed">Processed Zone</option>
                  <option value="curated">Curated Zone</option>
                  <option value="archive">Archive Zone</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
              <Download size={16} /> Export Catalog
            </button>
          </div>

          {/* Dataset List */}
          <div className="space-y-3">
            {filteredDatasets.map((dataset) => {
              const zoneColors = getZoneColor(dataset.zone);
              const isSelected = selectedDataset?.id === dataset.id;

              return (
                <div
                  key={dataset.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    isSelected ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedDataset(isSelected ? null : dataset)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-gray-400">
                          {isSelected ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="flex items-center gap-3">
                          {getFormatIcon(dataset.format)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800 font-mono">{dataset.name}</span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${zoneColors.bg} ${zoneColors.text}`}>
                                {dataset.zone}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{dataset.schema} | Source: {dataset.source}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Format</p>
                          <p className="font-medium text-gray-700">{dataset.format}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="font-medium text-gray-700">{dataset.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Records</p>
                          <p className="font-medium text-blue-600">{(dataset.records / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Quality</p>
                          <p className={`font-medium ${dataset.qualityScore >= 98 ? 'text-emerald-600' : dataset.qualityScore >= 95 ? 'text-amber-600' : 'text-red-600'}`}>
                            {dataset.qualityScore}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Update</p>
                          <p className="font-medium text-gray-700">{dataset.updateFrequency}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-10">
                      {dataset.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Schema Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Columns:</span> <span className="font-medium">{dataset.columns}</span></p>
                            {dataset.partitionKey && (
                              <p><span className="text-gray-500">Partition:</span> <span className="font-medium">{dataset.partitionKey}</span></p>
                            )}
                            <p><span className="text-gray-500">Owner:</span> <span className="font-medium">{dataset.owner}</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Last Ingested</h4>
                          <p className="text-sm text-gray-700">{dataset.lastIngested}</p>
                          <p className="text-xs text-gray-500 mt-1">Update: {dataset.updateFrequency}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Data Lineage</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{dataset.source}</span>
                            <span className="text-gray-400">→</span>
                            <span className={`px-2 py-1 rounded ${zoneColors.bg} ${zoneColors.text}`}>{dataset.zone}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye size={14} /> Preview
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Settings size={14} /> Schema
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg">
                            <Download size={14} /> Query
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
            <h3 className="text-lg font-semibold text-gray-800">Data Processing Pipelines</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
              <Play size={16} /> Run All
            </button>
          </div>

          <div className="space-y-4">
            {dataPipelines.map((pipeline) => {
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
                          {pipeline.status === 'active' ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Activity size={16} className="text-emerald-600" />
                            </div>
                          ) : pipeline.status === 'paused' ? (
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Clock size={16} className="text-amber-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                              <AlertTriangle size={16} className="text-red-600" />
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-800">{pipeline.name}</span>
                            <p className="text-xs text-gray-500">
                              {pipeline.sourceZone} → {pipeline.targetZone}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-medium text-gray-700 uppercase">{pipeline.type}</p>
                        </div>
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
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Pipeline Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Type:</span> <span className="font-medium uppercase">{pipeline.type}</span></p>
                            <p><span className="text-gray-500">Avg Duration:</span> <span className="font-medium">{pipeline.avgDuration} min</span></p>
                            <p><span className="text-gray-500">Last Run:</span> <span className="font-medium">{pipeline.lastRun}</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Data Flow</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{pipeline.sourceZone}</span>
                            <span className="text-gray-400">→</span>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">{pipeline.targetZone}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye size={14} /> Logs
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg">
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

      {viewMode === 'quality' && (
        <div className="p-4">
          {/* Quality Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-4 bg-emerald-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-800">Passing Rules</span>
                <CheckCircle size={18} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {dataQualityRules.filter(r => r.status === 'pass').length}
              </p>
              <p className="text-xs text-emerald-600">{((dataQualityRules.filter(r => r.status === 'pass').length / dataQualityRules.length) * 100).toFixed(0)}% of rules</p>
            </div>
            <div className="border rounded-lg p-4 bg-amber-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-800">Warnings</span>
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">
                {dataQualityRules.filter(r => r.status === 'warning').length}
              </p>
              <p className="text-xs text-amber-600">Require attention</p>
            </div>
            <div className="border rounded-lg p-4 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-800">Failed</span>
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {dataQualityRules.filter(r => r.status === 'fail').length}
              </p>
              <p className="text-xs text-red-600">Critical issues</p>
            </div>
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Avg Pass Rate</span>
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {(dataQualityRules.reduce((sum, r) => sum + r.passRate, 0) / dataQualityRules.length).toFixed(1)}%
              </p>
              <p className="text-xs text-blue-600">Across all rules</p>
            </div>
          </div>

          {/* Quality Rules Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Dataset</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rule</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Pass Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Checked</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataQualityRules.map((rule) => {
                  const statusColor = getStatusColor(rule.status);
                  return (
                    <tr key={rule.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-blue-600">{rule.dataset}</td>
                      <td className="py-3 px-4">{rule.rule}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded capitalize">
                          {rule.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                rule.passRate >= 98 ? 'bg-emerald-500' :
                                rule.passRate >= 90 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${rule.passRate}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{rule.passRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{rule.lastChecked.split(' ')[1]}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor.bg} ${statusColor.text}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:underline flex items-center gap-1">
                          <Eye size={14} /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quality Dimensions */}
          <div className="mt-6 grid grid-cols-5 gap-4">
            {['completeness', 'accuracy', 'consistency', 'timeliness', 'uniqueness'].map((dim) => {
              const rules = dataQualityRules.filter(r => r.type === dim);
              const avgPass = rules.length > 0 ? rules.reduce((sum, r) => sum + r.passRate, 0) / rules.length : 0;
              return (
                <div key={dim} className="border rounded-lg p-4 text-center">
                  <h4 className="text-sm font-semibold text-gray-800 capitalize mb-2">{dim}</h4>
                  <p className={`text-2xl font-bold ${avgPass >= 98 ? 'text-emerald-600' : avgPass >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                    {avgPass.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">{rules.length} rules</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
