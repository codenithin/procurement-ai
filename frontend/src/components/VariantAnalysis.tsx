import { useState } from 'react';
import {
  AlertTriangle, CheckCircle, Filter, Download,
  ChevronDown, ChevronRight, ArrowRight, Eye, XCircle, Shuffle,
  TrendingUp, BarChart3, AlertCircle, FileText, Search, Zap
} from 'lucide-react';

interface SequenceAnomaly {
  id: string;
  type: 'contract_before_sourcing' | 'po_before_contract' | 'payment_before_gr' | 'skip_approval' | 'duplicate_step' | 'missing_step';
  description: string;
  expectedSequence: string[];
  actualSequence: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  instances: AnomalyInstance[];
  totalCount: number;
  percentageOfTotal: number;
  avgCycleImpact: number;
  riskScore: number;
}

interface AnomalyInstance {
  transactionId: string;
  vendorName: string;
  amount: number;
  startDate: string;
  completedDate: string;
  cycleTime: number;
  owner: string;
  department: string;
}

interface VariantCluster {
  id: string;
  name: string;
  type: 'common' | 'outlier';
  variants: ProcessVariant[];
  totalTransactions: number;
  percentageOfTotal: number;
  avgCycleTime: number;
  characteristics: string[];
}

interface ProcessVariant {
  id: string;
  path: string[];
  count: number;
  percentage: number;
  avgDuration: number;
  isStandard: boolean;
  conformance: 'compliant' | 'minor_deviation' | 'major_deviation';
  anomalies: string[];
}

