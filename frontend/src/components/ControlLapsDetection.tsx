import { useState } from 'react';
import {
  AlertTriangle, Shield, ShieldAlert, ShieldCheck, ShieldX,
  Clock, User, CheckCircle, XCircle, AlertCircle,
  ChevronDown, ChevronRight, Eye, Filter, Download, RefreshCw,
  TrendingUp, Activity
} from 'lucide-react';

interface ControlViolation {
  id: string;
  transactionId: string;
  vendorName: string;
  violationType: 'missing_approval' | 'unauthorized_change' | 'policy_breach' | 'segregation_of_duties' | 'threshold_breach' | 'sequence_skip';
  severity: 'critical' | 'high' | 'medium' | 'low';
  stage: string;
  description: string;
  detectedAt: string;
  controlPoint: string;
  expectedAction: string;
  actualAction: string;
  responsible: string;
  status: 'open' | 'investigating' | 'remediated' | 'accepted_risk';
  riskScore: number;
  recommendation: string;
}

interface ControlPoint {
  id: string;
  name: string;
  stage: string;
  type: 'approval' | 'validation' | 'verification' | 'authorization';
  passRate: number;
  violations: number;
  lastChecked: string;
}

const mockViolations: ControlViolation[] = [
  {
    id: 'CLV001',
    transactionId: 'TXN202400012',
    vendorName: 'TechSupply Solutions',
    violationType: 'missing_approval',
    severity: 'critical',
    stage: 'Contracting',
    description: 'Contract executed without required Legal approval for value exceeding ₹50L',
    detectedAt: '2024-01-28 14:32',
    controlPoint: 'Legal Review Gate',
    expectedAction: 'Legal team approval required for contracts > ₹50L',
    actualAction: 'Contract signed by Procurement Lead only',
    responsible: 'Rajesh Kumar',
    status: 'open',
    riskScore: 92,
    recommendation: 'Escalate to Legal Head for retroactive review. Implement hard stop in contract workflow.'
  },
  {
    id: 'CLV002',
    transactionId: 'TXN202400018',
    vendorName: 'Global Logistics India',
    violationType: 'unauthorized_change',
    severity: 'high',
    stage: 'PR/PO Creation',
    description: 'PO amount increased by 35% after initial approval without re-authorization',
    detectedAt: '2024-01-27 09:15',
    controlPoint: 'PO Amendment Control',
    expectedAction: 'Re-approval required for changes > 10%',
    actualAction: 'PO modified directly in Oracle Fusion',
    responsible: 'Amit Singh',
    status: 'investigating',
    riskScore: 78,
    recommendation: 'Require dual approval for PO amendments. Review user access permissions.'
  },
  {
    id: 'CLV003',
    transactionId: 'TXN202400025',
    vendorName: 'CloudFirst Technologies',
    violationType: 'segregation_of_duties',
    severity: 'critical',
    stage: 'Sourcing',
    description: 'Same user created RFQ and awarded contract to vendor',
    detectedAt: '2024-01-26 16:45',
    controlPoint: 'SoD Control - Sourcing',
    expectedAction: 'RFQ creator cannot be contract awarder',
    actualAction: 'User performed both actions within 24 hours',
    responsible: 'Priya Sharma',
    status: 'open',
    riskScore: 95,
    recommendation: 'Implement system-level SoD controls. Review all awards by this user in last 6 months.'
  },
  {
    id: 'CLV004',
    transactionId: 'TXN202400031',
    vendorName: 'SecureIT Solutions',
    violationType: 'threshold_breach',
    severity: 'medium',
    stage: 'Payment',
    description: 'Payment released before goods receipt confirmation',
    detectedAt: '2024-01-25 11:20',
    controlPoint: '3-Way Match Control',
    expectedAction: 'GRN must be confirmed before payment release',
    actualAction: 'Payment processed with pending GRN status',
    responsible: 'Vikram Patel',
    status: 'remediated',
    riskScore: 65,
    recommendation: 'Enforce 3-way match in Oracle EBS. Add validation checkpoint.'
  },
  {
    id: 'CLV005',
    transactionId: 'TXN202400038',
    vendorName: 'PeopleFirst HR',
    violationType: 'sequence_skip',
    severity: 'high',
    stage: 'Vendor Onboarding',
    description: 'Vendor onboarded without compliance verification',
    detectedAt: '2024-01-24 08:30',
    controlPoint: 'Vendor Compliance Gate',
    expectedAction: 'Compliance check must be completed before vendor activation',
    actualAction: 'Vendor marked active with pending compliance status',
    responsible: 'Neha Gupta',
    status: 'investigating',
    riskScore: 82,
    recommendation: 'Block vendor activation until compliance verified. Review vendor portal workflow.'
  },
  {
    id: 'CLV006',
    transactionId: 'TXN202400042',
    vendorName: 'MarketBoost Digital',
    violationType: 'policy_breach',
    severity: 'medium',
    stage: 'Sourcing',
    description: 'Single source procurement without documented justification',
    detectedAt: '2024-01-23 15:00',
    controlPoint: 'Competitive Bidding Control',
    expectedAction: 'Minimum 3 quotes required for purchases > ₹10L',
    actualAction: 'Direct award without competitive bidding',
    responsible: 'Suresh Reddy',
    status: 'open',
    riskScore: 58,
    recommendation: 'Obtain retroactive justification. Update procurement policy training.'
  },
  {
    id: 'CLV007',
    transactionId: 'TXN202400045',
    vendorName: 'DataDriven Consulting',
    violationType: 'missing_approval',
    severity: 'low',
    stage: 'Request Intake',
    description: 'Budget holder approval missing for capex request',
    detectedAt: '2024-01-22 10:45',
    controlPoint: 'Budget Authorization',
    expectedAction: 'Budget holder must approve capex requests',
    actualAction: 'Request processed with department head approval only',
    responsible: 'Ananya Iyer',
    status: 'accepted_risk',
    riskScore: 35,
    recommendation: 'Document risk acceptance. Add reminder for budget holder sign-off.'
  },
  {
    id: 'CLV008',
    transactionId: 'TXN202400048',
    vendorName: 'FacilityPro Services',
    violationType: 'unauthorized_change',
    severity: 'high',
    stage: 'Contracting',
    description: 'Payment terms modified from Net-60 to Net-15 without CFO approval',
    detectedAt: '2024-01-21 14:20',
    controlPoint: 'Payment Terms Control',
    expectedAction: 'Payment term changes require Finance approval',
    actualAction: 'Terms updated by procurement without authorization',
    responsible: 'Karan Malhotra',
    status: 'open',
    riskScore: 75,
    recommendation: 'Revert to original terms. Implement change control for financial terms.'
  },
];

