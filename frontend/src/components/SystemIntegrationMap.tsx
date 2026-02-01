import { useState } from 'react';
import {
  Database, ArrowRight, Cpu, Link2, CheckCircle2,
  Zap, Brain, Search, FileText, Users, CreditCard,
  Building2, ChevronDown, ChevronRight, Activity, RefreshCw
} from 'lucide-react';

interface SystemNode {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: 'database' | 'file' | 'users' | 'credit' | 'building';
  color: string;
  keyData: string[];
  stage: string;
}

interface SystemLink {
  id: string;
  source: string;
  target: string;
  sourceFields: string[];
  targetFields: string[];
  mappingLogic: string;
  mappingType: 'nlp' | 'fuzzy' | 'direct' | 'hybrid';
  confidence: number;
  recordsMatched: number;
  lastSync: string;
}

const systems: SystemNode[] = [
  {
    id: 'sap_ariba',
    name: 'SAP Ariba',
    shortName: 'Ariba',
    description: 'Sourcing & Procurement',
    icon: 'database',
    color: '#0070c0',
    keyData: ['Requirement Description', 'Awarded Vendor Name', 'RFQ ID', 'Bid Details'],
    stage: 'Sourcing'
  },
  {
    id: 'simplicontract',
    name: 'Simplicontract',
    shortName: 'Simpli',
    description: 'Contract Management',
    icon: 'file',
    color: '#7030a0',
    keyData: ['Contract Purpose', 'Counterparty Name', 'Contract ID', 'Contract Value'],
    stage: 'Contracting'
  },
  {
    id: 'vendor_portal',
    name: 'Vendor Portal',
    shortName: 'Portal',
    description: 'Vendor Onboarding',
    icon: 'users',
    color: '#00b050',
    keyData: ['Vendor Name', 'Legal Entity', 'Registration ID', 'Compliance Status'],
    stage: 'Onboarding'
  },
  {
    id: 'oracle_fusion',
    name: 'Oracle Fusion',
    shortName: 'Fusion',
    description: 'PR/PO Management',
    icon: 'building',
    color: '#c00000',
    keyData: ['Supplier Name', 'PO Number', 'PO Value', 'PR Reference'],
    stage: 'PR/PO'
  },
  {
    id: 'oracle_ebs',
    name: 'Oracle EBS',
    shortName: 'EBS',
    description: 'Payments & Finance',
    icon: 'credit',
    color: '#ff6600',
    keyData: ['Invoice PO Reference', 'Invoice Amount', 'Payment Status', 'Vendor Code'],
    stage: 'Payment'
  }
];

const systemLinks: SystemLink[] = [
  {
    id: 'link1',
    source: 'sap_ariba',
    target: 'simplicontract',
    sourceFields: ['Requirement Description', 'Awarded Vendor Name'],
    targetFields: ['Contract Purpose', 'Counterparty Name'],
    mappingLogic: 'NLP-based matching of requirement details to contract scope using semantic similarity and entity extraction',
    mappingType: 'nlp',
    confidence: 94.2,
    recordsMatched: 1247,
    lastSync: '2024-01-28 14:30'
  },
  {
    id: 'link2',
    source: 'simplicontract',
    target: 'vendor_portal',
    sourceFields: ['Counterparty Name', 'Contract ID'],
    targetFields: ['Vendor Name', 'Legal Entity'],
    mappingLogic: 'Fuzzy matching of vendor names and entity details with Levenshtein distance and phonetic matching',
    mappingType: 'fuzzy',
    confidence: 91.8,
    recordsMatched: 1089,
    lastSync: '2024-01-28 14:30'
  },
  {
    id: 'link3',
    source: 'vendor_portal',
    target: 'oracle_fusion',
    sourceFields: ['Vendor Name', 'Registration ID'],
    targetFields: ['Supplier Name', 'Vendor Code'],
    mappingLogic: 'Direct and fuzzy matching to link the onboarded vendor to PR/PO data with master data validation',
    mappingType: 'hybrid',
    confidence: 96.5,
    recordsMatched: 2341,
    lastSync: '2024-01-28 14:30'
  },
  {
    id: 'link4',
    source: 'oracle_fusion',
    target: 'oracle_ebs',
    sourceFields: ['PO Number', 'PO Value'],
    targetFields: ['Invoice PO Reference', 'Invoice Amount'],
    mappingLogic: 'Direct matching of PO numbers and validation of amounts with tolerance threshold checking',
    mappingType: 'direct',
    confidence: 99.1,
    recordsMatched: 3567,
    lastSync: '2024-01-28 14:30'
  }
];