// Sequence anomalies data - instances where process order was violated
const sequenceAnomalies: SequenceAnomaly[] = [
  {
    id: 'sa1',
    type: 'contract_before_sourcing',
    description: 'Contract created before formal sourcing event was completed',
    expectedSequence: ['Request', 'Budget', 'Sourcing', 'Contract'],
    actualSequence: ['Request', 'Budget', 'Contract', 'Sourcing'],
    severity: 'critical',
    totalCount: 23,
    percentageOfTotal: 1.84,
    avgCycleImpact: -8.5,
    riskScore: 92,
    instances: [
      { transactionId: 'TXN-2024-0892', vendorName: 'Delhivery Logistics', amount: 4500000, startDate: '2024-01-15', completedDate: '2024-02-28', cycleTime: 44, owner: 'Rahul Sharma', department: 'Logistics' },
      { transactionId: 'TXN-2024-0915', vendorName: 'BlueDart Express', amount: 2800000, startDate: '2024-01-22', completedDate: '2024-03-05', cycleTime: 43, owner: 'Priya Nair', department: 'Supply Chain' },
      { transactionId: 'TXN-2024-0934', vendorName: 'XpressBees', amount: 1950000, startDate: '2024-02-01', completedDate: '2024-03-12', cycleTime: 40, owner: 'Amit Kumar', department: 'Operations' },
      { transactionId: 'TXN-2024-0967', vendorName: 'Shadowfax Tech', amount: 3200000, startDate: '2024-02-08', completedDate: '2024-03-20', cycleTime: 41, owner: 'Sneha Reddy', department: 'Logistics' },
      { transactionId: 'TXN-2024-0989', vendorName: 'Ecom Express', amount: 5100000, startDate: '2024-02-15', completedDate: '2024-04-01', cycleTime: 46, owner: 'Vikram Singh', department: 'Supply Chain' },
    ]
  },
  {
    id: 'sa2',
    type: 'po_before_contract',
    description: 'Purchase Order raised before contract execution',
    expectedSequence: ['Contract', 'Vendor Onboard', 'PR', 'PO'],
    actualSequence: ['PR', 'PO', 'Contract', 'Vendor Onboard'],
    severity: 'high',
    totalCount: 37,
    percentageOfTotal: 2.97,
    avgCycleImpact: -5.2,
    riskScore: 78,
    instances: [
      { transactionId: 'TXN-2024-0756', vendorName: 'Dell Technologies', amount: 8500000, startDate: '2024-01-10', completedDate: '2024-02-25', cycleTime: 46, owner: 'Karthik Iyer', department: 'IT' },
      { transactionId: 'TXN-2024-0782', vendorName: 'HP India', amount: 4200000, startDate: '2024-01-18', completedDate: '2024-03-02', cycleTime: 44, owner: 'Ananya Gupta', department: 'IT' },
      { transactionId: 'TXN-2024-0801', vendorName: 'Lenovo India', amount: 3100000, startDate: '2024-01-25', completedDate: '2024-03-08', cycleTime: 43, owner: 'Rajesh Pillai', department: 'IT' },
    ]
  },
  {
    id: 'sa3',
    type: 'payment_before_gr',
    description: 'Payment processed before Goods Receipt confirmation',
    expectedSequence: ['PO', 'Goods Receipt', 'Invoice', 'Payment'],
    actualSequence: ['PO', 'Invoice', 'Payment', 'Goods Receipt'],
    severity: 'critical',
    totalCount: 12,
    percentageOfTotal: 0.96,
    avgCycleImpact: -3.8,
    riskScore: 95,
    instances: [
      { transactionId: 'TXN-2024-0623', vendorName: 'Google Cloud India', amount: 12000000, startDate: '2024-01-05', completedDate: '2024-02-15', cycleTime: 41, owner: 'Meera Krishnan', department: 'IT' },
      { transactionId: 'TXN-2024-0645', vendorName: 'AWS India', amount: 9500000, startDate: '2024-01-12', completedDate: '2024-02-22', cycleTime: 41, owner: 'Arun Menon', department: 'IT' },
    ]
  },
  {
    id: 'sa4',
    type: 'skip_approval',
    description: 'Budget approval step was bypassed',
    expectedSequence: ['Request', 'Budget Check', 'Sourcing'],
    actualSequence: ['Request', 'Sourcing'],
    severity: 'high',
    totalCount: 49,
    percentageOfTotal: 3.93,
    avgCycleImpact: -6.7,
    riskScore: 85,
    instances: [
      { transactionId: 'TXN-2024-0412', vendorName: 'TeamLease Services', amount: 1500000, startDate: '2024-01-08', completedDate: '2024-02-10', cycleTime: 33, owner: 'Divya Sharma', department: 'HR' },
      { transactionId: 'TXN-2024-0438', vendorName: 'Quess Corp', amount: 2100000, startDate: '2024-01-15', completedDate: '2024-02-18', cycleTime: 34, owner: 'Suresh Kumar', department: 'HR' },
      { transactionId: 'TXN-2024-0456', vendorName: 'Randstad India', amount: 1800000, startDate: '2024-01-22', completedDate: '2024-02-25', cycleTime: 34, owner: 'Priyanka Das', department: 'HR' },
    ]
  },
  {
    id: 'sa5',
    type: 'duplicate_step',
    description: 'Same process step executed multiple times (rework)',
    expectedSequence: ['Legal Review', 'Vendor Onboard'],
    actualSequence: ['Legal Review', 'Contract', 'Legal Review', 'Contract', 'Legal Review', 'Vendor Onboard'],
    severity: 'medium',
    totalCount: 42,
    percentageOfTotal: 3.37,
    avgCycleImpact: 26.5,
    riskScore: 62,
    instances: [
      { transactionId: 'TXN-2024-0534', vendorName: 'Wipro Limited', amount: 15000000, startDate: '2024-01-03', completedDate: '2024-03-20', cycleTime: 77, owner: 'Sanjay Patel', department: 'IT' },
      { transactionId: 'TXN-2024-0567', vendorName: 'Infosys BPM', amount: 12500000, startDate: '2024-01-10', completedDate: '2024-03-28', cycleTime: 78, owner: 'Lakshmi Rao', department: 'Operations' },
    ]
  },
  {
    id: 'sa6',
    type: 'missing_step',
    description: 'Legal review skipped for high-value contracts',
    expectedSequence: ['Contract', 'Legal Review', 'Vendor Onboard'],
    actualSequence: ['Contract', 'Vendor Onboard'],
    severity: 'high',
    totalCount: 28,
    percentageOfTotal: 2.25,
    avgCycleImpact: -8.2,
    riskScore: 82,
    instances: [
      { transactionId: 'TXN-2024-0678', vendorName: 'JLL India', amount: 8500000, startDate: '2024-01-20', completedDate: '2024-02-28', cycleTime: 39, owner: 'Nikhil Verma', department: 'Facilities' },
      { transactionId: 'TXN-2024-0695', vendorName: 'CBRE India', amount: 7200000, startDate: '2024-01-27', completedDate: '2024-03-05', cycleTime: 38, owner: 'Anjali Mehta', department: 'Facilities' },
    ]
  },
];