const mockControlPoints: ControlPoint[] = [
  { id: 'CP001', name: 'Budget Authorization', stage: 'Request Intake', type: 'approval', passRate: 94.2, violations: 12, lastChecked: '2024-01-28' },
  { id: 'CP002', name: 'Competitive Bidding', stage: 'Sourcing', type: 'validation', passRate: 87.5, violations: 28, lastChecked: '2024-01-28' },
  { id: 'CP003', name: 'SoD - Sourcing', stage: 'Sourcing', type: 'authorization', passRate: 91.8, violations: 18, lastChecked: '2024-01-28' },
  { id: 'CP004', name: 'Legal Review Gate', stage: 'Contracting', type: 'approval', passRate: 82.3, violations: 35, lastChecked: '2024-01-28' },
  { id: 'CP005', name: 'Payment Terms Control', stage: 'Contracting', type: 'verification', passRate: 88.9, violations: 22, lastChecked: '2024-01-28' },
  { id: 'CP006', name: 'Vendor Compliance', stage: 'Vendor Onboarding', type: 'validation', passRate: 79.6, violations: 41, lastChecked: '2024-01-28' },
  { id: 'CP007', name: 'PO Amendment Control', stage: 'PR/PO Creation', type: 'authorization', passRate: 85.4, violations: 29, lastChecked: '2024-01-28' },
  { id: 'CP008', name: '3-Way Match', stage: 'Payment', type: 'verification', passRate: 96.1, violations: 8, lastChecked: '2024-01-28' },
];

const getViolationTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'missing_approval': 'Missing Approval',
    'unauthorized_change': 'Unauthorized Change',
    'policy_breach': 'Policy Breach',
    'segregation_of_duties': 'Segregation of Duties',
    'threshold_breach': 'Threshold Breach',
    'sequence_skip': 'Sequence Skip'
  };
  return labels[type] || type;
};

const getViolationIcon = (type: string) => {
  switch (type) {
    case 'missing_approval': return <ShieldX className="text-red-500" size={18} />;
    case 'unauthorized_change': return <ShieldAlert className="text-orange-500" size={18} />;
    case 'policy_breach': return <AlertTriangle className="text-amber-500" size={18} />;
    case 'segregation_of_duties': return <User className="text-red-600" size={18} />;
    case 'threshold_breach': return <TrendingUp className="text-orange-500" size={18} />;
    case 'sequence_skip': return <Activity className="text-amber-500" size={18} />;
    default: return <AlertCircle className="text-gray-500" size={18} />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' };
    case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'low': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return { bg: 'bg-red-50', text: 'text-red-700', icon: <XCircle size={14} className="text-red-500" /> };
    case 'investigating': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock size={14} className="text-amber-500" /> };
    case 'remediated': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle size={14} className="text-emerald-500" /> };
    case 'accepted_risk': return { bg: 'bg-blue-50', text: 'text-blue-700', icon: <Shield size={14} className="text-blue-500" /> };
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', icon: <AlertCircle size={14} className="text-gray-500" /> };
  }
};