const getMappingTypeInfo = (type: string) => {
  switch (type) {
    case 'nlp':
      return { label: 'NLP', color: 'bg-purple-100 text-purple-700', icon: <Brain size={14} /> };
    case 'fuzzy':
      return { label: 'Fuzzy', color: 'bg-amber-100 text-amber-700', icon: <Search size={14} /> };
    case 'direct':
      return { label: 'Direct', color: 'bg-emerald-100 text-emerald-700', icon: <Link2 size={14} /> };
    case 'hybrid':
      return { label: 'Hybrid', color: 'bg-blue-100 text-blue-700', icon: <Zap size={14} /> };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <Activity size={14} /> };
  }
};

const getSystemIcon = (type: string, size: number = 24) => {
  switch (type) {
    case 'database': return <Database size={size} />;
    case 'file': return <FileText size={size} />;
    case 'users': return <Users size={size} />;
    case 'credit': return <CreditCard size={size} />;
    case 'building': return <Building2 size={size} />;
    default: return <Database size={size} />;
  }
};

export default function SystemIntegrationMap() {
  const [selectedLink, setSelectedLink] = useState<SystemLink | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'matrix'>('flow');
  const [expandedSystems, setExpandedSystems] = useState<Set<string>>(new Set(systems.map(s => s.id)));

  const toggleSystem = (id: string) => {
    const newExpanded = new Set(expandedSystems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSystems(newExpanded);
  };

  const getSystemById = (id: string) => systems.find(s => s.id === id);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Cpu className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">System Integration Mapping</h2>
              <p className="text-sm text-gray-500">AI-powered data linking across procurement systems</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('flow')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'flow' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                Flow View
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'matrix' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                Matrix View
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <RefreshCw size={16} /> Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-3 border">
          <p className="text-xs text-gray-500 uppercase font-medium">Systems Connected</p>
          <p className="text-2xl font-bold text-gray-800">{systems.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <p className="text-xs text-gray-500 uppercase font-medium">Active Links</p>
          <p className="text-2xl font-bold text-blue-600">{systemLinks.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <p className="text-xs text-gray-500 uppercase font-medium">Records Mapped</p>
          <p className="text-2xl font-bold text-emerald-600">
            {systemLinks.reduce((acc, l) => acc + l.recordsMatched, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <p className="text-xs text-gray-500 uppercase font-medium">Avg Confidence</p>
          <p className="text-2xl font-bold text-purple-600">
            {(systemLinks.reduce((acc, l) => acc + l.confidence, 0) / systemLinks.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {viewMode === 'flow' ? (
        <div className="p-6">
          {/* Flow Diagram */}
          <div className="relative">
            {/* Systems Row */}
            <div className="flex justify-between items-start mb-8">
              {systems.map((system, idx) => (
                <div key={system.id} className="flex flex-col items-center" style={{ width: '18%' }}>
                  {/* System Card */}
                  <div
                    className="w-full rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-lg"
                    style={{ borderColor: system.color, backgroundColor: `${system.color}10` }}
                    onClick={() => toggleSystem(system.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: system.color }}
                      >
                        {getSystemIcon(system.icon, 20)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{system.name}</h3>
                        <p className="text-xs text-gray-500">{system.stage}</p>
                      </div>
                      {expandedSystems.has(system.id) ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>

                    {/* Key Data Fields */}
                    {expandedSystems.has(system.id) && (
                      <div className="mt-3 pt-3 border-t space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Key Data</p>
                        {system.keyData.map((field) => (
                          <div key={field} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: system.color }}></div>
                            <span className="text-xs text-gray-600">{field}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Connection Arrow */}
                  {idx < systems.length - 1 && (
                    <div className="absolute flex items-center" style={{
                      left: `${(idx + 0.5) * 20 + 9}%`,
                      top: '60px',
                      width: '10%'
                    }}>
                      <div className="flex-1 relative">
                        <div className="h-0.5 bg-gradient-to-r from-gray-300 via-blue-400 to-gray-300"></div>
                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Link Cards */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {systemLinks.map((link) => {
                const sourceSystem = getSystemById(link.source);
                const targetSystem = getSystemById(link.target);
                const mappingInfo = getMappingTypeInfo(link.mappingType);

                return (
                  <div
                    key={link.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLink?.id === link.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md bg-white'
                    }`}
                    onClick={() => setSelectedLink(selectedLink?.id === link.id ? null : link)}
                  >
                    {/* Link Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: sourceSystem?.color }}
                      >
                        {sourceSystem?.shortName.charAt(0)}
                      </div>
                      <ArrowRight size={14} className="text-gray-400" />
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: targetSystem?.color }}
                      >
                        {targetSystem?.shortName.charAt(0)}
                      </div>
                      <span className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${mappingInfo.color}`}>
                        {mappingInfo.icon}
                        {mappingInfo.label}
                      </span>
                    </div>

                    {/* Field Mapping */}
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 w-12">From:</span>
                        <span className="text-gray-700">{link.sourceFields.join(', ')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 w-12">To:</span>
                        <span className="text-gray-700">{link.targetFields.join(', ')}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-xs text-gray-600">{link.recordsMatched.toLocaleString()}</span>
                      </div>
                      <div className={`text-xs font-medium ${
                        link.confidence >= 95 ? 'text-emerald-600' :
                        link.confidence >= 90 ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {link.confidence}% match
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Link Detail */}
          {selectedLink && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {getSystemById(selectedLink.source)?.name} → {getSystemById(selectedLink.target)?.name}
                  </h4>
                  <p className="text-sm text-gray-600">AI Mapping Logic</p>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getMappingTypeInfo(selectedLink.mappingType).color}`}>
                  {getMappingTypeInfo(selectedLink.mappingType).icon}
                  {getMappingTypeInfo(selectedLink.mappingType).label} Matching
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-start gap-2">
                  <Brain className="text-purple-500 mt-0.5" size={18} />
                  <p className="text-sm text-gray-700">{selectedLink.mappingLogic}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Records Matched:</span>
                  <span className="ml-2 font-semibold text-gray-800">{selectedLink.recordsMatched.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Confidence:</span>
                  <span className="ml-2 font-semibold text-emerald-600">{selectedLink.confidence}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Sync:</span>
                  <span className="ml-2 font-semibold text-gray-800">{selectedLink.lastSync}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Matrix View */
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-50 border text-left text-sm font-semibold text-gray-700">Source System</th>
                  <th className="p-3 bg-gray-50 border text-left text-sm font-semibold text-gray-700">Key Linking Data</th>
                  <th className="p-3 bg-gray-50 border text-left text-sm font-semibold text-gray-700">Target System</th>
                  <th className="p-3 bg-gray-50 border text-left text-sm font-semibold text-gray-700">Key Linking Data</th>
                  <th className="p-3 bg-gray-50 border text-left text-sm font-semibold text-gray-700">AI Mapping Logic</th>
                  <th className="p-3 bg-gray-50 border text-center text-sm font-semibold text-gray-700">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {systemLinks.map((link) => {
                  const sourceSystem = getSystemById(link.source);
                  const targetSystem = getSystemById(link.target);
                  const mappingInfo = getMappingTypeInfo(link.mappingType);

                  return (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="p-3 border">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: sourceSystem?.color }}
                          >
                            {getSystemIcon(sourceSystem?.icon || 'database', 16)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{sourceSystem?.name}</p>
                            <p className="text-xs text-gray-500">{sourceSystem?.stage}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="space-y-1">
                          {link.sourceFields.map((field) => (
                            <div key={field} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sourceSystem?.color }}></div>
                              <span className="text-sm text-gray-700">{field}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: targetSystem?.color }}
                          >
                            {getSystemIcon(targetSystem?.icon || 'database', 16)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{targetSystem?.name}</p>
                            <p className="text-xs text-gray-500">{targetSystem?.stage}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="space-y-1">
                          {link.targetFields.map((field) => (
                            <div key={field} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: targetSystem?.color }}></div>
                              <span className="text-sm text-gray-700">{field}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="flex items-start gap-2">
                          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${mappingInfo.color}`}>
                            {mappingInfo.icon}
                            {mappingInfo.label}
                          </span>
                          <p className="text-sm text-gray-600">{link.mappingLogic}</p>
                        </div>
                      </td>
                      <td className="p-3 border text-center">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full font-bold text-lg ${
                          link.confidence >= 95 ? 'bg-emerald-100 text-emerald-700' :
                          link.confidence >= 90 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {link.confidence}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 justify-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Mapping Types:</span>
            {['nlp', 'fuzzy', 'direct', 'hybrid'].map((type) => {
              const info = getMappingTypeInfo(type);
              return (
                <div key={type} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${info.color}`}>
                  {info.icon}
                  <span className="text-sm font-medium">{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