// Variant clusters - grouping common vs outlier patterns
const variantClusters: VariantCluster[] = [
  {
    id: 'cluster1',
    name: 'Standard Happy Path',
    type: 'common',
    totalTransactions: 542,
    percentageOfTotal: 43.5,
    avgCycleTime: 45.2,
    characteristics: ['Complete compliance', 'No rework loops', 'All approvals in sequence'],
    variants: [
      { id: 'v1', path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 542, percentage: 43.5, avgDuration: 45.2, isStandard: true, conformance: 'compliant', anomalies: [] }
    ]
  },
  {
    id: 'cluster2',
    name: 'With Negotiation',
    type: 'common',
    totalTransactions: 198,
    percentageOfTotal: 15.9,
    avgCycleTime: 52.8,
    characteristics: ['Extended sourcing', 'Negotiation included', 'Longer cycle but compliant'],
    variants: [
      { id: 'v2', path: ['Request', 'Budget', 'Sourcing', 'Negotiate', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 198, percentage: 15.9, avgDuration: 52.8, isStandard: false, conformance: 'compliant', anomalies: [] }
    ]
  },
  {
    id: 'cluster3',
    name: 'With Legal Review',
    type: 'common',
    totalTransactions: 156,
    percentageOfTotal: 12.5,
    avgCycleTime: 58.4,
    characteristics: ['High-value contracts', 'Legal scrutiny', 'Extended timeline'],
    variants: [
      { id: 'v3', path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Legal', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 156, percentage: 12.5, avgDuration: 58.4, isStandard: false, conformance: 'compliant', anomalies: [] }
    ]
  },
  {
    id: 'cluster4',
    name: 'Budget Bypass (Outlier)',
    type: 'outlier',
    totalTransactions: 49,
    percentageOfTotal: 3.9,
    avgCycleTime: 38.5,
    characteristics: ['Missing budget approval', 'Shorter cycle', 'Compliance risk'],
    variants: [
      { id: 'v5', path: ['Request', 'Sourcing', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 49, percentage: 3.9, avgDuration: 38.5, isStandard: false, conformance: 'minor_deviation', anomalies: ['skip_approval'] }
    ]
  },
  {
    id: 'cluster5',
    name: 'Contract Before Sourcing (Outlier)',
    type: 'outlier',
    totalTransactions: 23,
    percentageOfTotal: 1.84,
    avgCycleTime: 42.8,
    characteristics: ['Sequence violation', 'Contract signed prematurely', 'High compliance risk'],
    variants: [
      { id: 'v9', path: ['Request', 'Budget', 'Contract', 'Sourcing', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 23, percentage: 1.84, avgDuration: 42.8, isStandard: false, conformance: 'major_deviation', anomalies: ['contract_before_sourcing'] }
    ]
  },
  {
    id: 'cluster6',
    name: 'Multiple Rework Loops (Outlier)',
    type: 'outlier',
    totalTransactions: 80,
    percentageOfTotal: 6.4,
    avgCycleTime: 75.6,
    characteristics: ['Repeated steps', 'Long cycle time', 'Process inefficiency'],
    variants: [
      { id: 'v7', path: ['Request', 'Budget', 'Sourcing', 'Contract', 'Legal', 'Contract', 'Legal', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 42, percentage: 3.4, avgDuration: 78.9, isStandard: false, conformance: 'major_deviation', anomalies: ['duplicate_step'] },
      { id: 'v8', path: ['Request', 'Budget', 'Sourcing', 'Negotiate', 'Sourcing', 'Negotiate', 'Contract', 'Onboard', 'PR', 'PO', 'GR', 'Invoice', 'Payment'], count: 38, percentage: 3.0, avgDuration: 72.4, isStandard: false, conformance: 'major_deviation', anomalies: ['duplicate_step'] }
    ]
  },
  {
    id: 'cluster7',
    name: 'PO Before Contract (Outlier)',
    type: 'outlier',
    totalTransactions: 37,
    percentageOfTotal: 2.97,
    avgCycleTime: 44.3,
    characteristics: ['Purchase order raised early', 'Contract executed late', 'Maverick buying risk'],
    variants: [
      { id: 'v10', path: ['Request', 'Budget', 'Sourcing', 'PR', 'PO', 'Contract', 'Onboard', 'GR', 'Invoice', 'Payment'], count: 37, percentage: 2.97, avgDuration: 44.3, isStandard: false, conformance: 'major_deviation', anomalies: ['po_before_contract'] }
    ]
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: 'text-red-500' };
    case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', icon: 'text-orange-500' };
    case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', icon: 'text-amber-500' };
    case 'low': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', icon: 'text-blue-500' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', icon: 'text-gray-500' };
  }
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

export default function VariantAnalysis() {
  const [viewMode, setViewMode] = useState<'anomalies' | 'clusters' | 'instances'>('anomalies');
  const [selectedAnomaly, setSelectedAnomaly] = useState<SequenceAnomaly | null>(null);
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCluster = (id: string) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedClusters(newExpanded);
  };

  const filteredAnomalies = sequenceAnomalies.filter(a =>
    filterSeverity === 'all' || a.severity === filterSeverity
  );

  const outlierClusters = variantClusters.filter(c => c.type === 'outlier');
  const commonClusters = variantClusters.filter(c => c.type === 'common');

  const totalOutlierTransactions = outlierClusters.reduce((sum, c) => sum + c.totalTransactions, 0);
  const totalAnomalyInstances = sequenceAnomalies.reduce((sum, a) => sum + a.totalCount, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-red-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shuffle className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Variant Analysis</h2>
              <p className="text-sm text-gray-500">Identify common patterns and process outliers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('anomalies')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'anomalies' ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'
                }`}
              >
                Sequence Anomalies
              </button>
              <button
                onClick={() => setViewMode('clusters')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'clusters' ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'
                }`}
              >
                Pattern Clusters
              </button>
              <button
                onClick={() => setViewMode('instances')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'instances' ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'
                }`}
              >
                Transaction Instances
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-purple-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Total Variants</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">23</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Common Patterns</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{commonClusters.length}</p>
          <p className="text-xs text-gray-500">71.9% of txns</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Outlier Patterns</p>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{outlierClusters.length}</p>
          <p className="text-xs text-gray-500">{totalOutlierTransactions} txns ({((totalOutlierTransactions / 1247) * 100).toFixed(1)}%)</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-amber-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Sequence Violations</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{totalAnomalyInstances}</p>
          <p className="text-xs text-gray-500">{sequenceAnomalies.length} anomaly types</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Avg Risk Score</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {Math.round(sequenceAnomalies.reduce((sum, a) => sum + a.riskScore, 0) / sequenceAnomalies.length)}
          </p>
        </div>
      </div>

      {viewMode === 'anomalies' && (
        <div className="p-4">
          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">Medium</span>
              </div>
            </div>
          </div>

          {/* Anomalies List */}
          <div className="space-y-4">
            {filteredAnomalies.map((anomaly) => {
              const colors = getSeverityColor(anomaly.severity);
              const isSelected = selectedAnomaly?.id === anomaly.id;

              return (
                <div
                  key={anomaly.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    isSelected ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${colors.bg}`}
                    onClick={() => setSelectedAnomaly(isSelected ? null : anomaly)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <button className="mt-1 text-gray-400">
                          {isSelected ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle size={18} className={colors.icon} />
                            <span className="font-semibold text-gray-800">{anomaly.description}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                              {anomaly.severity.toUpperCase()}
                            </span>
                          </div>

                          {/* Sequence Comparison */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-20">Expected:</span>
                              <div className="flex items-center gap-1">
                                {anomaly.expectedSequence.map((step, idx) => (
                                  <div key={idx} className="flex items-center">
                                    <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                                      {step}
                                    </span>
                                    {idx < anomaly.expectedSequence.length - 1 && (
                                      <ArrowRight size={12} className="mx-1 text-gray-400" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-20">Actual:</span>
                              <div className="flex items-center gap-1">
                                {anomaly.actualSequence.map((step, idx) => {
                                  const isOutOfOrder = !anomaly.expectedSequence.includes(step) ||
                                    (anomaly.expectedSequence.indexOf(step) !== -1 &&
                                     anomaly.actualSequence.indexOf(step) !== anomaly.expectedSequence.indexOf(step));
                                  return (
                                    <div key={idx} className="flex items-center">
                                      <span className={`px-2 py-0.5 text-xs rounded border ${
                                        isOutOfOrder
                                          ? 'bg-red-50 text-red-700 border-red-200'
                                          : 'bg-gray-50 text-gray-700 border-gray-200'
                                      }`}>
                                        {step}
                                      </span>
                                      {idx < anomaly.actualSequence.length - 1 && (
                                        <ArrowRight size={12} className="mx-1 text-gray-400" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Instances</p>
                          <p className="font-bold text-gray-800">{anomaly.totalCount}</p>
                          <p className="text-xs text-gray-400">{anomaly.percentageOfTotal}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Cycle Impact</p>
                          <p className={`font-bold ${anomaly.avgCycleImpact < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {anomaly.avgCycleImpact > 0 ? '+' : ''}{anomaly.avgCycleImpact} days
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Risk Score</p>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  anomaly.riskScore >= 80 ? 'bg-red-500' :
                                  anomaly.riskScore >= 60 ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${anomaly.riskScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-gray-800">{anomaly.riskScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="border-t bg-white p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Sample Transactions with this Anomaly</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Transaction ID</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Vendor</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Amount</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Department</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Owner</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Cycle Time</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {anomaly.instances.map((instance) => (
                              <tr key={instance.transactionId} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3">
                                  <span className="font-mono text-blue-600">{instance.transactionId}</span>
                                </td>
                                <td className="py-2 px-3 font-medium">{instance.vendorName}</td>
                                <td className="py-2 px-3">{formatCurrency(instance.amount)}</td>
                                <td className="py-2 px-3">{instance.department}</td>
                                <td className="py-2 px-3">{instance.owner}</td>
                                <td className="py-2 px-3">
                                  <span className={`font-medium ${instance.cycleTime > 52 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {instance.cycleTime} days
                                  </span>
                                </td>
                                <td className="py-2 px-3">
                                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                                    <Eye size={14} /> View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                          View all {anomaly.totalCount} instances <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'clusters' && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Common Patterns */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-emerald-500" />
                <h3 className="text-lg font-semibold text-gray-800">Common Patterns</h3>
                <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                  {commonClusters.length} clusters
                </span>
              </div>
              <div className="space-y-3">
                {commonClusters.map((cluster) => {
                  const isExpanded = expandedClusters.has(cluster.id);
                  return (
                    <div key={cluster.id} className="border rounded-lg overflow-hidden">
                      <div
                        className="p-4 bg-emerald-50 cursor-pointer hover:bg-emerald-100"
                        onClick={() => toggleCluster(cluster.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="font-semibold text-gray-800">{cluster.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">{cluster.totalTransactions} txns</span>
                            <span className="font-medium text-emerald-600">{cluster.percentageOfTotal}%</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cluster.characteristics.map((char, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-white border border-emerald-200 text-emerald-700 rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="p-4 bg-white border-t">
                          {cluster.variants.map((variant) => (
                            <div key={variant.id} className="mb-3">
                              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                                {variant.path.map((step, idx) => (
                                  <div key={idx} className="flex items-center">
                                    <span className="px-2 py-1 text-xs bg-emerald-50 border border-emerald-200 rounded whitespace-nowrap">
                                      {step}
                                    </span>
                                    {idx < variant.path.length - 1 && (
                                      <ArrowRight size={12} className="mx-1 text-gray-400 flex-shrink-0" />
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Avg: {variant.avgDuration} days</span>
                                <span>{variant.count} transactions</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outlier Patterns */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Outlier Patterns</h3>
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                  {outlierClusters.length} clusters
                </span>
              </div>
              <div className="space-y-3">
                {outlierClusters.map((cluster) => {
                  const isExpanded = expandedClusters.has(cluster.id);
                  return (
                    <div key={cluster.id} className="border border-red-200 rounded-lg overflow-hidden">
                      <div
                        className="p-4 bg-red-50 cursor-pointer hover:bg-red-100"
                        onClick={() => toggleCluster(cluster.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="font-semibold text-gray-800">{cluster.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">{cluster.totalTransactions} txns</span>
                            <span className="font-medium text-red-600">{cluster.percentageOfTotal}%</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cluster.characteristics.map((char, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-white border border-red-200 text-red-700 rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="p-4 bg-white border-t">
                          {cluster.variants.map((variant) => (
                            <div key={variant.id} className="mb-3">
                              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                                {variant.path.map((step, idx) => {
                                  const isAnomaly = variant.anomalies.some(a =>
                                    (a === 'contract_before_sourcing' && step === 'Contract' && variant.path[idx + 1] === 'Sourcing') ||
                                    (a === 'skip_approval' && step === 'Request' && variant.path[idx + 1] === 'Sourcing') ||
                                    (a === 'po_before_contract' && step === 'PO' && variant.path.indexOf('Contract') > idx)
                                  );
                                  return (
                                    <div key={idx} className="flex items-center">
                                      <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                                        isAnomaly
                                          ? 'bg-red-100 border-2 border-red-400 text-red-700 font-medium'
                                          : 'bg-gray-50 border border-gray-200'
                                      }`}>
                                        {step}
                                      </span>
                                      {idx < variant.path.length - 1 && (
                                        <ArrowRight size={12} className="mx-1 text-gray-400 flex-shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="text-red-600">Avg: {variant.avgDuration} days</span>
                                <span>{variant.count} transactions</span>
                                {variant.anomalies.map((a, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                                    {a.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <TrendingUp size={16} /> AI-Generated Insights
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm font-medium text-gray-800">Contract Before Sourcing</p>
                <p className="text-xs text-gray-600 mt-1">
                  23 instances detected where contracts were signed before completing formal sourcing.
                  This bypasses competitive bidding and price negotiation.
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">Risk: Overpayment, Compliance violation</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm font-medium text-gray-800">Budget Approval Bypass</p>
                <p className="text-xs text-gray-600 mt-1">
                  49 transactions (3.9%) skipped the mandatory budget check step.
                  Common in emergency purchases and certain departments.
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">Risk: Budget overrun, Audit findings</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm font-medium text-gray-800">Multiple Rework Loops</p>
                <p className="text-xs text-gray-600 mt-1">
                  80 transactions have 2+ rework loops, adding 26+ days to cycle time.
                  Legal review is the most common bottleneck.
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">Risk: Delays, Resource waste</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'instances' && (
        <div className="p-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID, vendor, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>All Anomaly Types</option>
              <option>Contract Before Sourcing</option>
              <option>PO Before Contract</option>
              <option>Payment Before GR</option>
              <option>Skip Approval</option>
              <option>Duplicate Steps</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>All Departments</option>
              <option>IT</option>
              <option>Logistics</option>
              <option>HR</option>
              <option>Operations</option>
              <option>Facilities</option>
            </select>
          </div>

          {/* All Instances Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vendor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Anomaly Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Severity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Owner</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cycle Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sequenceAnomalies.flatMap(anomaly =>
                  anomaly.instances.map(instance => ({
                    ...instance,
                    anomalyType: anomaly.type,
                    anomalyDescription: anomaly.description,
                    severity: anomaly.severity
                  }))
                )
                .filter(instance =>
                  searchTerm === '' ||
                  instance.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  instance.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  instance.owner.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 15)
                .map((instance) => {
                  const colors = getSeverityColor(instance.severity);
                  return (
                    <tr key={instance.transactionId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-blue-600">{instance.transactionId}</span>
                      </td>
                      <td className="py-3 px-4 font-medium">{instance.vendorName}</td>
                      <td className="py-3 px-4">{formatCurrency(instance.amount)}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600">{instance.anomalyType.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                          {instance.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">{instance.department}</td>
                      <td className="py-3 px-4">{instance.owner}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${instance.cycleTime > 52 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {instance.cycleTime} days
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:underline flex items-center gap-1">
                            <Eye size={14} />
                          </button>
                          <button className="text-gray-600 hover:underline flex items-center gap-1">
                            <FileText size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Showing 15 of {sequenceAnomalies.reduce((sum, a) => sum + a.instances.length, 0)} instances</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