const getRiskScoreColor = (score: number) => {
  if (score >= 80) return 'text-red-600';
  if (score >= 60) return 'text-orange-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-emerald-600';
};

export default function ControlLapsDetection() {
  const [selectedViolation, setSelectedViolation] = useState<ControlViolation | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'violations' | 'controls'>('violations');

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredViolations = mockViolations.filter(v => {
    if (filterSeverity !== 'all' && v.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  // Calculate summary stats
  const criticalCount = mockViolations.filter(v => v.severity === 'critical' && v.status === 'open').length;
  const openCount = mockViolations.filter(v => v.status === 'open').length;
  const avgRiskScore = Math.round(mockViolations.reduce((acc, v) => acc + v.riskScore, 0) / mockViolations.length);
  const complianceRate = Math.round((mockControlPoints.reduce((acc, cp) => acc + cp.passRate, 0) / mockControlPoints.length) * 10) / 10;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Control Laps Detection</h2>
              <p className="text-sm text-gray-500">Automated compliance monitoring & gap analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('violations')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'violations' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600'
                }`}
              >
                Violations
              </button>
              <button
                onClick={() => setViewMode('controls')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'controls' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600'
                }`}
              >
                Control Points
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              <RefreshCw size={16} /> Run Scan
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Critical Open</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="text-red-500" size={20} />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-1">Requires immediate action</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total Open</p>
              <p className="text-2xl font-bold text-orange-600">{openCount}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-orange-500" size={20} />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-1">Pending investigation</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Avg Risk Score</p>
              <p className={`text-2xl font-bold ${getRiskScoreColor(avgRiskScore)}`}>{avgRiskScore}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Activity className="text-amber-500" size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-1">Out of 100</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Compliance Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{complianceRate}%</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <p className="text-xs text-emerald-600">+2.3% vs last month</p>
          </div>
        </div>
      </div>

      {viewMode === 'violations' ? (
        <>
          {/* Filters */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-white"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 bg-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="remediated">Remediated</option>
                <option value="accepted_risk">Accepted Risk</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{filteredViolations.length} violations</span>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* Violations List */}
          <div className="divide-y">
            {filteredViolations.map((violation) => {
              const severityColor = getSeverityColor(violation.severity);
              const statusColor = getStatusColor(violation.status);
              const isExpanded = expandedRows.has(violation.id);

              return (
                <div key={violation.id} className={`${isExpanded ? 'bg-gray-50' : 'bg-white'}`}>
                  {/* Main Row */}
                  <div
                    className="px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRow(violation.id)}
                  >
                    <button className="text-gray-400">
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    <div className="flex items-center gap-2 w-40">
                      {getViolationIcon(violation.violationType)}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor.bg} ${severityColor.text} font-medium`}>
                        {violation.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{violation.description}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500">{violation.transactionId}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{violation.vendorName}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{violation.stage}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-32">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        violation.riskScore >= 80 ? 'bg-red-100' : violation.riskScore >= 60 ? 'bg-orange-100' : 'bg-amber-100'
                      }`}>
                        <span className={`text-xs font-bold ${getRiskScoreColor(violation.riskScore)}`}>
                          {violation.riskScore}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Risk Score</span>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                      {statusColor.icon}
                      {violation.status.replace('_', ' ')}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedViolation(violation);
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-500"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-12">
                      <div className="bg-white rounded-lg border p-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Violation Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-400 w-24">Type:</span>
                              <span className="text-sm text-gray-700">{getViolationTypeLabel(violation.violationType)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-400 w-24">Control Point:</span>
                              <span className="text-sm text-gray-700">{violation.controlPoint}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-400 w-24">Detected:</span>
                              <span className="text-sm text-gray-700">{violation.detectedAt}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-400 w-24">Responsible:</span>
                              <span className="text-sm text-gray-700">{violation.responsible}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Gap Analysis</h4>
                          <div className="space-y-2">
                            <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                              <span className="text-xs font-medium text-emerald-700">Expected:</span>
                              <p className="text-sm text-emerald-800 mt-0.5">{violation.expectedAction}</p>
                            </div>
                            <div className="p-2 bg-red-50 rounded border border-red-100">
                              <span className="text-xs font-medium text-red-700">Actual:</span>
                              <p className="text-sm text-red-800 mt-0.5">{violation.actualAction}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Recommendation</h4>
                          <div className="p-3 bg-blue-50 rounded border border-blue-100 flex items-start gap-2">
                            <Shield className="text-blue-500 mt-0.5" size={16} />
                            <p className="text-sm text-blue-800">{violation.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Control Points View */
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {mockControlPoints.map((cp) => {
              const passRateColor = cp.passRate >= 90 ? 'emerald' : cp.passRate >= 80 ? 'amber' : 'red';
              return (
                <div key={cp.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{cp.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{cp.stage}</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded capitalize">{cp.type}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${passRateColor}-100`}>
                      {cp.passRate >= 90 ? (
                        <ShieldCheck className={`text-${passRateColor}-500`} size={24} />
                      ) : cp.passRate >= 80 ? (
                        <Shield className={`text-${passRateColor}-500`} size={24} />
                      ) : (
                        <ShieldAlert className={`text-${passRateColor}-500`} size={24} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Pass Rate</span>
                        <span className={`font-medium text-${passRateColor}-600`}>{cp.passRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-${passRateColor}-500`}
                          style={{ width: `${cp.passRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={14} className="text-orange-500" />
                        <span className="text-gray-600">{cp.violations} violations</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={14} />
                        <span className="text-xs">Last: {cp.lastChecked}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Control Flow Diagram */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-800 mb-4">Control Points by Stage</h3>
            <div className="flex items-center justify-between">
              {['Request Intake', 'Sourcing', 'Contracting', 'Vendor Onboarding', 'PR/PO Creation', 'Payment'].map((stage, idx) => {
                const stageControls = mockControlPoints.filter(cp => cp.stage === stage);
                const avgPass = stageControls.length > 0
                  ? Math.round(stageControls.reduce((acc, cp) => acc + cp.passRate, 0) / stageControls.length)
                  : 100;
                const color = avgPass >= 90 ? 'emerald' : avgPass >= 80 ? 'amber' : 'red';

                return (
                  <div key={stage} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full bg-${color}-100 border-2 border-${color}-300 flex items-center justify-center mb-2`}>
                      <span className={`text-sm font-bold text-${color}-600`}>{avgPass}%</span>
                    </div>
                    <p className="text-xs text-center text-gray-600 font-medium">{stage}</p>
                    <p className="text-xs text-gray-400">{stageControls.length} controls</p>
                    {idx < 5 && (
                      <div className="absolute" style={{ left: `${(idx + 1) * 16.66}%`, top: '50%' }}>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedViolation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                {getViolationIcon(selectedViolation.violationType)}
                <div>
                  <h3 className="font-semibold text-gray-800">Violation Details</h3>
                  <p className="text-sm text-gray-500">{selectedViolation.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedViolation.severity).bg} ${getSeverityColor(selectedViolation.severity).text}`}>
                  {selectedViolation.severity.toUpperCase()}
                </span>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedViolation.status).bg} ${getStatusColor(selectedViolation.status).text}`}>
                  {getStatusColor(selectedViolation.status).icon}
                  {selectedViolation.status.replace('_', ' ')}
                </span>
                <span className={`text-sm font-bold ${getRiskScoreColor(selectedViolation.riskScore)}`}>
                  Risk Score: {selectedViolation.riskScore}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">{selectedViolation.description}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Transaction:</span> <span className="font-medium">{selectedViolation.transactionId}</span></div>
                  <div><span className="text-gray-500">Vendor:</span> <span className="font-medium">{selectedViolation.vendorName}</span></div>
                  <div><span className="text-gray-500">Stage:</span> <span className="font-medium">{selectedViolation.stage}</span></div>
                  <div><span className="text-gray-500">Control Point:</span> <span className="font-medium">{selectedViolation.controlPoint}</span></div>
                  <div><span className="text-gray-500">Detected:</span> <span className="font-medium">{selectedViolation.detectedAt}</span></div>
                  <div><span className="text-gray-500">Responsible:</span> <span className="font-medium">{selectedViolation.responsible}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="font-medium text-emerald-700">Expected Behavior</span>
                  </div>
                  <p className="text-sm text-emerald-800">{selectedViolation.expectedAction}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={16} className="text-red-600" />
                    <span className="font-medium text-red-700">Actual Behavior</span>
                  </div>
                  <p className="text-sm text-red-800">{selectedViolation.actualAction}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-700">Recommended Action</span>
                </div>
                <p className="text-sm text-blue-800">{selectedViolation.recommendation}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  Escalate
                </button>
                <button className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                  Start Investigation
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  Accept Risk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
