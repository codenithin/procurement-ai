import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, Bot, Search, AlertTriangle, Home, Globe,
  ChevronRight, TrendingUp, TrendingDown, CheckCircle,
  AlertCircle, Users, FileText, DollarSign, Package, Send,
  RefreshCw, Eye, Filter, Download, X, Activity, MapPin,
  Truck, Route, Calculator, FileCheck, Clock, Monitor, Key,
  Hash, Building2, UserCheck, Briefcase, Percent, Megaphone,
  ListChecks, Target, BookOpen, Layers, Shield, Zap, Database,
  GitBranch, PieChart as PieChartIcon, LayoutDashboard
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import GanttTimeline from './components/GanttTimeline';
import BottleneckFlowChart from './components/BottleneckFlowChart';
import ControlLapsDetection from './components/ControlLapsDetection';
import SystemIntegrationMap from './components/SystemIntegrationMap';
import ProcessDiscovery from './components/ProcessDiscovery';
import VariantAnalysis from './components/VariantAnalysis';
import DataConnectors from './components/DataConnectors';
import DataLake from './components/DataLake';
import ExternalIntelligence from './components/ExternalIntelligence';
import IndiaMap from './components/IndiaMap';
import TreemapChart from './components/TreemapChart';

const API_BASE = '/api';

// Types
interface Transaction {
  transaction_id: string;
  vendor_name: string;
  total_value: number;
  current_stage: string;
  total_cycle_time_days: number;
  has_bottleneck: boolean;
  bottleneck_stage?: string;
  compliance_score: number;
}

interface RateCardEntry {
  id: string;
  vendor: string;
  route: string;
  origin: string;
  destination: string;
  vehicleType: string;
  contractedRatePerKm: number;
  effectiveFrom: string;
  effectiveTo: string;
}

interface LogisticsInvoice {
  invoiceId: string;
  tripSheetId: string;
  vendor: string;
  invoiceDate: string;
  origin: string;
  destination: string;
  vehicleType: string;
  vehicleNumber: string;
  tripSheetKms: number;
  contractedRatePerKm: number;
  expectedCost: number;
  invoicedAmount: number;
  discrepancy: number;
  discrepancyPercent: number;
  status: 'compliant' | 'minor_variance' | 'flagged';
  rateCardRef: string;
}

interface SaaSContract {
  id: string;
  vendor: string;
  productName: string;
  licenseType: 'per_user' | 'per_device' | 'enterprise' | 'consumption';
  contractedLicenses: number;
  unitPrice: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  contractStart: string;
  contractEnd: string;
  poNumber: string;
  contractRef: string;
}

interface SaaSInvoice {
  invoiceId: string;
  vendor: string;
  productName: string;
  invoiceDate: string;
  billingPeriod: string;
  licensesInPO: number;
  licensesInContract: number;
  licensesBilled: number;
  unitPrice: number;
  expectedAmount: number;
  invoicedAmount: number;
  licenseDiff: number;
  amountDiff: number;
  status: 'compliant' | 'over_licensed' | 'under_utilized' | 'flagged';
  poRef: string;
  contractRef: string;
  utilizationPercent: number;
}

interface RecruitmentFeeStructure {
  salaryMin: number;
  salaryMax: number;
  feePercent: number;
}

interface RecruitmentContract {
  id: string;
  vendor: string;
  vendorType: 'agency' | 'consultant' | 'platform';
  feeStructure: RecruitmentFeeStructure[];
  replacementPeriod: number; // days
  paymentTerms: string;
  contractStart: string;
  contractEnd: string;
  poNumber: string;
  contractRef: string;
}

interface RecruitmentInvoice {
  invoiceId: string;
  vendor: string;
  invoiceDate: string;
  candidateName: string;
  position: string;
  department: string;
  joiningDate: string;
  candidateCTC: number;
  contractedFeePercent: number;
  expectedFee: number;
  invoicedAmount: number;
  discrepancy: number;
  discrepancyPercent: number;
  status: 'compliant' | 'overcharged' | 'undercharged' | 'flagged';
  poRef: string;
  contractRef: string;
  salaryVerified: boolean;
}

interface MarketingDeliverable {
  id: string;
  description: string;
  category: 'social_media' | 'content' | 'design' | 'video' | 'seo' | 'paid_ads' | 'other';
  quantity: number;
  unitPrice: number;
  totalValue: number;
}

interface MarketingSOW {
  id: string;
  vendor: string;
  projectName: string;
  campaignType: string;
  deliverables: MarketingDeliverable[];
  totalValue: number;
  contractStart: string;
  contractEnd: string;
  poNumber: string;
  contractRef: string;
}

interface MarketingLineItem {
  deliverableId: string;
  description: string;
  category: string;
  quantityInSOW: number;
  quantityBilled: number;
  unitPrice: number;
  expectedAmount: number;
  billedAmount: number;
  variance: number;
  status: 'delivered' | 'partial' | 'overbilled' | 'not_delivered';
}

interface MarketingInvoice {
  invoiceId: string;
  vendor: string;
  invoiceDate: string;
  projectName: string;
  campaignType: string;
  lineItems: MarketingLineItem[];
  totalExpected: number;
  totalInvoiced: number;
  discrepancy: number;
  discrepancyPercent: number;
  status: 'compliant' | 'partial_delivery' | 'overbilled' | 'flagged';
  poRef: string;
  contractRef: string;
  deliveryVerified: boolean;
}

// Infrastructure Price Variance Interfaces
interface InfrastructureInvoiceItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  historicalAvgPrice: number;
  variance: number;
  variancePercent: number;
  status: 'normal' | 'high' | 'outlier';
}

interface InfrastructureInvoice {
  invoiceId: string;
  vendor: string;
  vendorType: 'manufacturer' | 'distributor' | 'contractor' | 'retailer';
  project: string;
  location: string;
  invoiceDate: string;
  items: InfrastructureInvoiceItem[];
  totalAmount: number;
  totalExpected: number;
  totalVariance: number;
  variancePercent: number;
  status: 'compliant' | 'variance' | 'flagged';
  poRef: string;
  grnVerified: boolean;
}

// Retroactive Duplicates Interfaces
interface DuplicateInvoice {
  invoiceId: string;
  vendor: string;
  vendorCode: string;
  invoiceNumber: string;
  amount: number;
  originalPaymentDate: string;
  duplicatePaymentDate: string;
  daysBetween: number;
  paymentMethod: string;
  department: string;
  approvedBy: string;
  status: 'confirmed_duplicate' | 'potential_duplicate' | 'under_review';
  source: 'Oracle EBS' | 'SAP' | 'Manual Entry';
  recoveryStatus: 'pending' | 'in_progress' | 'recovered' | 'written_off';
  notes: string;
}

// Addendum Timing Interfaces
interface ContractAddendum {
  addendumId: string;
  contractRef: string;
  vendor: string;
  version: number;
  effectiveFrom: string;
  effectiveTo: string;
  rates: { item: string; rate: number }[];
  status: 'active' | 'superseded' | 'expired';
  createdDate: string;
}

interface AddendumTimingIssue {
  issueId: string;
  invoiceId: string;
  vendor: string;
  invoiceDate: string;
  paymentDate: string;
  invoiceAmount: number;
  contractRef: string;
  appliedAddendum: ContractAddendum;
  correctAddendum: ContractAddendum;
  rateDifference: number;
  potentialOvercharge: number;
  status: 'flagged' | 'confirmed' | 'resolved' | 'disputed';
  category: string;
  lineItems: { description: string; quantity: number; appliedRate: number; correctRate: number; difference: number }[];
}

// Case Management Interfaces
interface CaseActivity {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: 'status_change' | 'comment' | 'assignment' | 'evidence' | 'escalation' | 'resolution';
}

interface RelatedTransaction {
  transactionId: string;
  type: string;
  date: string;
  amount: number;
  vendor: string;
  description: string;
}

interface CaseEvidence {
  id: string;
  type: 'invoice' | 'contract' | 'email' | 'screenshot' | 'report' | 'other';
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

interface LeakageFinding {
  caseId: string;
  title: string;
  description: string;
  category: 'rate_card' | 'license' | 'recruitment' | 'marketing' | 'infrastructure' | 'duplicate' | 'addendum' | 'contract' | 'compliance';
  subCategory: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'new' | 'triaged' | 'investigating' | 'pending_approval' | 'recovery_initiated' | 'recovered' | 'disputed' | 'closed' | 'false_positive';
  leakageAmount: number;
  recoveredAmount: number;
  potentialSavings: number;
  vendor: {
    name: string;
    code: string;
    contact: string;
  };
  assignee: {
    name: string;
    email: string;
    department: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  source: string;
  detectionMethod: 'ai_detected' | 'rule_based' | 'manual_audit' | 'vendor_report' | 'whistleblower';
  relatedTransactions: RelatedTransaction[];
  activities: CaseActivity[];
  evidence: CaseEvidence[];
  tags: string[];
  rootCause: string;
  recommendation: string;
  approver: string | null;
  approvalDate: string | null;
  recoveryDeadline: string | null;
  notes: string;
}

// Main App
// Password Gate Component
const PasswordGate = ({ onAuthenticate }: { onAuthenticate: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check password
    setTimeout(() => {
      if (password === 'Flipkartprocurement') {
        localStorage.setItem('procurement_auth', 'true');
        onAuthenticate();
      } else {
        setError('Invalid password. Please try again.');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#2874f0] p-6">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-medium text-white italic">Flipkart</h1>
            <span className="text-sm text-[#ffe500] font-medium">PROCUREMENT</span>
          </div>
          <p className="text-center text-blue-200 mt-2">AI-Powered Procurement Platform</p>
        </div>
        {/* Yellow accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#e8f0fe] rounded-full flex items-center justify-center">
              <Shield size={32} className="text-[#2874f0]" />
            </div>
          </div>

          <h2 className="text-xl font-medium text-[#212121] text-center mb-2">Protected Access</h2>
          <p className="text-sm text-[#878787] text-center mb-6">Enter the password to access the platform</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#212121] mb-2">Password</label>
            <div className="relative">
              <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878787]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-sm focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] text-[#212121]"
                placeholder="Enter password"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 bg-[#ff9f00] hover:bg-[#e68f00] disabled:bg-[#e0e0e0] disabled:cursor-not-allowed text-white font-medium rounded-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield size={18} />
                Access Platform
              </>
            )}
          </button>
        </form>

        <div className="px-8 pb-6">
          <p className="text-xs text-[#878787] text-center">
            This platform contains confidential procurement data. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('procurement_auth') === 'true';
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      // Use mock data if API fails
      setStats({
        vendors: 30,
        sourcing_requests: 100,
        contracts: 85,
        purchase_orders: 150,
        invoices: 120,
        transactions_tracked: 50,
        total_spend: 125000000,
        total_leakage_identified: 1850000
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // If not authenticated, show password gate
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lifecycle', label: 'Lifecycle Tracking', icon: BarChart3 },
    { id: 'agent', label: 'AI Procurement Agent', icon: Bot },
    { id: 'analytics', label: 'Insights & Analytics', icon: Search },
    { id: 'intelligence', label: 'External Intelligence', icon: Globe },
    { id: 'leakage', label: 'Leakage Detection', icon: AlertTriangle },
    { id: 'docs', label: 'Documentation', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-[#f1f3f6]">
      {/* Flipkart-style Sidebar */}
      <div className="w-60 bg-white flex flex-col" style={{ boxShadow: '1px 0 8px rgba(0,0,0,0.08)' }}>
        {/* Logo */}
        <div className="p-4 bg-[#2874f0]">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium text-white italic">Flipkart</h1>
            <span className="text-[10px] text-[#ffe500] font-medium">PROCUREMENT</span>
          </div>
          <p className="text-xs text-blue-200 mt-1">AI-Powered Platform</p>
        </div>
        {/* Yellow accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer transition-all mb-1 ${
                activeTab === item.id
                  ? 'bg-[#e8f0fe] text-[#2874f0]'
                  : 'text-[#212121] hover:bg-[#f1f3f6]'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-[#2874f0]' : 'text-[#878787]'} />
              <span className={`text-sm ${activeTab === item.id ? 'font-medium' : ''}`}>{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1 h-5 bg-[#2874f0] rounded-full"></div>
              )}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-[#e0e0e0] bg-[#f1f3f6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#212121] truncate">Procurement Team</p>
              <p className="text-[10px] text-[#878787]">Admin Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView stats={stats} setActiveTab={setActiveTab} />}
        {activeTab === 'lifecycle' && <LifecycleView />}
        {activeTab === 'agent' && <AgentView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'intelligence' && <ExternalIntelligence />}
        {activeTab === 'leakage' && <LeakageView />}
        {activeTab === 'docs' && <DocumentationView />}
      </div>
    </div>
  );
}

// Category breakdown data with subcategories - moved here for proper initialization
const categoryBreakdown = {
  'Logistics & Supply Chain': {
    color: '#2874f0',
    subcategories: [
      { name: 'Logistics & Transportation', amount: 285000000, percentage: 58.8 },
      { name: 'Packaging Supplies', amount: 98000000, percentage: 20.2 },
      { name: 'Supply Chain Operations', amount: 102000000, percentage: 21.0 },
    ]
  },
  'Services': {
    color: '#34d399',
    subcategories: [
      { name: 'HR Services', amount: 85000000, percentage: 34.7 },
      { name: 'Professional Services', amount: 92000000, percentage: 37.6 },
      { name: 'Corporate Services', amount: 68000000, percentage: 27.7 },
    ]
  },
  'Technology (IT)': {
    color: '#fbbf24',
    subcategories: [
      { name: 'IT Hardware & Peripherals', amount: 125000000, percentage: 44.6 },
      { name: 'Software & SaaS Licenses', amount: 155000000, percentage: 55.4 },
    ]
  },
  'Marketing & Advertising': {
    color: '#f87171',
    subcategories: [
      { name: 'Media Buys', amount: 115000000, percentage: 59.0 },
      { name: 'Agency Fees', amount: 52000000, percentage: 26.7 },
      { name: 'Production Costs', amount: 28000000, percentage: 14.3 },
    ]
  },
  'Facilities & Infrastructure': {
    color: '#a78bfa',
    subcategories: [
      { name: 'Civil Works & Infra', amount: 68000000, percentage: 40.5 },
      { name: 'Racking & Warehouse', amount: 62000000, percentage: 36.9 },
      { name: 'Automation', amount: 38000000, percentage: 22.6 },
    ]
  },
  'Outsourcing': {
    color: '#60a5fa',
    subcategories: [
      { name: 'Customer Experience', amount: 72000000, percentage: 56.7 },
      { name: 'Seller Support', amount: 35000000, percentage: 27.6 },
      { name: 'Other Services', amount: 20000000, percentage: 15.7 },
    ]
  },
};

// Dashboard View
function DashboardView({ stats, setActiveTab }: { stats: any; setActiveTab: (tab: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const treemapRef = useRef<HTMLDivElement>(null);

  // Total Indirect Spend (in Crores)
  const totalIndirectSpend = 1500; // ₹1,500 Cr

  const scrollToTreemap = () => {
    treemapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Mock transactions data by subcategory
  const subcategoryTransactions: Record<string, Array<{
    id: string;
    vendor: string;
    category: string;
    contract: string;
    spend: number;
    date: string;
    status: string;
  }>> = {
    'HR Services': [
      { id: 'TXN-HR-001', vendor: 'TeamLease Services', category: 'Staffing', contract: 'TLS-2024-001', spend: 2850000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-HR-002', vendor: 'ABC Consultants', category: 'Recruitment', contract: 'ABC-2024-003', spend: 1200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-HR-003', vendor: 'Quess Corp', category: 'Temp Staffing', contract: 'QC-2024-007', spend: 1850000, date: '2025-01-10', status: 'Processing' },
      { id: 'TXN-HR-004', vendor: 'Randstad India', category: 'Executive Search', contract: 'RI-2024-002', spend: 950000, date: '2025-01-08', status: 'Paid' },
      { id: 'TXN-HR-005', vendor: 'ManpowerGroup', category: 'Contract Staffing', contract: 'MG-2024-011', spend: 1650000, date: '2025-01-05', status: 'Paid' },
    ],
    'Professional Services': [
      { id: 'TXN-PS-001', vendor: 'Deloitte India', category: 'Consulting', contract: 'DEL-2024-005', spend: 4500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-PS-002', vendor: 'KPMG India', category: 'Audit Services', contract: 'KPMG-2024-002', spend: 2200000, date: '2025-01-11', status: 'Processing' },
      { id: 'TXN-PS-003', vendor: 'EY India', category: 'Tax Advisory', contract: 'EY-2024-008', spend: 1800000, date: '2025-01-09', status: 'Paid' },
      { id: 'TXN-PS-004', vendor: 'PwC India', category: 'Risk Advisory', contract: 'PWC-2024-003', spend: 1350000, date: '2025-01-07', status: 'Paid' },
    ],
    'Corporate Services': [
      { id: 'TXN-CS-001', vendor: 'ISS Facility Services', category: 'Facility Mgmt', contract: 'ISS-2024-001', spend: 1950000, date: '2025-01-13', status: 'Paid' },
      { id: 'TXN-CS-002', vendor: 'Sodexo India', category: 'Food Services', contract: 'SOD-2024-004', spend: 1250000, date: '2025-01-10', status: 'Processing' },
      { id: 'TXN-CS-003', vendor: 'JLL India', category: 'Property Mgmt', contract: 'JLL-2024-006', spend: 2100000, date: '2025-01-08', status: 'Paid' },
      { id: 'TXN-CS-004', vendor: 'CBRE India', category: 'Real Estate', contract: 'CBRE-2024-002', spend: 1500000, date: '2025-01-06', status: 'Paid' },
    ],
    'Logistics & Transportation': [
      { id: 'TXN-LT-001', vendor: 'Blue Dart Express', category: 'Express Delivery', contract: 'BD-2024-001', spend: 8500000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-LT-002', vendor: 'Delhivery Ltd', category: 'Last Mile', contract: 'DEL-2024-012', spend: 12500000, date: '2025-01-14', status: 'Processing' },
      { id: 'TXN-LT-003', vendor: 'Ecom Express', category: 'E-commerce Logistics', contract: 'ECM-2024-005', spend: 6800000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-LT-004', vendor: 'XpressBees', category: 'Hyperlocal', contract: 'XB-2024-003', spend: 4200000, date: '2025-01-10', status: 'Paid' },
    ],
    'Packaging Supplies': [
      { id: 'TXN-PK-001', vendor: 'Uflex Limited', category: 'Flexible Packaging', contract: 'UFL-2024-002', spend: 3200000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-PK-002', vendor: 'Essel Propack', category: 'Laminated Tubes', contract: 'EP-2024-001', spend: 1800000, date: '2025-01-11', status: 'Paid' },
      { id: 'TXN-PK-003', vendor: 'Huhtamaki PPL', category: 'Rigid Packaging', contract: 'HPP-2024-004', spend: 2500000, date: '2025-01-09', status: 'Processing' },
    ],
    'Supply Chain Operations': [
      { id: 'TXN-SC-001', vendor: 'DHL Supply Chain', category: 'Warehousing', contract: 'DHL-2024-001', spend: 4500000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-SC-002', vendor: 'FM Logistic', category: '3PL Services', contract: 'FML-2024-003', spend: 3200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-SC-003', vendor: 'Mahindra Logistics', category: 'Distribution', contract: 'ML-2024-007', spend: 2700000, date: '2025-01-10', status: 'Processing' },
    ],
    'IT Hardware & Peripherals': [
      { id: 'TXN-IT-001', vendor: 'Dell Technologies', category: 'Servers', contract: 'DELL-2024-001', spend: 8500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-IT-002', vendor: 'HP India', category: 'Laptops & PCs', contract: 'HP-2024-005', spend: 4200000, date: '2025-01-11', status: 'Paid' },
      { id: 'TXN-IT-003', vendor: 'Lenovo India', category: 'Workstations', contract: 'LEN-2024-002', spend: 2800000, date: '2025-01-09', status: 'Processing' },
    ],
    'Software & SaaS Licenses': [
      { id: 'TXN-SW-001', vendor: 'Microsoft India', category: 'Cloud Services', contract: 'MS-2024-001', spend: 12500000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-SW-002', vendor: 'Salesforce India', category: 'CRM', contract: 'SF-2024-003', spend: 4800000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-SW-003', vendor: 'SAP India', category: 'ERP Licenses', contract: 'SAP-2024-002', spend: 6500000, date: '2025-01-10', status: 'Processing' },
    ],
    'Media Buys': [
      { id: 'TXN-MB-001', vendor: 'Google India', category: 'Digital Ads', contract: 'GOOG-2024-001', spend: 15000000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-MB-002', vendor: 'Meta India', category: 'Social Media Ads', contract: 'META-2024-002', spend: 8500000, date: '2025-01-13', status: 'Processing' },
      { id: 'TXN-MB-003', vendor: 'Times Internet', category: 'Display Ads', contract: 'TIL-2024-004', spend: 3200000, date: '2025-01-10', status: 'Paid' },
    ],
    'Agency Fees': [
      { id: 'TXN-AF-001', vendor: 'Ogilvy India', category: 'Creative Agency', contract: 'OGV-2024-001', spend: 2500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-AF-002', vendor: 'Dentsu India', category: 'Media Planning', contract: 'DEN-2024-003', spend: 1800000, date: '2025-01-11', status: 'Paid' },
    ],
    'Production Costs': [
      { id: 'TXN-PC-001', vendor: 'Prime Focus', category: 'Video Production', contract: 'PF-2024-001', spend: 1200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-PC-002', vendor: 'Famous Studios', category: 'Ad Films', contract: 'FS-2024-002', spend: 850000, date: '2025-01-09', status: 'Processing' },
    ],
    'Civil Works & Infra': [
      { id: 'TXN-CW-001', vendor: 'L&T Construction', category: 'Civil Works', contract: 'LT-2024-001', spend: 5500000, date: '2025-01-14', status: 'Processing' },
      { id: 'TXN-CW-002', vendor: 'Shapoorji Pallonji', category: 'Infrastructure', contract: 'SP-2024-002', spend: 3200000, date: '2025-01-10', status: 'Paid' },
    ],
    'Racking & Warehouse': [
      { id: 'TXN-RW-001', vendor: 'Godrej Storage', category: 'Racking Systems', contract: 'GS-2024-001', spend: 2800000, date: '2025-01-13', status: 'Paid' },
      { id: 'TXN-RW-002', vendor: 'Jungheinrich India', category: 'Material Handling', contract: 'JH-2024-003', spend: 2100000, date: '2025-01-09', status: 'Paid' },
    ],
    'Automation': [
      { id: 'TXN-AU-001', vendor: 'Addverb Technologies', category: 'Warehouse Automation', contract: 'ADD-2024-001', spend: 4500000, date: '2025-01-15', status: 'Processing' },
      { id: 'TXN-AU-002', vendor: 'GreyOrange', category: 'Robotics', contract: 'GO-2024-002', spend: 3200000, date: '2025-01-11', status: 'Paid' },
    ],
    'Customer Experience': [
      { id: 'TXN-CX-001', vendor: 'Concentrix India', category: 'Customer Support', contract: 'CON-2024-001', spend: 4500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-CX-002', vendor: 'Teleperformance', category: 'Call Center', contract: 'TP-2024-003', spend: 3200000, date: '2025-01-11', status: 'Processing' },
    ],
    'Seller Support': [
      { id: 'TXN-SS-001', vendor: 'Wipro BPS', category: 'Seller Onboarding', contract: 'WIP-2024-001', spend: 1850000, date: '2025-01-13', status: 'Paid' },
      { id: 'TXN-SS-002', vendor: 'Infosys BPM', category: 'Seller Services', contract: 'INF-2024-002', spend: 1350000, date: '2025-01-10', status: 'Paid' },
    ],
    'Other Services': [
      { id: 'TXN-OS-001', vendor: 'TCS BPS', category: 'Back Office', contract: 'TCS-2024-001', spend: 1200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-OS-002', vendor: 'HCL BServ', category: 'Data Processing', contract: 'HCL-2024-003', spend: 800000, date: '2025-01-08', status: 'Processing' },
    ],
  };

  const systemStatus = [
    { name: 'SAP Ariba', status: 'Connected', color: 'green' },
    { name: 'Simplicontract', status: 'Connected', color: 'green' },
    { name: 'Oracle Fusion', status: 'Connected', color: 'green' },
    { name: 'Oracle EBS', status: 'Connected', color: 'green' },
    { name: 'Vendor Portal', status: 'Connected', color: 'green' },
  ];

  interface StateRisk {
    id: string;
    state: string;
    stateCode: string;
    riskLevel: 'low' | 'moderate' | 'elevated' | 'high' | 'severe';
    riskScore: number;
    supplierCount: number;
    warehouseCount: number;
    spendAmount: number;
    factors: { type: string; severity: 'low' | 'medium' | 'high'; description: string }[];
    keyCategories: string[];
  }

  const stateRiskData: StateRisk[] = [
    { id: 'MH', state: 'Maharashtra', stateCode: 'MH', riskLevel: 'low', riskScore: 25, supplierCount: 45, warehouseCount: 12, spendAmount: 450000000, factors: [], keyCategories: ['Logistics', 'IT'] },
    { id: 'GJ', state: 'Gujarat', stateCode: 'GJ', riskLevel: 'low', riskScore: 28, supplierCount: 32, warehouseCount: 8, spendAmount: 320000000, factors: [], keyCategories: ['Manufacturing'] },
    { id: 'TN', state: 'Tamil Nadu', stateCode: 'TN', riskLevel: 'moderate', riskScore: 45, supplierCount: 28, warehouseCount: 6, spendAmount: 280000000, factors: [], keyCategories: ['Auto', 'IT'] },
    { id: 'KA', state: 'Karnataka', stateCode: 'KA', riskLevel: 'low', riskScore: 22, supplierCount: 38, warehouseCount: 10, spendAmount: 380000000, factors: [], keyCategories: ['IT', 'Services'] },
    { id: 'UP', state: 'Uttar Pradesh', stateCode: 'UP', riskLevel: 'elevated', riskScore: 55, supplierCount: 22, warehouseCount: 5, spendAmount: 220000000, factors: [], keyCategories: ['FMCG'] },
    { id: 'WB', state: 'West Bengal', stateCode: 'WB', riskLevel: 'high', riskScore: 72, supplierCount: 15, warehouseCount: 4, spendAmount: 150000000, factors: [], keyCategories: ['Steel', 'Jute'] },
    { id: 'RJ', state: 'Rajasthan', stateCode: 'RJ', riskLevel: 'moderate', riskScore: 48, supplierCount: 18, warehouseCount: 4, spendAmount: 180000000, factors: [], keyCategories: ['Textiles'] },
    { id: 'DL', state: 'Delhi', stateCode: 'DL', riskLevel: 'low', riskScore: 20, supplierCount: 25, warehouseCount: 6, spendAmount: 250000000, factors: [], keyCategories: ['Services', 'IT'] },
    { id: 'PB', state: 'Punjab', stateCode: 'PB', riskLevel: 'low', riskScore: 30, supplierCount: 12, warehouseCount: 3, spendAmount: 120000000, factors: [], keyCategories: ['Agri'] },
    { id: 'HR', state: 'Haryana', stateCode: 'HR', riskLevel: 'low', riskScore: 26, supplierCount: 14, warehouseCount: 4, spendAmount: 140000000, factors: [], keyCategories: ['Auto'] },
    { id: 'TS', state: 'Telangana', stateCode: 'TS', riskLevel: 'low', riskScore: 24, supplierCount: 20, warehouseCount: 5, spendAmount: 200000000, factors: [], keyCategories: ['Pharma', 'IT'] },
    { id: 'AP', state: 'Andhra Pradesh', stateCode: 'AP', riskLevel: 'moderate', riskScore: 42, supplierCount: 16, warehouseCount: 4, spendAmount: 160000000, factors: [], keyCategories: ['Pharma'] },
    { id: 'KL', state: 'Kerala', stateCode: 'KL', riskLevel: 'low', riskScore: 28, supplierCount: 10, warehouseCount: 3, spendAmount: 100000000, factors: [], keyCategories: ['Spices', 'IT'] },
    { id: 'MP', state: 'Madhya Pradesh', stateCode: 'MP', riskLevel: 'moderate', riskScore: 46, supplierCount: 11, warehouseCount: 3, spendAmount: 110000000, factors: [], keyCategories: ['Agri'] },
    { id: 'BR', state: 'Bihar', stateCode: 'BR', riskLevel: 'high', riskScore: 68, supplierCount: 8, warehouseCount: 2, spendAmount: 80000000, factors: [], keyCategories: ['Agri'] },
  ];

  const [selectedState, setSelectedState] = useState<StateRisk | null>(null);

  return (
    <div className="p-5 bg-[#f1f3f6] min-h-full">
      {/* Flipkart-style Hero Header */}
      <div className="mb-6 rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        {/* Yellow accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#ffe500] via-[#ff9f00] to-[#ff6161]"></div>
        {/* Main header */}
        <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5dc8] p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-medium">Procurement Command Center</h1>
                <span className="px-2 py-0.5 bg-[#ffe500] text-[#212121] text-xs font-medium rounded-sm">LIVE</span>
              </div>
              <p className="text-blue-100 text-sm">Real-time insights across your procurement ecosystem</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 bg-white/10 rounded-sm px-3 py-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#26a541] animate-pulse"></div>
                  <span className="text-xs">All Systems Online</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-sm px-3 py-1.5">
                  <Activity size={14} className="text-[#ffe500]" />
                  <span className="text-xs">6 Categories Tracked</span>
                </div>
              </div>
            </div>
            <div
              className="text-right bg-white/10 rounded-sm p-4 cursor-pointer hover:bg-white/20 transition-all"
              onClick={scrollToTreemap}
              title="Click to view spend breakdown"
            >
              <p className="text-blue-200 text-xs uppercase tracking-wide">Total Indirect Spend</p>
              <p className="text-3xl font-medium mt-1">₹{totalIndirectSpend} Cr</p>
              <p className="text-blue-200 text-xs mt-1">FY 2024-25 • Click for details ↓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Flipkart Style */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <FKStatCard
          title="Active Vendors"
          value={stats?.vendors || 30}
          icon={Users}
          trend="+5%"
          trendUp={true}
          color="#2874f0"
        />
        <FKStatCard
          title="Active Contracts"
          value={stats?.contracts || 85}
          icon={FileText}
          trend="+12%"
          trendUp={true}
          color="#ff9f00"
        />
        <FKStatCard
          title="Purchase Orders"
          value={stats?.purchase_orders || 150}
          icon={Package}
          trend="+8%"
          trendUp={true}
          color="#388e3c"
        />
        <FKStatCard
          title="Total Spend"
          value={formatCurrency(stats?.total_spend || 125000000)}
          icon={DollarSign}
          trend="+15%"
          trendUp={true}
          color="#ff6161"
        />
      </div>

      {/* Main Content Grid - Flipkart Style */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Category Spend Overview */}
        <div className="col-span-2 bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
          <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                <DollarSign className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-[#212121] text-sm">Spend by Category</h3>
                <p className="text-xs text-[#878787]">FY 2024-25 procurement spend breakdown</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#878787]">Total: </span>
              <span className="text-sm font-medium text-[#2874f0]">₹1,500 Cr</span>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Logistics & Supply Chain */}
              <div
                className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[#2874f0] group"
                onClick={() => setSelectedCategory('Logistics & Supply Chain')}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#212121]">Logistics & Supply Chain</p>
                  <span className="text-[10px] text-[#388e3c] font-medium">32.3%</span>
                </div>
                <p className="text-xl font-medium text-[#2874f0]">₹485 Cr</p>
                <p className="text-[10px] text-[#878787] mt-1 line-clamp-1">Transportation, Packaging, Pallets, MHEs</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#2874f0] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View breakdown</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Technology (IT) */}
              <div
                className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[#ff9f00] group"
                onClick={() => setSelectedCategory('Technology (IT)')}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#212121]">Technology (IT)</p>
                  <span className="text-[10px] text-[#388e3c] font-medium">18.7%</span>
                </div>
                <p className="text-xl font-medium text-[#ff9f00]">₹280 Cr</p>
                <p className="text-[10px] text-[#878787] mt-1 line-clamp-1">Hardware, Peripherals, Software & SaaS</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#ff9f00] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View breakdown</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Services */}
              <div
                className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[#388e3c] group"
                onClick={() => setSelectedCategory('Services')}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#212121]">Services</p>
                  <span className="text-[10px] text-[#388e3c] font-medium">16.3%</span>
                </div>
                <p className="text-xl font-medium text-[#388e3c]">₹245 Cr</p>
                <p className="text-[10px] text-[#878787] mt-1 line-clamp-1">HR, Professional, Corporate Services</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#388e3c] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View breakdown</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Marketing & Advertising */}
              <div
                className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[#ff6161] group"
                onClick={() => setSelectedCategory('Marketing & Advertising')}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#212121]">Marketing & Advertising</p>
                  <span className="text-[10px] text-[#388e3c] font-medium">13.0%</span>
                </div>
                <p className="text-xl font-medium text-[#ff6161]">₹195 Cr</p>
                <p className="text-[10px] text-[#878787] mt-1 line-clamp-1">Media Buys, Agency Fees, Production</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#ff6161] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View breakdown</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Facilities & Infrastructure */}
              <div
                className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[#9c27b0] group"
                onClick={() => setSelectedCategory('Facilities & Infrastructure')}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#212121]">Facilities & Infrastructure</p>
                  <span className="text-[10px] text-[#388e3c] font-medium">11.2%</span>
                </div>
                <p className="text-xl font-medium text-[#9c27b0]">₹168 Cr</p>
                <p className="text-[10px] text-[#878787] mt-1 line-clamp-1">Civil Works, Racking, Automation</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#9c27b0] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View breakdown</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Outsourcing */}
              <div
                className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[#00bcd4] group"
                onClick={() => setSelectedCategory('Outsourcing')}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#212121]">Outsourcing</p>
                  <span className="text-[10px] text-[#388e3c] font-medium">8.5%</span>
                </div>
                <p className="text-xl font-medium text-[#00bcd4]">₹127 Cr</p>
                <p className="text-[10px] text-[#878787] mt-1 line-clamp-1">Customer Experience, Seller Support</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[#00bcd4] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View breakdown</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leakage Case Summary */}
        <div className="bg-white rounded-sm overflow-hidden flex flex-col" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
          <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                <ListChecks className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-[#212121] text-sm">Recent Cases</h3>
                <p className="text-xs text-[#878787]">{mockLeakageFindings.filter(f => f.status !== 'closed' && f.status !== 'false_positive').length} active</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('leakage')} className="text-xs text-[#2874f0] font-medium hover:underline">
              View All →
            </button>
          </div>
          <div className="p-3 flex-1 overflow-auto">
            <div className="space-y-2">
              {mockLeakageFindings.slice(0, 4).map(finding => (
                <div
                  key={finding.caseId}
                  className="p-2.5 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActiveTab('leakage')}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      finding.severity === 'critical' ? 'bg-[#ffebee]' :
                      finding.severity === 'high' ? 'bg-[#fff3e0]' :
                      finding.severity === 'medium' ? 'bg-[#fffde7]' : 'bg-[#e8f5e9]'
                    }`}>
                      <AlertTriangle className={`${
                        finding.severity === 'critical' ? 'text-[#c62828]' :
                        finding.severity === 'high' ? 'text-[#e65100]' :
                        finding.severity === 'medium' ? 'text-[#f9a825]' : 'text-[#2e7d32]'
                      }`} size={12} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#212121] line-clamp-1">{finding.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-[#878787]">{finding.vendor.name}</span>
                        <span className="text-xs font-medium text-[#ff6161]">{formatCurrency(finding.leakageAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-[#e0e0e0] bg-[#f1f3f6]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-lg font-medium text-[#ff6161]">{formatCurrency(mockLeakageFindings.reduce((acc, f) => acc + f.leakageAmount, 0))}</p>
                <p className="text-[10px] text-[#878787]">Total Identified</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-[#388e3c]">{formatCurrency(mockLeakageFindings.reduce((acc, f) => acc + f.recoveredAmount, 0))}</p>
                <p className="text-[10px] text-[#878787]">Recovered</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('leakage')}
              className="w-full px-3 py-2 bg-[#2874f0] text-white text-xs font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
            >
              View All Cases
            </button>
          </div>
        </div>

        {/* Category Drill-Down Modal */}
        {selectedCategory && categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown] && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}>
            <div className="bg-white rounded-sm w-full max-w-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-[#2874f0] p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    {selectedSubcategory && (
                      <button
                        onClick={() => setSelectedSubcategory(null)}
                        className="w-6 h-6 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mr-1"
                      >
                        <ChevronRight className="text-white rotate-180" size={16} />
                      </button>
                    )}
                    <h3 className="text-white font-medium">{selectedSubcategory || selectedCategory}</h3>
                  </div>
                  <p className="text-blue-200 text-xs mt-0.5">
                    {selectedSubcategory ? 'Transaction Details' : 'Spend Breakdown FY 2024-25'}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                  className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="text-white" size={18} />
                </button>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>

              {/* Modal Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {!selectedSubcategory ? (
                  <>
                    {/* Total */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#e0e0e0]">
                      <span className="text-sm text-[#878787]">Category Total</span>
                      <span className="text-xl font-medium" style={{ color: categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].color }}>
                        {formatCurrency(categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].subcategories.reduce((acc, s) => acc + s.amount, 0))}
                      </span>
                    </div>

                    {/* Subcategories - Now Clickable */}
                    <div className="space-y-3">
                      {categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].subcategories.map((sub, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md hover:bg-[#e8f0fe] transition-all cursor-pointer group"
                          onClick={() => setSelectedSubcategory(sub.name)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#212121] group-hover:text-[#2874f0]">{sub.name}</span>
                              <ChevronRight className="text-[#878787] group-hover:text-[#2874f0] opacity-0 group-hover:opacity-100 transition-all" size={14} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].color }}>
                              {formatCurrency(sub.amount)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${sub.percentage}%`,
                                  backgroundColor: categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].color
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-[#878787] w-12 text-right">{sub.percentage}%</span>
                          </div>
                          <p className="text-[10px] text-[#878787] mt-2 group-hover:text-[#2874f0]">
                            Click to view {subcategoryTransactions[sub.name]?.length || 0} transactions →
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Transactions Table */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-[#878787]">
                        {subcategoryTransactions[selectedSubcategory]?.length || 0} Transactions
                      </span>
                      <span className="text-lg font-medium" style={{ color: categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].color }}>
                        {formatCurrency(subcategoryTransactions[selectedSubcategory]?.reduce((acc, t) => acc + t.spend, 0) || 0)}
                      </span>
                    </div>

                    {/* Transactions List */}
                    <div className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#f1f3f6]">
                            <th className="px-3 py-2 text-left text-xs font-medium text-[#878787] uppercase">Vendor</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-[#878787] uppercase">Category</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-[#878787] uppercase">Contract</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-[#878787] uppercase">Spend</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e0e0e0]">
                          {subcategoryTransactions[selectedSubcategory]?.map((txn, idx) => (
                            <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                              <td className="px-3 py-2.5">
                                <div className="text-sm font-medium text-[#212121]">{txn.vendor}</div>
                                <div className="text-[10px] text-[#878787]">{txn.id}</div>
                              </td>
                              <td className="px-3 py-2.5 text-sm text-[#212121]">{txn.category}</td>
                              <td className="px-3 py-2.5">
                                <span className="text-xs font-mono bg-[#f1f3f6] px-1.5 py-0.5 rounded text-[#2874f0]">
                                  {txn.contract}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-sm font-medium text-right" style={{ color: categoryBreakdown[selectedCategory as keyof typeof categoryBreakdown].color }}>
                                {formatCurrency(txn.spend)}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                  txn.status === 'Paid'
                                    ? 'bg-[#e8f5e9] text-[#388e3c]'
                                    : 'bg-[#fff3e0] text-[#ff9f00]'
                                }`}>
                                  {txn.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-[#e0e0e0] flex justify-between items-center">
                  <span className="text-xs text-[#878787]">Data as of Jan 2025</span>
                  <div className="flex gap-2">
                    {selectedSubcategory && (
                      <button
                        className="px-4 py-2 border border-[#e0e0e0] text-[#212121] text-sm font-medium rounded-sm hover:bg-[#f1f3f6] transition-colors"
                        onClick={() => setSelectedSubcategory(null)}
                      >
                        Back
                      </button>
                    )}
                    <button
                      className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                      onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* India Map and Use Cases - Flipkart Style */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* India Risk Map - Prominent */}
        <div className="col-span-2 bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
          <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                <MapPin className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-[#212121] text-sm">Supplier Risk Map</h3>
                <p className="text-xs text-[#878787]">Pan-India procurement risk analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]"></div>
                <span className="text-[#878787]">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]"></div>
                <span className="text-[#878787]">Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]"></div>
                <span className="text-[#878787]">Elevated</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#f97316]"></div>
                <span className="text-[#878787]">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]"></div>
                <span className="text-[#878787]">Severe</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-0">
            {/* Map */}
            <div className="col-span-3 p-3">
              <div className="h-[320px]">
                <IndiaMap
                  stateRisks={stateRiskData}
                  selectedState={selectedState}
                  onStateClick={(state: any) => setSelectedState(state)}
                />
              </div>
            </div>
            {/* State Details Panel */}
            <div className="col-span-2 border-l border-[#e0e0e0] p-4 bg-[#f9fafb]">
              {selectedState ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-[#212121]">{selectedState.state}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-sm capitalize ${
                      selectedState.riskLevel === 'low' ? 'bg-[#dcfce7] text-[#166534]' :
                      selectedState.riskLevel === 'moderate' ? 'bg-[#dbeafe] text-[#1e40af]' :
                      selectedState.riskLevel === 'elevated' ? 'bg-[#fef3c7] text-[#92400e]' :
                      selectedState.riskLevel === 'high' ? 'bg-[#ffedd5] text-[#c2410c]' :
                      'bg-[#fee2e2] text-[#991b1b]'
                    }`}>{selectedState.riskLevel} Risk</span>
                  </div>

                  {/* Risk Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#878787]">Risk Score</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedState.riskScore}/100</span>
                    </div>
                    <div className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedState.riskScore < 30 ? 'bg-[#22c55e]' :
                          selectedState.riskScore < 45 ? 'bg-[#3b82f6]' :
                          selectedState.riskScore < 55 ? 'bg-[#f59e0b]' :
                          selectedState.riskScore < 70 ? 'bg-[#f97316]' : 'bg-[#ef4444]'
                        }`}
                        style={{ width: `${selectedState.riskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2 bg-white rounded-sm border border-[#e0e0e0]">
                      <p className="text-xs text-[#878787]">Suppliers</p>
                      <p className="text-lg font-medium text-[#2874f0]">{selectedState.supplierCount}</p>
                    </div>
                    <div className="p-2 bg-white rounded-sm border border-[#e0e0e0]">
                      <p className="text-xs text-[#878787]">Warehouses</p>
                      <p className="text-lg font-medium text-[#ff9f00]">{selectedState.warehouseCount}</p>
                    </div>
                    <div className="col-span-2 p-2 bg-white rounded-sm border border-[#e0e0e0]">
                      <p className="text-xs text-[#878787]">Total Spend</p>
                      <p className="text-lg font-medium text-[#388e3c]">{formatCurrency(selectedState.spendAmount)}</p>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#878787] uppercase tracking-wide mb-2">Risk Factors</p>
                    <div className="space-y-1.5">
                      {selectedState.factors.slice(0, 3).map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-sm border border-[#e0e0e0]">
                          <span className="text-xs text-[#212121]">{factor.type}</span>
                          <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded capitalize ${
                            factor.severity === 'high' ? 'bg-[#fee2e2] text-[#991b1b]' :
                            factor.severity === 'medium' ? 'bg-[#fef3c7] text-[#92400e]' :
                            'bg-[#dcfce7] text-[#166534]'
                          }`}>{factor.severity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
                    <p className="text-[10px] text-[#878787] mb-1.5">Key Categories</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedState.keyCategories.map((cat, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] bg-[#e8f0fe] text-[#2874f0] rounded-sm">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MapPin className="text-[#d1d5db] mb-2" size={32} />
                  <p className="text-sm text-[#878787]">Click on a state</p>
                  <p className="text-xs text-[#d1d5db]">to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Access Use Cases - Compact */}
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-sm p-3 hover:shadow-lg transition-all cursor-pointer group" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#2874f0]">
                <BarChart3 className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#212121] text-sm">Lifecycle Tracking</h4>
                <p className="text-xs text-[#878787] truncate">End-to-end visibility</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-[#2874f0]">{stats?.transactions_tracked || 50}</p>
                <p className="text-[10px] text-[#878787]">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm p-3 hover:shadow-lg transition-all cursor-pointer group" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#ff9f00]">
                <Bot className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#212121] text-sm">AI Agent</h4>
                <p className="text-xs text-[#878787] truncate">Automated procurement</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-[#ff9f00]">80%</p>
                <p className="text-[10px] text-[#878787]">Automation</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm p-3 hover:shadow-lg transition-all cursor-pointer group" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#388e3c]">
                <Search className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#212121] text-sm">Analytics</h4>
                <p className="text-xs text-[#878787] truncate">Spend insights</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-[#388e3c]">{formatCurrency(stats?.total_spend || 125000000)}</p>
                <p className="text-[10px] text-[#878787]">Analyzed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm p-3 hover:shadow-lg transition-all cursor-pointer group" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#ff6161]">
                <AlertTriangle className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#212121] text-sm">Leakage Detection</h4>
                <p className="text-xs text-[#878787] truncate">Post-payment audit</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-[#ff6161]">{formatCurrency(stats?.total_leakage_identified || 1850000)}</p>
                <p className="text-[10px] text-[#878787]">Identified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indirect Spend Treemap */}
      <div ref={treemapRef} className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#2874f0] to-[#6366f1] rounded-sm flex items-center justify-center">
              <BarChart3 className="text-white" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-[#212121] text-sm">Indirect Spend Distribution</h3>
              <p className="text-xs text-[#878787]">Interactive treemap • Click to explore subcategories</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-semibold text-[#212121]">₹1,500 Cr</p>
              <p className="text-xs text-[#878787]">Total Indirect Spend</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <TreemapChart
            onCategoryClick={(category, subcategory) => {
              console.log(`Clicked: ${category} > ${subcategory}`);
              setSelectedCategory(category);
            }}
          />
        </div>
      </div>

      {/* System Integration Status - Flipkart Style */}
      <div className="bg-white rounded-sm p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-[#212121] flex items-center gap-2">
            <Activity className="text-[#388e3c]" size={18} />
            System Integration Status
          </h3>
          <span className="text-xs text-[#878787]">All systems operational</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {systemStatus.map(sys => (
            <div key={sys.name} className="flex items-center gap-2.5 p-3 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer">
              <div className="relative flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#388e3c]"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#388e3c] animate-ping opacity-60"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#212121] truncate">{sys.name}</p>
                <p className="text-xs text-[#388e3c]">{sys.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Flipkart Stat Card Component
function FKStatCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
  return (
    <div className="bg-white rounded-sm p-4 hover:shadow-lg transition-all cursor-pointer group" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
      <div className="flex justify-between items-start mb-3">
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon style={{ color }} size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium ${
            trendUp ? 'bg-[#e8f7e9] text-[#388e3c]' : 'bg-[#ffebee] text-[#ff6161]'
          }`}>
            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-medium text-[#212121]">{value}</p>
      <p className="text-xs text-[#878787] mt-1">{title}</p>
      {/* Flipkart-style bottom accent */}
      <div className="mt-3 h-0.5 rounded-full bg-[#f1f3f6] overflow-hidden">
        <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
}

// Use Case 1: Lifecycle Tracking View
function LifecycleView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'bottleneck' | 'controls' | 'integration' | 'discovery' | 'variants' | 'connectors' | 'datalake'>('timeline');

  useEffect(() => {
    fetchTransactions();
    fetchKPIs();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/lifecycle/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch {
      setTransactions(mockTransactions);
    }
  };

  const fetchKPIs = async () => {
    try {
      const res = await fetch(`${API_BASE}/lifecycle/kpis`);
      const data = await res.json();
      setKpis(data);
    } catch {
      setKpis(mockKPIs);
    }
  };

  const stages = [
    { id: 'request', name: 'Request Intake', system: 'SAP Ariba' },
    { id: 'sourcing', name: 'Sourcing', system: 'SAP Ariba' },
    { id: 'contracting', name: 'Contracting', system: 'Simplicontract' },
    { id: 'po', name: 'PR/PO Creation', system: 'Oracle Fusion' },
    { id: 'payment', name: 'Payment', system: 'Oracle EBS' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Procurement Lifecycle Tracking</h2>
          <p className="text-gray-500">End-to-end visibility across all procurement systems</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'timeline' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600'
              }`}
            >
              Transaction Timeline
            </button>
            <button
              onClick={() => setViewMode('bottleneck')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'bottleneck' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600'
              }`}
            >
              Bottleneck Analysis
            </button>
            <button
              onClick={() => setViewMode('controls')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'controls' ? 'bg-white shadow text-red-600 font-medium' : 'text-gray-600'
              }`}
            >
              Control Laps
            </button>
            <button
              onClick={() => setViewMode('integration')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'integration' ? 'bg-white shadow text-purple-600 font-medium' : 'text-gray-600'
              }`}
            >
              Integration Map
            </button>
            <button
              onClick={() => setViewMode('discovery')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'discovery' ? 'bg-white shadow text-indigo-600 font-medium' : 'text-gray-600'
              }`}
            >
              Process Discovery
            </button>
            <button
              onClick={() => setViewMode('variants')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'variants' ? 'bg-white shadow text-purple-600 font-medium' : 'text-gray-600'
              }`}
            >
              Variant Analysis
            </button>
            <button
              onClick={() => setViewMode('connectors')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'connectors' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600'
              }`}
            >
              Connectors
            </button>
            <button
              onClick={() => setViewMode('datalake')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'datalake' ? 'bg-white shadow text-emerald-600 font-medium' : 'text-gray-600'
              }`}
            >
              Data Lake
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.summary?.map((kpi: any) => (
            <div key={kpi.metric_name} className="stat-card">
              <p className="text-sm text-gray-500">{kpi.metric_name}</p>
              <p className="text-2xl font-bold text-gray-800">
                {kpi.value}{kpi.unit === '%' ? '%' : kpi.unit === 'days' ? ' days' : ''}
              </p>
              <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'improving' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {Math.abs(kpi.change_percentage)}% vs last month
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'bottleneck' ? (
        <BottleneckFlowChart />
      ) : viewMode === 'controls' ? (
        <ControlLapsDetection />
      ) : viewMode === 'integration' ? (
        <SystemIntegrationMap />
      ) : viewMode === 'discovery' ? (
        <ProcessDiscovery />
      ) : viewMode === 'variants' ? (
        <VariantAnalysis />
      ) : viewMode === 'connectors' ? (
        <DataConnectors />
      ) : viewMode === 'datalake' ? (
        <DataLake />
      ) : (
        <>
          {/* Process Flow Visualization */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Process Flow</h3>
            <div className="flex justify-between items-center">
              {stages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <CheckCircle className="text-blue-600" size={24} />
                    </div>
                    <p className="text-sm font-medium text-center">{stage.name}</p>
                    <p className="text-xs text-gray-500">{stage.system}</p>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="flex-1 h-1 bg-blue-200 mx-2 mt-[-20px]"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transaction Timeline</h3>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Transaction ID</th>
              <th className="table-header">Vendor</th>
              <th className="table-header">Value</th>
              <th className="table-header">Current Stage</th>
              <th className="table-header">Cycle Time</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map(txn => (
              <tr key={txn.transaction_id} className="border-b hover:bg-gray-50">
                <td className="table-cell font-mono">{txn.transaction_id}</td>
                <td className="table-cell">{txn.vendor_name}</td>
                <td className="table-cell">{formatCurrency(txn.total_value)}</td>
                <td className="table-cell">
                  <span className="badge badge-blue">{txn.current_stage}</span>
                </td>
                <td className="table-cell">{txn.total_cycle_time_days} days</td>
                <td className="table-cell">
                  {txn.has_bottleneck ? (
                    <span className="badge badge-red">Bottleneck</span>
                  ) : (
                    <span className="badge badge-green">On Track</span>
                  )}
                </td>
                <td className="table-cell">
                  <button
                    className="text-blue-600 hover:underline flex items-center gap-1"
                    onClick={() => setSelectedTxn(txn)}
                  >
                    <Eye size={14} /> View Timeline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gantt Timeline Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Transaction: {selectedTxn.transaction_id}</h3>
                <p className="text-sm text-gray-500">{selectedTxn.vendor_name} - {formatCurrency(selectedTxn.total_value)}</p>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <GanttTimeline
                transactionId={selectedTxn.transaction_id}
                vendorName={selectedTxn.vendor_name}
                totalValue={selectedTxn.total_value}
              />
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

// Use Case 2: AI Agent View
function AgentView() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Procurement Assistant. I can help you with transactional and tactical procurement needs. What would you like to procure today?' }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestedVendors, setSuggestedVendors] = useState<any[]>([]);
  const [rfqReady, setRfqReady] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch(`${API_BASE}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: input,
          user_id: 'demo_user'
        })
      });
      const data = await res.json();

      setSessionId(data.session_id);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      if (data.suggested_vendors) {
        setSuggestedVendors(data.suggested_vendors);
      }
      setRfqReady(data.rfq_ready);
    } catch {
      // Mock response
      const mockResponses = [
        'I can help with that. What quantity do you need?',
        'Got it. What\'s your budget for this procurement?',
        'Perfect! Based on your requirements, I\'ve identified 3 preferred vendors. Shall I generate an RFQ?'
      ];
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)]
      }]);
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Procurement Agent</h2>
          <p className="text-gray-500">Automated sourcing for transactional & tactical spend</p>
        </div>
        <span className="badge badge-green">Agent Active</span>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-100px)]">
        {/* Chat Interface */}
        <div className="col-span-2 card flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your procurement request..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={sendMessage} className="btn-primary flex items-center gap-2">
              <Send size={16} /> Send
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-semibold mb-3">Quick Start Templates</h3>
            <div className="space-y-2">
              {['Office Supplies', 'IT Equipment', 'Software Licenses', 'Professional Services'].map(template => (
                <button
                  key={template}
                  onClick={() => setInput(`I need to procure ${template.toLowerCase()}`)}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Vendors */}
          {suggestedVendors.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-3">Recommended Vendors</h3>
              <div className="space-y-2">
                {suggestedVendors.slice(0, 3).map(vendor => (
                  <div key={vendor.vendor_id} className="p-2 bg-gray-50 rounded">
                    <p className="font-medium text-sm">{vendor.vendor_name}</p>
                    <p className="text-xs text-gray-500">Score: {vendor.performance_score}</p>
                  </div>
                ))}
              </div>
              {rfqReady && (
                <button className="btn-primary w-full mt-3">Generate RFQ</button>
              )}
            </div>
          )}

          {/* Process Steps */}
          <div className="card">
            <h3 className="font-semibold mb-3">Procurement Steps</h3>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Gather Requirements', status: 'in-progress' },
                { step: 2, label: 'Identify Vendors', status: 'pending' },
                { step: 3, label: 'Generate RFQ', status: 'pending' },
                { step: 4, label: 'Collect Bids', status: 'pending' },
                { step: 5, label: 'Award & PO', status: 'pending' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${item.status === 'completed' ? 'bg-green-500 text-white' :
                      item.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {item.step}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use Case 3: Analytics View
function AnalyticsView() {
  const [spendData, setSpendData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [trendCategoryFilter, setTrendCategoryFilter] = useState<string>('all');

  // Category filter options for the trend chart
  const trendCategoryOptions = [
    { value: 'all', label: 'All Categories', color: '#2874f0' },
    { value: 'logistics', label: 'Logistics & Supply Chain', color: '#2874f0' },
    { value: 'technology', label: 'Technology', color: '#6366f1' },
    { value: 'services', label: 'Services', color: '#22c55e' },
    { value: 'marketing', label: 'Marketing', color: '#f59e0b' },
    { value: 'facilities', label: 'Facilities', color: '#8b5cf6' },
    { value: 'outsourcing', label: 'Outsourcing', color: '#ec4899' },
  ];

  // Get filtered trend data based on selected category
  const getFilteredTrendData = () => {
    if (trendCategoryFilter === 'all') {
      return mockMonthlyTrendDetailed.map(d => ({ month: d.month, amount: d.total }));
    }
    return mockMonthlyTrendDetailed.map(d => ({
      month: d.month,
      amount: d[trendCategoryFilter as keyof typeof d] as number
    }));
  };

  const filteredTrendData = getFilteredTrendData();
  const currentTrendColor = trendCategoryOptions.find(opt => opt.value === trendCategoryFilter)?.color || '#2874f0';

  // Mock transactions data by subcategory
  const subcategoryTransactions: Record<string, Array<{
    id: string;
    vendor: string;
    category: string;
    contract: string;
    spend: number;
    date: string;
    status: string;
  }>> = {
    'HR Services': [
      { id: 'TXN-HR-001', vendor: 'TeamLease Services', category: 'Staffing', contract: 'TLS-2024-001', spend: 2850000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-HR-002', vendor: 'ABC Consultants', category: 'Recruitment', contract: 'ABC-2024-003', spend: 1200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-HR-003', vendor: 'Quess Corp', category: 'Temp Staffing', contract: 'QC-2024-007', spend: 1850000, date: '2025-01-10', status: 'Processing' },
      { id: 'TXN-HR-004', vendor: 'Randstad India', category: 'Executive Search', contract: 'RI-2024-002', spend: 950000, date: '2025-01-08', status: 'Paid' },
      { id: 'TXN-HR-005', vendor: 'ManpowerGroup', category: 'Contract Staffing', contract: 'MG-2024-011', spend: 1650000, date: '2025-01-05', status: 'Paid' },
    ],
    'Professional Services': [
      { id: 'TXN-PS-001', vendor: 'Deloitte India', category: 'Consulting', contract: 'DEL-2024-005', spend: 4500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-PS-002', vendor: 'KPMG India', category: 'Audit Services', contract: 'KPMG-2024-002', spend: 2200000, date: '2025-01-11', status: 'Processing' },
      { id: 'TXN-PS-003', vendor: 'EY India', category: 'Tax Advisory', contract: 'EY-2024-008', spend: 1800000, date: '2025-01-09', status: 'Paid' },
      { id: 'TXN-PS-004', vendor: 'PwC India', category: 'Risk Advisory', contract: 'PWC-2024-003', spend: 1350000, date: '2025-01-07', status: 'Paid' },
    ],
    'Corporate Services': [
      { id: 'TXN-CS-001', vendor: 'ISS Facility Services', category: 'Facility Mgmt', contract: 'ISS-2024-001', spend: 1950000, date: '2025-01-13', status: 'Paid' },
      { id: 'TXN-CS-002', vendor: 'Sodexo India', category: 'Food Services', contract: 'SOD-2024-004', spend: 1250000, date: '2025-01-10', status: 'Processing' },
      { id: 'TXN-CS-003', vendor: 'JLL India', category: 'Property Mgmt', contract: 'JLL-2024-006', spend: 2100000, date: '2025-01-08', status: 'Paid' },
      { id: 'TXN-CS-004', vendor: 'CBRE India', category: 'Real Estate', contract: 'CBRE-2024-002', spend: 1500000, date: '2025-01-06', status: 'Paid' },
    ],
    'Logistics & Transportation': [
      { id: 'TXN-LT-001', vendor: 'Blue Dart Express', category: 'Express Delivery', contract: 'BD-2024-001', spend: 8500000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-LT-002', vendor: 'Delhivery Ltd', category: 'Last Mile', contract: 'DEL-2024-012', spend: 12500000, date: '2025-01-14', status: 'Processing' },
      { id: 'TXN-LT-003', vendor: 'Ecom Express', category: 'E-commerce Logistics', contract: 'ECM-2024-005', spend: 6800000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-LT-004', vendor: 'XpressBees', category: 'Hyperlocal', contract: 'XB-2024-003', spend: 4200000, date: '2025-01-10', status: 'Paid' },
    ],
    'Packaging Supplies': [
      { id: 'TXN-PK-001', vendor: 'Uflex Limited', category: 'Flexible Packaging', contract: 'UFL-2024-002', spend: 3200000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-PK-002', vendor: 'Essel Propack', category: 'Laminated Tubes', contract: 'EP-2024-001', spend: 1800000, date: '2025-01-11', status: 'Paid' },
      { id: 'TXN-PK-003', vendor: 'Huhtamaki PPL', category: 'Rigid Packaging', contract: 'HPP-2024-004', spend: 2500000, date: '2025-01-09', status: 'Processing' },
    ],
    'Supply Chain Operations': [
      { id: 'TXN-SC-001', vendor: 'DHL Supply Chain', category: 'Warehousing', contract: 'DHL-2024-001', spend: 4500000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-SC-002', vendor: 'FM Logistic', category: '3PL Services', contract: 'FML-2024-003', spend: 3200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-SC-003', vendor: 'Mahindra Logistics', category: 'Distribution', contract: 'ML-2024-007', spend: 2700000, date: '2025-01-10', status: 'Processing' },
    ],
    'IT Hardware & Peripherals': [
      { id: 'TXN-IT-001', vendor: 'Dell Technologies', category: 'Servers', contract: 'DELL-2024-001', spend: 8500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-IT-002', vendor: 'HP India', category: 'Laptops & PCs', contract: 'HP-2024-005', spend: 4200000, date: '2025-01-11', status: 'Paid' },
      { id: 'TXN-IT-003', vendor: 'Lenovo India', category: 'Workstations', contract: 'LEN-2024-002', spend: 2800000, date: '2025-01-09', status: 'Processing' },
    ],
    'Software & SaaS Licenses': [
      { id: 'TXN-SW-001', vendor: 'Microsoft India', category: 'Cloud Services', contract: 'MS-2024-001', spend: 12500000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-SW-002', vendor: 'Salesforce India', category: 'CRM', contract: 'SF-2024-003', spend: 4800000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-SW-003', vendor: 'SAP India', category: 'ERP Licenses', contract: 'SAP-2024-002', spend: 6500000, date: '2025-01-10', status: 'Processing' },
    ],
    'Media Buys': [
      { id: 'TXN-MB-001', vendor: 'Google India', category: 'Digital Ads', contract: 'GOOG-2024-001', spend: 15000000, date: '2025-01-15', status: 'Paid' },
      { id: 'TXN-MB-002', vendor: 'Meta India', category: 'Social Media Ads', contract: 'META-2024-002', spend: 8500000, date: '2025-01-13', status: 'Processing' },
      { id: 'TXN-MB-003', vendor: 'Times Internet', category: 'Display Ads', contract: 'TIL-2024-004', spend: 3200000, date: '2025-01-10', status: 'Paid' },
    ],
    'Agency Fees': [
      { id: 'TXN-AF-001', vendor: 'Ogilvy India', category: 'Creative Agency', contract: 'OGV-2024-001', spend: 2500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-AF-002', vendor: 'Dentsu India', category: 'Media Planning', contract: 'DEN-2024-003', spend: 1800000, date: '2025-01-11', status: 'Paid' },
    ],
    'Production Costs': [
      { id: 'TXN-PC-001', vendor: 'Prime Focus', category: 'Video Production', contract: 'PF-2024-001', spend: 1200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-PC-002', vendor: 'Famous Studios', category: 'Ad Films', contract: 'FS-2024-002', spend: 850000, date: '2025-01-09', status: 'Processing' },
    ],
    'Civil Works & Infra': [
      { id: 'TXN-CW-001', vendor: 'L&T Construction', category: 'Civil Works', contract: 'LT-2024-001', spend: 5500000, date: '2025-01-14', status: 'Processing' },
      { id: 'TXN-CW-002', vendor: 'Shapoorji Pallonji', category: 'Infrastructure', contract: 'SP-2024-002', spend: 3200000, date: '2025-01-10', status: 'Paid' },
    ],
    'Racking & Warehouse': [
      { id: 'TXN-RW-001', vendor: 'Godrej Storage', category: 'Racking Systems', contract: 'GS-2024-001', spend: 2800000, date: '2025-01-13', status: 'Paid' },
      { id: 'TXN-RW-002', vendor: 'Jungheinrich India', category: 'Material Handling', contract: 'JH-2024-003', spend: 2100000, date: '2025-01-09', status: 'Paid' },
    ],
    'Automation': [
      { id: 'TXN-AU-001', vendor: 'Addverb Technologies', category: 'Warehouse Automation', contract: 'ADD-2024-001', spend: 4500000, date: '2025-01-15', status: 'Processing' },
      { id: 'TXN-AU-002', vendor: 'GreyOrange', category: 'Robotics', contract: 'GO-2024-002', spend: 3200000, date: '2025-01-11', status: 'Paid' },
    ],
    'Customer Experience': [
      { id: 'TXN-CX-001', vendor: 'Concentrix India', category: 'Customer Support', contract: 'CON-2024-001', spend: 4500000, date: '2025-01-14', status: 'Paid' },
      { id: 'TXN-CX-002', vendor: 'Teleperformance', category: 'Call Center', contract: 'TP-2024-003', spend: 3200000, date: '2025-01-11', status: 'Processing' },
    ],
    'Seller Support': [
      { id: 'TXN-SS-001', vendor: 'Wipro BPS', category: 'Seller Onboarding', contract: 'WIP-2024-001', spend: 1850000, date: '2025-01-13', status: 'Paid' },
      { id: 'TXN-SS-002', vendor: 'Infosys BPM', category: 'Seller Services', contract: 'INF-2024-002', spend: 1350000, date: '2025-01-10', status: 'Paid' },
    ],
    'Other Services': [
      { id: 'TXN-OS-001', vendor: 'TCS BPS', category: 'Back Office', contract: 'TCS-2024-001', spend: 1200000, date: '2025-01-12', status: 'Paid' },
      { id: 'TXN-OS-002', vendor: 'HCL BServ', category: 'Data Processing', contract: 'HCL-2024-003', spend: 800000, date: '2025-01-08', status: 'Processing' },
    ],
  };

  useEffect(() => {
    fetchSpendData();
    fetchRiskData();
  }, []);

  const fetchSpendData = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/spend/overview`);
      const data = await res.json();
      setSpendData(data);
    } catch {
      setSpendData(mockSpendData);
    }
  };

  const fetchRiskData = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/suppliers/risk`);
      const data = await res.json();
      setRiskData(data);
    } catch {
      setRiskData(mockRiskData);
    }
  };

  const COLORS = ['#2874f0', '#388e3c', '#ff9f00', '#ff6161', '#9c27b0', '#00bcd4'];

  return (
    <div className="p-5 bg-[#f1f3f6] min-h-full">
      {/* Flipkart-style Header */}
      <div className="mb-6 rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="h-1 bg-gradient-to-r from-[#ffe500] via-[#ff9f00] to-[#ff6161]"></div>
        <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5dc8] p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-medium">Procurement Insights & Analytics</h2>
                <span className="px-2 py-0.5 bg-[#ffe500] text-[#212121] text-xs font-medium rounded-sm">AI POWERED</span>
              </div>
              <p className="text-blue-100 text-sm">Spend analytics and decision support</p>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 rounded-sm bg-white/10 border border-white/20 text-white text-sm focus:outline-none">
                <option className="text-[#212121]">FY 2024-25</option>
                <option className="text-[#212121]">FY 2023-24</option>
              </select>
              <button className="px-4 py-2 bg-[#ffe500] text-[#212121] text-sm font-medium rounded-sm hover:bg-[#ffd700] transition-colors flex items-center gap-2">
                <Download size={16} />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards - Flipkart Style */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <FKStatCard
          title="Total Spend"
          value={formatCurrency(spendData?.total_spend || 1500000000)}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
          color="#2874f0"
        />
        <FKStatCard
          title="Active Suppliers"
          value={riskData?.summary?.total_suppliers || 248}
          icon={Users}
          trend="+18"
          trendUp={true}
          color="#ff9f00"
        />
        <FKStatCard
          title="High Risk Suppliers"
          value={riskData?.summary?.high_risk_count || 12}
          icon={AlertTriangle}
          trend="-3"
          trendUp={false}
          color="#ff6161"
        />
        <FKStatCard
          title="Compliance Rate"
          value="94.5%"
          icon={CheckCircle}
          trend="+1.2%"
          trendUp={true}
          color="#388e3c"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Spend by Category */}
        <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
          <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
              <DollarSign className="text-white" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-[#212121] text-sm">Spend by Category</h3>
              <p className="text-xs text-[#878787]">Click to drill down</p>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={spendData?.spend_by_category || mockSpendByCategory}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={{ stroke: '#878787', strokeWidth: 1 }}
                  onClick={(data) => setSelectedCategory(data.category)}
                  style={{ cursor: 'pointer' }}
                >
                  {(spendData?.spend_by_category || mockSpendByCategory).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    fontSize: '10px',
                    paddingTop: '15px',
                    lineHeight: '18px'
                  }}
                  iconSize={8}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
          <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                <TrendingUp className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-[#212121] text-sm">Monthly Spend Trend</h3>
                <p className="text-xs text-[#878787]">Jan 2024 - Dec 2025 (24 months)</p>
              </div>
            </div>
            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#878787]">Filter:</span>
              <select
                value={trendCategoryFilter}
                onChange={(e) => setTrendCategoryFilter(e.target.value)}
                className="text-sm border border-[#e0e0e0] rounded-sm px-3 py-1.5 bg-white text-[#212121] focus:outline-none focus:border-[#2874f0] cursor-pointer"
              >
                {trendCategoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={trendCategoryFilter === 'all' ? 340 : 280}>
              {trendCategoryFilter === 'all' ? (
                <AreaChart data={mockMonthlyTrendDetailed} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#878787' }} interval={1} />
                  <YAxis tickFormatter={(value) => `₹${(value/10000000).toFixed(0)}Cr`} tick={{ fontSize: 11, fill: '#878787' }} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="square"
                    iconSize={10}
                  />
                  <Area type="monotone" dataKey="logistics" stackId="1" stroke="#2874f0" fill="#2874f0" fillOpacity={0.8} name="logistics" />
                  <Area type="monotone" dataKey="technology" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.8} name="technology" />
                  <Area type="monotone" dataKey="services" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} name="services" />
                  <Area type="monotone" dataKey="marketing" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="marketing" />
                  <Area type="monotone" dataKey="facilities" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} name="facilities" />
                  <Area type="monotone" dataKey="outsourcing" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.8} name="outsourcing" />
                </AreaChart>
              ) : (
                <AreaChart data={filteredTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#878787' }} interval={1} />
                  <YAxis tickFormatter={(value) => `₹${(value/10000000).toFixed(0)}Cr`} tick={{ fontSize: 11, fill: '#878787' }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => `Month: ${label}`} />
                  <Area type="monotone" dataKey="amount" stroke={currentTrendColor} fill={currentTrendColor} fillOpacity={0.3} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown Detail */}
      <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#ff9f00] rounded-sm flex items-center justify-center">
              <BarChart3 className="text-white" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-[#212121] text-sm">Category Breakdown</h3>
              <p className="text-xs text-[#878787]">Detailed subcategory analysis</p>
            </div>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-3 py-1.5 text-xs text-[#2874f0] font-medium hover:bg-[#e8f0fe] rounded-sm transition-colors"
            >
              Show All Categories
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(categoryBreakdown)
              .filter(([name]) => !selectedCategory || name === selectedCategory)
              .map(([name, data]) => (
              <div
                key={name}
                className="p-4 bg-[#f1f3f6] rounded-sm hover:shadow-md transition-all cursor-pointer border-l-4"
                style={{ borderLeftColor: data.color }}
                onClick={() => setSelectedCategory(name)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></div>
                  <h4 className="font-medium text-[#212121] text-sm">{name}</h4>
                </div>
                <div className="space-y-2">
                  {data.subcategories.map((sub) => (
                    <div
                      key={sub.name}
                      className="flex items-center justify-between text-xs p-1.5 -mx-1.5 rounded hover:bg-white cursor-pointer group transition-all"
                      onClick={(e) => { e.stopPropagation(); setSelectedSubcategory(sub.name); }}
                    >
                      <span className="text-[#878787] truncate flex-1 group-hover:text-[#2874f0]">{sub.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="w-12 bg-[#e0e0e0] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${sub.percentage}%`, backgroundColor: data.color }}
                          ></div>
                        </div>
                        <span className="text-[#212121] font-medium w-16 text-right">{formatCurrency(sub.amount)}</span>
                        <ChevronRight className="text-[#878787] opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#e0e0e0] flex justify-between text-xs">
                  <span className="text-[#878787]">Total</span>
                  <span className="font-medium" style={{ color: data.color }}>
                    {formatCurrency(data.subcategories.reduce((acc, s) => acc + s.amount, 0))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subcategory Transactions Modal */}
      {selectedSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSubcategory(null)}>
          <div className="bg-white rounded-sm w-full max-w-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{selectedSubcategory}</h3>
                <p className="text-blue-200 text-xs mt-0.5">Transaction Details</p>
              </div>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>

            {/* Modal Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Summary */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#878787]">
                  {subcategoryTransactions[selectedSubcategory]?.length || 0} Transactions
                </span>
                <span className="text-lg font-medium text-[#2874f0]">
                  {formatCurrency(subcategoryTransactions[selectedSubcategory]?.reduce((acc, t) => acc + t.spend, 0) || 0)}
                </span>
              </div>

              {/* Transactions List */}
              <div className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f1f3f6]">
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787] uppercase">Vendor</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787] uppercase">Category</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787] uppercase">Contract</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787] uppercase">Spend</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {subcategoryTransactions[selectedSubcategory]?.map((txn, idx) => (
                      <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="text-sm font-medium text-[#212121]">{txn.vendor}</div>
                          <div className="text-[10px] text-[#878787]">{txn.id}</div>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-[#212121]">{txn.category}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-xs font-mono bg-[#f1f3f6] px-1.5 py-0.5 rounded text-[#2874f0]">
                            {txn.contract}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-sm font-medium text-right text-[#2874f0]">
                          {formatCurrency(txn.spend)}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            txn.status === 'Paid'
                              ? 'bg-[#e8f5e9] text-[#388e3c]'
                              : 'bg-[#fff3e0] text-[#ff9f00]'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-[#e0e0e0] flex justify-between items-center">
                <span className="text-xs text-[#878787]">Data as of Jan 2025</span>
                <button
                  className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  onClick={() => setSelectedSubcategory(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Risk Matrix */}
      <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
          <div className="w-9 h-9 bg-[#ff6161] rounded-sm flex items-center justify-center">
            <AlertTriangle className="text-white" size={18} />
          </div>
          <div>
            <h3 className="font-medium text-[#212121] text-sm">Supplier Risk Analysis</h3>
            <p className="text-xs text-[#878787]">Risk distribution across suppliers</p>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#ffebee] rounded-sm border-l-4 border-[#ff6161]">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-[#ff6161]" size={18} />
                <span className="font-medium text-[#c62828] text-sm">High Risk</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{riskData?.summary?.high_risk_count || 12}</p>
              <p className="text-xs text-[#878787] mt-1">suppliers require attention</p>
            </div>
            <div className="p-4 bg-[#fff3e0] rounded-sm border-l-4 border-[#ff9f00]">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-[#ff9f00]" size={18} />
                <span className="font-medium text-[#e65100] text-sm">Medium Risk</span>
              </div>
              <p className="text-2xl font-medium text-[#ff9f00]">{riskData?.summary?.medium_risk_count || 45}</p>
              <p className="text-xs text-[#878787] mt-1">suppliers to monitor</p>
            </div>
            <div className="p-4 bg-[#e8f5e9] rounded-sm border-l-4 border-[#388e3c]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#388e3c]" size={18} />
                <span className="font-medium text-[#2e7d32] text-sm">Low Risk</span>
              </div>
              <p className="text-2xl font-medium text-[#388e3c]">{riskData?.summary?.low_risk_count || 191}</p>
              <p className="text-xs text-[#878787] mt-1">suppliers performing well</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
            <Users className="text-white" size={18} />
          </div>
          <div>
            <h3 className="font-medium text-[#212121] text-sm">Top Vendors by Spend</h3>
            <p className="text-xs text-[#878787]">FY 2024-25 spend ranking</p>
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData?.top_vendors?.slice(0, 8) || mockTopVendors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tickFormatter={(value) => `₹${(value/10000000).toFixed(0)}Cr`} tick={{ fontSize: 11, fill: '#878787' }} />
              <YAxis type="category" dataKey="vendor_name" width={140} tick={{ fontSize: 11, fill: '#212121' }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#2874f0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Mock data for Rate Card Adherence
const mockRateCards: RateCardEntry[] = [
  { id: 'RC001', vendor: 'Delhivery Logistics', route: 'BLR-MUM', origin: 'Bengaluru', destination: 'Mumbai', vehicleType: '32ft Container', contractedRatePerKm: 42, effectiveFrom: '2024-04-01', effectiveTo: '2025-03-31' },
  { id: 'RC002', vendor: 'Delhivery Logistics', route: 'DEL-BLR', origin: 'Delhi', destination: 'Bengaluru', vehicleType: '32ft Container', contractedRatePerKm: 45, effectiveFrom: '2024-04-01', effectiveTo: '2025-03-31' },
  { id: 'RC003', vendor: 'Ecom Express', route: 'MUM-HYD', origin: 'Mumbai', destination: 'Hyderabad', vehicleType: '24ft Container', contractedRatePerKm: 38, effectiveFrom: '2024-04-01', effectiveTo: '2025-03-31' },
  { id: 'RC004', vendor: 'Ecom Express', route: 'CHN-BLR', origin: 'Chennai', destination: 'Bengaluru', vehicleType: '20ft Container', contractedRatePerKm: 35, effectiveFrom: '2024-04-01', effectiveTo: '2025-03-31' },
  { id: 'RC005', vendor: 'XpressBees', route: 'KOL-DEL', origin: 'Kolkata', destination: 'Delhi', vehicleType: '32ft Container', contractedRatePerKm: 48, effectiveFrom: '2024-04-01', effectiveTo: '2025-03-31' },
];

const mockLogisticsInvoices: LogisticsInvoice[] = [
  { invoiceId: 'INV-LOG-2024-001245', tripSheetId: 'TS-2024-8745', vendor: 'Delhivery Logistics', invoiceDate: '2024-01-28', origin: 'Bengaluru', destination: 'Mumbai', vehicleType: '32ft Container', vehicleNumber: 'KA01AB1234', tripSheetKms: 985, contractedRatePerKm: 42, expectedCost: 41370, invoicedAmount: 48500, discrepancy: 7130, discrepancyPercent: 17.2, status: 'flagged', rateCardRef: 'RC001' },
  { invoiceId: 'INV-LOG-2024-001246', tripSheetId: 'TS-2024-8746', vendor: 'Delhivery Logistics', invoiceDate: '2024-01-28', origin: 'Delhi', destination: 'Bengaluru', vehicleType: '32ft Container', vehicleNumber: 'DL02CD5678', tripSheetKms: 2150, contractedRatePerKm: 45, expectedCost: 96750, invoicedAmount: 98200, discrepancy: 1450, discrepancyPercent: 1.5, status: 'minor_variance', rateCardRef: 'RC002' },
  { invoiceId: 'INV-LOG-2024-001247', tripSheetId: 'TS-2024-8747', vendor: 'Ecom Express', invoiceDate: '2024-01-27', origin: 'Mumbai', destination: 'Hyderabad', vehicleType: '24ft Container', vehicleNumber: 'MH04EF9012', tripSheetKms: 712, contractedRatePerKm: 38, expectedCost: 27056, invoicedAmount: 27000, discrepancy: -56, discrepancyPercent: -0.2, status: 'compliant', rateCardRef: 'RC003' },
  { invoiceId: 'INV-LOG-2024-001248', tripSheetId: 'TS-2024-8748', vendor: 'Ecom Express', invoiceDate: '2024-01-27', origin: 'Chennai', destination: 'Bengaluru', vehicleType: '20ft Container', vehicleNumber: 'TN05GH3456', tripSheetKms: 346, contractedRatePerKm: 35, expectedCost: 12110, invoicedAmount: 14500, discrepancy: 2390, discrepancyPercent: 19.7, status: 'flagged', rateCardRef: 'RC004' },
  { invoiceId: 'INV-LOG-2024-001249', tripSheetId: 'TS-2024-8749', vendor: 'XpressBees', invoiceDate: '2024-01-26', origin: 'Kolkata', destination: 'Delhi', vehicleType: '32ft Container', vehicleNumber: 'WB06IJ7890', tripSheetKms: 1530, contractedRatePerKm: 48, expectedCost: 73440, invoicedAmount: 73500, discrepancy: 60, discrepancyPercent: 0.08, status: 'compliant', rateCardRef: 'RC005' },
  { invoiceId: 'INV-LOG-2024-001250', tripSheetId: 'TS-2024-8750', vendor: 'Delhivery Logistics', invoiceDate: '2024-01-26', origin: 'Bengaluru', destination: 'Mumbai', vehicleType: '32ft Container', vehicleNumber: 'KA01KL2345', tripSheetKms: 992, contractedRatePerKm: 42, expectedCost: 41664, invoicedAmount: 52000, discrepancy: 10336, discrepancyPercent: 24.8, status: 'flagged', rateCardRef: 'RC001' },
  { invoiceId: 'INV-LOG-2024-001251', tripSheetId: 'TS-2024-8751', vendor: 'Ecom Express', invoiceDate: '2024-01-25', origin: 'Mumbai', destination: 'Hyderabad', vehicleType: '24ft Container', vehicleNumber: 'MH04MN6789', tripSheetKms: 705, contractedRatePerKm: 38, expectedCost: 26790, invoicedAmount: 26800, discrepancy: 10, discrepancyPercent: 0.04, status: 'compliant', rateCardRef: 'RC003' },
  { invoiceId: 'INV-LOG-2024-001252', tripSheetId: 'TS-2024-8752', vendor: 'Delhivery Logistics', invoiceDate: '2024-01-25', origin: 'Delhi', destination: 'Bengaluru', vehicleType: '32ft Container', vehicleNumber: 'DL02OP1234', tripSheetKms: 2180, contractedRatePerKm: 45, expectedCost: 98100, invoicedAmount: 115000, discrepancy: 16900, discrepancyPercent: 17.2, status: 'flagged', rateCardRef: 'RC002' },
];

// Mock data for SaaS License Compliance
const mockSaaSContracts: SaaSContract[] = [
  { id: 'SC001', vendor: 'Google Cloud India', productName: 'Google Workspace Business Plus', licenseType: 'per_user', contractedLicenses: 2500, unitPrice: 1188, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0245', contractRef: 'SIMP-GCP-2024-001' },
  { id: 'SC002', vendor: 'Microsoft India Pvt Ltd', productName: 'Microsoft 365 E5', licenseType: 'per_user', contractedLicenses: 1800, unitPrice: 3150, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0312', contractRef: 'SIMP-MSFT-2024-001' },
  { id: 'SC003', vendor: 'Salesforce India Pvt Ltd', productName: 'Sales Cloud Enterprise', licenseType: 'per_user', contractedLicenses: 450, unitPrice: 13500, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0156', contractRef: 'SIMP-SFDC-2024-001' },
  { id: 'SC004', vendor: 'Atlassian Pty Ltd', productName: 'Jira Software Premium', licenseType: 'per_user', contractedLicenses: 850, unitPrice: 695, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0089', contractRef: 'SIMP-ATLS-2024-001' },
  { id: 'SC005', vendor: 'Zoom Video Communications', productName: 'Zoom Enterprise', licenseType: 'per_user', contractedLicenses: 600, unitPrice: 1650, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0178', contractRef: 'SIMP-ZOOM-2024-001' },
  { id: 'SC006', vendor: 'Amazon Web Services India', productName: 'AWS Enterprise Support', licenseType: 'enterprise', contractedLicenses: 1, unitPrice: 1250000, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0421', contractRef: 'SIMP-AWS-2024-001' },
  { id: 'SC007', vendor: 'ServiceNow India', productName: 'ITSM Professional', licenseType: 'per_user', contractedLicenses: 320, unitPrice: 8500, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0534', contractRef: 'SIMP-SNOW-2024-001' },
  { id: 'SC008', vendor: 'Adobe Systems India', productName: 'Adobe Creative Cloud', licenseType: 'per_user', contractedLicenses: 180, unitPrice: 4200, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0267', contractRef: 'SIMP-ADBE-2024-001' },
  { id: 'SC009', vendor: 'Freshworks Inc', productName: 'Freshdesk Enterprise', licenseType: 'per_user', contractedLicenses: 500, unitPrice: 1850, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0389', contractRef: 'SIMP-FRSH-2024-001' },
  { id: 'SC010', vendor: 'Slack Technologies', productName: 'Slack Enterprise Grid', licenseType: 'per_user', contractedLicenses: 2200, unitPrice: 1100, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0445', contractRef: 'SIMP-SLCK-2024-001' },
  { id: 'SC011', vendor: 'Oracle India Pvt Ltd', productName: 'Oracle Fusion ERP Cloud', licenseType: 'enterprise', contractedLicenses: 1, unitPrice: 4500000, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0612', contractRef: 'SIMP-ORCL-2024-001' },
  { id: 'SC012', vendor: 'Datadog Inc', productName: 'Datadog Infrastructure Pro', licenseType: 'per_device', contractedLicenses: 1500, unitPrice: 1250, billingCycle: 'monthly', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-IT-2024-0578', contractRef: 'SIMP-DDOG-2024-001' },
];

const mockSaaSInvoices: SaaSInvoice[] = [
  // January 2024 Invoices
  { invoiceId: 'INV-SAAS-2024-0891', vendor: 'Google Cloud India', productName: 'Google Workspace Business Plus', invoiceDate: '2024-01-28', billingPeriod: 'Jan 2024', licensesInPO: 2500, licensesInContract: 2500, licensesBilled: 2650, unitPrice: 1188, expectedAmount: 2970000, invoicedAmount: 3149220, licenseDiff: 150, amountDiff: 179220, status: 'flagged', poRef: 'PO-IT-2024-0245', contractRef: 'SIMP-GCP-2024-001', utilizationPercent: 94 },
  { invoiceId: 'INV-SAAS-2024-0892', vendor: 'Microsoft India Pvt Ltd', productName: 'Microsoft 365 E5', invoiceDate: '2024-01-28', billingPeriod: 'Jan 2024', licensesInPO: 1800, licensesInContract: 1800, licensesBilled: 1920, unitPrice: 3150, expectedAmount: 5670000, invoicedAmount: 6048000, licenseDiff: 120, amountDiff: 378000, status: 'flagged', poRef: 'PO-IT-2024-0312', contractRef: 'SIMP-MSFT-2024-001', utilizationPercent: 89 },
  { invoiceId: 'INV-SAAS-2024-0893', vendor: 'Salesforce India Pvt Ltd', productName: 'Sales Cloud Enterprise', invoiceDate: '2024-01-27', billingPeriod: 'Jan 2024', licensesInPO: 450, licensesInContract: 450, licensesBilled: 450, unitPrice: 13500, expectedAmount: 6075000, invoicedAmount: 6075000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0156', contractRef: 'SIMP-SFDC-2024-001', utilizationPercent: 96 },
  { invoiceId: 'INV-SAAS-2024-0894', vendor: 'Atlassian Pty Ltd', productName: 'Jira Software Premium', invoiceDate: '2024-01-27', billingPeriod: 'Jan 2024', licensesInPO: 850, licensesInContract: 850, licensesBilled: 850, unitPrice: 695, expectedAmount: 590750, invoicedAmount: 590750, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0089', contractRef: 'SIMP-ATLS-2024-001', utilizationPercent: 72 },
  { invoiceId: 'INV-SAAS-2024-0895', vendor: 'Zoom Video Communications', productName: 'Zoom Enterprise', invoiceDate: '2024-01-26', billingPeriod: 'Jan 2024', licensesInPO: 600, licensesInContract: 600, licensesBilled: 680, unitPrice: 1650, expectedAmount: 990000, invoicedAmount: 1122000, licenseDiff: 80, amountDiff: 132000, status: 'over_licensed', poRef: 'PO-IT-2024-0178', contractRef: 'SIMP-ZOOM-2024-001', utilizationPercent: 58 },
  { invoiceId: 'INV-SAAS-2024-0896', vendor: 'Amazon Web Services India', productName: 'AWS Enterprise Support', invoiceDate: '2024-01-26', billingPeriod: 'Jan 2024', licensesInPO: 1, licensesInContract: 1, licensesBilled: 1, unitPrice: 1250000, expectedAmount: 1250000, invoicedAmount: 1250000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0421', contractRef: 'SIMP-AWS-2024-001', utilizationPercent: 100 },
  { invoiceId: 'INV-SAAS-2024-0897', vendor: 'ServiceNow India', productName: 'ITSM Professional', invoiceDate: '2024-01-25', billingPeriod: 'Jan 2024', licensesInPO: 320, licensesInContract: 320, licensesBilled: 320, unitPrice: 8500, expectedAmount: 2720000, invoicedAmount: 2720000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0534', contractRef: 'SIMP-SNOW-2024-001', utilizationPercent: 85 },
  { invoiceId: 'INV-SAAS-2024-0898', vendor: 'Adobe Systems India', productName: 'Adobe Creative Cloud', invoiceDate: '2024-01-25', billingPeriod: 'Jan 2024', licensesInPO: 180, licensesInContract: 180, licensesBilled: 180, unitPrice: 4200, expectedAmount: 756000, invoicedAmount: 756000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0267', contractRef: 'SIMP-ADBE-2024-001', utilizationPercent: 45 },
  { invoiceId: 'INV-SAAS-2024-0899', vendor: 'Freshworks Inc', productName: 'Freshdesk Enterprise', invoiceDate: '2024-01-24', billingPeriod: 'Jan 2024', licensesInPO: 500, licensesInContract: 500, licensesBilled: 540, unitPrice: 1850, expectedAmount: 925000, invoicedAmount: 999000, licenseDiff: 40, amountDiff: 74000, status: 'over_licensed', poRef: 'PO-IT-2024-0389', contractRef: 'SIMP-FRSH-2024-001', utilizationPercent: 82 },
  { invoiceId: 'INV-SAAS-2024-0900', vendor: 'Slack Technologies', productName: 'Slack Enterprise Grid', invoiceDate: '2024-01-24', billingPeriod: 'Jan 2024', licensesInPO: 2200, licensesInContract: 2200, licensesBilled: 2200, unitPrice: 1100, expectedAmount: 2420000, invoicedAmount: 2420000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0445', contractRef: 'SIMP-SLCK-2024-001', utilizationPercent: 91 },
  { invoiceId: 'INV-SAAS-2024-0901', vendor: 'Oracle India Pvt Ltd', productName: 'Oracle Fusion ERP Cloud', invoiceDate: '2024-01-23', billingPeriod: 'Jan 2024', licensesInPO: 1, licensesInContract: 1, licensesBilled: 1, unitPrice: 4500000, expectedAmount: 4500000, invoicedAmount: 4500000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0612', contractRef: 'SIMP-ORCL-2024-001', utilizationPercent: 100 },
  { invoiceId: 'INV-SAAS-2024-0902', vendor: 'Datadog Inc', productName: 'Datadog Infrastructure Pro', invoiceDate: '2024-01-23', billingPeriod: 'Jan 2024', licensesInPO: 1500, licensesInContract: 1500, licensesBilled: 1680, unitPrice: 1250, expectedAmount: 1875000, invoicedAmount: 2100000, licenseDiff: 180, amountDiff: 225000, status: 'flagged', poRef: 'PO-IT-2024-0578', contractRef: 'SIMP-DDOG-2024-001', utilizationPercent: 78 },
  // December 2023 Invoices
  { invoiceId: 'INV-SAAS-2023-0845', vendor: 'Google Cloud India', productName: 'Google Workspace Business Plus', invoiceDate: '2023-12-28', billingPeriod: 'Dec 2023', licensesInPO: 2500, licensesInContract: 2500, licensesBilled: 2550, unitPrice: 1188, expectedAmount: 2970000, invoicedAmount: 3029400, licenseDiff: 50, amountDiff: 59400, status: 'over_licensed', poRef: 'PO-IT-2024-0245', contractRef: 'SIMP-GCP-2024-001', utilizationPercent: 92 },
  { invoiceId: 'INV-SAAS-2023-0846', vendor: 'Microsoft India Pvt Ltd', productName: 'Microsoft 365 E5', invoiceDate: '2023-12-28', billingPeriod: 'Dec 2023', licensesInPO: 1800, licensesInContract: 1800, licensesBilled: 1850, unitPrice: 3150, expectedAmount: 5670000, invoicedAmount: 5827500, licenseDiff: 50, amountDiff: 157500, status: 'over_licensed', poRef: 'PO-IT-2024-0312', contractRef: 'SIMP-MSFT-2024-001', utilizationPercent: 87 },
  { invoiceId: 'INV-SAAS-2023-0847', vendor: 'Atlassian Pty Ltd', productName: 'Jira Software Premium', invoiceDate: '2023-12-27', billingPeriod: 'Dec 2023', licensesInPO: 850, licensesInContract: 850, licensesBilled: 850, unitPrice: 695, expectedAmount: 590750, invoicedAmount: 590750, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0089', contractRef: 'SIMP-ATLS-2024-001', utilizationPercent: 68 },
  { invoiceId: 'INV-SAAS-2023-0848', vendor: 'Adobe Systems India', productName: 'Adobe Creative Cloud', invoiceDate: '2023-12-27', billingPeriod: 'Dec 2023', licensesInPO: 180, licensesInContract: 180, licensesBilled: 180, unitPrice: 4200, expectedAmount: 756000, invoicedAmount: 756000, licenseDiff: 0, amountDiff: 0, status: 'compliant', poRef: 'PO-IT-2024-0267', contractRef: 'SIMP-ADBE-2024-001', utilizationPercent: 42 },
];

// Mock data for HR Recruitment Fee Calculation
const mockRecruitmentContracts: RecruitmentContract[] = [
  { id: 'RC001', vendor: 'TeamLease Services', vendorType: 'agency', feeStructure: [{ salaryMin: 0, salaryMax: 800000, feePercent: 8.33 }, { salaryMin: 800001, salaryMax: 1500000, feePercent: 10 }, { salaryMin: 1500001, salaryMax: 999999999, feePercent: 12 }], replacementPeriod: 90, paymentTerms: 'Net 30', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-HR-2024-0089', contractRef: 'SIMP-TLS-2024-001' },
  { id: 'RC002', vendor: 'ABC Consultants', vendorType: 'consultant', feeStructure: [{ salaryMin: 0, salaryMax: 1200000, feePercent: 10 }, { salaryMin: 1200001, salaryMax: 2500000, feePercent: 12.5 }, { salaryMin: 2500001, salaryMax: 999999999, feePercent: 15 }], replacementPeriod: 60, paymentTerms: 'Net 45', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-HR-2024-0112', contractRef: 'SIMP-ABC-2024-001' },
  { id: 'RC003', vendor: 'Randstad India', vendorType: 'agency', feeStructure: [{ salaryMin: 0, salaryMax: 1000000, feePercent: 8.33 }, { salaryMin: 1000001, salaryMax: 2000000, feePercent: 10 }, { salaryMin: 2000001, salaryMax: 999999999, feePercent: 12 }], replacementPeriod: 90, paymentTerms: 'Net 30', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-HR-2024-0145', contractRef: 'SIMP-RND-2024-001' },
  { id: 'RC004', vendor: 'Michael Page India', vendorType: 'consultant', feeStructure: [{ salaryMin: 0, salaryMax: 2000000, feePercent: 15 }, { salaryMin: 2000001, salaryMax: 5000000, feePercent: 18 }, { salaryMin: 5000001, salaryMax: 999999999, feePercent: 20 }], replacementPeriod: 90, paymentTerms: 'Net 30', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-HR-2024-0178', contractRef: 'SIMP-MPI-2024-001' },
  { id: 'RC005', vendor: 'Naukri Hiring', vendorType: 'platform', feeStructure: [{ salaryMin: 0, salaryMax: 600000, feePercent: 6 }, { salaryMin: 600001, salaryMax: 1200000, feePercent: 7.5 }, { salaryMin: 1200001, salaryMax: 999999999, feePercent: 8.33 }], replacementPeriod: 45, paymentTerms: 'Net 15', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-HR-2024-0201', contractRef: 'SIMP-NKR-2024-001' },
  { id: 'RC006', vendor: 'Korn Ferry India', vendorType: 'consultant', feeStructure: [{ salaryMin: 0, salaryMax: 3000000, feePercent: 20 }, { salaryMin: 3000001, salaryMax: 8000000, feePercent: 22 }, { salaryMin: 8000001, salaryMax: 999999999, feePercent: 25 }], replacementPeriod: 120, paymentTerms: 'Net 45', contractStart: '2024-04-01', contractEnd: '2025-03-31', poNumber: 'PO-HR-2024-0234', contractRef: 'SIMP-KFI-2024-001' },
];

const mockRecruitmentInvoices: RecruitmentInvoice[] = [
  // January 2024 Invoices
  { invoiceId: 'INV-HR-2024-0456', vendor: 'TeamLease Services', invoiceDate: '2024-01-28', candidateName: 'Priya Sharma', position: 'Senior Software Engineer', department: 'Technology', joiningDate: '2024-01-15', candidateCTC: 1800000, contractedFeePercent: 10, expectedFee: 180000, invoicedAmount: 216000, discrepancy: 36000, discrepancyPercent: 20, status: 'flagged', poRef: 'PO-HR-2024-0089', contractRef: 'SIMP-TLS-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0457', vendor: 'ABC Consultants', invoiceDate: '2024-01-27', candidateName: 'Rahul Verma', position: 'Product Manager', department: 'Product', joiningDate: '2024-01-10', candidateCTC: 2800000, contractedFeePercent: 15, expectedFee: 420000, invoicedAmount: 420000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-HR-2024-0112', contractRef: 'SIMP-ABC-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0458', vendor: 'Randstad India', invoiceDate: '2024-01-26', candidateName: 'Ananya Reddy', position: 'Data Analyst', department: 'Analytics', joiningDate: '2024-01-08', candidateCTC: 950000, contractedFeePercent: 8.33, expectedFee: 79135, invoicedAmount: 95000, discrepancy: 15865, discrepancyPercent: 20.05, status: 'overcharged', poRef: 'PO-HR-2024-0145', contractRef: 'SIMP-RND-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0459', vendor: 'Michael Page India', invoiceDate: '2024-01-25', candidateName: 'Vikram Singh', position: 'VP Engineering', department: 'Technology', joiningDate: '2024-01-05', candidateCTC: 6500000, contractedFeePercent: 20, expectedFee: 1300000, invoicedAmount: 1300000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-HR-2024-0178', contractRef: 'SIMP-MPI-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0460', vendor: 'Naukri Hiring', invoiceDate: '2024-01-24', candidateName: 'Sneha Patel', position: 'Customer Support Lead', department: 'Operations', joiningDate: '2024-01-02', candidateCTC: 720000, contractedFeePercent: 7.5, expectedFee: 54000, invoicedAmount: 54000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-HR-2024-0201', contractRef: 'SIMP-NKR-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0461', vendor: 'TeamLease Services', invoiceDate: '2024-01-23', candidateName: 'Amit Kumar', position: 'DevOps Engineer', department: 'Technology', joiningDate: '2024-01-03', candidateCTC: 1400000, contractedFeePercent: 10, expectedFee: 140000, invoicedAmount: 168000, discrepancy: 28000, discrepancyPercent: 20, status: 'flagged', poRef: 'PO-HR-2024-0089', contractRef: 'SIMP-TLS-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0462', vendor: 'Korn Ferry India', invoiceDate: '2024-01-22', candidateName: 'Deepa Menon', position: 'Chief Marketing Officer', department: 'Marketing', joiningDate: '2023-12-28', candidateCTC: 12000000, contractedFeePercent: 25, expectedFee: 3000000, invoicedAmount: 3000000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-HR-2024-0234', contractRef: 'SIMP-KFI-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0463', vendor: 'ABC Consultants', invoiceDate: '2024-01-20', candidateName: 'Sanjay Gupta', position: 'Finance Manager', department: 'Finance', joiningDate: '2023-12-20', candidateCTC: 2200000, contractedFeePercent: 12.5, expectedFee: 275000, invoicedAmount: 330000, discrepancy: 55000, discrepancyPercent: 20, status: 'flagged', poRef: 'PO-HR-2024-0112', contractRef: 'SIMP-ABC-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0464', vendor: 'Randstad India', invoiceDate: '2024-01-18', candidateName: 'Kavitha Nair', position: 'HR Business Partner', department: 'HR', joiningDate: '2023-12-15', candidateCTC: 1600000, contractedFeePercent: 10, expectedFee: 160000, invoicedAmount: 160000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-HR-2024-0145', contractRef: 'SIMP-RND-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2024-0465', vendor: 'Naukri Hiring', invoiceDate: '2024-01-15', candidateName: 'Ravi Krishnan', position: 'Software Developer', department: 'Technology', joiningDate: '2023-12-10', candidateCTC: 850000, contractedFeePercent: 7.5, expectedFee: 63750, invoicedAmount: 72000, discrepancy: 8250, discrepancyPercent: 12.94, status: 'overcharged', poRef: 'PO-HR-2024-0201', contractRef: 'SIMP-NKR-2024-001', salaryVerified: false },
  // December 2023 Invoices
  { invoiceId: 'INV-HR-2023-0398', vendor: 'TeamLease Services', invoiceDate: '2023-12-28', candidateName: 'Meera Iyer', position: 'Quality Analyst', department: 'Technology', joiningDate: '2023-12-05', candidateCTC: 750000, contractedFeePercent: 8.33, expectedFee: 62475, invoicedAmount: 62475, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-HR-2024-0089', contractRef: 'SIMP-TLS-2024-001', salaryVerified: true },
  { invoiceId: 'INV-HR-2023-0399', vendor: 'Michael Page India', invoiceDate: '2023-12-25', candidateName: 'Arjun Mehta', position: 'Director of Sales', department: 'Sales', joiningDate: '2023-12-01', candidateCTC: 4500000, contractedFeePercent: 18, expectedFee: 810000, invoicedAmount: 900000, discrepancy: 90000, discrepancyPercent: 11.11, status: 'overcharged', poRef: 'PO-HR-2024-0178', contractRef: 'SIMP-MPI-2024-001', salaryVerified: true },
];

// Mock data for Marketing Deliverable Mismatch
const mockMarketingSOWs: MarketingSOW[] = [
  {
    id: 'SOW001', vendor: 'WATConsult', projectName: 'Big Billion Days 2024 Campaign', campaignType: 'Integrated Digital',
    deliverables: [
      { id: 'D001', description: 'Social Media Campaigns', category: 'social_media', quantity: 5, unitPrice: 250000, totalValue: 1250000 },
      { id: 'D002', description: 'Video Ad Creatives (30s)', category: 'video', quantity: 8, unitPrice: 150000, totalValue: 1200000 },
      { id: 'D003', description: 'Banner Designs', category: 'design', quantity: 20, unitPrice: 15000, totalValue: 300000 },
      { id: 'D004', description: 'Influencer Collaborations', category: 'social_media', quantity: 10, unitPrice: 100000, totalValue: 1000000 },
    ],
    totalValue: 3750000, contractStart: '2024-01-01', contractEnd: '2024-03-31', poNumber: 'PO-MKT-2024-0156', contractRef: 'SIMP-WAT-2024-001'
  },
  {
    id: 'SOW002', vendor: 'Dentsu Webchutney', projectName: 'Brand Awareness Q1', campaignType: 'Brand Building',
    deliverables: [
      { id: 'D005', description: 'TV Commercial Production', category: 'video', quantity: 2, unitPrice: 2500000, totalValue: 5000000 },
      { id: 'D006', description: 'Digital Display Ads', category: 'paid_ads', quantity: 15, unitPrice: 50000, totalValue: 750000 },
      { id: 'D007', description: 'SEO Content Articles', category: 'seo', quantity: 30, unitPrice: 8000, totalValue: 240000 },
    ],
    totalValue: 5990000, contractStart: '2024-01-01', contractEnd: '2024-03-31', poNumber: 'PO-MKT-2024-0189', contractRef: 'SIMP-DWC-2024-001'
  },
  {
    id: 'SOW003', vendor: 'Schbang Digital', projectName: 'App Install Campaign', campaignType: 'Performance Marketing',
    deliverables: [
      { id: 'D008', description: 'Google UAC Campaigns', category: 'paid_ads', quantity: 4, unitPrice: 200000, totalValue: 800000 },
      { id: 'D009', description: 'Facebook/Meta Campaigns', category: 'paid_ads', quantity: 4, unitPrice: 200000, totalValue: 800000 },
      { id: 'D010', description: 'Creative Variations', category: 'design', quantity: 50, unitPrice: 5000, totalValue: 250000 },
    ],
    totalValue: 1850000, contractStart: '2024-01-01', contractEnd: '2024-02-28', poNumber: 'PO-MKT-2024-0201', contractRef: 'SIMP-SCH-2024-001'
  },
  {
    id: 'SOW004', vendor: 'Ogilvy India', projectName: 'Fashion Category Launch', campaignType: 'Product Launch',
    deliverables: [
      { id: 'D011', description: 'Brand Film (60s)', category: 'video', quantity: 1, unitPrice: 3500000, totalValue: 3500000 },
      { id: 'D012', description: 'Social Media Content', category: 'content', quantity: 40, unitPrice: 12000, totalValue: 480000 },
      { id: 'D013', description: 'Print Ads', category: 'design', quantity: 5, unitPrice: 80000, totalValue: 400000 },
      { id: 'D014', description: 'OOH Creative', category: 'design', quantity: 3, unitPrice: 120000, totalValue: 360000 },
    ],
    totalValue: 4740000, contractStart: '2024-01-15', contractEnd: '2024-04-15', poNumber: 'PO-MKT-2024-0234', contractRef: 'SIMP-OGV-2024-001'
  },
  {
    id: 'SOW005', vendor: 'Interactive Avenues', projectName: 'Electronics Sale Push', campaignType: 'Sales Promotion',
    deliverables: [
      { id: 'D015', description: 'Email Campaigns', category: 'content', quantity: 12, unitPrice: 25000, totalValue: 300000 },
      { id: 'D016', description: 'Push Notification Content', category: 'content', quantity: 20, unitPrice: 5000, totalValue: 100000 },
      { id: 'D017', description: 'Landing Page Designs', category: 'design', quantity: 6, unitPrice: 40000, totalValue: 240000 },
    ],
    totalValue: 640000, contractStart: '2024-01-01', contractEnd: '2024-01-31', poNumber: 'PO-MKT-2024-0267', contractRef: 'SIMP-IAV-2024-001'
  },
];

const mockMarketingInvoices: MarketingInvoice[] = [
  {
    invoiceId: 'INV-MKT-2024-0891', vendor: 'WATConsult', invoiceDate: '2024-01-28', projectName: 'Big Billion Days 2024 Campaign', campaignType: 'Integrated Digital',
    lineItems: [
      { deliverableId: 'D001', description: 'Social Media Campaigns', category: 'social_media', quantityInSOW: 5, quantityBilled: 6, unitPrice: 250000, expectedAmount: 1250000, billedAmount: 1500000, variance: 250000, status: 'overbilled' },
      { deliverableId: 'D002', description: 'Video Ad Creatives (30s)', category: 'video', quantityInSOW: 8, quantityBilled: 8, unitPrice: 150000, expectedAmount: 1200000, billedAmount: 1200000, variance: 0, status: 'delivered' },
      { deliverableId: 'D003', description: 'Banner Designs', category: 'design', quantityInSOW: 20, quantityBilled: 20, unitPrice: 15000, expectedAmount: 300000, billedAmount: 300000, variance: 0, status: 'delivered' },
      { deliverableId: 'D004', description: 'Influencer Collaborations', category: 'social_media', quantityInSOW: 10, quantityBilled: 12, unitPrice: 100000, expectedAmount: 1000000, billedAmount: 1200000, variance: 200000, status: 'overbilled' },
    ],
    totalExpected: 3750000, totalInvoiced: 4200000, discrepancy: 450000, discrepancyPercent: 12, status: 'flagged', poRef: 'PO-MKT-2024-0156', contractRef: 'SIMP-WAT-2024-001', deliveryVerified: false
  },
  {
    invoiceId: 'INV-MKT-2024-0892', vendor: 'Dentsu Webchutney', invoiceDate: '2024-01-27', projectName: 'Brand Awareness Q1', campaignType: 'Brand Building',
    lineItems: [
      { deliverableId: 'D005', description: 'TV Commercial Production', category: 'video', quantityInSOW: 2, quantityBilled: 2, unitPrice: 2500000, expectedAmount: 5000000, billedAmount: 5000000, variance: 0, status: 'delivered' },
      { deliverableId: 'D006', description: 'Digital Display Ads', category: 'paid_ads', quantityInSOW: 15, quantityBilled: 15, unitPrice: 50000, expectedAmount: 750000, billedAmount: 750000, variance: 0, status: 'delivered' },
      { deliverableId: 'D007', description: 'SEO Content Articles', category: 'seo', quantityInSOW: 30, quantityBilled: 30, unitPrice: 8000, expectedAmount: 240000, billedAmount: 240000, variance: 0, status: 'delivered' },
    ],
    totalExpected: 5990000, totalInvoiced: 5990000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-MKT-2024-0189', contractRef: 'SIMP-DWC-2024-001', deliveryVerified: true
  },
  {
    invoiceId: 'INV-MKT-2024-0893', vendor: 'Schbang Digital', invoiceDate: '2024-01-26', projectName: 'App Install Campaign', campaignType: 'Performance Marketing',
    lineItems: [
      { deliverableId: 'D008', description: 'Google UAC Campaigns', category: 'paid_ads', quantityInSOW: 4, quantityBilled: 4, unitPrice: 200000, expectedAmount: 800000, billedAmount: 800000, variance: 0, status: 'delivered' },
      { deliverableId: 'D009', description: 'Facebook/Meta Campaigns', category: 'paid_ads', quantityInSOW: 4, quantityBilled: 3, unitPrice: 200000, expectedAmount: 800000, billedAmount: 600000, variance: -200000, status: 'partial' },
      { deliverableId: 'D010', description: 'Creative Variations', category: 'design', quantityInSOW: 50, quantityBilled: 45, unitPrice: 5000, expectedAmount: 250000, billedAmount: 225000, variance: -25000, status: 'partial' },
    ],
    totalExpected: 1850000, totalInvoiced: 1625000, discrepancy: -225000, discrepancyPercent: -12.16, status: 'partial_delivery', poRef: 'PO-MKT-2024-0201', contractRef: 'SIMP-SCH-2024-001', deliveryVerified: true
  },
  {
    invoiceId: 'INV-MKT-2024-0894', vendor: 'Ogilvy India', invoiceDate: '2024-01-25', projectName: 'Fashion Category Launch', campaignType: 'Product Launch',
    lineItems: [
      { deliverableId: 'D011', description: 'Brand Film (60s)', category: 'video', quantityInSOW: 1, quantityBilled: 1, unitPrice: 3500000, expectedAmount: 3500000, billedAmount: 3500000, variance: 0, status: 'delivered' },
      { deliverableId: 'D012', description: 'Social Media Content', category: 'content', quantityInSOW: 40, quantityBilled: 48, unitPrice: 12000, expectedAmount: 480000, billedAmount: 576000, variance: 96000, status: 'overbilled' },
      { deliverableId: 'D013', description: 'Print Ads', category: 'design', quantityInSOW: 5, quantityBilled: 5, unitPrice: 80000, expectedAmount: 400000, billedAmount: 400000, variance: 0, status: 'delivered' },
      { deliverableId: 'D014', description: 'OOH Creative', category: 'design', quantityInSOW: 3, quantityBilled: 3, unitPrice: 120000, expectedAmount: 360000, billedAmount: 360000, variance: 0, status: 'delivered' },
    ],
    totalExpected: 4740000, totalInvoiced: 4836000, discrepancy: 96000, discrepancyPercent: 2.03, status: 'overbilled', poRef: 'PO-MKT-2024-0234', contractRef: 'SIMP-OGV-2024-001', deliveryVerified: true
  },
  {
    invoiceId: 'INV-MKT-2024-0895', vendor: 'Interactive Avenues', invoiceDate: '2024-01-24', projectName: 'Electronics Sale Push', campaignType: 'Sales Promotion',
    lineItems: [
      { deliverableId: 'D015', description: 'Email Campaigns', category: 'content', quantityInSOW: 12, quantityBilled: 12, unitPrice: 25000, expectedAmount: 300000, billedAmount: 300000, variance: 0, status: 'delivered' },
      { deliverableId: 'D016', description: 'Push Notification Content', category: 'content', quantityInSOW: 20, quantityBilled: 20, unitPrice: 5000, expectedAmount: 100000, billedAmount: 100000, variance: 0, status: 'delivered' },
      { deliverableId: 'D017', description: 'Landing Page Designs', category: 'design', quantityInSOW: 6, quantityBilled: 6, unitPrice: 40000, expectedAmount: 240000, billedAmount: 240000, variance: 0, status: 'delivered' },
    ],
    totalExpected: 640000, totalInvoiced: 640000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-MKT-2024-0267', contractRef: 'SIMP-IAV-2024-001', deliveryVerified: true
  },
  {
    invoiceId: 'INV-MKT-2024-0896', vendor: 'WATConsult', invoiceDate: '2024-01-20', projectName: 'Big Billion Days 2024 Campaign', campaignType: 'Integrated Digital',
    lineItems: [
      { deliverableId: 'D001', description: 'Social Media Campaigns (Phase 1)', category: 'social_media', quantityInSOW: 2, quantityBilled: 2, unitPrice: 250000, expectedAmount: 500000, billedAmount: 500000, variance: 0, status: 'delivered' },
      { deliverableId: 'D002', description: 'Video Ad Creatives (30s)', category: 'video', quantityInSOW: 4, quantityBilled: 4, unitPrice: 150000, expectedAmount: 600000, billedAmount: 600000, variance: 0, status: 'delivered' },
    ],
    totalExpected: 1100000, totalInvoiced: 1100000, discrepancy: 0, discrepancyPercent: 0, status: 'compliant', poRef: 'PO-MKT-2024-0156', contractRef: 'SIMP-WAT-2024-001', deliveryVerified: true
  },
  {
    invoiceId: 'INV-MKT-2024-0897', vendor: 'Ogilvy India', invoiceDate: '2024-01-18', projectName: 'Fashion Category Launch', campaignType: 'Product Launch',
    lineItems: [
      { deliverableId: 'D012', description: 'Social Media Content (Phase 1)', category: 'content', quantityInSOW: 20, quantityBilled: 18, unitPrice: 12000, expectedAmount: 240000, billedAmount: 216000, variance: -24000, status: 'partial' },
      { deliverableId: 'D013', description: 'Print Ads (Phase 1)', category: 'design', quantityInSOW: 3, quantityBilled: 3, unitPrice: 80000, expectedAmount: 240000, billedAmount: 240000, variance: 0, status: 'delivered' },
    ],
    totalExpected: 480000, totalInvoiced: 456000, discrepancy: -24000, discrepancyPercent: -5, status: 'partial_delivery', poRef: 'PO-MKT-2024-0234', contractRef: 'SIMP-OGV-2024-001', deliveryVerified: false
  },
];

// Mock data for Infrastructure Price Variance
const mockInfrastructureInvoices: InfrastructureInvoice[] = [
  {
    invoiceId: 'INV-INFRA-2024-0451', vendor: 'ElectroBazaar', vendorType: 'distributor', project: 'Bangalore FC-3 Build', location: 'Bangalore',
    invoiceDate: '2024-01-25',
    items: [
      { itemId: 'INFRA001', itemCode: 'ANCHOR-SW-6A', itemName: 'Anchor Roma 6A Switch', category: 'electrical', quantity: 400, unitPrice: 125, totalAmount: 50000, historicalAvgPrice: 85, variance: 16000, variancePercent: 47.1, status: 'outlier' },
      { itemId: 'INFRA002', itemCode: 'HAVELLS-MCB-32A', itemName: 'Havells MCB 32A SP', category: 'electrical', quantity: 80, unitPrice: 410, totalAmount: 32800, historicalAvgPrice: 385, variance: 2000, variancePercent: 6.5, status: 'normal' },
    ],
    totalAmount: 82800, totalExpected: 64800, totalVariance: 18000, variancePercent: 27.8, status: 'flagged', poRef: 'PO-INFRA-2024-0089', grnVerified: false
  },
  {
    invoiceId: 'INV-INFRA-2024-0452', vendor: 'Anchor Electricals', vendorType: 'manufacturer', project: 'Chennai Warehouse Expansion', location: 'Chennai',
    invoiceDate: '2024-01-24',
    items: [
      { itemId: 'INFRA001', itemCode: 'ANCHOR-SW-6A', itemName: 'Anchor Roma 6A Switch', category: 'electrical', quantity: 600, unitPrice: 82, totalAmount: 49200, historicalAvgPrice: 85, variance: -1800, variancePercent: -3.5, status: 'normal' },
      { itemId: 'INFRA002', itemCode: 'HAVELLS-MCB-32A', itemName: 'Havells MCB 32A SP', category: 'electrical', quantity: 120, unitPrice: 378, totalAmount: 45360, historicalAvgPrice: 385, variance: -840, variancePercent: -1.8, status: 'normal' },
    ],
    totalAmount: 94560, totalExpected: 97200, totalVariance: -2640, variancePercent: -2.7, status: 'compliant', poRef: 'PO-INFRA-2024-0091', grnVerified: true
  },
  {
    invoiceId: 'INV-INFRA-2024-0453', vendor: 'Daikin India', vendorType: 'manufacturer', project: 'Hyderabad DC Phase 2', location: 'Hyderabad',
    invoiceDate: '2024-01-23',
    items: [
      { itemId: 'INFRA004', itemCode: 'AC-SPLIT-1.5T', itemName: 'Split AC 1.5 Ton 5 Star', category: 'hvac', quantity: 25, unitPrice: 48500, totalAmount: 1212500, historicalAvgPrice: 42500, variance: 150000, variancePercent: 14.1, status: 'high' },
    ],
    totalAmount: 1212500, totalExpected: 1062500, totalVariance: 150000, variancePercent: 14.1, status: 'variance', poRef: 'PO-INFRA-2024-0088', grnVerified: true
  },
  {
    invoiceId: 'INV-INFRA-2024-0454', vendor: 'Godrej Interio', vendorType: 'manufacturer', project: 'Mumbai Corporate Office', location: 'Mumbai',
    invoiceDate: '2024-01-22',
    items: [
      { itemId: 'INFRA005', itemCode: 'OFC-CHAIR-ERG', itemName: 'Ergonomic Office Chair', category: 'furniture', quantity: 150, unitPrice: 8650, totalAmount: 1297500, historicalAvgPrice: 8500, variance: 22500, variancePercent: 1.8, status: 'normal' },
    ],
    totalAmount: 1297500, totalExpected: 1275000, totalVariance: 22500, variancePercent: 1.8, status: 'compliant', poRef: 'PO-INFRA-2024-0085', grnVerified: true
  },
  {
    invoiceId: 'INV-INFRA-2024-0455', vendor: 'Supreme Industries', vendorType: 'manufacturer', project: 'Pune FC New Wing', location: 'Pune',
    invoiceDate: '2024-01-21',
    items: [
      { itemId: 'INFRA003', itemCode: 'CPVC-PIPE-1IN', itemName: 'CPVC Pipe 1 inch (per ft)', category: 'plumbing', quantity: 3000, unitPrice: 62, totalAmount: 186000, historicalAvgPrice: 45, variance: 51000, variancePercent: 37.8, status: 'outlier' },
    ],
    totalAmount: 186000, totalExpected: 135000, totalVariance: 51000, variancePercent: 37.8, status: 'flagged', poRef: 'PO-INFRA-2024-0092', grnVerified: false
  },
  {
    invoiceId: 'INV-INFRA-2024-0456', vendor: 'APC India', vendorType: 'manufacturer', project: 'Kolkata DC Setup', location: 'Kolkata',
    invoiceDate: '2024-01-20',
    items: [
      { itemId: 'INFRA008', itemCode: 'SERVER-RACK-42U', itemName: '42U Server Rack', category: 'it_hardware', quantity: 15, unitPrice: 29800, totalAmount: 447000, historicalAvgPrice: 28500, variance: 19500, variancePercent: 4.6, status: 'normal' },
    ],
    totalAmount: 447000, totalExpected: 427500, totalVariance: 19500, variancePercent: 4.6, status: 'compliant', poRef: 'PO-INFRA-2024-0087', grnVerified: true
  },
  {
    invoiceId: 'INV-INFRA-2024-0457', vendor: 'BuildMart India', vendorType: 'distributor', project: 'Delhi Office Renovation', location: 'Delhi',
    invoiceDate: '2024-01-19',
    items: [
      { itemId: 'INFRA007', itemCode: 'CEMENT-OPC-53', itemName: 'OPC 53 Grade Cement (per bag)', category: 'civil', quantity: 200, unitPrice: 455, totalAmount: 91000, historicalAvgPrice: 385, variance: 14000, variancePercent: 18.2, status: 'high' },
      { itemId: 'INFRA006', itemCode: 'FIRE-EXT-ABC', itemName: 'ABC Fire Extinguisher 4kg', category: 'safety', quantity: 25, unitPrice: 2100, totalAmount: 52500, historicalAvgPrice: 1850, variance: 6250, variancePercent: 13.5, status: 'high' },
    ],
    totalAmount: 143500, totalExpected: 123250, totalVariance: 20250, variancePercent: 16.4, status: 'variance', poRef: 'PO-INFRA-2024-0093', grnVerified: false
  },
  {
    invoiceId: 'INV-INFRA-2024-0458', vendor: 'UltraTech', vendorType: 'manufacturer', project: 'Bangalore FC-3 Build', location: 'Bangalore',
    invoiceDate: '2024-01-18',
    items: [
      { itemId: 'INFRA007', itemCode: 'CEMENT-OPC-53', itemName: 'OPC 53 Grade Cement (per bag)', category: 'civil', quantity: 350, unitPrice: 375, totalAmount: 131250, historicalAvgPrice: 385, variance: -3500, variancePercent: -2.6, status: 'normal' },
    ],
    totalAmount: 131250, totalExpected: 134750, totalVariance: -3500, variancePercent: -2.6, status: 'compliant', poRef: 'PO-INFRA-2024-0094', grnVerified: true
  },
  {
    invoiceId: 'INV-INFRA-2024-0459', vendor: 'Minimax India', vendorType: 'distributor', project: 'Chennai Warehouse Expansion', location: 'Chennai',
    invoiceDate: '2024-01-17',
    items: [
      { itemId: 'INFRA006', itemCode: 'FIRE-EXT-ABC', itemName: 'ABC Fire Extinguisher 4kg', category: 'safety', quantity: 50, unitPrice: 1880, totalAmount: 94000, historicalAvgPrice: 1850, variance: 1500, variancePercent: 1.6, status: 'normal' },
    ],
    totalAmount: 94000, totalExpected: 92500, totalVariance: 1500, variancePercent: 1.6, status: 'compliant', poRef: 'PO-INFRA-2024-0095', grnVerified: true
  },
  {
    invoiceId: 'INV-INFRA-2024-0460', vendor: 'PowerTech India', vendorType: 'distributor', project: 'Hyderabad DC Phase 2', location: 'Hyderabad',
    invoiceDate: '2024-01-16',
    items: [
      { itemId: 'INFRA001', itemCode: 'ANCHOR-SW-6A', itemName: 'Anchor Roma 6A Switch', category: 'electrical', quantity: 250, unitPrice: 115, totalAmount: 28750, historicalAvgPrice: 85, variance: 7500, variancePercent: 35.3, status: 'outlier' },
      { itemId: 'INFRA002', itemCode: 'HAVELLS-MCB-32A', itemName: 'Havells MCB 32A SP', category: 'electrical', quantity: 50, unitPrice: 480, totalAmount: 24000, historicalAvgPrice: 385, variance: 4750, variancePercent: 24.7, status: 'high' },
    ],
    totalAmount: 52750, totalExpected: 40500, totalVariance: 12250, variancePercent: 30.2, status: 'flagged', poRef: 'PO-INFRA-2024-0096', grnVerified: false
  },
];

// Mock data for Retroactive Duplicates
const mockDuplicateInvoices: DuplicateInvoice[] = [
  {
    invoiceId: 'DUP-2024-001', vendor: 'Delhivery Logistics', vendorCode: 'VND-DEL-001', invoiceNumber: 'DEL-INV-2023-45678',
    amount: 1250000, originalPaymentDate: '2023-08-15', duplicatePaymentDate: '2024-01-10', daysBetween: 148,
    paymentMethod: 'NEFT', department: 'Logistics', approvedBy: 'Ramesh Kumar',
    status: 'confirmed_duplicate', source: 'Oracle EBS', recoveryStatus: 'in_progress',
    notes: 'Same invoice submitted twice with different PO references'
  },
  {
    invoiceId: 'DUP-2024-002', vendor: 'CloudFirst Technologies', vendorCode: 'VND-CFT-002', invoiceNumber: 'CFT-2023-12890',
    amount: 875000, originalPaymentDate: '2023-09-22', duplicatePaymentDate: '2024-01-05', daysBetween: 105,
    paymentMethod: 'RTGS', department: 'IT Services', approvedBy: 'Priya Sharma',
    status: 'potential_duplicate', source: 'Oracle EBS', recoveryStatus: 'pending',
    notes: 'Invoice amount and vendor match, verifying invoice number format difference'
  },
  {
    invoiceId: 'DUP-2024-003', vendor: 'TeamLease Services', vendorCode: 'VND-TLS-003', invoiceNumber: 'TL-INV-78234',
    amount: 456000, originalPaymentDate: '2023-10-30', duplicatePaymentDate: '2023-12-28', daysBetween: 59,
    paymentMethod: 'NEFT', department: 'HR Services', approvedBy: 'Amit Patel',
    status: 'confirmed_duplicate', source: 'SAP', recoveryStatus: 'recovered',
    notes: 'Duplicate payment processed due to system migration - fully recovered'
  },
  {
    invoiceId: 'DUP-2024-004', vendor: 'Dentsu Media', vendorCode: 'VND-DEN-004', invoiceNumber: 'DEN-MKT-2023-567',
    amount: 2340000, originalPaymentDate: '2023-07-18', duplicatePaymentDate: '2024-01-15', daysBetween: 181,
    paymentMethod: 'RTGS', department: 'Marketing', approvedBy: 'Sneha Reddy',
    status: 'under_review', source: 'Oracle EBS', recoveryStatus: 'pending',
    notes: 'Large amount - requires finance director review'
  },
  {
    invoiceId: 'DUP-2024-005', vendor: 'JLL India', vendorCode: 'VND-JLL-005', invoiceNumber: 'JLL-FAC-2023-8901',
    amount: 678000, originalPaymentDate: '2023-11-05', duplicatePaymentDate: '2024-01-08', daysBetween: 64,
    paymentMethod: 'NEFT', department: 'Facilities', approvedBy: 'Vikram Singh',
    status: 'confirmed_duplicate', source: 'Manual Entry', recoveryStatus: 'in_progress',
    notes: 'Manual entry error - same invoice entered by two different clerks'
  },
  {
    invoiceId: 'DUP-2024-006', vendor: 'Ecom Express', vendorCode: 'VND-ECM-006', invoiceNumber: 'ECM-LOG-2023-34521',
    amount: 1890000, originalPaymentDate: '2023-06-25', duplicatePaymentDate: '2023-12-20', daysBetween: 178,
    paymentMethod: 'RTGS', department: 'Logistics', approvedBy: 'Rajesh Menon',
    status: 'confirmed_duplicate', source: 'Oracle EBS', recoveryStatus: 'pending',
    notes: 'Vendor resubmitted old invoice with minor description change'
  },
  {
    invoiceId: 'DUP-2024-007', vendor: 'Google Cloud India', vendorCode: 'VND-GCP-007', invoiceNumber: 'GCP-2023-INV-45678',
    amount: 3250000, originalPaymentDate: '2023-08-30', duplicatePaymentDate: '2024-01-12', daysBetween: 135,
    paymentMethod: 'Wire Transfer', department: 'IT Infrastructure', approvedBy: 'Ananya Krishnan',
    status: 'potential_duplicate', source: 'Oracle EBS', recoveryStatus: 'pending',
    notes: 'USD to INR conversion difference - verifying if same invoice'
  },
  {
    invoiceId: 'DUP-2024-008', vendor: 'Teleperformance', vendorCode: 'VND-TEL-008', invoiceNumber: 'TP-BPO-2023-7890',
    amount: 567000, originalPaymentDate: '2023-09-15', duplicatePaymentDate: '2023-11-28', daysBetween: 74,
    paymentMethod: 'NEFT', department: 'Customer Support', approvedBy: 'Meera Nair',
    status: 'confirmed_duplicate', source: 'SAP', recoveryStatus: 'recovered',
    notes: 'Duplicate detected by internal audit - fully recovered with interest'
  },
];

// Mock data for Addendum Timing
const mockContractAddendums: ContractAddendum[] = [
  {
    addendumId: 'ADD-2023-001-V1', contractRef: 'SIMP-DEL-2023-001', vendor: 'Delhivery Logistics', version: 1,
    effectiveFrom: '2023-01-01', effectiveTo: '2023-06-30',
    rates: [{ item: 'Standard Delivery', rate: 45 }, { item: 'Express Delivery', rate: 85 }, { item: 'Same Day', rate: 150 }],
    status: 'superseded', createdDate: '2022-12-15'
  },
  {
    addendumId: 'ADD-2023-001-V2', contractRef: 'SIMP-DEL-2023-001', vendor: 'Delhivery Logistics', version: 2,
    effectiveFrom: '2023-07-01', effectiveTo: '2024-06-30',
    rates: [{ item: 'Standard Delivery', rate: 48 }, { item: 'Express Delivery', rate: 92 }, { item: 'Same Day', rate: 165 }],
    status: 'active', createdDate: '2023-06-15'
  },
  {
    addendumId: 'ADD-2023-002-V1', contractRef: 'SIMP-CFT-2023-002', vendor: 'CloudFirst Technologies', version: 1,
    effectiveFrom: '2023-01-01', effectiveTo: '2023-09-30',
    rates: [{ item: 'Cloud Hosting', rate: 25000 }, { item: 'Support Tier 1', rate: 15000 }, { item: 'Support Tier 2', rate: 35000 }],
    status: 'superseded', createdDate: '2022-12-20'
  },
  {
    addendumId: 'ADD-2023-002-V2', contractRef: 'SIMP-CFT-2023-002', vendor: 'CloudFirst Technologies', version: 2,
    effectiveFrom: '2023-10-01', effectiveTo: '2024-09-30',
    rates: [{ item: 'Cloud Hosting', rate: 28000 }, { item: 'Support Tier 1', rate: 18000 }, { item: 'Support Tier 2', rate: 42000 }],
    status: 'active', createdDate: '2023-09-10'
  },
];

const mockAddendumTimingIssues: AddendumTimingIssue[] = [
  {
    issueId: 'ATI-2024-001', invoiceId: 'INV-DEL-2024-1234', vendor: 'Delhivery Logistics',
    invoiceDate: '2024-01-15', paymentDate: '2024-01-20', invoiceAmount: 4850000,
    contractRef: 'SIMP-DEL-2023-001', category: 'Logistics',
    appliedAddendum: mockContractAddendums[0], // V1 - old rates
    correctAddendum: mockContractAddendums[1], // V2 - new rates
    rateDifference: 6.7, potentialOvercharge: -324500, // Undercharged using old rates
    status: 'flagged',
    lineItems: [
      { description: 'Standard Delivery (85,000 units)', quantity: 85000, appliedRate: 45, correctRate: 48, difference: -255000 },
      { description: 'Express Delivery (5,000 units)', quantity: 5000, appliedRate: 85, correctRate: 92, difference: -35000 },
      { description: 'Same Day (2,300 units)', quantity: 2300, appliedRate: 150, correctRate: 165, difference: -34500 },
    ]
  },
  {
    issueId: 'ATI-2024-002', invoiceId: 'INV-CFT-2024-5678', vendor: 'CloudFirst Technologies',
    invoiceDate: '2024-01-10', paymentDate: '2024-01-18', invoiceAmount: 1250000,
    contractRef: 'SIMP-CFT-2023-002', category: 'IT Services',
    appliedAddendum: mockContractAddendums[3], // V2 - new higher rates
    correctAddendum: mockContractAddendums[2], // V1 - old lower rates (if payment was for period before V2)
    rateDifference: 12.0, potentialOvercharge: 150000, // Overcharged using new rates for old period
    status: 'confirmed',
    lineItems: [
      { description: 'Cloud Hosting (Oct-Dec 2023)', quantity: 3, appliedRate: 28000, correctRate: 25000, difference: 9000 },
      { description: 'Support Tier 1 (Oct-Dec 2023)', quantity: 3, appliedRate: 18000, correctRate: 15000, difference: 9000 },
      { description: 'Support Tier 2 (Oct-Dec 2023)', quantity: 3, appliedRate: 42000, correctRate: 35000, difference: 21000 },
    ]
  },
  {
    issueId: 'ATI-2024-003', invoiceId: 'INV-TLS-2024-9012', vendor: 'TeamLease Services',
    invoiceDate: '2024-01-08', paymentDate: '2024-01-14', invoiceAmount: 890000,
    contractRef: 'SIMP-TLS-2023-003', category: 'HR Services',
    appliedAddendum: {
      addendumId: 'ADD-2023-003-V1', contractRef: 'SIMP-TLS-2023-003', vendor: 'TeamLease Services', version: 1,
      effectiveFrom: '2023-01-01', effectiveTo: '2023-08-31',
      rates: [{ item: 'Staffing Fee', rate: 8500 }, { item: 'Admin Fee', rate: 1200 }],
      status: 'superseded', createdDate: '2022-12-10'
    },
    correctAddendum: {
      addendumId: 'ADD-2023-003-V2', contractRef: 'SIMP-TLS-2023-003', vendor: 'TeamLease Services', version: 2,
      effectiveFrom: '2023-09-01', effectiveTo: '2024-08-31',
      rates: [{ item: 'Staffing Fee', rate: 9200 }, { item: 'Admin Fee', rate: 1400 }],
      status: 'active', createdDate: '2023-08-15'
    },
    rateDifference: 8.2, potentialOvercharge: -72800, // Undercharged
    status: 'disputed',
    lineItems: [
      { description: 'Staffing Fee (80 resources)', quantity: 80, appliedRate: 8500, correctRate: 9200, difference: -56000 },
      { description: 'Admin Fee (80 resources)', quantity: 80, appliedRate: 1200, correctRate: 1400, difference: -16000 },
    ]
  },
  {
    issueId: 'ATI-2024-004', invoiceId: 'INV-ECM-2024-3456', vendor: 'Ecom Express',
    invoiceDate: '2024-01-12', paymentDate: '2024-01-22', invoiceAmount: 2150000,
    contractRef: 'SIMP-ECM-2023-004', category: 'Logistics',
    appliedAddendum: {
      addendumId: 'ADD-2023-004-V2', contractRef: 'SIMP-ECM-2023-004', vendor: 'Ecom Express', version: 2,
      effectiveFrom: '2023-10-01', effectiveTo: '2024-09-30',
      rates: [{ item: 'Metro Delivery', rate: 38 }, { item: 'Tier 1 City', rate: 52 }, { item: 'Tier 2 City', rate: 68 }],
      status: 'active', createdDate: '2023-09-20'
    },
    correctAddendum: {
      addendumId: 'ADD-2023-004-V1', contractRef: 'SIMP-ECM-2023-004', vendor: 'Ecom Express', version: 1,
      effectiveFrom: '2023-01-01', effectiveTo: '2023-09-30',
      rates: [{ item: 'Metro Delivery', rate: 35 }, { item: 'Tier 1 City', rate: 48 }, { item: 'Tier 2 City', rate: 62 }],
      status: 'superseded', createdDate: '2022-12-25'
    },
    rateDifference: 8.6, potentialOvercharge: 185000, // Overcharged
    status: 'flagged',
    lineItems: [
      { description: 'Metro Delivery (Sept shipments)', quantity: 25000, appliedRate: 38, correctRate: 35, difference: 75000 },
      { description: 'Tier 1 City (Sept shipments)', quantity: 15000, appliedRate: 52, correctRate: 48, difference: 60000 },
      { description: 'Tier 2 City (Sept shipments)', quantity: 8000, appliedRate: 68, correctRate: 62, difference: 48000 },
    ]
  },
  {
    issueId: 'ATI-2024-005', invoiceId: 'INV-DEN-2024-7890', vendor: 'Dentsu Media',
    invoiceDate: '2024-01-05', paymentDate: '2024-01-12', invoiceAmount: 5600000,
    contractRef: 'SIMP-DEN-2023-005', category: 'Marketing',
    appliedAddendum: {
      addendumId: 'ADD-2023-005-V2', contractRef: 'SIMP-DEN-2023-005', vendor: 'Dentsu Media', version: 2,
      effectiveFrom: '2023-11-01', effectiveTo: '2024-10-31',
      rates: [{ item: 'Digital Campaign', rate: 450000 }, { item: 'TV Spot (30s)', rate: 850000 }, { item: 'Print Full Page', rate: 125000 }],
      status: 'active', createdDate: '2023-10-15'
    },
    correctAddendum: {
      addendumId: 'ADD-2023-005-V1', contractRef: 'SIMP-DEN-2023-005', vendor: 'Dentsu Media', version: 1,
      effectiveFrom: '2023-01-01', effectiveTo: '2023-10-31',
      rates: [{ item: 'Digital Campaign', rate: 420000 }, { item: 'TV Spot (30s)', rate: 780000 }, { item: 'Print Full Page', rate: 110000 }],
      status: 'superseded', createdDate: '2022-12-01'
    },
    rateDifference: 7.1, potentialOvercharge: 398000, // Overcharged
    status: 'confirmed',
    lineItems: [
      { description: 'Digital Campaign (Oct delivery)', quantity: 5, appliedRate: 450000, correctRate: 420000, difference: 150000 },
      { description: 'TV Spot 30s (Oct airings)', quantity: 2, appliedRate: 850000, correctRate: 780000, difference: 140000 },
      { description: 'Print Full Page (Oct publications)', quantity: 8, appliedRate: 125000, correctRate: 110000, difference: 120000 },
    ]
  },
  {
    issueId: 'ATI-2024-006', invoiceId: 'INV-JLL-2024-2345', vendor: 'JLL India',
    invoiceDate: '2024-01-18', paymentDate: '2024-01-25', invoiceAmount: 1450000,
    contractRef: 'SIMP-JLL-2023-006', category: 'Facilities',
    appliedAddendum: {
      addendumId: 'ADD-2023-006-V1', contractRef: 'SIMP-JLL-2023-006', vendor: 'JLL India', version: 1,
      effectiveFrom: '2023-01-01', effectiveTo: '2023-12-31',
      rates: [{ item: 'Facility Management', rate: 85000 }, { item: 'Security Services', rate: 45000 }, { item: 'Housekeeping', rate: 32000 }],
      status: 'expired', createdDate: '2022-11-30'
    },
    correctAddendum: {
      addendumId: 'ADD-2024-006-V1', contractRef: 'SIMP-JLL-2023-006', vendor: 'JLL India', version: 2,
      effectiveFrom: '2024-01-01', effectiveTo: '2024-12-31',
      rates: [{ item: 'Facility Management', rate: 92000 }, { item: 'Security Services', rate: 52000 }, { item: 'Housekeeping', rate: 38000 }],
      status: 'active', createdDate: '2023-12-15'
    },
    rateDifference: 8.3, potentialOvercharge: -120500, // Undercharged using old rates
    status: 'resolved',
    lineItems: [
      { description: 'Facility Management (Jan 2024)', quantity: 8, appliedRate: 85000, correctRate: 92000, difference: -56000 },
      { description: 'Security Services (Jan 2024)', quantity: 8, appliedRate: 45000, correctRate: 52000, difference: -56000 },
      { description: 'Housekeeping (Jan 2024)', quantity: 4, appliedRate: 32000, correctRate: 38000, difference: -24000 },
    ]
  },
];

// Mock data for Case Management Dashboard
const mockLeakageFindings: LeakageFinding[] = [
  {
    caseId: 'CASE-2024-0001',
    title: 'Duplicate Payment to BlueDart - Invoice INV-BD-2024-1234',
    description: 'Same invoice (INV-BD-2024-1234) paid twice within 15 days through different payment batches. Original payment via Oracle EBS, duplicate via manual NEFT.',
    category: 'duplicate',
    subCategory: 'Same Invoice Number',
    severity: 'critical',
    priority: 'urgent',
    status: 'recovery_initiated',
    leakageAmount: 485000,
    recoveredAmount: 0,
    potentialSavings: 485000,
    vendor: { name: 'BlueDart Express', code: 'V-BD-001', contact: 'finance@bluedart.com' },
    assignee: { name: 'Priya Sharma', email: 'priya.sharma@flipkart.com', department: 'Accounts Payable' },
    createdAt: '2024-01-28 09:15:00',
    updatedAt: '2024-01-30 14:30:00',
    dueDate: '2024-02-05',
    slaStatus: 'on_track',
    source: 'Oracle EBS Payment History',
    detectionMethod: 'ai_detected',
    relatedTransactions: [
      { transactionId: 'PAY-2024-45678', type: 'Payment', date: '2024-01-10', amount: 485000, vendor: 'BlueDart Express', description: 'Original Payment - Batch B2024-01-10' },
      { transactionId: 'PAY-2024-46789', type: 'Payment', date: '2024-01-25', amount: 485000, vendor: 'BlueDart Express', description: 'Duplicate Payment - Manual NEFT' },
    ],
    activities: [
      { id: 'ACT-001', timestamp: '2024-01-30 14:30:00', action: 'Recovery initiated', user: 'Priya Sharma', details: 'Sent recovery request email to vendor finance team', type: 'status_change' },
      { id: 'ACT-002', timestamp: '2024-01-29 11:00:00', action: 'Evidence attached', user: 'Priya Sharma', details: 'Uploaded bank statement showing duplicate debit', type: 'evidence' },
      { id: 'ACT-003', timestamp: '2024-01-28 16:45:00', action: 'Assigned to Priya Sharma', user: 'System', details: 'Auto-assigned based on vendor category', type: 'assignment' },
      { id: 'ACT-004', timestamp: '2024-01-28 09:15:00', action: 'Case created', user: 'AI Detection System', details: 'Duplicate payment pattern detected by AI scanner', type: 'status_change' },
    ],
    evidence: [
      { id: 'EV-001', type: 'invoice', name: 'INV-BD-2024-1234.pdf', uploadedBy: 'System', uploadedAt: '2024-01-28 09:15:00', size: '1.2 MB' },
      { id: 'EV-002', type: 'report', name: 'Bank_Statement_Jan2024.pdf', uploadedBy: 'Priya Sharma', uploadedAt: '2024-01-29 11:00:00', size: '2.4 MB' },
      { id: 'EV-003', type: 'report', name: 'Oracle_EBS_Payment_Batch_B2024-01-10.xlsx', uploadedBy: 'System', uploadedAt: '2024-01-28 09:15:00', size: '856 KB' },
      { id: 'EV-004', type: 'screenshot', name: 'NEFT_Transfer_Confirmation_25Jan.png', uploadedBy: 'Priya Sharma', uploadedAt: '2024-01-29 11:15:00', size: '324 KB' },
      { id: 'EV-005', type: 'email', name: 'Vendor_Acknowledgment_Email.eml', uploadedBy: 'Priya Sharma', uploadedAt: '2024-01-30 10:00:00', size: '128 KB' },
      { id: 'EV-006', type: 'report', name: 'AI_Duplicate_Detection_Report.pdf', uploadedBy: 'System', uploadedAt: '2024-01-28 09:15:00', size: '445 KB' },
    ],
    tags: ['duplicate', 'logistics', 'critical', 'auto-detected'],
    rootCause: 'Invoice processed in both ERP batch and manual payment due to missing duplicate check',
    recommendation: 'Implement real-time duplicate detection before payment approval',
    approver: 'Rajesh Kumar',
    approvalDate: '2024-01-29 16:00:00',
    recoveryDeadline: '2024-02-15',
    notes: 'Vendor acknowledged the duplicate and agreed to credit note'
  },
  {
    caseId: 'CASE-2024-0002',
    title: 'Rate Card Violation - SafeExpress Overcharged ₹67K',
    description: 'SafeExpress invoiced at ₹18.5/km for BLR-HYD route instead of contracted rate of ₹14.2/km. Pattern detected across 12 invoices.',
    category: 'rate_card',
    subCategory: 'Rate Overcharge',
    severity: 'high',
    priority: 'high',
    status: 'investigating',
    leakageAmount: 67200,
    recoveredAmount: 0,
    potentialSavings: 67200,
    vendor: { name: 'SafeExpress', code: 'V-SE-003', contact: 'accounts@safexpress.com' },
    assignee: { name: 'Amit Verma', email: 'amit.verma@flipkart.com', department: 'Logistics Finance' },
    createdAt: '2024-01-27 11:30:00',
    updatedAt: '2024-01-30 10:15:00',
    dueDate: '2024-02-03',
    slaStatus: 'on_track',
    source: 'Rate Card Adherence Scanner',
    detectionMethod: 'rule_based',
    relatedTransactions: [
      { transactionId: 'INV-SE-2024-0891', type: 'Invoice', date: '2024-01-20', amount: 125400, vendor: 'SafeExpress', description: 'BLR-HYD Trip #T2024-4521' },
      { transactionId: 'INV-SE-2024-0892', type: 'Invoice', date: '2024-01-22', amount: 98700, vendor: 'SafeExpress', description: 'BLR-HYD Trip #T2024-4589' },
    ],
    activities: [
      { id: 'ACT-005', timestamp: '2024-01-30 10:15:00', action: 'Comment added', user: 'Amit Verma', details: 'Vendor claims fuel surcharge not included in rate card. Reviewing contract terms.', type: 'comment' },
      { id: 'ACT-006', timestamp: '2024-01-28 14:00:00', action: 'Status changed to Investigating', user: 'Amit Verma', details: 'Started detailed review of all 12 flagged invoices', type: 'status_change' },
    ],
    evidence: [
      { id: 'EV-007', type: 'contract', name: 'SafeExpress_RateCard_2024.pdf', uploadedBy: 'System', uploadedAt: '2024-01-27 11:30:00', size: '890 KB' },
      { id: 'EV-008', type: 'invoice', name: 'INV-SE-2024-0891_BLR-HYD.pdf', uploadedBy: 'System', uploadedAt: '2024-01-27 11:30:00', size: '1.1 MB' },
      { id: 'EV-009', type: 'invoice', name: 'INV-SE-2024-0892_BLR-HYD.pdf', uploadedBy: 'System', uploadedAt: '2024-01-27 11:30:00', size: '1.0 MB' },
      { id: 'EV-010', type: 'report', name: 'Rate_Comparison_Analysis_12_Invoices.xlsx', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-28 15:00:00', size: '678 KB' },
      { id: 'EV-011', type: 'screenshot', name: 'Simplicontract_RateCard_Screenshot.png', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-28 15:30:00', size: '512 KB' },
      { id: 'EV-012', type: 'report', name: 'Trip_Sheet_Distance_Verification.pdf', uploadedBy: 'System', uploadedAt: '2024-01-27 11:30:00', size: '2.3 MB' },
      { id: 'EV-013', type: 'email', name: 'Vendor_Fuel_Surcharge_Claim_Email.eml', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-30 09:00:00', size: '156 KB' },
    ],
    tags: ['rate-card', 'logistics', 'pattern', 'recurring'],
    rootCause: 'Pending investigation',
    recommendation: 'Pending investigation completion',
    approver: null,
    approvalDate: null,
    recoveryDeadline: null,
    notes: ''
  },
  {
    caseId: 'CASE-2024-0003',
    title: 'SaaS Over-Licensing - Salesforce 45 Excess Licenses',
    description: 'Salesforce invoice shows 320 licenses but active user count is only 275. 45 licenses unused for 3+ months.',
    category: 'license',
    subCategory: 'Over-licensing',
    severity: 'high',
    priority: 'medium',
    status: 'pending_approval',
    leakageAmount: 472500,
    recoveredAmount: 0,
    potentialSavings: 472500,
    vendor: { name: 'Salesforce India', code: 'V-SF-001', contact: 'billing@salesforce.com' },
    assignee: { name: 'Sneha Patel', email: 'sneha.patel@flipkart.com', department: 'IT Procurement' },
    createdAt: '2024-01-25 15:00:00',
    updatedAt: '2024-01-30 09:00:00',
    dueDate: '2024-02-01',
    slaStatus: 'at_risk',
    source: 'License Compliance Audit',
    detectionMethod: 'ai_detected',
    relatedTransactions: [
      { transactionId: 'INV-SF-2024-Q1', type: 'Invoice', date: '2024-01-15', amount: 3360000, vendor: 'Salesforce India', description: 'Q1 2024 License Fee - 320 users' },
    ],
    activities: [
      { id: 'ACT-007', timestamp: '2024-01-30 09:00:00', action: 'Pending CFO approval', user: 'Sneha Patel', details: 'License reduction request submitted for CFO sign-off', type: 'status_change' },
      { id: 'ACT-008', timestamp: '2024-01-28 11:30:00', action: 'Evidence attached', user: 'Sneha Patel', details: 'Uploaded Okta user activity report showing inactive users', type: 'evidence' },
    ],
    evidence: [
      { id: 'EV-014', type: 'report', name: 'Okta_UserActivity_Dec2023.xlsx', uploadedBy: 'Sneha Patel', uploadedAt: '2024-01-28 11:30:00', size: '456 KB' },
      { id: 'EV-015', type: 'invoice', name: 'Salesforce_INV_Q1_2024.pdf', uploadedBy: 'System', uploadedAt: '2024-01-25 15:00:00', size: '1.1 MB' },
      { id: 'EV-016', type: 'contract', name: 'Salesforce_MSA_2023-2025.pdf', uploadedBy: 'System', uploadedAt: '2024-01-25 15:00:00', size: '3.8 MB' },
      { id: 'EV-017', type: 'report', name: 'Salesforce_Admin_Console_Export.xlsx', uploadedBy: 'Sneha Patel', uploadedAt: '2024-01-27 14:00:00', size: '892 KB' },
      { id: 'EV-018', type: 'report', name: 'HR_Exit_List_Q4_2023.xlsx', uploadedBy: 'Sneha Patel', uploadedAt: '2024-01-28 10:00:00', size: '234 KB' },
      { id: 'EV-019', type: 'screenshot', name: 'License_Usage_Dashboard_Screenshot.png', uploadedBy: 'Sneha Patel', uploadedAt: '2024-01-28 11:00:00', size: '1.5 MB' },
      { id: 'EV-020', type: 'report', name: 'Inactive_Users_90_Days_Report.pdf', uploadedBy: 'System', uploadedAt: '2024-01-25 15:00:00', size: '567 KB' },
      { id: 'EV-021', type: 'email', name: 'Salesforce_Rep_Reduction_Options.eml', uploadedBy: 'Sneha Patel', uploadedAt: '2024-01-29 16:00:00', size: '178 KB' },
    ],
    tags: ['saas', 'license', 'optimization', 'quarterly'],
    rootCause: 'Departed employees licenses not deprovisioned; project team licenses not returned post-completion',
    recommendation: 'Implement automated license deprovisioning integrated with HR exit process',
    approver: 'CFO Office',
    approvalDate: null,
    recoveryDeadline: '2024-02-28',
    notes: 'Salesforce rep indicated mid-term reduction possible with 30-day notice'
  },
  {
    caseId: 'CASE-2024-0004',
    title: 'Recruitment Fee Overcharge - ABC Consultants',
    description: 'Agency billed 18% fee on ₹24L CTC instead of contracted 12% for L6 band. Excess charge of ₹1.44L.',
    category: 'recruitment',
    subCategory: 'Fee Percentage Violation',
    severity: 'medium',
    priority: 'medium',
    status: 'triaged',
    leakageAmount: 144000,
    recoveredAmount: 0,
    potentialSavings: 144000,
    vendor: { name: 'ABC Consultants', code: 'V-ABC-002', contact: 'invoices@abcconsultants.in' },
    assignee: { name: 'Rahul Mehta', email: 'rahul.mehta@flipkart.com', department: 'HR Operations' },
    createdAt: '2024-01-26 10:00:00',
    updatedAt: '2024-01-29 16:45:00',
    dueDate: '2024-02-08',
    slaStatus: 'on_track',
    source: 'HR Recruitment Fee Audit',
    detectionMethod: 'rule_based',
    relatedTransactions: [
      { transactionId: 'INV-ABC-2024-0089', type: 'Invoice', date: '2024-01-20', amount: 432000, vendor: 'ABC Consultants', description: 'Recruitment Fee - Candidate: Vikram Singh' },
    ],
    activities: [
      { id: 'ACT-009', timestamp: '2024-01-29 16:45:00', action: 'Status changed to Triaged', user: 'Rahul Mehta', details: 'Verified fee structure from contract. Confirmed overcharge.', type: 'status_change' },
    ],
    evidence: [
      { id: 'EV-022', type: 'contract', name: 'ABC_Consultants_Agreement_2023.pdf', uploadedBy: 'System', uploadedAt: '2024-01-26 10:00:00', size: '2.1 MB' },
      { id: 'EV-023', type: 'invoice', name: 'INV-ABC-2024-0089_Vikram_Singh.pdf', uploadedBy: 'System', uploadedAt: '2024-01-26 10:00:00', size: '445 KB' },
      { id: 'EV-024', type: 'report', name: 'Fee_Structure_Band_Mapping.xlsx', uploadedBy: 'Rahul Mehta', uploadedAt: '2024-01-27 11:00:00', size: '128 KB' },
      { id: 'EV-025', type: 'other', name: 'Candidate_Offer_Letter_Vikram_Singh.pdf', uploadedBy: 'Rahul Mehta', uploadedAt: '2024-01-27 11:30:00', size: '356 KB' },
      { id: 'EV-026', type: 'report', name: 'HR_Joining_Form_CTC_Details.pdf', uploadedBy: 'Rahul Mehta', uploadedAt: '2024-01-27 14:00:00', size: '234 KB' },
      { id: 'EV-027', type: 'screenshot', name: 'Contract_Fee_Tier_Table_Screenshot.png', uploadedBy: 'Rahul Mehta', uploadedAt: '2024-01-29 10:00:00', size: '289 KB' },
    ],
    tags: ['recruitment', 'hr', 'fee-violation'],
    rootCause: 'Vendor applied wrong fee tier; internal review missed the discrepancy',
    recommendation: 'Add automated fee calculation validation in invoice approval workflow',
    approver: null,
    approvalDate: null,
    recoveryDeadline: null,
    notes: ''
  },
  {
    caseId: 'CASE-2024-0005',
    title: 'Marketing Deliverables Overbilled - WATConsult',
    description: 'Billed for 15 social media campaigns but only 11 delivered per SOW tracker. ₹10L overbilled.',
    category: 'marketing',
    subCategory: 'Undelivered Billables',
    severity: 'high',
    priority: 'high',
    status: 'new',
    leakageAmount: 1000000,
    recoveredAmount: 0,
    potentialSavings: 1000000,
    vendor: { name: 'WATConsult', code: 'V-WAT-001', contact: 'finance@watconsult.com' },
    assignee: null,
    createdAt: '2024-01-30 08:00:00',
    updatedAt: '2024-01-30 08:00:00',
    dueDate: '2024-02-06',
    slaStatus: 'on_track',
    source: 'Marketing SOW Compliance',
    detectionMethod: 'ai_detected',
    relatedTransactions: [
      { transactionId: 'INV-WAT-2024-0156', type: 'Invoice', date: '2024-01-28', amount: 3750000, vendor: 'WATConsult', description: 'BBD Campaign Phase 2 - Integrated Digital' },
    ],
    activities: [
      { id: 'ACT-010', timestamp: '2024-01-30 08:00:00', action: 'Case created', user: 'AI Detection System', details: 'Deliverable count mismatch detected via SOW cross-reference', type: 'status_change' },
    ],
    evidence: [
      { id: 'EV-028', type: 'invoice', name: 'WATConsult_INV_0156.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 08:00:00', size: '1.5 MB' },
      { id: 'EV-029', type: 'contract', name: 'SOW_BBD_Campaign_Phase2_Signed.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 08:00:00', size: '4.2 MB' },
      { id: 'EV-030', type: 'report', name: 'Campaign_Tracker_BBD_2024.xlsx', uploadedBy: 'System', uploadedAt: '2024-01-30 08:00:00', size: '1.8 MB' },
      { id: 'EV-031', type: 'report', name: 'Deliverables_Checklist_Comparison.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 08:00:00', size: '567 KB' },
      { id: 'EV-032', type: 'screenshot', name: 'Campaign_Dashboard_Jan30.png', uploadedBy: 'System', uploadedAt: '2024-01-30 08:00:00', size: '2.1 MB' },
      { id: 'EV-033', type: 'report', name: 'AI_SOW_Mismatch_Detection_Report.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 08:00:00', size: '890 KB' },
    ],
    tags: ['marketing', 'sow', 'deliverables', 'auto-detected', 'new'],
    rootCause: 'Pending investigation',
    recommendation: '',
    approver: null,
    approvalDate: null,
    recoveryDeadline: null,
    notes: ''
  },
  {
    caseId: 'CASE-2024-0006',
    title: 'Infrastructure Price Variance - Anchor Switches 47% Above Historical',
    description: 'ElectroBazaar charged ₹125/unit for Anchor Roma 6A Switch vs historical avg of ₹85/unit. 400 units affected.',
    category: 'infrastructure',
    subCategory: 'Price Outlier',
    severity: 'high',
    priority: 'high',
    status: 'investigating',
    leakageAmount: 16000,
    recoveredAmount: 0,
    potentialSavings: 16000,
    vendor: { name: 'ElectroBazaar', code: 'V-EB-001', contact: 'sales@electrobazaar.com' },
    assignee: { name: 'Vikram Reddy', email: 'vikram.reddy@flipkart.com', department: 'Infrastructure Procurement' },
    createdAt: '2024-01-25 14:30:00',
    updatedAt: '2024-01-30 11:00:00',
    dueDate: '2024-02-02',
    slaStatus: 'on_track',
    source: 'Infrastructure Price Scanner',
    detectionMethod: 'rule_based',
    relatedTransactions: [
      { transactionId: 'INV-INFRA-2024-0451', type: 'Invoice', date: '2024-01-25', amount: 82800, vendor: 'ElectroBazaar', description: 'Bangalore FC-3 Build - Electrical Materials' },
    ],
    activities: [
      { id: 'ACT-011', timestamp: '2024-01-30 11:00:00', action: 'Comment added', user: 'Vikram Reddy', details: 'Vendor claims supply chain disruption caused price increase. Requesting documentation.', type: 'comment' },
      { id: 'ACT-012', timestamp: '2024-01-27 10:00:00', action: 'Assigned to Vikram Reddy', user: 'Anita Singh', details: 'Manual assignment by manager', type: 'assignment' },
    ],
    evidence: [
      { id: 'EV-034', type: 'invoice', name: 'ElectroBazaar_INV_0451.pdf', uploadedBy: 'System', uploadedAt: '2024-01-25 14:30:00', size: '980 KB' },
      { id: 'EV-035', type: 'report', name: 'Historical_Price_Analysis_Anchor_Switches.xlsx', uploadedBy: 'System', uploadedAt: '2024-01-25 14:30:00', size: '456 KB' },
      { id: 'EV-036', type: 'report', name: 'GRN_Pending_Verification_FC3.pdf', uploadedBy: 'Vikram Reddy', uploadedAt: '2024-01-26 10:00:00', size: '234 KB' },
      { id: 'EV-037', type: 'other', name: 'PO_INFRA_2024_0089.pdf', uploadedBy: 'System', uploadedAt: '2024-01-25 14:30:00', size: '345 KB' },
      { id: 'EV-038', type: 'screenshot', name: 'Anchor_Price_Comparison_3_Vendors.png', uploadedBy: 'Vikram Reddy', uploadedAt: '2024-01-27 15:00:00', size: '678 KB' },
      { id: 'EV-039', type: 'report', name: 'Market_Price_Index_Electrical_Jan2024.pdf', uploadedBy: 'Vikram Reddy', uploadedAt: '2024-01-28 09:00:00', size: '1.2 MB' },
      { id: 'EV-040', type: 'email', name: 'Vendor_Supply_Chain_Disruption_Claim.eml', uploadedBy: 'Vikram Reddy', uploadedAt: '2024-01-30 10:30:00', size: '189 KB' },
    ],
    tags: ['infrastructure', 'price-variance', 'electrical', 'outlier'],
    rootCause: 'Pending vendor response',
    recommendation: '',
    approver: null,
    approvalDate: null,
    recoveryDeadline: null,
    notes: ''
  },
  {
    caseId: 'CASE-2024-0007',
    title: 'Addendum Timing - TCS Applied Incorrect Rate Period',
    description: 'TCS invoice used addendum v3 rates (effective Nov 2024) for services delivered in Oct 2024 when v2 was applicable.',
    category: 'addendum',
    subCategory: 'Rate Period Mismatch',
    severity: 'medium',
    priority: 'medium',
    status: 'recovered',
    leakageAmount: 245000,
    recoveredAmount: 245000,
    potentialSavings: 0,
    vendor: { name: 'TCS', code: 'V-TCS-001', contact: 'invoices@tcs.com' },
    assignee: { name: 'Kavitha Nair', email: 'kavitha.nair@flipkart.com', department: 'IT Procurement' },
    createdAt: '2024-01-15 09:00:00',
    updatedAt: '2024-01-28 15:00:00',
    dueDate: '2024-01-25',
    slaStatus: 'on_track',
    source: 'Addendum Timing Validator',
    detectionMethod: 'rule_based',
    relatedTransactions: [
      { transactionId: 'INV-TCS-2024-5678', type: 'Invoice', date: '2024-01-12', amount: 3450000, vendor: 'TCS', description: 'Oct 2024 Managed Services' },
      { transactionId: 'CN-TCS-2024-0012', type: 'Credit Note', date: '2024-01-28', amount: -245000, vendor: 'TCS', description: 'Rate correction credit' },
    ],
    activities: [
      { id: 'ACT-013', timestamp: '2024-01-28 15:00:00', action: 'Case resolved', user: 'Kavitha Nair', details: 'Credit note received and verified. Closing case.', type: 'resolution' },
      { id: 'ACT-014', timestamp: '2024-01-22 11:00:00', action: 'Credit note received', user: 'System', details: 'TCS issued credit note CN-TCS-2024-0012 for ₹2,45,000', type: 'status_change' },
      { id: 'ACT-015', timestamp: '2024-01-18 14:00:00', action: 'Recovery initiated', user: 'Kavitha Nair', details: 'Sent formal request to TCS for rate correction', type: 'status_change' },
    ],
    evidence: [
      { id: 'EV-041', type: 'invoice', name: 'TCS_Credit_Note_0012.pdf', uploadedBy: 'System', uploadedAt: '2024-01-22 11:00:00', size: '450 KB' },
      { id: 'EV-042', type: 'invoice', name: 'TCS_INV_5678_Oct_Services.pdf', uploadedBy: 'System', uploadedAt: '2024-01-15 09:00:00', size: '1.8 MB' },
      { id: 'EV-043', type: 'contract', name: 'TCS_Addendum_V2_Effective_Aug2024.pdf', uploadedBy: 'System', uploadedAt: '2024-01-15 09:00:00', size: '2.3 MB' },
      { id: 'EV-044', type: 'contract', name: 'TCS_Addendum_V3_Effective_Nov2024.pdf', uploadedBy: 'System', uploadedAt: '2024-01-15 09:00:00', size: '2.1 MB' },
      { id: 'EV-045', type: 'report', name: 'Rate_Period_Comparison_Analysis.xlsx', uploadedBy: 'Kavitha Nair', uploadedAt: '2024-01-16 14:00:00', size: '567 KB' },
      { id: 'EV-046', type: 'screenshot', name: 'Simplicontract_Addendum_Timeline.png', uploadedBy: 'Kavitha Nair', uploadedAt: '2024-01-17 10:00:00', size: '890 KB' },
      { id: 'EV-047', type: 'email', name: 'TCS_Recovery_Request_Formal.eml', uploadedBy: 'Kavitha Nair', uploadedAt: '2024-01-18 14:00:00', size: '156 KB' },
      { id: 'EV-048', type: 'email', name: 'TCS_Acknowledgment_Credit_Note.eml', uploadedBy: 'System', uploadedAt: '2024-01-22 11:30:00', size: '134 KB' },
      { id: 'EV-049', type: 'report', name: 'Reconciliation_Statement_Final.pdf', uploadedBy: 'Kavitha Nair', uploadedAt: '2024-01-28 14:00:00', size: '345 KB' },
    ],
    tags: ['addendum', 'it-services', 'recovered', 'closed'],
    rootCause: 'Vendor billing system applied future-dated addendum rates prematurely',
    recommendation: 'Vendor to implement addendum effective date validation in billing system',
    approver: 'Rajesh Kumar',
    approvalDate: '2024-01-28 16:00:00',
    recoveryDeadline: '2024-01-25',
    notes: 'Successful recovery. Vendor committed to process improvement.'
  },
  {
    caseId: 'CASE-2024-0008',
    title: 'Contract Compliance - Missing PO Reference in 8 Invoices',
    description: 'Multiple invoices from Delhivery processed without valid PO reference, bypassing 3-way match control.',
    category: 'compliance',
    subCategory: 'PO Bypass',
    severity: 'medium',
    priority: 'low',
    status: 'closed',
    leakageAmount: 0,
    recoveredAmount: 0,
    potentialSavings: 0,
    vendor: { name: 'Delhivery', code: 'V-DEL-001', contact: 'finance@delhivery.com' },
    assignee: { name: 'Anand Kumar', email: 'anand.kumar@flipkart.com', department: 'Internal Audit' },
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-01-25 17:00:00',
    dueDate: '2024-01-20',
    slaStatus: 'breached',
    source: 'Control Compliance Audit',
    detectionMethod: 'manual_audit',
    relatedTransactions: [
      { transactionId: 'INV-DEL-2024-0234', type: 'Invoice', date: '2024-01-05', amount: 234000, vendor: 'Delhivery', description: 'Jan Week 1 Services' },
      { transactionId: 'INV-DEL-2024-0235', type: 'Invoice', date: '2024-01-08', amount: 189000, vendor: 'Delhivery', description: 'Emergency Delivery Services' },
    ],
    activities: [
      { id: 'ACT-016', timestamp: '2024-01-25 17:00:00', action: 'Case closed', user: 'Anand Kumar', details: 'Process gap identified and remediated. No financial leakage confirmed.', type: 'resolution' },
      { id: 'ACT-017', timestamp: '2024-01-22 09:00:00', action: 'Escalated to VP', user: 'Anand Kumar', details: 'SLA breach - escalated to VP Finance for visibility', type: 'escalation' },
    ],
    evidence: [
      { id: 'EV-050', type: 'invoice', name: 'INV-DEL-2024-0234_No_PO.pdf', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-12 11:00:00', size: '678 KB' },
      { id: 'EV-051', type: 'invoice', name: 'INV-DEL-2024-0235_No_PO.pdf', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-12 11:00:00', size: '712 KB' },
      { id: 'EV-052', type: 'report', name: 'All_8_Invoices_Without_PO_List.xlsx', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-12 14:00:00', size: '234 KB' },
      { id: 'EV-053', type: 'report', name: 'Oracle_EBS_3Way_Match_Exception_Report.pdf', uploadedBy: 'System', uploadedAt: '2024-01-10 10:00:00', size: '1.2 MB' },
      { id: 'EV-054', type: 'screenshot', name: 'ERP_Missing_PO_Error_Screenshot.png', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-15 10:00:00', size: '456 KB' },
      { id: 'EV-055', type: 'email', name: 'Emergency_Purchase_Approval_Chain.eml', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-18 15:00:00', size: '234 KB' },
      { id: 'EV-056', type: 'report', name: 'Process_Gap_Analysis_Report.pdf', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-22 16:00:00', size: '890 KB' },
      { id: 'EV-057', type: 'report', name: 'Remediation_Action_Plan.pdf', uploadedBy: 'Anand Kumar', uploadedAt: '2024-01-25 15:00:00', size: '567 KB' },
    ],
    tags: ['compliance', 'process-gap', 'po-bypass', 'audit'],
    rootCause: 'Emergency purchases processed without retrospective PO creation',
    recommendation: 'Implement mandatory PO matching in ERP; add retrospective PO workflow',
    approver: 'VP Finance',
    approvalDate: '2024-01-25 16:30:00',
    recoveryDeadline: null,
    notes: 'No financial leakage but process improvement required. Remediation plan in progress.'
  },
  {
    caseId: 'CASE-2024-0009',
    title: 'Duplicate Payment Pattern - Vendor CEVA Logistics',
    description: 'Pattern analysis detected 3 potential duplicate payments to CEVA in last 90 days. Total at risk: ₹8.2L.',
    category: 'duplicate',
    subCategory: 'Pattern Detection',
    severity: 'critical',
    priority: 'urgent',
    status: 'new',
    leakageAmount: 820000,
    recoveredAmount: 0,
    potentialSavings: 820000,
    vendor: { name: 'CEVA Logistics', code: 'V-CEVA-001', contact: 'ap@cevalogistics.com' },
    assignee: null,
    createdAt: '2024-01-30 07:00:00',
    updatedAt: '2024-01-30 07:00:00',
    dueDate: '2024-02-02',
    slaStatus: 'on_track',
    source: 'AI Pattern Detection',
    detectionMethod: 'ai_detected',
    relatedTransactions: [
      { transactionId: 'PAY-2024-78901', type: 'Payment', date: '2024-01-28', amount: 312000, vendor: 'CEVA Logistics', description: 'Batch Payment B-2024-01-28' },
      { transactionId: 'PAY-2024-78456', type: 'Payment', date: '2024-01-15', amount: 312000, vendor: 'CEVA Logistics', description: 'Batch Payment B-2024-01-15' },
      { transactionId: 'PAY-2024-77890', type: 'Payment', date: '2024-01-02', amount: 196000, vendor: 'CEVA Logistics', description: 'Batch Payment B-2024-01-02' },
    ],
    activities: [
      { id: 'ACT-018', timestamp: '2024-01-30 07:00:00', action: 'Case created', user: 'AI Detection System', details: 'Pattern analysis flagged potential duplicates based on amount/timing correlation', type: 'status_change' },
    ],
    evidence: [
      { id: 'EV-058', type: 'report', name: 'CEVA_Payment_Pattern_Analysis.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '890 KB' },
      { id: 'EV-059', type: 'report', name: 'AI_Confidence_Score_Report_93%.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '567 KB' },
      { id: 'EV-060', type: 'report', name: 'Oracle_EBS_Payment_History_90Days.xlsx', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '2.3 MB' },
      { id: 'EV-061', type: 'invoice', name: 'CEVA_INV_Batch_B2024-01-28.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '1.1 MB' },
      { id: 'EV-062', type: 'invoice', name: 'CEVA_INV_Batch_B2024-01-15.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '1.0 MB' },
      { id: 'EV-063', type: 'invoice', name: 'CEVA_INV_Batch_B2024-01-02.pdf', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '978 KB' },
      { id: 'EV-064', type: 'report', name: 'Amount_Timing_Correlation_Matrix.xlsx', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '345 KB' },
      { id: 'EV-065', type: 'screenshot', name: 'Pattern_Detection_Visualization.png', uploadedBy: 'System', uploadedAt: '2024-01-30 07:00:00', size: '1.5 MB' },
    ],
    tags: ['duplicate', 'pattern', 'ai-detected', 'urgent', 'logistics'],
    rootCause: 'Pending investigation',
    recommendation: '',
    approver: null,
    approvalDate: null,
    recoveryDeadline: null,
    notes: 'High confidence AI detection. Requires immediate assignment.'
  },
  {
    caseId: 'CASE-2024-0010',
    title: 'False Positive - Xpressbees Rate Variance',
    description: 'Initially flagged as rate card violation but verified as legitimate fuel surcharge per contract clause 4.2.',
    category: 'rate_card',
    subCategory: 'Rate Variance',
    severity: 'low',
    priority: 'low',
    status: 'false_positive',
    leakageAmount: 0,
    recoveredAmount: 0,
    potentialSavings: 0,
    vendor: { name: 'Xpressbees', code: 'V-XPB-001', contact: 'finance@xpressbees.com' },
    assignee: { name: 'Amit Verma', email: 'amit.verma@flipkart.com', department: 'Logistics Finance' },
    createdAt: '2024-01-20 12:00:00',
    updatedAt: '2024-01-24 10:00:00',
    dueDate: '2024-01-27',
    slaStatus: 'on_track',
    source: 'Rate Card Adherence Scanner',
    detectionMethod: 'rule_based',
    relatedTransactions: [
      { transactionId: 'INV-XPB-2024-0567', type: 'Invoice', date: '2024-01-18', amount: 456000, vendor: 'Xpressbees', description: 'Jan Week 3 Deliveries' },
    ],
    activities: [
      { id: 'ACT-019', timestamp: '2024-01-24 10:00:00', action: 'Marked as false positive', user: 'Amit Verma', details: 'Verified fuel surcharge clause in contract. Variance is legitimate.', type: 'resolution' },
    ],
    evidence: [
      { id: 'EV-066', type: 'contract', name: 'Xpressbees_Contract_FuelClause.pdf', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-23 14:00:00', size: '1.8 MB' },
      { id: 'EV-067', type: 'invoice', name: 'INV-XPB-2024-0567_Jan_Week3.pdf', uploadedBy: 'System', uploadedAt: '2024-01-20 12:00:00', size: '890 KB' },
      { id: 'EV-068', type: 'contract', name: 'Xpressbees_RateCard_2024_Full.pdf', uploadedBy: 'System', uploadedAt: '2024-01-20 12:00:00', size: '2.4 MB' },
      { id: 'EV-069', type: 'report', name: 'Fuel_Price_Index_Jan2024.pdf', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-22 10:00:00', size: '567 KB' },
      { id: 'EV-070', type: 'screenshot', name: 'Contract_Clause_4.2_Highlighted.png', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-23 14:00:00', size: '456 KB' },
      { id: 'EV-071', type: 'report', name: 'Fuel_Surcharge_Calculation_Verification.xlsx', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-23 16:00:00', size: '234 KB' },
      { id: 'EV-072', type: 'report', name: 'False_Positive_Analysis_Report.pdf', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-24 09:00:00', size: '678 KB' },
      { id: 'EV-073', type: 'other', name: 'Rule_Engine_Update_Ticket_JIRA-4521.pdf', uploadedBy: 'Amit Verma', uploadedAt: '2024-01-24 10:00:00', size: '189 KB' },
    ],
    tags: ['false-positive', 'rate-card', 'fuel-surcharge'],
    rootCause: 'Detection rule did not account for fuel surcharge clause',
    recommendation: 'Update rate card scanner to include fuel surcharge threshold from contracts',
    approver: null,
    approvalDate: null,
    recoveryDeadline: null,
    notes: 'Rule engine updated to prevent similar false positives.'
  },
];

// Use Case 4: Leakage Detection View
function LeakageView() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'rate-card' | 'license' | 'recruitment' | 'marketing' | 'infrastructure' | 'duplicates' | 'addendum' | 'cases' | 'investigation'>('overview');
  const [investigationTab, setInvestigationTab] = useState<'details' | 'transactions' | 'evidence' | 'timeline' | 'analysis'>('details');
  const [selectedInvoice, setSelectedInvoice] = useState<LogisticsInvoice | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<SaaSInvoice | null>(null);
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentInvoice | null>(null);
  const [selectedMarketing, setSelectedMarketing] = useState<MarketingInvoice | null>(null);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<InfrastructureInvoice | null>(null);
  const [selectedDuplicate, setSelectedDuplicate] = useState<DuplicateInvoice | null>(null);
  const [selectedAddendumIssue, setSelectedAddendumIssue] = useState<AddendumTimingIssue | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<LeakageFinding | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<CaseEvidence | null>(null);
  const [caseStatusFilter, setCaseStatusFilter] = useState<string>('all');
  const [caseSeverityFilter, setCaseSeverityFilter] = useState<string>('all');
  const [caseCategoryFilter, setCaseCategoryFilter] = useState<string>('all');
  const [caseSearchTerm, setCaseSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/leakage/dashboard`);
      const data = await res.json();
      setDashboard(data);
    } catch {
      setDashboard(mockLeakageDashboard);
    }
  };

  const COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa'];

  // Calculate rate card adherence stats
  const rateCardStats = {
    totalInvoices: mockLogisticsInvoices.length,
    compliant: mockLogisticsInvoices.filter(i => i.status === 'compliant').length,
    minorVariance: mockLogisticsInvoices.filter(i => i.status === 'minor_variance').length,
    flagged: mockLogisticsInvoices.filter(i => i.status === 'flagged').length,
    totalDiscrepancy: mockLogisticsInvoices.filter(i => i.discrepancy > 0).reduce((acc, i) => acc + i.discrepancy, 0),
    totalExpected: mockLogisticsInvoices.reduce((acc, i) => acc + i.expectedCost, 0),
    totalInvoiced: mockLogisticsInvoices.reduce((acc, i) => acc + i.invoicedAmount, 0),
  };

  // Calculate license compliance stats
  const licenseStats = {
    totalInvoices: mockSaaSInvoices.length,
    compliant: mockSaaSInvoices.filter(i => i.status === 'compliant').length,
    overLicensed: mockSaaSInvoices.filter(i => i.status === 'over_licensed').length,
    flagged: mockSaaSInvoices.filter(i => i.status === 'flagged').length,
    underUtilized: mockSaaSInvoices.filter(i => i.status === 'under_utilized').length,
    totalExcessLicenses: mockSaaSInvoices.filter(i => i.licenseDiff > 0).reduce((acc, i) => acc + i.licenseDiff, 0),
    totalOvercharge: mockSaaSInvoices.filter(i => i.amountDiff > 0).reduce((acc, i) => acc + i.amountDiff, 0),
    avgUtilization: Math.round(mockSaaSInvoices.reduce((acc, i) => acc + i.utilizationPercent, 0) / mockSaaSInvoices.length),
  };

  // Calculate recruitment fee stats
  const recruitmentStats = {
    totalInvoices: mockRecruitmentInvoices.length,
    compliant: mockRecruitmentInvoices.filter(i => i.status === 'compliant').length,
    overcharged: mockRecruitmentInvoices.filter(i => i.status === 'overcharged').length,
    flagged: mockRecruitmentInvoices.filter(i => i.status === 'flagged').length,
    totalDiscrepancy: mockRecruitmentInvoices.filter(i => i.discrepancy > 0).reduce((acc, i) => acc + i.discrepancy, 0),
    totalExpectedFees: mockRecruitmentInvoices.reduce((acc, i) => acc + i.expectedFee, 0),
    totalInvoicedFees: mockRecruitmentInvoices.reduce((acc, i) => acc + i.invoicedAmount, 0),
    unverifiedSalaries: mockRecruitmentInvoices.filter(i => !i.salaryVerified).length,
  };

  // Calculate marketing deliverable stats
  const marketingStats = {
    totalInvoices: mockMarketingInvoices.length,
    compliant: mockMarketingInvoices.filter(i => i.status === 'compliant').length,
    partialDelivery: mockMarketingInvoices.filter(i => i.status === 'partial_delivery').length,
    overbilled: mockMarketingInvoices.filter(i => i.status === 'overbilled').length,
    flagged: mockMarketingInvoices.filter(i => i.status === 'flagged').length,
    totalOverbilled: mockMarketingInvoices.filter(i => i.discrepancy > 0).reduce((acc, i) => acc + i.discrepancy, 0),
    totalUndelivered: Math.abs(mockMarketingInvoices.filter(i => i.discrepancy < 0).reduce((acc, i) => acc + i.discrepancy, 0)),
    unverifiedDeliveries: mockMarketingInvoices.filter(i => !i.deliveryVerified).length,
  };

  // Calculate infrastructure price variance stats
  const infrastructureStats = {
    totalInvoices: mockInfrastructureInvoices.length,
    compliant: mockInfrastructureInvoices.filter(i => i.status === 'compliant').length,
    variance: mockInfrastructureInvoices.filter(i => i.status === 'variance').length,
    flagged: mockInfrastructureInvoices.filter(i => i.status === 'flagged').length,
    totalVarianceAmount: mockInfrastructureInvoices.filter(i => i.totalVariance > 0).reduce((acc, i) => acc + i.totalVariance, 0),
    totalItems: mockInfrastructureInvoices.reduce((acc, i) => acc + i.items.length, 0),
    outlierItems: mockInfrastructureInvoices.flatMap(i => i.items).filter(item => item.status === 'outlier').length,
    unverifiedGRN: mockInfrastructureInvoices.filter(i => !i.grnVerified).length,
  };

  // Calculate duplicate invoice stats
  const duplicateStats = {
    totalDuplicates: mockDuplicateInvoices.length,
    confirmed: mockDuplicateInvoices.filter(i => i.status === 'confirmed_duplicate').length,
    potential: mockDuplicateInvoices.filter(i => i.status === 'potential_duplicate').length,
    underReview: mockDuplicateInvoices.filter(i => i.status === 'under_review').length,
    totalAmount: mockDuplicateInvoices.reduce((acc, i) => acc + i.amount, 0),
    recoveredAmount: mockDuplicateInvoices.filter(i => i.recoveryStatus === 'recovered').reduce((acc, i) => acc + i.amount, 0),
    pendingRecovery: mockDuplicateInvoices.filter(i => i.recoveryStatus === 'pending' || i.recoveryStatus === 'in_progress').reduce((acc, i) => acc + i.amount, 0),
    avgDaysBetween: Math.round(mockDuplicateInvoices.reduce((acc, i) => acc + i.daysBetween, 0) / mockDuplicateInvoices.length),
  };

  // Calculate addendum timing stats
  const addendumStats = {
    totalIssues: mockAddendumTimingIssues.length,
    flagged: mockAddendumTimingIssues.filter(i => i.status === 'flagged').length,
    confirmed: mockAddendumTimingIssues.filter(i => i.status === 'confirmed').length,
    resolved: mockAddendumTimingIssues.filter(i => i.status === 'resolved').length,
    disputed: mockAddendumTimingIssues.filter(i => i.status === 'disputed').length,
    totalOvercharge: mockAddendumTimingIssues.filter(i => i.potentialOvercharge > 0).reduce((acc, i) => acc + i.potentialOvercharge, 0),
    totalUndercharge: Math.abs(mockAddendumTimingIssues.filter(i => i.potentialOvercharge < 0).reduce((acc, i) => acc + i.potentialOvercharge, 0)),
    avgRateDifference: (mockAddendumTimingIssues.reduce((acc, i) => acc + i.rateDifference, 0) / mockAddendumTimingIssues.length).toFixed(1),
  };

  return (
    <div className="p-5 bg-[#f1f3f6] min-h-full">
      {/* Flipkart-style Header */}
      <div className="mb-6 rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="h-1 bg-gradient-to-r from-[#ffe500] via-[#ff9f00] to-[#ff6161]"></div>
        <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5dc8] p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-medium">Post-Payment Audit & Leakage Detection</h2>
                <span className="px-2 py-0.5 bg-[#ff6161] text-white text-xs font-medium rounded-sm">AI POWERED</span>
              </div>
              <p className="text-blue-100 text-sm">Identify discrepancies and recover financial leakages</p>
            </div>
            <button className="px-4 py-2 bg-[#ffe500] text-[#212121] text-sm font-medium rounded-sm hover:bg-[#ffd700] transition-colors flex items-center gap-2">
              <RefreshCw size={16} />
              Run Audit Scan
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-sm mb-6 p-1 inline-flex" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <button
          onClick={() => setViewMode('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
            viewMode === 'overview' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          Leakage Overview
        </button>
        <button
          onClick={() => setViewMode('cases')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'cases' ? 'bg-[#ff9f00] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <ListChecks size={16} />
          Case Management
        </button>
        <button
          onClick={() => setViewMode('rate-card')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'rate-card' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <Truck size={16} />
          Logistics Rate Card
        </button>
        <button
          onClick={() => setViewMode('license')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'license' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <Monitor size={16} />
          SaaS License Compliance
        </button>
        <button
          onClick={() => setViewMode('recruitment')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'recruitment' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <UserCheck size={16} />
          HR Recruitment Fees
        </button>
        <button
          onClick={() => setViewMode('marketing')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'marketing' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <Megaphone size={16} />
          Marketing Deliverables
        </button>
        <button
          onClick={() => setViewMode('infrastructure')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'infrastructure' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <Building2 size={16} />
          Infrastructure Price
        </button>
        <button
          onClick={() => setViewMode('duplicates')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'duplicates' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <FileText size={16} />
          Duplicate Detection
        </button>
        <button
          onClick={() => setViewMode('addendum')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
            viewMode === 'addendum' ? 'bg-[#2874f0] text-white' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <Clock size={16} />
          Addendum Timing
        </button>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Summary Cards - Flipkart Style */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <FKStatCard
              title="Total Cases"
              value={dashboard?.summary?.total_cases || 18}
              icon={FileText}
              color="#2874f0"
            />
            <FKStatCard
              title="Leakage Identified"
              value={formatCurrency(dashboard?.summary?.total_leakage_identified || 1850000)}
              icon={AlertTriangle}
              color="#ff6161"
            />
            <FKStatCard
              title="Amount Recovered"
              value={formatCurrency(dashboard?.summary?.total_recovered || 920000)}
              icon={CheckCircle}
              trend="+₹2.1L"
              trendUp={true}
              color="#388e3c"
            />
            <FKStatCard
              title="Recovery Rate"
              value={`${dashboard?.summary?.recovery_rate || 49.7}%`}
              icon={TrendingUp}
              trend="+3.2%"
              trendUp={true}
              color="#ff9f00"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Leakage by Type */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff6161] rounded-sm flex items-center justify-center">
                  <AlertTriangle className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Leakage by Type</h3>
                  <p className="text-xs text-[#878787]">Distribution of issues</p>
                </div>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={dashboard?.type_breakdown || mockLeakageByType}
                      dataKey="value"
                      nameKey="type"
                      cx="50%"
                      cy="40%"
                      outerRadius={60}
                    >
                      {(dashboard?.type_breakdown || mockLeakageByType).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                      iconSize={8}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                  <Clock className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Cases by Status</h3>
                  <p className="text-xs text-[#878787]">Current pipeline</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {(dashboard?.status_breakdown || mockStatusBreakdown).map((item: any) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        item.status === 'New' ? 'bg-[#2874f0]' :
                        item.status === 'Under Investigation' ? 'bg-[#ff9f00]' :
                        item.status === 'Recovery Initiated' ? 'bg-[#ff6161]' : 'bg-[#388e3c]'
                      }`}></div>
                      <span className="text-sm text-[#212121]">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-[#212121]">{item.count}</span>
                      <span className="text-xs text-[#878787] ml-2">({formatCurrency(item.value)})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity Distribution */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <AlertCircle className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Severity Distribution</h3>
                  <p className="text-xs text-[#878787]">Priority breakdown</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {['High', 'Medium', 'Low'].map(severity => {
                  const data = (dashboard?.severity_breakdown || mockLeakageDashboard.severity_breakdown).find((s: any) => s.severity === severity) || { count: 0, value: 0 };
                  return (
                    <div key={severity}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`font-medium ${
                          severity === 'High' ? 'text-[#ff6161]' :
                          severity === 'Medium' ? 'text-[#ff9f00]' : 'text-[#388e3c]'
                        }`}>{severity}</span>
                        <span className="text-[#212121]">{data.count} cases</span>
                      </div>
                      <div className="w-full bg-[#f1f3f6] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            severity === 'High' ? 'bg-[#ff6161]' :
                            severity === 'Medium' ? 'bg-[#ff9f00]' : 'bg-[#388e3c]'
                          }`}
                          style={{ width: `${(data.count / (dashboard?.summary?.total_cases || 18)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* General Leakage Detection - Duplicates & Addendum */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Retroactive Duplicates Summary */}
            <div
              className="bg-white rounded-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}
              onClick={() => setViewMode('duplicates')}
            >
              <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#c62828] rounded-sm flex items-center justify-center">
                    <FileText className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Retroactive Duplicate Detection</h3>
                    <p className="text-xs text-[#878787]">Oracle EBS payment history scan</p>
                  </div>
                </div>
                <ChevronRight className="text-[#878787]" size={20} />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#c62828]">{duplicateStats.totalDuplicates}</p>
                    <p className="text-[10px] text-[#878787]">Total Found</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#ff6161]">{duplicateStats.confirmed}</p>
                    <p className="text-[10px] text-[#878787]">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#ff9f00]">{duplicateStats.potential}</p>
                    <p className="text-[10px] text-[#878787]">Potential</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#388e3c]">{duplicateStats.underReview}</p>
                    <p className="text-[10px] text-[#878787]">Under Review</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#ffebee] rounded-sm p-3">
                  <div>
                    <p className="text-xs text-[#c62828] font-medium">Total Duplicate Amount</p>
                    <p className="text-lg font-bold text-[#c62828]">{formatCurrency(duplicateStats.totalAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#388e3c] font-medium">Recovered</p>
                    <p className="text-lg font-bold text-[#388e3c]">{formatCurrency(duplicateStats.recoveredAmount)}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[#878787] flex items-center gap-2">
                  <Clock size={12} />
                  <span>Avg. {duplicateStats.avgDaysBetween} days between original and duplicate payments</span>
                </div>
              </div>
            </div>

            {/* Addendum Timing Summary */}
            <div
              className="bg-white rounded-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}
              onClick={() => setViewMode('addendum')}
            >
              <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#7b1fa2] rounded-sm flex items-center justify-center">
                    <Clock className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Addendum Timing Validation</h3>
                    <p className="text-xs text-[#878787]">Simplicontract rate period check</p>
                  </div>
                </div>
                <ChevronRight className="text-[#878787]" size={20} />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#7b1fa2]">{addendumStats.totalIssues}</p>
                    <p className="text-[10px] text-[#878787]">Total Issues</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#ff6161]">{addendumStats.flagged}</p>
                    <p className="text-[10px] text-[#878787]">Flagged</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#ff9f00]">{addendumStats.confirmed}</p>
                    <p className="text-[10px] text-[#878787]">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#388e3c]">{addendumStats.resolved}</p>
                    <p className="text-[10px] text-[#878787]">Resolved</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#ffebee] rounded-sm p-3">
                    <p className="text-xs text-[#c62828] font-medium">Overcharged</p>
                    <p className="text-lg font-bold text-[#c62828]">{formatCurrency(addendumStats.totalOvercharge)}</p>
                    <p className="text-[10px] text-[#878787]">Recoverable from vendors</p>
                  </div>
                  <div className="bg-[#e8f5e9] rounded-sm p-3">
                    <p className="text-xs text-[#388e3c] font-medium">Undercharged</p>
                    <p className="text-lg font-bold text-[#388e3c]">{formatCurrency(addendumStats.totalUndercharge)}</p>
                    <p className="text-[10px] text-[#878787]">May owe to vendors</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[#878787] flex items-center gap-2">
                  <Percent size={12} />
                  <span>Avg. {addendumStats.avgRateDifference}% rate variance across contracts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Opportunities Section */}
          <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#388e3c] to-[#2e7d32] rounded-sm flex items-center justify-center">
                  <TrendingUp className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Savings Opportunities</h3>
                  <p className="text-xs text-[#878787]">Aggregate potential recovery across all audit modules</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#878787]">Last updated: Today 10:45 AM</span>
                <button className="px-3 py-1.5 bg-[#388e3c] text-white text-xs font-medium rounded-sm hover:bg-[#2e7d32] transition-colors flex items-center gap-1">
                  <Download size={12} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Total Savings Summary */}
            <div className="p-4 bg-gradient-to-r from-[#e8f5e9] to-[#c8e6c9]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2e7d32] font-medium mb-1">Total Identifiable Savings</p>
                  <p className="text-4xl font-bold text-[#1b5e20]">
                    {formatCurrency(
                      rateCardStats.totalDiscrepancy +
                      licenseStats.totalOvercharge +
                      recruitmentStats.totalDiscrepancy +
                      marketingStats.totalOverbilled +
                      infrastructureStats.totalVarianceAmount +
                      duplicateStats.totalAmount +
                      addendumStats.totalOvercharge
                    )}
                  </p>
                  <p className="text-xs text-[#388e3c] mt-1">Across 7 audit categories • {
                    rateCardStats.flagged + licenseStats.flagged + recruitmentStats.flagged +
                    marketingStats.flagged + infrastructureStats.flagged + duplicateStats.confirmed + addendumStats.flagged
                  } active cases</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#388e3c]"></div>
                    <span className="text-sm text-[#2e7d32]">Recovered: {formatCurrency(duplicateStats.recoveredAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff9f00]"></div>
                    <span className="text-sm text-[#e65100]">In Progress: {formatCurrency(duplicateStats.pendingRecovery)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2874f0]"></div>
                    <span className="text-sm text-[#1565c0]">Pending Review: {formatCurrency(
                      rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge +
                      recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled +
                      infrastructureStats.totalVarianceAmount + addendumStats.totalOvercharge
                    )}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-[#212121] mb-4">Savings by Category</h4>
              <div className="space-y-3">
                {/* Logistics Rate Card */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">Logistics Rate Card</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#2874f0] to-[#1565c0]"
                      style={{ width: `${Math.min((rateCardStats.totalDiscrepancy / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(rateCardStats.totalDiscrepancy)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('rate-card')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>

                {/* SaaS License */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">SaaS License</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#9333ea] to-[#7c3aed]"
                      style={{ width: `${Math.min((licenseStats.totalOvercharge / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(licenseStats.totalOvercharge)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('license')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>

                {/* HR Recruitment */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">HR Recruitment</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#0891b2] to-[#0e7490]"
                      style={{ width: `${Math.min((recruitmentStats.totalDiscrepancy / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(recruitmentStats.totalDiscrepancy)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('recruitment')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>

                {/* Marketing Deliverables */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">Marketing</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#ea580c] to-[#c2410c]"
                      style={{ width: `${Math.min((marketingStats.totalOverbilled / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(marketingStats.totalOverbilled)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('marketing')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>

                {/* Infrastructure */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">Infrastructure</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#059669] to-[#047857]"
                      style={{ width: `${Math.min((infrastructureStats.totalVarianceAmount / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(infrastructureStats.totalVarianceAmount)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('infrastructure')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>

                {/* Duplicate Invoices */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">Duplicate Invoices</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c]"
                      style={{ width: `${Math.min((duplicateStats.totalAmount / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(duplicateStats.totalAmount)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('duplicates')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>

                {/* Addendum Timing */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-xs text-[#878787]">Addendum Timing</div>
                  <div className="flex-1 h-6 bg-[#f1f3f6] rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#7b1fa2] to-[#6a1b9a]"
                      style={{ width: `${Math.min((addendumStats.totalOvercharge / (rateCardStats.totalDiscrepancy + licenseStats.totalOvercharge + recruitmentStats.totalDiscrepancy + marketingStats.totalOverbilled + infrastructureStats.totalVarianceAmount + duplicateStats.totalAmount + addendumStats.totalOvercharge)) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-[#212121]">
                      {formatCurrency(addendumStats.totalOvercharge)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode('addendum')}
                    className="text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-[#e0e0e0] bg-[#f9fafb]">
              <h4 className="text-sm font-medium text-[#212121] mb-3">Priority Actions</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-sm p-3 border border-[#ffebee]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-[#c62828]" size={14} />
                    <span className="text-xs font-medium text-[#c62828]">High Priority</span>
                  </div>
                  <p className="text-lg font-bold text-[#212121]">{duplicateStats.confirmed}</p>
                  <p className="text-xs text-[#878787]">Confirmed duplicates pending recovery</p>
                  <button
                    onClick={() => setViewMode('duplicates')}
                    className="mt-2 text-xs text-[#c62828] hover:underline font-medium"
                  >
                    Initiate Recovery →
                  </button>
                </div>
                <div className="bg-white rounded-sm p-3 border border-[#fff3e0]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-[#e65100]" size={14} />
                    <span className="text-xs font-medium text-[#e65100]">Needs Review</span>
                  </div>
                  <p className="text-lg font-bold text-[#212121]">{infrastructureStats.unverifiedGRN}</p>
                  <p className="text-xs text-[#878787]">Invoices awaiting GRN verification</p>
                  <button
                    onClick={() => setViewMode('infrastructure')}
                    className="mt-2 text-xs text-[#e65100] hover:underline font-medium"
                  >
                    Verify GRN →
                  </button>
                </div>
                <div className="bg-white rounded-sm p-3 border border-[#e8f0fe]">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-[#2874f0]" size={14} />
                    <span className="text-xs font-medium text-[#2874f0]">Salary Check</span>
                  </div>
                  <p className="text-lg font-bold text-[#212121]">{recruitmentStats.unverifiedSalaries}</p>
                  <p className="text-xs text-[#878787]">Recruitment fees with unverified CTC</p>
                  <button
                    onClick={() => setViewMode('recruitment')}
                    className="mt-2 text-xs text-[#2874f0] hover:underline font-medium"
                  >
                    Verify Salaries →
                  </button>
                </div>
                <div className="bg-white rounded-sm p-3 border border-[#f3e8ff]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="text-[#7b1fa2]" size={14} />
                    <span className="text-xs font-medium text-[#7b1fa2]">Delivery Pending</span>
                  </div>
                  <p className="text-lg font-bold text-[#212121]">{marketingStats.unverifiedDeliveries}</p>
                  <p className="text-xs text-[#878787]">Marketing invoices unverified</p>
                  <button
                    onClick={() => setViewMode('marketing')}
                    className="mt-2 text-xs text-[#7b1fa2] hover:underline font-medium"
                  >
                    Verify Delivery →
                  </button>
                </div>
              </div>
            </div>

            {/* Recovery Timeline */}
            <div className="p-4 border-t border-[#e0e0e0]">
              <h4 className="text-sm font-medium text-[#212121] mb-3">Recovery Progress Timeline</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#388e3c]" style={{ width: '25%' }}></div>
                    <div className="h-full bg-[#ff9f00]" style={{ width: '15%' }}></div>
                    <div className="h-full bg-[#2874f0]" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#388e3c]"></div>
                    <span className="text-[#878787]">Recovered (25%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff9f00]"></div>
                    <span className="text-[#878787]">In Progress (15%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#2874f0]"></div>
                    <span className="text-[#878787]">Pending (60%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'rate-card' && (
        <>
          {/* Rate Card Adherence View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Truck className="text-[#2874f0]" size={18} />
                <span className="text-xs text-[#878787]">Total Invoices</span>
              </div>
              <p className="text-2xl font-medium text-[#212121]">{rateCardStats.totalInvoices}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#388e3c]" size={18} />
                <span className="text-xs text-[#878787]">Compliant</span>
              </div>
              <p className="text-2xl font-medium text-[#388e3c]">{rateCardStats.compliant}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-[#ff9f00]" size={18} />
                <span className="text-xs text-[#878787]">Minor Variance</span>
              </div>
              <p className="text-2xl font-medium text-[#ff9f00]">{rateCardStats.minorVariance}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Flagged</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{rateCardStats.flagged}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Total Discrepancy</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{formatCurrency(rateCardStats.totalDiscrepancy)}</p>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="bg-[#e8f0fe] border border-[#2874f0] rounded-sm p-4 mb-6 flex items-start gap-3">
            <Calculator className="text-[#2874f0] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-[#212121] text-sm mb-1">Rate Card Adherence Check</h4>
              <p className="text-xs text-[#878787]">
                For each paid invoice, we recalculate the expected cost using: <span className="font-mono bg-white px-1 py-0.5 rounded text-[#2874f0]">Trip Sheet KMs × Contracted Rate (from Simplicontract)</span>.
                Invoices with &gt;5% variance from expected cost are flagged for review.
              </p>
            </div>
          </div>

          {/* Rate Card Adherence Table */}
          <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <Route className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Logistics Invoice Analysis</h3>
                  <p className="text-xs text-[#878787]">Trip sheet KMs vs contracted rate verification</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Vendors</option>
                  <option>Delhivery Logistics</option>
                  <option>Ecom Express</option>
                  <option>XpressBees</option>
                </select>
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Status</option>
                  <option>Compliant</option>
                  <option>Minor Variance</option>
                  <option>Flagged</option>
                </select>
                <button className="px-3 py-1.5 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f6]">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Invoice ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Trip Sheet</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Vendor</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Route</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">KMs</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Rate/KM</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Expected</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Invoiced</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Discrepancy</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {mockLogisticsInvoices.map(invoice => (
                    <tr key={invoice.invoiceId} className="hover:bg-[#f1f3f6] transition-colors">
                      <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{invoice.invoiceId}</td>
                      <td className="px-3 py-3 text-xs text-[#212121]">{invoice.tripSheetId}</td>
                      <td className="px-3 py-3 text-xs text-[#212121]">{invoice.vendor}</td>
                      <td className="px-3 py-3 text-xs text-[#212121]">
                        <div className="flex items-center gap-1">
                          <span>{invoice.origin}</span>
                          <ChevronRight size={12} className="text-[#878787]" />
                          <span>{invoice.destination}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right font-medium">{invoice.tripSheetKms.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right">₹{invoice.contractedRatePerKm}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right">{formatCurrency(invoice.expectedCost)}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right font-medium">{formatCurrency(invoice.invoicedAmount)}</td>
                      <td className="px-3 py-3 text-right">
                        <span className={`text-xs font-medium ${
                          invoice.discrepancy > 0 ? 'text-[#ff6161]' : invoice.discrepancy < 0 ? 'text-[#388e3c]' : 'text-[#212121]'
                        }`}>
                          {invoice.discrepancy > 0 ? '+' : ''}{formatCurrency(Math.abs(invoice.discrepancy))}
                          <span className="text-[10px] ml-1">({invoice.discrepancyPercent > 0 ? '+' : ''}{invoice.discrepancyPercent.toFixed(1)}%)</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          invoice.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          invoice.status === 'minor_variance' ? 'bg-[#fff3e0] text-[#e65100]' :
                          'bg-[#ffebee] text-[#c62828]'
                        }`}>
                          {invoice.status === 'compliant' ? 'Compliant' :
                           invoice.status === 'minor_variance' ? 'Minor' : 'Flagged'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-[#2874f0] hover:underline text-xs font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contracted Rate Cards Reference */}
          <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
              <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                <FileText className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-[#212121] text-sm">Active Rate Cards (Simplicontract)</h3>
                <p className="text-xs text-[#878787]">Contracted rates for verification</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-3">
                {mockRateCards.map(rc => (
                  <div key={rc.id} className="p-3 bg-[#f1f3f6] rounded-sm border-l-4 border-[#388e3c]">
                    <p className="text-xs font-medium text-[#212121] mb-1">{rc.vendor}</p>
                    <p className="text-xs text-[#878787] mb-2">{rc.origin} → {rc.destination}</p>
                    <p className="text-lg font-medium text-[#388e3c]">₹{rc.contractedRatePerKm}/km</p>
                    <p className="text-[10px] text-[#878787] mt-1">{rc.vehicleType}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'license' && (
        <>
          {/* License Compliance View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="text-[#2874f0]" size={18} />
                <span className="text-xs text-[#878787]">Total Invoices</span>
              </div>
              <p className="text-2xl font-medium text-[#212121]">{licenseStats.totalInvoices}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#388e3c]" size={18} />
                <span className="text-xs text-[#878787]">Compliant</span>
              </div>
              <p className="text-2xl font-medium text-[#388e3c]">{licenseStats.compliant}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-[#ff9f00]" size={18} />
                <span className="text-xs text-[#878787]">Over-Licensed</span>
              </div>
              <p className="text-2xl font-medium text-[#ff9f00]">{licenseStats.overLicensed}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Flagged</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{licenseStats.flagged}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Total Overcharge</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{formatCurrency(licenseStats.totalOvercharge)}</p>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="bg-[#e8f0fe] border border-[#2874f0] rounded-sm p-4 mb-6 flex items-start gap-3">
            <Key className="text-[#2874f0] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-[#212121] text-sm mb-1">License Compliance Check</h4>
              <p className="text-xs text-[#878787]">
                For each SaaS invoice, we compare: <span className="font-mono bg-white px-1 py-0.5 rounded text-[#2874f0]">Licenses Billed</span> vs
                <span className="font-mono bg-white px-1 py-0.5 rounded text-[#388e3c] ml-1">Licenses in PO (Oracle Fusion)</span> and
                <span className="font-mono bg-white px-1 py-0.5 rounded text-[#ff9f00] ml-1">Licenses in Contract (Simplicontract)</span>.
                Invoices billing more licenses than contracted are flagged.
              </p>
            </div>
          </div>

          {/* License Compliance Table */}
          <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <Hash className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">SaaS License Invoice Analysis</h3>
                  <p className="text-xs text-[#878787]">Compare billed licenses vs PO/Contract</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Vendors</option>
                  <option>Google Cloud India</option>
                  <option>Microsoft India</option>
                  <option>Salesforce India</option>
                  <option>Atlassian</option>
                  <option>Zoom</option>
                </select>
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Status</option>
                  <option>Compliant</option>
                  <option>Over-Licensed</option>
                  <option>Flagged</option>
                </select>
                <button className="px-3 py-1.5 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f6]">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Invoice</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Vendor / Product</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Period</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">In Contract</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">In PO</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Billed</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Expected</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Invoiced</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Difference</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {mockSaaSInvoices.map(invoice => (
                    <tr key={invoice.invoiceId} className="hover:bg-[#f1f3f6] transition-colors">
                      <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{invoice.invoiceId}</td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-medium text-[#212121]">{invoice.vendor}</p>
                        <p className="text-[10px] text-[#878787]">{invoice.productName}</p>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121]">{invoice.billingPeriod}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-[#ff9f00]">{invoice.licensesInContract}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-[#388e3c]">{invoice.licensesInPO}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs font-medium ${invoice.licensesBilled > invoice.licensesInPO ? 'text-[#ff6161]' : 'text-[#212121]'}`}>
                          {invoice.licensesBilled}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right">{formatCurrency(invoice.expectedAmount)}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right font-medium">{formatCurrency(invoice.invoicedAmount)}</td>
                      <td className="px-3 py-3 text-right">
                        {invoice.amountDiff !== 0 ? (
                          <div>
                            <span className={`text-xs font-medium ${invoice.amountDiff > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                              {invoice.amountDiff > 0 ? '+' : ''}{formatCurrency(invoice.amountDiff)}
                            </span>
                            <p className="text-[10px] text-[#878787]">
                              {invoice.licenseDiff > 0 ? '+' : ''}{invoice.licenseDiff} licenses
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#388e3c]">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          invoice.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          invoice.status === 'over_licensed' ? 'bg-[#fff3e0] text-[#e65100]' :
                          invoice.status === 'under_utilized' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                          'bg-[#ffebee] text-[#c62828]'
                        }`}>
                          {invoice.status === 'compliant' ? 'Compliant' :
                           invoice.status === 'over_licensed' ? 'Over' :
                           invoice.status === 'under_utilized' ? 'Under-Used' : 'Flagged'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setSelectedLicense(invoice)}
                          className="text-[#2874f0] hover:underline text-xs font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Utilization Overview */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* License Utilization */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <BarChart3 className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">License Utilization</h3>
                  <p className="text-xs text-[#878787]">Average: {licenseStats.avgUtilization}%</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {mockSaaSContracts.slice(0, 5).map(contract => {
                  const invoices = mockSaaSInvoices.filter(i => i.contractRef === contract.contractRef);
                  const avgUtil = invoices.length > 0
                    ? Math.round(invoices.reduce((acc, i) => acc + i.utilizationPercent, 0) / invoices.length)
                    : 0;
                  return (
                    <div key={contract.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#212121] font-medium truncate flex-1">{contract.productName}</span>
                        <span className={`ml-2 ${avgUtil < 70 ? 'text-[#ff9f00]' : 'text-[#388e3c]'}`}>{avgUtil}%</span>
                      </div>
                      <div className="h-2 bg-[#f1f3f6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${avgUtil < 70 ? 'bg-[#ff9f00]' : 'bg-[#388e3c]'}`}
                          style={{ width: `${avgUtil}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Contracts */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                  <Building2 className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Active SaaS Contracts</h3>
                  <p className="text-xs text-[#878787]">From Simplicontract</p>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {mockSaaSContracts.slice(0, 6).map(contract => (
                    <div key={contract.id} className="p-3 bg-[#f1f3f6] rounded-sm border-l-4 border-[#2874f0]">
                      <p className="text-xs font-medium text-[#212121] truncate">{contract.productName}</p>
                      <p className="text-[10px] text-[#878787] mb-2">{contract.vendor}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#2874f0]">{contract.contractedLicenses}</span>
                        <span className="text-[10px] text-[#878787]">licenses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'recruitment' && (
        <>
          {/* HR Recruitment Fee Calculation View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="text-[#2874f0]" size={18} />
                <span className="text-xs text-[#878787]">Total Placements</span>
              </div>
              <p className="text-2xl font-medium text-[#212121]">{recruitmentStats.totalInvoices}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#388e3c]" size={18} />
                <span className="text-xs text-[#878787]">Compliant</span>
              </div>
              <p className="text-2xl font-medium text-[#388e3c]">{recruitmentStats.compliant}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-[#ff9f00]" size={18} />
                <span className="text-xs text-[#878787]">Overcharged</span>
              </div>
              <p className="text-2xl font-medium text-[#ff9f00]">{recruitmentStats.overcharged}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Flagged</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{recruitmentStats.flagged}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Total Overcharge</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{formatCurrency(recruitmentStats.totalDiscrepancy)}</p>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="bg-[#e8f0fe] border border-[#2874f0] rounded-sm p-4 mb-6 flex items-start gap-3">
            <Percent className="text-[#2874f0] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-[#212121] text-sm mb-1">Recruitment Fee Verification</h4>
              <p className="text-xs text-[#878787]">
                For each recruitment invoice, we verify the fee by: <span className="font-mono bg-white px-1 py-0.5 rounded text-[#2874f0]">Candidate CTC × Contracted Fee %</span> based on the salary slab in the contract (Simplicontract).
                The candidate's salary is cross-referenced with HR records when available. Invoices with fees exceeding the expected amount are flagged.
              </p>
            </div>
          </div>

          {/* Recruitment Fee Table */}
          <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <Briefcase className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Recruitment Invoice Analysis</h3>
                  <p className="text-xs text-[#878787]">Candidate salary vs contracted fee percentage</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Agencies</option>
                  <option>TeamLease Services</option>
                  <option>ABC Consultants</option>
                  <option>Randstad India</option>
                  <option>Michael Page India</option>
                </select>
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Status</option>
                  <option>Compliant</option>
                  <option>Overcharged</option>
                  <option>Flagged</option>
                </select>
                <button className="px-3 py-1.5 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f6]">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Invoice</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Candidate / Position</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Agency</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">CTC (₹)</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Fee %</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Expected Fee</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Invoiced</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Discrepancy</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Salary</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {mockRecruitmentInvoices.map(invoice => (
                    <tr key={invoice.invoiceId} className="hover:bg-[#f1f3f6] transition-colors">
                      <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{invoice.invoiceId}</td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-medium text-[#212121]">{invoice.candidateName}</p>
                        <p className="text-[10px] text-[#878787]">{invoice.position} • {invoice.department}</p>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121]">{invoice.vendor}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right font-medium">{(invoice.candidateCTC / 100000).toFixed(1)}L</td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-[#2874f0]">{invoice.contractedFeePercent}%</span>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right">{formatCurrency(invoice.expectedFee)}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right font-medium">{formatCurrency(invoice.invoicedAmount)}</td>
                      <td className="px-3 py-3 text-right">
                        {invoice.discrepancy !== 0 ? (
                          <div>
                            <span className={`text-xs font-medium ${invoice.discrepancy > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                              {invoice.discrepancy > 0 ? '+' : ''}{formatCurrency(invoice.discrepancy)}
                            </span>
                            <p className="text-[10px] text-[#878787]">
                              {invoice.discrepancyPercent > 0 ? '+' : ''}{invoice.discrepancyPercent.toFixed(1)}%
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#388e3c]">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          invoice.salaryVerified ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]'
                        }`}>
                          {invoice.salaryVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          invoice.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          invoice.status === 'overcharged' ? 'bg-[#fff3e0] text-[#e65100]' :
                          'bg-[#ffebee] text-[#c62828]'
                        }`}>
                          {invoice.status === 'compliant' ? 'Compliant' :
                           invoice.status === 'overcharged' ? 'Overcharged' : 'Flagged'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setSelectedRecruitment(invoice)}
                          className="text-[#2874f0] hover:underline text-xs font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Fee Structure by Agency */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <Percent className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Fee Structure by Agency</h3>
                  <p className="text-xs text-[#878787]">Contracted fee percentages by salary slab</p>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {mockRecruitmentContracts.map(contract => (
                  <div key={contract.id} className="p-3 bg-[#f1f3f6] rounded-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#212121]">{contract.vendor}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                        contract.vendorType === 'agency' ? 'bg-[#e8f0fe] text-[#2874f0]' :
                        contract.vendorType === 'consultant' ? 'bg-[#fce4ec] text-[#c2185b]' :
                        'bg-[#e8f5e9] text-[#2e7d32]'
                      }`}>
                        {contract.vendorType}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {contract.feeStructure.map((tier, idx) => (
                        <div key={idx} className="flex justify-between text-[10px]">
                          <span className="text-[#878787]">
                            {tier.salaryMax < 999999999
                              ? `₹${(tier.salaryMin / 100000).toFixed(0)}L - ₹${(tier.salaryMax / 100000).toFixed(0)}L`
                              : `Above ₹${(tier.salaryMin / 100000).toFixed(0)}L`}
                          </span>
                          <span className="font-medium text-[#2874f0]">{tier.feePercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agency-wise Summary */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                  <Building2 className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Agency-wise Summary</h3>
                  <p className="text-xs text-[#878787]">Placement count and fee compliance</p>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {mockRecruitmentContracts.slice(0, 5).map(contract => {
                    const agencyInvoices = mockRecruitmentInvoices.filter(i => i.vendor === contract.vendor);
                    const placements = agencyInvoices.length;
                    const compliant = agencyInvoices.filter(i => i.status === 'compliant').length;
                    const totalFees = agencyInvoices.reduce((acc, i) => acc + i.invoicedAmount, 0);
                    return (
                      <div key={contract.id} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{contract.vendor}</p>
                          <p className="text-[10px] text-[#878787]">{placements} placements • {compliant}/{placements} compliant</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-[#212121]">{formatCurrency(totalFees)}</p>
                          <p className="text-[10px] text-[#878787]">Total Fees</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'marketing' && (
        <>
          {/* Marketing Deliverable Mismatch View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="text-[#2874f0]" size={18} />
                <span className="text-xs text-[#878787]">Total Invoices</span>
              </div>
              <p className="text-2xl font-medium text-[#212121]">{marketingStats.totalInvoices}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#388e3c]" size={18} />
                <span className="text-xs text-[#878787]">Compliant</span>
              </div>
              <p className="text-2xl font-medium text-[#388e3c]">{marketingStats.compliant}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-[#ff9f00]" size={18} />
                <span className="text-xs text-[#878787]">Overbilled</span>
              </div>
              <p className="text-2xl font-medium text-[#ff9f00]">{marketingStats.overbilled}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Flagged</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{marketingStats.flagged}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">Total Overbilled</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{formatCurrency(marketingStats.totalOverbilled)}</p>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="bg-[#e8f0fe] border border-[#2874f0] rounded-sm p-4 mb-6 flex items-start gap-3">
            <ListChecks className="text-[#2874f0] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-[#212121] text-sm mb-1">Deliverable Mismatch Detection</h4>
              <p className="text-xs text-[#878787]">
                For each marketing invoice, we compare line items (e.g., "3 Social Media Campaigns") against the
                <span className="font-mono bg-white px-1 py-0.5 rounded text-[#2874f0] ml-1">SOW deliverables in Simplicontract</span>.
                Invoices billing more than the contracted deliverables or with unverified delivery are flagged for review.
              </p>
            </div>
          </div>

          {/* Marketing Invoice Table */}
          <div className="bg-white rounded-sm overflow-hidden mb-6" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <Target className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Marketing Invoice Analysis</h3>
                  <p className="text-xs text-[#878787]">Compare billed deliverables vs SOW</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Agencies</option>
                  <option>WATConsult</option>
                  <option>Dentsu Webchutney</option>
                  <option>Schbang Digital</option>
                  <option>Ogilvy India</option>
                </select>
                <select className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]">
                  <option>All Status</option>
                  <option>Compliant</option>
                  <option>Overbilled</option>
                  <option>Partial Delivery</option>
                  <option>Flagged</option>
                </select>
                <button className="px-3 py-1.5 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f6]">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Invoice</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Agency / Project</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-[#878787] uppercase">Campaign</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Items</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">SOW Value</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Invoiced</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-[#878787] uppercase">Variance</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Verified</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-[#878787] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {mockMarketingInvoices.map(invoice => (
                    <tr key={invoice.invoiceId} className="hover:bg-[#f1f3f6] transition-colors">
                      <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{invoice.invoiceId}</td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-medium text-[#212121]">{invoice.vendor}</p>
                        <p className="text-[10px] text-[#878787]">{invoice.projectName}</p>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121]">{invoice.campaignType}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-[#2874f0]">{invoice.lineItems.length}</span>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right">{formatCurrency(invoice.totalExpected)}</td>
                      <td className="px-3 py-3 text-xs text-[#212121] text-right font-medium">{formatCurrency(invoice.totalInvoiced)}</td>
                      <td className="px-3 py-3 text-right">
                        {invoice.discrepancy !== 0 ? (
                          <div>
                            <span className={`text-xs font-medium ${invoice.discrepancy > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                              {invoice.discrepancy > 0 ? '+' : ''}{formatCurrency(invoice.discrepancy)}
                            </span>
                            <p className="text-[10px] text-[#878787]">
                              {invoice.discrepancyPercent > 0 ? '+' : ''}{invoice.discrepancyPercent.toFixed(1)}%
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#388e3c]">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          invoice.deliveryVerified ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]'
                        }`}>
                          {invoice.deliveryVerified ? 'Yes' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          invoice.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          invoice.status === 'overbilled' ? 'bg-[#fff3e0] text-[#e65100]' :
                          invoice.status === 'partial_delivery' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                          'bg-[#ffebee] text-[#c62828]'
                        }`}>
                          {invoice.status === 'compliant' ? 'Compliant' :
                           invoice.status === 'overbilled' ? 'Overbilled' :
                           invoice.status === 'partial_delivery' ? 'Partial' : 'Flagged'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setSelectedMarketing(invoice)}
                          className="text-[#2874f0] hover:underline text-xs font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* SOW by Agency */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <FileText className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Active SOWs (Simplicontract)</h3>
                  <p className="text-xs text-[#878787]">Statement of Work by agency</p>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {mockMarketingSOWs.map(sow => (
                  <div key={sow.id} className="p-3 bg-[#f1f3f6] rounded-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-medium text-[#212121]">{sow.vendor}</span>
                        <p className="text-[10px] text-[#878787]">{sow.projectName}</p>
                      </div>
                      <span className="text-xs font-medium text-[#2874f0]">{formatCurrency(sow.totalValue)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sow.deliverables.slice(0, 3).map(d => (
                        <span key={d.id} className="px-1.5 py-0.5 text-[10px] bg-white rounded text-[#878787]">
                          {d.quantity}x {d.description.split(' ').slice(0, 2).join(' ')}
                        </span>
                      ))}
                      {sow.deliverables.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-[#2874f0] rounded text-white">
                          +{sow.deliverables.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agency-wise Summary */}
            <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                  <Building2 className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121] text-sm">Agency-wise Summary</h3>
                  <p className="text-xs text-[#878787]">Invoice count and compliance</p>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {mockMarketingSOWs.slice(0, 5).map(sow => {
                    const agencyInvoices = mockMarketingInvoices.filter(i => i.vendor === sow.vendor);
                    const invoiceCount = agencyInvoices.length;
                    const compliant = agencyInvoices.filter(i => i.status === 'compliant').length;
                    const totalBilled = agencyInvoices.reduce((acc, i) => acc + i.totalInvoiced, 0);
                    return (
                      <div key={sow.id} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{sow.vendor}</p>
                          <p className="text-[10px] text-[#878787]">{invoiceCount} invoices • {compliant}/{invoiceCount} compliant</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-[#212121]">{formatCurrency(totalBilled)}</p>
                          <p className="text-[10px] text-[#878787]">Total Billed</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'infrastructure' && (
        <>
          {/* Infrastructure Price Variance View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Invoices</p>
                  <p className="text-xl font-medium text-[#212121]">{infrastructureStats.totalInvoices}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#388e3c] rounded-sm flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Within Threshold</p>
                  <p className="text-xl font-medium text-[#388e3c]">{infrastructureStats.compliant}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">High Variance</p>
                  <p className="text-xl font-medium text-[#ff9f00]">{infrastructureStats.variance}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff6161] rounded-sm flex items-center justify-center">
                  <AlertTriangle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Outliers Flagged</p>
                  <p className="text-xl font-medium text-[#ff6161]">{infrastructureStats.flagged}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Overcharge</p>
                  <p className="text-xl font-medium text-[#9c27b0]">{formatCurrency(infrastructureStats.totalVarianceAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#e3f2fd] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#1565c0] font-medium">Total Line Items Analyzed</p>
                <p className="text-sm text-[#212121]">{infrastructureStats.totalItems} items across {infrastructureStats.totalInvoices} invoices</p>
              </div>
              <Package className="text-[#1565c0]" size={24} />
            </div>
            <div className="bg-[#ffebee] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#c62828] font-medium">Price Outlier Items</p>
                <p className="text-sm text-[#212121]">{infrastructureStats.outlierItems} items flagged as significant outliers</p>
              </div>
              <AlertCircle className="text-[#c62828]" size={24} />
            </div>
            <div className="bg-[#fff3e0] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#e65100] font-medium">Pending GRN Verification</p>
                <p className="text-sm text-[#212121]">{infrastructureStats.unverifiedGRN} invoices awaiting verification</p>
              </div>
              <FileCheck className="text-[#e65100]" size={24} />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Invoice Table - Takes 2 columns */}
            <div className="col-span-2 bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                    <Building2 className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Infrastructure Invoice Price Analysis</h3>
                    <p className="text-xs text-[#878787]">Compare unit prices against historical averages</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#f1f3f6] text-[#212121] text-xs font-medium rounded-sm hover:bg-[#e0e0e0] transition-colors flex items-center gap-1">
                  <Download size={14} />
                  Export Analysis
                </button>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-[#f1f3f6] sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Invoice ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Vendor</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Project</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Items</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Expected</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Invoiced</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Variance</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Status</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {mockInfrastructureInvoices.map(invoice => (
                      <tr key={invoice.invoiceId} className="hover:bg-[#f1f3f6] transition-colors">
                        <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{invoice.invoiceId}</td>
                        <td className="px-3 py-3">
                          <p className="text-xs font-medium text-[#212121]">{invoice.vendor}</p>
                          <p className="text-[10px] text-[#878787]">{invoice.vendorType}</p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-[#212121]">{invoice.project}</p>
                          <p className="text-[10px] text-[#878787]">{invoice.location}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-[#212121]">{invoice.items.length} items</td>
                        <td className="px-3 py-3 text-xs text-right text-[#212121]">{formatCurrency(invoice.totalExpected)}</td>
                        <td className="px-3 py-3 text-xs text-right text-[#212121]">{formatCurrency(invoice.totalAmount)}</td>
                        <td className="px-3 py-3 text-xs text-right">
                          <span className={invoice.totalVariance > 0 ? 'text-[#ff6161]' : invoice.totalVariance < 0 ? 'text-[#388e3c]' : 'text-[#212121]'}>
                            {invoice.totalVariance > 0 ? '+' : ''}{formatCurrency(invoice.totalVariance)}
                          </span>
                          <span className={`text-[10px] ml-1 ${invoice.variancePercent > 10 ? 'text-[#ff6161]' : invoice.variancePercent > 5 ? 'text-[#ff9f00]' : 'text-[#878787]'}`}>
                            ({invoice.variancePercent > 0 ? '+' : ''}{invoice.variancePercent.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                            invoice.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                            invoice.status === 'variance' ? 'bg-[#fff3e0] text-[#e65100]' :
                            'bg-[#ffebee] text-[#c62828]'
                          }`}>
                            {invoice.status === 'compliant' ? 'Normal' : invoice.status === 'variance' ? 'High Variance' : 'Outlier'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => setSelectedInfrastructure(invoice)}
                            className="p-1.5 text-[#2874f0] hover:bg-[#e8f0fe] rounded-sm transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Category-wise Analysis */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                    <Package className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Category-wise Variance</h3>
                    <p className="text-xs text-[#878787]">Price variance by item category</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {['electrical', 'hvac', 'plumbing', 'civil', 'furniture', 'safety', 'it_hardware'].map(cat => {
                    const catItems = mockInfrastructureInvoices.flatMap(i => i.items).filter(item => item.category === cat);
                    if (catItems.length === 0) return null;
                    const totalVariance = catItems.reduce((acc, item) => acc + item.variance, 0);
                    const avgVariancePercent = catItems.reduce((acc, item) => acc + item.variancePercent, 0) / catItems.length;
                    return (
                      <div key={cat} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121] capitalize">{cat.replace('_', ' ')}</p>
                          <p className="text-[10px] text-[#878787]">{catItems.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${totalVariance > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                            {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                          </p>
                          <p className={`text-[10px] ${avgVariancePercent > 10 ? 'text-[#ff6161]' : avgVariancePercent > 5 ? 'text-[#ff9f00]' : 'text-[#878787]'}`}>
                            Avg: {avgVariancePercent > 0 ? '+' : ''}{avgVariancePercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Outlier Items */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#ff6161] rounded-sm flex items-center justify-center">
                    <AlertTriangle className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Top Price Outliers</h3>
                    <p className="text-xs text-[#878787]">Items with highest variance %</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {mockInfrastructureInvoices
                    .flatMap(inv => inv.items.map(item => ({ ...item, invoiceId: inv.invoiceId, vendor: inv.vendor })))
                    .filter(item => item.variancePercent > 15)
                    .sort((a, b) => b.variancePercent - a.variancePercent)
                    .slice(0, 5)
                    .map((item, idx) => (
                      <div key={`${item.invoiceId}-${item.itemId}-${idx}`} className="p-2 bg-[#ffebee] rounded-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium text-[#212121]">{item.itemName}</p>
                            <p className="text-[10px] text-[#878787]">{item.vendor} • {item.invoiceId}</p>
                          </div>
                          <span className="text-xs font-medium text-[#c62828]">+{item.variancePercent.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px]">
                          <span className="text-[#878787]">Hist. Avg: ₹{item.historicalAvgPrice}</span>
                          <span className="text-[#c62828]">Invoiced: ₹{item.unitPrice}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Vendor-wise Summary */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                    <Users className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Vendor Performance</h3>
                    <p className="text-xs text-[#878787]">Price compliance by vendor</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {Array.from(new Set(mockInfrastructureInvoices.map(i => i.vendor))).slice(0, 5).map(vendor => {
                    const vendorInvoices = mockInfrastructureInvoices.filter(i => i.vendor === vendor);
                    const compliant = vendorInvoices.filter(i => i.status === 'compliant').length;
                    const totalVariance = vendorInvoices.reduce((acc, i) => acc + i.totalVariance, 0);
                    return (
                      <div key={vendor} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{vendor}</p>
                          <p className="text-[10px] text-[#878787]">{vendorInvoices.length} invoices • {compliant}/{vendorInvoices.length} compliant</p>
                        </div>
                        <span className={`text-xs font-medium ${totalVariance > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                          {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'duplicates' && (
        <>
          {/* Retroactive Duplicates Detection View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Duplicates</p>
                  <p className="text-xl font-medium text-[#212121]">{duplicateStats.totalDuplicates}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff6161] rounded-sm flex items-center justify-center">
                  <AlertTriangle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Confirmed</p>
                  <p className="text-xl font-medium text-[#ff6161]">{duplicateStats.confirmed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                  <AlertCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Potential</p>
                  <p className="text-xl font-medium text-[#ff9f00]">{duplicateStats.potential}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Amount</p>
                  <p className="text-xl font-medium text-[#9c27b0]">{formatCurrency(duplicateStats.totalAmount)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#388e3c] rounded-sm flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Recovered</p>
                  <p className="text-xl font-medium text-[#388e3c]">{formatCurrency(duplicateStats.recoveredAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#e3f2fd] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#1565c0] font-medium">Pending Recovery</p>
                <p className="text-sm text-[#212121]">{formatCurrency(duplicateStats.pendingRecovery)} from {duplicateStats.totalDuplicates - mockDuplicateInvoices.filter(i => i.recoveryStatus === 'recovered').length} invoices</p>
              </div>
              <DollarSign className="text-[#1565c0]" size={24} />
            </div>
            <div className="bg-[#fff3e0] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#e65100] font-medium">Under Review</p>
                <p className="text-sm text-[#212121]">{duplicateStats.underReview} invoices require manual verification</p>
              </div>
              <Eye className="text-[#e65100]" size={24} />
            </div>
            <div className="bg-[#f3e5f5] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7b1fa2] font-medium">Avg. Days Between Payments</p>
                <p className="text-sm text-[#212121]">{duplicateStats.avgDaysBetween} days between original and duplicate</p>
              </div>
              <Clock className="text-[#7b1fa2]" size={24} />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Duplicate Table - Takes 2 columns */}
            <div className="col-span-2 bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                    <FileText className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Duplicate Invoice Detection (Oracle EBS)</h3>
                    <p className="text-xs text-[#878787]">Vendor + Invoice # + Amount matching across periods</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#f1f3f6] text-[#212121] text-xs font-medium rounded-sm hover:bg-[#e0e0e0] transition-colors flex items-center gap-1">
                  <Download size={14} />
                  Export Report
                </button>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-[#f1f3f6] sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Invoice #</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Vendor</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Amount</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Original Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Duplicate Date</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Days Gap</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Status</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Recovery</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {mockDuplicateInvoices.map(invoice => (
                      <tr key={invoice.invoiceId} className="hover:bg-[#f1f3f6] transition-colors">
                        <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{invoice.invoiceNumber}</td>
                        <td className="px-3 py-3">
                          <p className="text-xs font-medium text-[#212121]">{invoice.vendor}</p>
                          <p className="text-[10px] text-[#878787]">{invoice.department}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-right font-medium text-[#212121]">{formatCurrency(invoice.amount)}</td>
                        <td className="px-3 py-3 text-xs text-[#212121]">{invoice.originalPaymentDate}</td>
                        <td className="px-3 py-3 text-xs text-[#ff6161]">{invoice.duplicatePaymentDate}</td>
                        <td className="px-3 py-3 text-xs text-center">
                          <span className={`px-2 py-0.5 rounded-sm ${invoice.daysBetween > 90 ? 'bg-[#ffebee] text-[#c62828]' : 'bg-[#fff3e0] text-[#e65100]'}`}>
                            {invoice.daysBetween}d
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                            invoice.status === 'confirmed_duplicate' ? 'bg-[#ffebee] text-[#c62828]' :
                            invoice.status === 'potential_duplicate' ? 'bg-[#fff3e0] text-[#e65100]' :
                            'bg-[#e3f2fd] text-[#1565c0]'
                          }`}>
                            {invoice.status === 'confirmed_duplicate' ? 'Confirmed' :
                             invoice.status === 'potential_duplicate' ? 'Potential' : 'Under Review'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                            invoice.recoveryStatus === 'recovered' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                            invoice.recoveryStatus === 'in_progress' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                            invoice.recoveryStatus === 'pending' ? 'bg-[#fff3e0] text-[#e65100]' :
                            'bg-[#f5f5f5] text-[#757575]'
                          }`}>
                            {invoice.recoveryStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => setSelectedDuplicate(invoice)}
                            className="p-1.5 text-[#2874f0] hover:bg-[#e8f0fe] rounded-sm transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Source System Breakdown */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                    <Activity className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">By Source System</h3>
                    <p className="text-xs text-[#878787]">Detection by ERP system</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {['Oracle EBS', 'SAP', 'Manual Entry'].map(source => {
                    const sourceInvoices = mockDuplicateInvoices.filter(i => i.source === source);
                    const totalAmount = sourceInvoices.reduce((acc, i) => acc + i.amount, 0);
                    return (
                      <div key={source} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{source}</p>
                          <p className="text-[10px] text-[#878787]">{sourceInvoices.length} duplicates</p>
                        </div>
                        <p className="text-xs font-medium text-[#ff6161]">{formatCurrency(totalAmount)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Breakdown */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                    <Users className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">By Department</h3>
                    <p className="text-xs text-[#878787]">Duplicate exposure by dept</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {Array.from(new Set(mockDuplicateInvoices.map(i => i.department))).map(dept => {
                    const deptInvoices = mockDuplicateInvoices.filter(i => i.department === dept);
                    const totalAmount = deptInvoices.reduce((acc, i) => acc + i.amount, 0);
                    return (
                      <div key={dept} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{dept}</p>
                          <p className="text-[10px] text-[#878787]">{deptInvoices.length} cases</p>
                        </div>
                        <p className="text-xs font-medium text-[#212121]">{formatCurrency(totalAmount)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recovery Summary */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                    <DollarSign className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Recovery Progress</h3>
                    <p className="text-xs text-[#878787]">Amount recovery status</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#878787]">Total Duplicate Amount</span>
                      <span className="text-sm font-medium text-[#212121]">{formatCurrency(duplicateStats.totalAmount)}</span>
                    </div>
                    <div className="h-2 bg-[#f1f3f6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#388e3c] rounded-full"
                        style={{ width: `${(duplicateStats.recoveredAmount / duplicateStats.totalAmount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#388e3c]">Recovered: {formatCurrency(duplicateStats.recoveredAmount)}</span>
                      <span className="text-[#ff9f00]">Pending: {formatCurrency(duplicateStats.pendingRecovery)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'addendum' && (
        <>
          {/* Addendum Timing Validation View */}
          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#2874f0] rounded-sm flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Issues</p>
                  <p className="text-xl font-medium text-[#212121]">{addendumStats.totalIssues}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff6161] rounded-sm flex items-center justify-center">
                  <AlertTriangle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Flagged</p>
                  <p className="text-xl font-medium text-[#ff6161]">{addendumStats.flagged}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Overcharge</p>
                  <p className="text-xl font-medium text-[#ff9f00]">{formatCurrency(addendumStats.totalOvercharge)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#9c27b0] rounded-sm flex items-center justify-center">
                  <TrendingDown className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Total Undercharge</p>
                  <p className="text-xl font-medium text-[#9c27b0]">{formatCurrency(addendumStats.totalUndercharge)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#388e3c] rounded-sm flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#878787]">Resolved</p>
                  <p className="text-xl font-medium text-[#388e3c]">{addendumStats.resolved}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#e3f2fd] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#1565c0] font-medium">Confirmed Issues</p>
                <p className="text-sm text-[#212121]">{addendumStats.confirmed} invoices with wrong addendum applied</p>
              </div>
              <AlertTriangle className="text-[#1565c0]" size={24} />
            </div>
            <div className="bg-[#fff3e0] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#e65100] font-medium">Disputed by Vendor</p>
                <p className="text-sm text-[#212121]">{addendumStats.disputed} cases under dispute resolution</p>
              </div>
              <AlertCircle className="text-[#e65100]" size={24} />
            </div>
            <div className="bg-[#f3e5f5] rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7b1fa2] font-medium">Avg. Rate Difference</p>
                <p className="text-sm text-[#212121]">{addendumStats.avgRateDifference}% average rate variance</p>
              </div>
              <Percent className="text-[#7b1fa2]" size={24} />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Issues Table - Takes 2 columns */}
            <div className="col-span-2 bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                    <Clock className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Addendum Timing Validation (Simplicontract)</h3>
                    <p className="text-xs text-[#878787]">Invoice date vs addendum validity periods</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#f1f3f6] text-[#212121] text-xs font-medium rounded-sm hover:bg-[#e0e0e0] transition-colors flex items-center gap-1">
                  <Download size={14} />
                  Export Report
                </button>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-[#f1f3f6] sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Invoice ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Vendor</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Amount</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Applied</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Correct</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Variance</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Status</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {mockAddendumTimingIssues.map(issue => (
                      <tr key={issue.issueId} className="hover:bg-[#f1f3f6] transition-colors">
                        <td className="px-3 py-3 text-xs font-mono text-[#2874f0]">{issue.invoiceId}</td>
                        <td className="px-3 py-3">
                          <p className="text-xs font-medium text-[#212121]">{issue.vendor}</p>
                          <p className="text-[10px] text-[#878787]">{issue.category}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-right font-medium text-[#212121]">{formatCurrency(issue.invoiceAmount)}</td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-[#212121]">V{issue.appliedAddendum.version}</p>
                          <p className="text-[10px] text-[#878787]">{issue.appliedAddendum.effectiveFrom}</p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-[#388e3c]">V{issue.correctAddendum.version}</p>
                          <p className="text-[10px] text-[#878787]">{issue.correctAddendum.effectiveFrom}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-right">
                          <span className={issue.potentialOvercharge > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}>
                            {issue.potentialOvercharge > 0 ? '+' : ''}{formatCurrency(issue.potentialOvercharge)}
                          </span>
                          <span className="block text-[10px] text-[#878787]">{issue.rateDifference}% diff</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                            issue.status === 'flagged' ? 'bg-[#ffebee] text-[#c62828]' :
                            issue.status === 'confirmed' ? 'bg-[#fff3e0] text-[#e65100]' :
                            issue.status === 'disputed' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                            'bg-[#e8f5e9] text-[#2e7d32]'
                          }`}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => setSelectedAddendumIssue(issue)}
                            className="p-1.5 text-[#2874f0] hover:bg-[#e8f0fe] rounded-sm transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Category Breakdown */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#ff9f00] rounded-sm flex items-center justify-center">
                    <Package className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">By Category</h3>
                    <p className="text-xs text-[#878787]">Issues by spend category</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {Array.from(new Set(mockAddendumTimingIssues.map(i => i.category))).map(cat => {
                    const catIssues = mockAddendumTimingIssues.filter(i => i.category === cat);
                    const totalVariance = catIssues.reduce((acc, i) => acc + Math.abs(i.potentialOvercharge), 0);
                    return (
                      <div key={cat} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{cat}</p>
                          <p className="text-[10px] text-[#878787]">{catIssues.length} issues</p>
                        </div>
                        <p className="text-xs font-medium text-[#ff6161]">{formatCurrency(totalVariance)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vendor Breakdown */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#388e3c] rounded-sm flex items-center justify-center">
                    <Users className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">By Vendor</h3>
                    <p className="text-xs text-[#878787]">Addendum issues by vendor</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {Array.from(new Set(mockAddendumTimingIssues.map(i => i.vendor))).slice(0, 5).map(vendor => {
                    const vendorIssues = mockAddendumTimingIssues.filter(i => i.vendor === vendor);
                    const variance = vendorIssues.reduce((acc, i) => acc + i.potentialOvercharge, 0);
                    return (
                      <div key={vendor} className="flex items-center justify-between p-2 bg-[#f1f3f6] rounded-sm">
                        <div>
                          <p className="text-xs font-medium text-[#212121]">{vendor}</p>
                          <p className="text-[10px] text-[#878787]">{vendorIssues.length} issues</p>
                        </div>
                        <span className={`text-xs font-medium ${variance > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                          {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Impact Summary */}
              <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#2874f0] rounded-sm flex items-center justify-center">
                    <Calculator className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#212121] text-sm">Financial Impact</h3>
                    <p className="text-xs text-[#878787]">Net impact from timing issues</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-[#ffebee] rounded-sm">
                      <p className="text-xs text-[#c62828] font-medium">Overcharged (We Paid More)</p>
                      <p className="text-lg font-medium text-[#c62828]">{formatCurrency(addendumStats.totalOvercharge)}</p>
                      <p className="text-[10px] text-[#878787]">Recoverable from vendors</p>
                    </div>
                    <div className="p-3 bg-[#e8f5e9] rounded-sm">
                      <p className="text-xs text-[#2e7d32] font-medium">Undercharged (We Paid Less)</p>
                      <p className="text-lg font-medium text-[#2e7d32]">{formatCurrency(addendumStats.totalUndercharge)}</p>
                      <p className="text-[10px] text-[#878787]">May need to pay difference</p>
                    </div>
                    <div className="p-3 bg-[#f1f3f6] rounded-sm border-l-4 border-[#2874f0]">
                      <p className="text-xs text-[#878787] font-medium">Net Position</p>
                      <p className={`text-lg font-medium ${(addendumStats.totalOvercharge - addendumStats.totalUndercharge) > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                        {formatCurrency(Math.abs(addendumStats.totalOvercharge - addendumStats.totalUndercharge))}
                        <span className="text-xs ml-1">
                          {(addendumStats.totalOvercharge - addendumStats.totalUndercharge) > 0 ? 'to recover' : 'to pay'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Case Management Dashboard View */}
      {viewMode === 'cases' && (
        <>
          {/* Back Button */}
          <button
            onClick={() => setViewMode('overview')}
            className="mb-4 flex items-center gap-2 text-[#2874f0] hover:underline text-sm font-medium"
          >
            <ChevronRight className="rotate-180" size={16} />
            Back to Overview
          </button>

          {/* Case Stats Summary */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="text-[#2874f0]" size={18} />
                <span className="text-xs text-[#878787]">Total Cases</span>
              </div>
              <p className="text-2xl font-medium text-[#212121]">{mockLeakageFindings.length}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-[#ff6161]" size={18} />
                <span className="text-xs text-[#878787]">New</span>
              </div>
              <p className="text-2xl font-medium text-[#ff6161]">{mockLeakageFindings.filter(f => f.status === 'new').length}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Search className="text-[#ff9f00]" size={18} />
                <span className="text-xs text-[#878787]">Investigating</span>
              </div>
              <p className="text-2xl font-medium text-[#ff9f00]">{mockLeakageFindings.filter(f => f.status === 'investigating' || f.status === 'triaged').length}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-[#7b1fa2]" size={18} />
                <span className="text-xs text-[#878787]">Pending Approval</span>
              </div>
              <p className="text-2xl font-medium text-[#7b1fa2]">{mockLeakageFindings.filter(f => f.status === 'pending_approval').length}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-[#0891b2]" size={18} />
                <span className="text-xs text-[#878787]">Recovery In Progress</span>
              </div>
              <p className="text-2xl font-medium text-[#0891b2]">{mockLeakageFindings.filter(f => f.status === 'recovery_initiated').length}</p>
            </div>
            <div className="bg-white rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#388e3c]" size={18} />
                <span className="text-xs text-[#878787]">Recovered</span>
              </div>
              <p className="text-2xl font-medium text-[#388e3c]">{mockLeakageFindings.filter(f => f.status === 'recovered' || f.status === 'closed').length}</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#ffebee] to-[#ffcdd2] rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <p className="text-xs text-[#c62828] font-medium mb-1">Total Leakage Identified</p>
              <p className="text-3xl font-bold text-[#c62828]">{formatCurrency(mockLeakageFindings.reduce((acc, f) => acc + f.leakageAmount, 0))}</p>
              <p className="text-xs text-[#878787] mt-1">{mockLeakageFindings.filter(f => f.leakageAmount > 0).length} active cases</p>
            </div>
            <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <p className="text-xs text-[#2e7d32] font-medium mb-1">Amount Recovered</p>
              <p className="text-3xl font-bold text-[#2e7d32]">{formatCurrency(mockLeakageFindings.reduce((acc, f) => acc + f.recoveredAmount, 0))}</p>
              <p className="text-xs text-[#878787] mt-1">{mockLeakageFindings.filter(f => f.recoveredAmount > 0).length} cases resolved</p>
            </div>
            <div className="bg-gradient-to-br from-[#e8f0fe] to-[#bbdefb] rounded-sm p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
              <p className="text-xs text-[#1565c0] font-medium mb-1">Potential Savings Pending</p>
              <p className="text-3xl font-bold text-[#1565c0]">{formatCurrency(mockLeakageFindings.reduce((acc, f) => acc + f.potentialSavings, 0))}</p>
              <p className="text-xs text-[#878787] mt-1">Awaiting recovery action</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-sm p-4 mb-4 flex items-center justify-between" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878787]" size={16} />
                <input
                  type="text"
                  placeholder="Search cases, vendors, descriptions..."
                  className="pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-sm text-sm w-80 focus:outline-none focus:border-[#2874f0]"
                  value={caseSearchTerm}
                  onChange={(e) => setCaseSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]"
                value={caseStatusFilter}
                onChange={(e) => setCaseStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="triaged">Triaged</option>
                <option value="investigating">Investigating</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="recovery_initiated">Recovery Initiated</option>
                <option value="recovered">Recovered</option>
                <option value="closed">Closed</option>
                <option value="false_positive">False Positive</option>
              </select>
              <select
                className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]"
                value={caseSeverityFilter}
                onChange={(e) => setCaseSeverityFilter(e.target.value)}
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm bg-white text-[#212121]"
                value={caseCategoryFilter}
                onChange={(e) => setCaseCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="duplicate">Duplicate Payments</option>
                <option value="rate_card">Rate Card Violations</option>
                <option value="license">License Compliance</option>
                <option value="recruitment">Recruitment Fees</option>
                <option value="marketing">Marketing Deliverables</option>
                <option value="infrastructure">Infrastructure Pricing</option>
                <option value="addendum">Addendum Timing</option>
                <option value="compliance">Compliance Issues</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm text-[#212121] flex items-center gap-2 hover:bg-[#f1f3f6]">
                <Filter size={14} />
                More Filters
              </button>
              <button className="px-3 py-2 bg-[#2874f0] text-white rounded-sm text-sm flex items-center gap-2 hover:bg-[#1a5dc8]">
                <Download size={14} />
                Export
              </button>
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <table className="w-full">
              <thead className="bg-[#f1f3f6]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Case ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Finding</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Vendor</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#878787] uppercase">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#878787] uppercase">Severity</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#878787] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Assignee</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#878787] uppercase">SLA</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#878787] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {mockLeakageFindings
                  .filter(f => {
                    const matchesSearch = caseSearchTerm === '' ||
                      f.caseId.toLowerCase().includes(caseSearchTerm.toLowerCase()) ||
                      f.title.toLowerCase().includes(caseSearchTerm.toLowerCase()) ||
                      f.vendor.name.toLowerCase().includes(caseSearchTerm.toLowerCase());
                    const matchesStatus = caseStatusFilter === 'all' || f.status === caseStatusFilter;
                    const matchesSeverity = caseSeverityFilter === 'all' || f.severity === caseSeverityFilter;
                    const matchesCategory = caseCategoryFilter === 'all' || f.category === caseCategoryFilter;
                    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
                  })
                  .map(finding => (
                    <tr key={finding.caseId} className="hover:bg-[#f9fafb] transition-colors cursor-pointer" onClick={() => { setSelectedFinding(finding); setViewMode('investigation'); setInvestigationTab('details'); }}>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-[#2874f0]">{finding.caseId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-[#212121] truncate">{finding.title}</p>
                          <p className="text-xs text-[#878787] truncate">{finding.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          finding.category === 'duplicate' ? 'bg-[#ffebee] text-[#c62828]' :
                          finding.category === 'rate_card' ? 'bg-[#e8f0fe] text-[#2874f0]' :
                          finding.category === 'license' ? 'bg-[#f3e8ff] text-[#7b1fa2]' :
                          finding.category === 'recruitment' ? 'bg-[#e0f7fa] text-[#00838f]' :
                          finding.category === 'marketing' ? 'bg-[#fff3e0] text-[#e65100]' :
                          finding.category === 'infrastructure' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          finding.category === 'addendum' ? 'bg-[#fce4ec] text-[#c2185b]' :
                          'bg-[#f1f3f6] text-[#878787]'
                        }`}>
                          {finding.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[#212121]">{finding.vendor.name}</p>
                        <p className="text-xs text-[#878787]">{finding.vendor.code}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-medium text-[#ff6161]">{formatCurrency(finding.leakageAmount)}</p>
                        {finding.recoveredAmount > 0 && (
                          <p className="text-xs text-[#388e3c]">Recovered: {formatCurrency(finding.recoveredAmount)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          finding.severity === 'critical' ? 'bg-[#b71c1c] text-white' :
                          finding.severity === 'high' ? 'bg-[#ffebee] text-[#c62828]' :
                          finding.severity === 'medium' ? 'bg-[#fff3e0] text-[#e65100]' :
                          'bg-[#e8f5e9] text-[#2e7d32]'
                        }`}>
                          {finding.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                          finding.status === 'new' ? 'bg-[#e8f0fe] text-[#2874f0]' :
                          finding.status === 'triaged' ? 'bg-[#fff8e1] text-[#f57c00]' :
                          finding.status === 'investigating' ? 'bg-[#fff3e0] text-[#e65100]' :
                          finding.status === 'pending_approval' ? 'bg-[#f3e8ff] text-[#7b1fa2]' :
                          finding.status === 'recovery_initiated' ? 'bg-[#e0f7fa] text-[#00838f]' :
                          finding.status === 'recovered' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          finding.status === 'closed' ? 'bg-[#f1f3f6] text-[#878787]' :
                          finding.status === 'false_positive' ? 'bg-[#fafafa] text-[#9e9e9e]' :
                          'bg-[#f1f3f6] text-[#878787]'
                        }`}>
                          {finding.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {finding.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#2874f0] rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {finding.assignee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs text-[#212121]">{finding.assignee.name}</p>
                              <p className="text-[10px] text-[#878787]">{finding.assignee.department}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#ff9f00] font-medium flex items-center gap-1">
                            <AlertCircle size={12} />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          finding.slaStatus === 'on_track' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          finding.slaStatus === 'at_risk' ? 'bg-[#fff3e0] text-[#e65100]' :
                          'bg-[#ffebee] text-[#c62828]'
                        }`}>
                          {finding.slaStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedFinding(finding); setViewMode('investigation'); setInvestigationTab('details'); }}
                          className="text-[#2874f0] hover:underline text-sm font-medium"
                        >
                          Investigate
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-4">
            <p className="text-sm text-[#878787]">
              Showing {mockLeakageFindings.filter(f => {
                const matchesSearch = caseSearchTerm === '' ||
                  f.caseId.toLowerCase().includes(caseSearchTerm.toLowerCase()) ||
                  f.title.toLowerCase().includes(caseSearchTerm.toLowerCase()) ||
                  f.vendor.name.toLowerCase().includes(caseSearchTerm.toLowerCase());
                const matchesStatus = caseStatusFilter === 'all' || f.status === caseStatusFilter;
                const matchesSeverity = caseSeverityFilter === 'all' || f.severity === caseSeverityFilter;
                const matchesCategory = caseCategoryFilter === 'all' || f.category === caseCategoryFilter;
                return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
              }).length} of {mockLeakageFindings.length} cases
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm text-[#878787]">Previous</button>
              <button className="px-3 py-1.5 bg-[#2874f0] text-white rounded-sm text-sm">1</button>
              <button className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm text-[#212121]">2</button>
              <button className="px-3 py-1.5 border border-[#e0e0e0] rounded-sm text-sm text-[#878787]">Next</button>
            </div>
          </div>
        </>
      )}

      {/* Investigation View */}
      {viewMode === 'investigation' && selectedFinding && (
        <div className="space-y-4">
          {/* Back Button & Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setViewMode('cases'); setSelectedFinding(null); }}
              className="flex items-center gap-2 text-[#2874f0] hover:underline text-sm font-medium"
            >
              <ChevronRight className="rotate-180" size={16} />
              Back to Case Management
            </button>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-[#e0e0e0] rounded-sm text-sm text-[#212121] flex items-center gap-2 hover:bg-[#f1f3f6]">
                <Download size={14} />
                Export Case
              </button>
              <button className="px-4 py-2 bg-[#2874f0] text-white rounded-sm text-sm flex items-center gap-2 hover:bg-[#1a5dc8]">
                <Send size={14} />
                Escalate
              </button>
            </div>
          </div>

          {/* Case Header Card */}
          <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className={`h-2 ${
              selectedFinding.severity === 'critical' ? 'bg-[#c62828]' :
              selectedFinding.severity === 'high' ? 'bg-[#ff6161]' :
              selectedFinding.severity === 'medium' ? 'bg-[#ff9f00]' :
              'bg-[#388e3c]'
            }`}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-mono font-bold text-[#2874f0]">{selectedFinding.caseId}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      selectedFinding.severity === 'critical' ? 'bg-[#ffebee] text-[#c62828]' :
                      selectedFinding.severity === 'high' ? 'bg-[#fff3e0] text-[#e65100]' :
                      selectedFinding.severity === 'medium' ? 'bg-[#fffde7] text-[#f57f17]' :
                      'bg-[#e8f5e9] text-[#2e7d32]'
                    }`}>{selectedFinding.severity.toUpperCase()}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      selectedFinding.status === 'new' ? 'bg-[#e8f0fe] text-[#2874f0]' :
                      selectedFinding.status === 'investigating' ? 'bg-[#f3e8ff] text-[#7b1fa2]' :
                      selectedFinding.status === 'pending_approval' ? 'bg-[#fff3e0] text-[#e65100]' :
                      selectedFinding.status === 'recovery_initiated' ? 'bg-[#e0f7fa] text-[#00838f]' :
                      selectedFinding.status === 'recovered' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                      'bg-[#f1f3f6] text-[#878787]'
                    }`}>{selectedFinding.status.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  <h1 className="text-lg font-medium text-[#212121]">{selectedFinding.title}</h1>
                  <p className="text-sm text-[#878787] mt-1">{selectedFinding.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#c62828]">{formatCurrency(selectedFinding.leakageAmount)}</p>
                  <p className="text-xs text-[#878787]">Potential Leakage</p>
                  {selectedFinding.recoveredAmount > 0 && (
                    <p className="text-sm font-medium text-[#388e3c] mt-1">
                      {formatCurrency(selectedFinding.recoveredAmount)} Recovered
                    </p>
                  )}
                </div>
              </div>

              {/* Status Progress */}
              <div className="flex items-center gap-2 p-3 bg-[#f9fafb] rounded-sm">
                {['new', 'triaged', 'investigating', 'pending_approval', 'recovery_initiated', 'recovered'].map((status, idx, arr) => {
                  const currentIdx = arr.indexOf(selectedFinding.status);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = status === selectedFinding.status;
                  return (
                    <React.Fragment key={status}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium ${
                        isCompleted ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                        isCurrent ? 'bg-[#2874f0] text-white' :
                        'bg-[#e0e0e0] text-[#878787]'
                      }`}>
                        {isCompleted && <CheckCircle size={12} />}
                        {status.replace(/_/g, ' ')}
                      </div>
                      {idx < arr.length - 1 && <ChevronRight size={16} className="text-[#878787]" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Investigation Tabs */}
          <div className="bg-white rounded-sm" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex border-b border-[#e0e0e0]">
              {[
                { id: 'details', label: 'Case Details', icon: FileText },
                { id: 'transactions', label: 'Related Transactions', icon: DollarSign },
                { id: 'evidence', label: 'Evidence', icon: FileCheck },
                { id: 'timeline', label: 'Activity Timeline', icon: Clock },
                { id: 'analysis', label: 'AI Analysis', icon: Bot },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInvestigationTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    investigationTab === tab.id
                      ? 'border-[#2874f0] text-[#2874f0] bg-[#f9fafb]'
                      : 'border-transparent text-[#878787] hover:text-[#212121]'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Details Tab */}
              {investigationTab === 'details' && (
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    {/* Case Information */}
                    <div>
                      <h3 className="text-sm font-medium text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">Case Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#878787]">Category</p>
                          <p className="text-sm font-medium text-[#212121] mt-1">{selectedFinding.category.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#878787]">Sub-Category</p>
                          <p className="text-sm font-medium text-[#212121] mt-1">{selectedFinding.subCategory}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#878787]">Detection Method</p>
                          <p className="text-sm font-medium text-[#212121] mt-1">{selectedFinding.detectionMethod.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#878787]">Source System</p>
                          <p className="text-sm font-medium text-[#212121] mt-1">{selectedFinding.source}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#878787]">Created Date</p>
                          <p className="text-sm font-medium text-[#212121] mt-1">{selectedFinding.createdAt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#878787]">Due Date</p>
                          <p className="text-sm font-medium text-[#212121] mt-1">{selectedFinding.dueDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Root Cause & Recommendation */}
                    <div>
                      <h3 className="text-sm font-medium text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">Investigation Findings</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#fff3e0] rounded-sm border-l-4 border-[#ff9f00]">
                          <p className="text-xs font-medium text-[#e65100] mb-1">Root Cause</p>
                          <p className="text-sm text-[#212121]">{selectedFinding.rootCause}</p>
                        </div>
                        <div className="p-4 bg-[#e8f5e9] rounded-sm border-l-4 border-[#388e3c]">
                          <p className="text-xs font-medium text-[#2e7d32] mb-1">Recommendation</p>
                          <p className="text-sm text-[#212121]">{selectedFinding.recommendation}</p>
                        </div>
                        {selectedFinding.notes && (
                          <div className="p-4 bg-[#f1f3f6] rounded-sm">
                            <p className="text-xs font-medium text-[#878787] mb-1">Notes</p>
                            <p className="text-sm text-[#212121]">{selectedFinding.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className="text-sm font-medium text-[#212121] mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFinding.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-[#f1f3f6] text-[#212121] text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-4">
                    {/* Vendor Info */}
                    <div className="p-4 bg-[#f9fafb] rounded-sm">
                      <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Vendor</h4>
                      <p className="text-sm font-medium text-[#212121]">{selectedFinding.vendor.name}</p>
                      <p className="text-xs text-[#878787]">{selectedFinding.vendor.code}</p>
                      <a href={`mailto:${selectedFinding.vendor.contact}`} className="text-xs text-[#2874f0] mt-1 block">{selectedFinding.vendor.contact}</a>
                    </div>

                    {/* Assignee */}
                    <div className="p-4 bg-[#f9fafb] rounded-sm">
                      <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Assignee</h4>
                      {selectedFinding.assignee ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#2874f0] flex items-center justify-center text-white font-medium">
                              {selectedFinding.assignee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#212121]">{selectedFinding.assignee.name}</p>
                              <p className="text-xs text-[#878787]">{selectedFinding.assignee.department}</p>
                            </div>
                          </div>
                          <a href={`mailto:${selectedFinding.assignee.email}`} className="text-xs text-[#2874f0] mt-2 block">{selectedFinding.assignee.email}</a>
                        </>
                      ) : (
                        <button className="w-full py-2 border border-dashed border-[#e0e0e0] rounded-sm text-sm text-[#878787] hover:border-[#2874f0] hover:text-[#2874f0]">
                          + Assign
                        </button>
                      )}
                    </div>

                    {/* SLA Status */}
                    <div className={`p-4 rounded-sm ${
                      selectedFinding.slaStatus === 'on_track' ? 'bg-[#e8f5e9]' :
                      selectedFinding.slaStatus === 'at_risk' ? 'bg-[#fff3e0]' :
                      'bg-[#ffebee]'
                    }`}>
                      <h4 className="text-xs font-medium text-[#878787] uppercase mb-2">SLA Status</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedFinding.slaStatus === 'on_track' ? 'bg-[#388e3c]' :
                          selectedFinding.slaStatus === 'at_risk' ? 'bg-[#ff9f00]' :
                          'bg-[#ff6161]'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          selectedFinding.slaStatus === 'on_track' ? 'text-[#2e7d32]' :
                          selectedFinding.slaStatus === 'at_risk' ? 'text-[#e65100]' :
                          'text-[#c62828]'
                        }`}>{selectedFinding.slaStatus.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <p className="text-xs text-[#878787] mt-2">Due: {selectedFinding.dueDate}</p>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-4 bg-[#f9fafb] rounded-sm">
                      <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Financial Impact</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-[#878787]">Leakage Amount</span>
                          <span className="text-sm font-bold text-[#c62828]">{formatCurrency(selectedFinding.leakageAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-[#878787]">Recovered</span>
                          <span className="text-sm font-medium text-[#388e3c]">{formatCurrency(selectedFinding.recoveredAmount)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#e0e0e0]">
                          <span className="text-xs font-medium text-[#212121]">Pending Recovery</span>
                          <span className="text-sm font-bold text-[#2874f0]">{formatCurrency(selectedFinding.potentialSavings - selectedFinding.recoveredAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Tab */}
              {investigationTab === 'transactions' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-[#212121]">Related Transactions ({selectedFinding.relatedTransactions.length})</h3>
                    <button className="text-xs text-[#2874f0] font-medium">Export to Excel</button>
                  </div>
                  <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                    <table className="w-full">
                      <thead className="bg-[#f1f3f6]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Transaction ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Vendor</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-[#878787] uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#878787] uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0e0e0]">
                        {selectedFinding.relatedTransactions.map((txn, idx) => (
                          <tr key={txn.transactionId} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'}>
                            <td className="px-4 py-3">
                              <span className="font-mono text-sm text-[#2874f0]">{txn.transactionId}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                txn.type === 'Payment' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                                txn.type === 'Invoice' ? 'bg-[#e8f0fe] text-[#2874f0]' :
                                'bg-[#f1f3f6] text-[#878787]'
                              }`}>{txn.type}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#212121]">{txn.date}</td>
                            <td className="px-4 py-3 text-sm text-[#212121]">{txn.vendor}</td>
                            <td className="px-4 py-3 text-sm font-medium text-[#212121] text-right">{formatCurrency(txn.amount)}</td>
                            <td className="px-4 py-3 text-sm text-[#878787]">{txn.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Evidence Tab */}
              {investigationTab === 'evidence' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-[#212121]">Evidence & Attachments ({selectedFinding.evidence.length})</h3>
                    <button className="px-4 py-2 bg-[#2874f0] text-white rounded-sm text-sm flex items-center gap-2 hover:bg-[#1a5dc8]">
                      <Download size={14} />
                      Upload Evidence
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedFinding.evidence.map(ev => (
                      <div
                        key={ev.id}
                        className="p-4 border border-[#e0e0e0] rounded-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedEvidence(ev)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded flex items-center justify-center ${
                            ev.type === 'invoice' ? 'bg-[#e8f0fe]' :
                            ev.type === 'contract' ? 'bg-[#f3e8ff]' :
                            ev.type === 'email' ? 'bg-[#fff3e0]' :
                            ev.type === 'screenshot' ? 'bg-[#e0f7fa]' :
                            ev.type === 'report' ? 'bg-[#e8f5e9]' :
                            'bg-[#f1f3f6]'
                          }`}>
                            <FileText size={20} className={
                              ev.type === 'invoice' ? 'text-[#2874f0]' :
                              ev.type === 'contract' ? 'text-[#7b1fa2]' :
                              ev.type === 'email' ? 'text-[#e65100]' :
                              ev.type === 'screenshot' ? 'text-[#00838f]' :
                              ev.type === 'report' ? 'text-[#388e3c]' :
                              'text-[#878787]'
                            } />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#212121] truncate">{ev.name}</p>
                            <p className="text-xs text-[#878787] mt-1">{ev.type.toUpperCase()} • {ev.size}</p>
                            <p className="text-xs text-[#878787] mt-1">By {ev.uploadedBy}</p>
                            <p className="text-xs text-[#878787]">{ev.uploadedAt.split(' ')[0]}</p>
                          </div>
                        </div>
                        <button className="w-full mt-3 py-1.5 border border-[#e0e0e0] rounded-sm text-xs text-[#2874f0] font-medium hover:bg-[#f9fafb]">
                          View Document
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Tab */}
              {investigationTab === 'timeline' && (
                <div>
                  <h3 className="text-sm font-medium text-[#212121] mb-4">Activity Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#e0e0e0]"></div>
                    <div className="space-y-6">
                      {selectedFinding.activities.map((activity) => (
                        <div key={activity.id} className="relative pl-10">
                          <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                            activity.type === 'status_change' ? 'bg-[#2874f0] border-[#2874f0]' :
                            activity.type === 'evidence' ? 'bg-[#388e3c] border-[#388e3c]' :
                            activity.type === 'assignment' ? 'bg-[#7b1fa2] border-[#7b1fa2]' :
                            activity.type === 'comment' ? 'bg-[#ff9f00] border-[#ff9f00]' :
                            activity.type === 'escalation' ? 'bg-[#ff6161] border-[#ff6161]' :
                            'bg-[#878787] border-[#878787]'
                          } flex items-center justify-center`}>
                            {activity.type === 'status_change' && <Activity size={10} className="text-white" />}
                            {activity.type === 'evidence' && <FileText size={10} className="text-white" />}
                            {activity.type === 'assignment' && <Users size={10} className="text-white" />}
                            {activity.type === 'comment' && <FileText size={10} className="text-white" />}
                          </div>
                          <div className="bg-[#f9fafb] p-4 rounded-sm">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-[#212121]">{activity.action}</p>
                              <span className="text-xs text-[#878787]">{activity.timestamp}</span>
                            </div>
                            <p className="text-sm text-[#878787]">{activity.details}</p>
                            <p className="text-xs text-[#2874f0] mt-2">By {activity.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Comment */}
                  <div className="mt-6 pt-6 border-t border-[#e0e0e0]">
                    <h4 className="text-sm font-medium text-[#212121] mb-3">Add Comment</h4>
                    <div className="flex gap-3">
                      <textarea
                        placeholder="Enter your comment..."
                        className="flex-1 px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm resize-none focus:outline-none focus:border-[#2874f0]"
                        rows={3}
                      />
                      <button className="px-6 py-2 bg-[#2874f0] text-white rounded-sm text-sm font-medium hover:bg-[#1a5dc8] h-fit">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Analysis Tab */}
              {investigationTab === 'analysis' && (
                <div className="space-y-6">
                  {/* AI Summary */}
                  <div className="bg-gradient-to-r from-[#e8f0fe] to-[#f3e8ff] p-6 rounded-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#2874f0] rounded-full flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#212121] mb-2">AI-Powered Analysis Summary</h3>
                        <p className="text-sm text-[#212121] leading-relaxed">
                          Based on the analysis of {selectedFinding.relatedTransactions.length} related transactions and
                          {selectedFinding.evidence.length} supporting documents, this case has been classified as
                          <strong className={selectedFinding.severity === 'critical' ? ' text-[#c62828]' : selectedFinding.severity === 'high' ? ' text-[#e65100]' : ' text-[#ff9f00]'}>
                            {' '}{selectedFinding.severity.toUpperCase()}
                          </strong> severity with {
                            selectedFinding.detectionMethod === 'ai_detected' ? 'high confidence AI detection' :
                            selectedFinding.detectionMethod === 'rule_based' ? 'rule-based pattern matching' :
                            'manual audit verification'
                          }. The detected leakage pattern suggests {selectedFinding.rootCause.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pattern Analysis */}
                  <div>
                    <h3 className="text-sm font-medium text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">Pattern Analysis</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-[#f9fafb] rounded-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={16} className="text-[#ff9f00]" />
                          <span className="text-xs font-medium text-[#878787]">Detection Confidence</span>
                        </div>
                        <p className="text-2xl font-bold text-[#212121]">94.5%</p>
                        <p className="text-xs text-[#878787] mt-1">Based on historical pattern matching</p>
                      </div>
                      <div className="p-4 bg-[#f9fafb] rounded-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp size={16} className="text-[#388e3c]" />
                          <span className="text-xs font-medium text-[#878787]">Recovery Probability</span>
                        </div>
                        <p className="text-2xl font-bold text-[#388e3c]">87%</p>
                        <p className="text-xs text-[#878787] mt-1">Based on vendor history</p>
                      </div>
                      <div className="p-4 bg-[#f9fafb] rounded-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-[#2874f0]" />
                          <span className="text-xs font-medium text-[#878787]">Est. Resolution Time</span>
                        </div>
                        <p className="text-2xl font-bold text-[#2874f0]">12 days</p>
                        <p className="text-xs text-[#878787] mt-1">Based on similar cases</p>
                      </div>
                    </div>
                  </div>

                  {/* Similar Cases */}
                  <div>
                    <h3 className="text-sm font-medium text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">Similar Historical Cases</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'CASE-2023-0892', title: 'Similar duplicate payment pattern with same vendor', amount: 320000, status: 'recovered', similarity: 92 },
                        { id: 'CASE-2023-0756', title: 'Rate card deviation in logistics billing', amount: 156000, status: 'recovered', similarity: 78 },
                        { id: 'CASE-2024-0023', title: 'Invoice timing discrepancy', amount: 245000, status: 'investigating', similarity: 71 },
                      ].map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-sm">
                          <div className="flex items-center gap-4">
                            <div className="text-right w-12">
                              <p className="text-lg font-bold text-[#2874f0]">{c.similarity}%</p>
                              <p className="text-[10px] text-[#878787]">match</p>
                            </div>
                            <div>
                              <p className="text-sm font-mono text-[#2874f0]">{c.id}</p>
                              <p className="text-xs text-[#212121]">{c.title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#212121]">{formatCurrency(c.amount)}</p>
                            <span className={`text-xs ${c.status === 'recovered' ? 'text-[#388e3c]' : 'text-[#ff9f00]'}`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div>
                    <h3 className="text-sm font-medium text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">AI Recommendations</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-[#e8f5e9] rounded-sm">
                        <CheckCircle size={20} className="text-[#388e3c] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#2e7d32]">Immediate Action</p>
                          <p className="text-sm text-[#212121]">Contact vendor finance team with documented evidence to initiate recovery process.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[#e8f0fe] rounded-sm">
                        <Target size={20} className="text-[#2874f0] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#1565c0]">Process Improvement</p>
                          <p className="text-sm text-[#212121]">{selectedFinding.recommendation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[#fff3e0] rounded-sm">
                        <AlertCircle size={20} className="text-[#e65100] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#e65100]">Preventive Control</p>
                          <p className="text-sm text-[#212121]">Implement automated duplicate detection rules in payment processing workflow to prevent recurrence.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-white rounded-sm p-4 flex items-center justify-between sticky bottom-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm">
                <option>Change Status</option>
                <option value="triaged">Mark as Triaged</option>
                <option value="investigating">Start Investigation</option>
                <option value="pending_approval">Submit for Approval</option>
                <option value="recovery_initiated">Initiate Recovery</option>
                <option value="recovered">Mark as Recovered</option>
                <option value="false_positive">Mark False Positive</option>
                <option value="closed">Close Case</option>
              </select>
              <select className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm">
                <option>Assign To</option>
                <option>Priya Sharma</option>
                <option>Rajesh Kumar</option>
                <option>Amit Patel</option>
                <option>Neha Singh</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              {selectedFinding.status === 'new' && (
                <button className="px-6 py-2 bg-[#ff9f00] text-white rounded-sm text-sm font-medium hover:bg-[#f57c00]">
                  Triage Case
                </button>
              )}
              {(selectedFinding.status === 'triaged' || selectedFinding.status === 'new') && (
                <button className="px-6 py-2 bg-[#7b1fa2] text-white rounded-sm text-sm font-medium hover:bg-[#6a1b9a]">
                  Start Investigation
                </button>
              )}
              {selectedFinding.status === 'investigating' && (
                <button className="px-6 py-2 bg-[#0891b2] text-white rounded-sm text-sm font-medium hover:bg-[#0e7490]">
                  Submit for Approval
                </button>
              )}
              {selectedFinding.status === 'pending_approval' && (
                <>
                  <button className="px-6 py-2 bg-[#388e3c] text-white rounded-sm text-sm font-medium hover:bg-[#2e7d32]">
                    Approve Recovery
                  </button>
                  <button className="px-6 py-2 border border-[#e0e0e0] text-[#878787] rounded-sm text-sm font-medium hover:bg-[#f1f3f6]">
                    Reject
                  </button>
                </>
              )}
              {selectedFinding.status === 'recovery_initiated' && (
                <button className="px-6 py-2 bg-[#388e3c] text-white rounded-sm text-sm font-medium hover:bg-[#2e7d32]">
                  Mark as Recovered
                </button>
              )}
              <button className="px-6 py-2 bg-[#2874f0] text-white rounded-sm text-sm font-medium hover:bg-[#1a5dc8]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-sm w-full max-w-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Invoice Analysis Details</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedInvoice.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6">
              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Trip Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Trip Sheet ID</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.tripSheetId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Vehicle</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.vehicleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Vehicle Type</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Route</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.origin} → {selectedInvoice.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Trip Sheet KMs</span>
                      <span className="text-sm font-medium text-[#2874f0]">{selectedInvoice.tripSheetKms.toLocaleString()} km</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Contract Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Vendor</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Rate Card Ref</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.rateCardRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Contracted Rate</span>
                      <span className="text-sm font-medium text-[#388e3c]">₹{selectedInvoice.contractedRatePerKm}/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Invoice Date</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedInvoice.invoiceDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Comparison */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Cost Calculation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-sm p-3 text-center">
                    <p className="text-xs text-[#878787] mb-1">Expected Cost</p>
                    <p className="text-sm text-[#878787] mb-1">{selectedInvoice.tripSheetKms} km × ₹{selectedInvoice.contractedRatePerKm}</p>
                    <p className="text-xl font-medium text-[#212121]">{formatCurrency(selectedInvoice.expectedCost)}</p>
                  </div>
                  <div className="bg-white rounded-sm p-3 text-center">
                    <p className="text-xs text-[#878787] mb-1">Invoiced Amount</p>
                    <p className="text-sm text-[#878787] mb-1">From Invoice</p>
                    <p className="text-xl font-medium text-[#212121]">{formatCurrency(selectedInvoice.invoicedAmount)}</p>
                  </div>
                  <div className={`rounded-sm p-3 text-center ${
                    selectedInvoice.status === 'flagged' ? 'bg-[#ffebee]' :
                    selectedInvoice.status === 'minor_variance' ? 'bg-[#fff3e0]' : 'bg-[#e8f5e9]'
                  }`}>
                    <p className="text-xs text-[#878787] mb-1">Discrepancy</p>
                    <p className="text-sm text-[#878787] mb-1">{selectedInvoice.discrepancyPercent > 0 ? 'Overcharged' : 'Within Range'}</p>
                    <p className={`text-xl font-medium ${
                      selectedInvoice.discrepancy > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'
                    }`}>
                      {selectedInvoice.discrepancy > 0 ? '+' : ''}{formatCurrency(selectedInvoice.discrepancy)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#878787]">Status:</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                    selectedInvoice.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                    selectedInvoice.status === 'minor_variance' ? 'bg-[#fff3e0] text-[#e65100]' :
                    'bg-[#ffebee] text-[#c62828]'
                  }`}>
                    {selectedInvoice.status === 'compliant' ? 'Compliant' :
                     selectedInvoice.status === 'minor_variance' ? 'Minor Variance (<5%)' : 'Flagged for Review'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedInvoice.status === 'flagged' && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Initiate Recovery
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* License Detail Modal */}
      {selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLicense(null)}>
          <div className="bg-white rounded-sm w-full max-w-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">License Invoice Analysis</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedLicense.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedLicense(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6">
              {/* Product Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Product Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Vendor</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedLicense.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Product</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedLicense.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Billing Period</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedLicense.billingPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Unit Price</span>
                      <span className="text-sm font-medium text-[#2874f0]">{formatCurrency(selectedLicense.unitPrice)}/license</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Reference Documents</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">PO Number</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedLicense.poRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Contract Ref</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedLicense.contractRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Invoice Date</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedLicense.invoiceDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Utilization</span>
                      <span className={`text-sm font-medium ${selectedLicense.utilizationPercent < 70 ? 'text-[#ff9f00]' : 'text-[#388e3c]'}`}>
                        {selectedLicense.utilizationPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* License Comparison */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">License Comparison</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-sm p-3 text-center border-l-4 border-[#ff9f00]">
                    <p className="text-xs text-[#878787] mb-1">In Contract</p>
                    <p className="text-sm text-[#878787]">Simplicontract</p>
                    <p className="text-xl font-medium text-[#ff9f00]">{selectedLicense.licensesInContract}</p>
                  </div>
                  <div className="bg-white rounded-sm p-3 text-center border-l-4 border-[#388e3c]">
                    <p className="text-xs text-[#878787] mb-1">In PO</p>
                    <p className="text-sm text-[#878787]">Oracle Fusion</p>
                    <p className="text-xl font-medium text-[#388e3c]">{selectedLicense.licensesInPO}</p>
                  </div>
                  <div className="bg-white rounded-sm p-3 text-center border-l-4 border-[#2874f0]">
                    <p className="text-xs text-[#878787] mb-1">Billed</p>
                    <p className="text-sm text-[#878787]">Invoice</p>
                    <p className={`text-xl font-medium ${selectedLicense.licensesBilled > selectedLicense.licensesInPO ? 'text-[#ff6161]' : 'text-[#2874f0]'}`}>
                      {selectedLicense.licensesBilled}
                    </p>
                  </div>
                  <div className={`rounded-sm p-3 text-center ${
                    selectedLicense.licenseDiff > 0 ? 'bg-[#ffebee] border-l-4 border-[#ff6161]' : 'bg-[#e8f5e9] border-l-4 border-[#388e3c]'
                  }`}>
                    <p className="text-xs text-[#878787] mb-1">Difference</p>
                    <p className="text-sm text-[#878787]">{selectedLicense.licenseDiff > 0 ? 'Excess' : 'OK'}</p>
                    <p className={`text-xl font-medium ${selectedLicense.licenseDiff > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                      {selectedLicense.licenseDiff > 0 ? '+' : ''}{selectedLicense.licenseDiff}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Comparison */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Amount Comparison</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-sm p-3 text-center">
                    <p className="text-xs text-[#878787] mb-1">Expected Amount</p>
                    <p className="text-sm text-[#878787] mb-1">{selectedLicense.licensesInPO} × {formatCurrency(selectedLicense.unitPrice)}</p>
                    <p className="text-xl font-medium text-[#212121]">{formatCurrency(selectedLicense.expectedAmount)}</p>
                  </div>
                  <div className="bg-white rounded-sm p-3 text-center">
                    <p className="text-xs text-[#878787] mb-1">Invoiced Amount</p>
                    <p className="text-sm text-[#878787] mb-1">From Invoice</p>
                    <p className="text-xl font-medium text-[#212121]">{formatCurrency(selectedLicense.invoicedAmount)}</p>
                  </div>
                  <div className={`rounded-sm p-3 text-center ${
                    selectedLicense.amountDiff > 0 ? 'bg-[#ffebee]' : 'bg-[#e8f5e9]'
                  }`}>
                    <p className="text-xs text-[#878787] mb-1">Discrepancy</p>
                    <p className="text-sm text-[#878787] mb-1">{selectedLicense.amountDiff > 0 ? 'Overcharge' : 'Match'}</p>
                    <p className={`text-xl font-medium ${selectedLicense.amountDiff > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                      {selectedLicense.amountDiff > 0 ? '+' : ''}{formatCurrency(selectedLicense.amountDiff)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#878787]">Status:</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                    selectedLicense.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                    selectedLicense.status === 'over_licensed' ? 'bg-[#fff3e0] text-[#e65100]' :
                    selectedLicense.status === 'under_utilized' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                    'bg-[#ffebee] text-[#c62828]'
                  }`}>
                    {selectedLicense.status === 'compliant' ? 'Compliant' :
                     selectedLicense.status === 'over_licensed' ? 'Over-Licensed (Minor)' :
                     selectedLicense.status === 'under_utilized' ? 'Under-Utilized' : 'Flagged for Review'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {(selectedLicense.status === 'flagged' || selectedLicense.status === 'over_licensed') && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Initiate Recovery
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedLicense(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruitment Invoice Detail Modal */}
      {selectedRecruitment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecruitment(null)}>
          <div className="bg-white rounded-sm w-full max-w-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Recruitment Fee Analysis</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedRecruitment.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedRecruitment(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6">
              {/* Candidate Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Candidate Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Name</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedRecruitment.candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Position</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedRecruitment.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Department</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedRecruitment.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Joining Date</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedRecruitment.joiningDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Annual CTC</span>
                      <span className="text-sm font-medium text-[#2874f0]">{formatCurrency(selectedRecruitment.candidateCTC)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Agency & Contract</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Recruitment Agency</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedRecruitment.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Contract Reference</span>
                      <span className="text-sm font-medium text-[#2874f0]">{selectedRecruitment.contractRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">PO Reference</span>
                      <span className="text-sm font-medium text-[#388e3c]">{selectedRecruitment.poRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Invoice Date</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedRecruitment.invoiceDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Salary Verification</span>
                      <span className={`text-sm font-medium ${selectedRecruitment.salaryVerified ? 'text-[#388e3c]' : 'text-[#ff9f00]'}`}>
                        {selectedRecruitment.salaryVerified ? 'Verified with HR' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Calculation */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Fee Calculation</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-sm p-3 text-center border-l-4 border-[#2874f0]">
                    <p className="text-xs text-[#878787] mb-1">Candidate CTC</p>
                    <p className="text-xl font-medium text-[#2874f0]">{formatCurrency(selectedRecruitment.candidateCTC)}</p>
                  </div>
                  <div className="bg-white rounded-sm p-3 text-center border-l-4 border-[#9c27b0]">
                    <p className="text-xs text-[#878787] mb-1">Contracted Fee %</p>
                    <p className="text-xl font-medium text-[#9c27b0]">{selectedRecruitment.contractedFeePercent}%</p>
                  </div>
                  <div className="bg-white rounded-sm p-3 text-center border-l-4 border-[#388e3c]">
                    <p className="text-xs text-[#878787] mb-1">Expected Fee</p>
                    <p className="text-xl font-medium text-[#388e3c]">{formatCurrency(selectedRecruitment.expectedFee)}</p>
                  </div>
                  <div className={`rounded-sm p-3 text-center border-l-4 ${
                    selectedRecruitment.discrepancy > 0 ? 'bg-[#ffebee] border-[#ff6161]' : 'bg-[#e8f5e9] border-[#388e3c]'
                  }`}>
                    <p className="text-xs text-[#878787] mb-1">Invoiced</p>
                    <p className={`text-xl font-medium ${selectedRecruitment.discrepancy > 0 ? 'text-[#ff6161]' : 'text-[#388e3c]'}`}>
                      {formatCurrency(selectedRecruitment.invoicedAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discrepancy Analysis */}
              {selectedRecruitment.discrepancy > 0 && (
                <div className="bg-[#ffebee] rounded-sm p-4 mb-6">
                  <h4 className="text-xs font-medium text-[#c62828] uppercase mb-2">Discrepancy Detected</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#212121]">
                        Invoice charged <span className="font-medium text-[#ff6161]">{formatCurrency(selectedRecruitment.discrepancy)}</span> more than the expected fee
                      </p>
                      <p className="text-xs text-[#878787] mt-1">
                        Overcharge percentage: <span className="font-medium">{selectedRecruitment.discrepancyPercent.toFixed(1)}%</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-medium text-[#ff6161]">+{formatCurrency(selectedRecruitment.discrepancy)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#878787]">Status:</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                    selectedRecruitment.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                    selectedRecruitment.status === 'overcharged' ? 'bg-[#fff3e0] text-[#e65100]' :
                    'bg-[#ffebee] text-[#c62828]'
                  }`}>
                    {selectedRecruitment.status === 'compliant' ? 'Compliant' :
                     selectedRecruitment.status === 'overcharged' ? 'Overcharged' : 'Flagged for Review'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!selectedRecruitment.salaryVerified && (
                    <button className="px-4 py-2 bg-[#ff9f00] text-white text-sm font-medium rounded-sm hover:bg-[#f57c00] transition-colors">
                      Verify Salary
                    </button>
                  )}
                  {(selectedRecruitment.status === 'flagged' || selectedRecruitment.status === 'overcharged') && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Initiate Recovery
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedRecruitment(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Invoice Detail Modal */}
      {selectedMarketing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMarketing(null)}>
          <div className="bg-white rounded-sm w-full max-w-3xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Marketing Deliverable Analysis</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedMarketing.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedMarketing(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6">
              {/* Project Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Project Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Agency</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedMarketing.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Project</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedMarketing.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Campaign Type</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedMarketing.campaignType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Invoice Date</span>
                      <span className="text-sm font-medium text-[#212121]">{selectedMarketing.invoiceDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Contract References</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">SOW Reference</span>
                      <span className="text-sm font-medium text-[#2874f0]">{selectedMarketing.contractRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">PO Reference</span>
                      <span className="text-sm font-medium text-[#388e3c]">{selectedMarketing.poRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#878787]">Delivery Verification</span>
                      <span className={`text-sm font-medium ${selectedMarketing.deliveryVerified ? 'text-[#388e3c]' : 'text-[#ff9f00]'}`}>
                        {selectedMarketing.deliveryVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Comparison */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-xs font-medium text-[#878787] uppercase mb-3">Deliverable Line Items (SOW vs Invoice)</h4>
                <div className="bg-white rounded-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#f1f3f6]">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-[#878787] uppercase">Deliverable</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-[#878787] uppercase">In SOW</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-[#878787] uppercase">Billed</th>
                        <th className="px-3 py-2 text-right text-[10px] font-medium text-[#878787] uppercase">Unit Price</th>
                        <th className="px-3 py-2 text-right text-[10px] font-medium text-[#878787] uppercase">Expected</th>
                        <th className="px-3 py-2 text-right text-[10px] font-medium text-[#878787] uppercase">Billed Amt</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-[#878787] uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e0e0]">
                      {selectedMarketing.lineItems.map((item, idx) => (
                        <tr key={idx} className={item.status !== 'delivered' ? 'bg-[#fff8f8]' : ''}>
                          <td className="px-3 py-2">
                            <p className="text-xs text-[#212121]">{item.description}</p>
                            <p className="text-[10px] text-[#878787]">{item.category}</p>
                          </td>
                          <td className="px-3 py-2 text-center text-xs font-medium text-[#388e3c]">{item.quantityInSOW}</td>
                          <td className="px-3 py-2 text-center text-xs font-medium text-[#2874f0]">{item.quantityBilled}</td>
                          <td className="px-3 py-2 text-right text-xs text-[#212121]">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-3 py-2 text-right text-xs text-[#212121]">{formatCurrency(item.expectedAmount)}</td>
                          <td className="px-3 py-2 text-right text-xs font-medium text-[#212121]">{formatCurrency(item.billedAmount)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                              item.status === 'delivered' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                              item.status === 'overbilled' ? 'bg-[#ffebee] text-[#c62828]' :
                              item.status === 'partial' ? 'bg-[#fff3e0] text-[#e65100]' :
                              'bg-[#e3f2fd] text-[#1565c0]'
                            }`}>
                              {item.status === 'delivered' ? 'OK' :
                               item.status === 'overbilled' ? '+' + (item.quantityBilled - item.quantityInSOW) :
                               item.status === 'partial' ? '-' + (item.quantityInSOW - item.quantityBilled) : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#e8f5e9] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">SOW Total</p>
                  <p className="text-lg font-medium text-[#388e3c]">{formatCurrency(selectedMarketing.totalExpected)}</p>
                </div>
                <div className="bg-[#e8f0fe] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Invoice Total</p>
                  <p className="text-lg font-medium text-[#2874f0]">{formatCurrency(selectedMarketing.totalInvoiced)}</p>
                </div>
                <div className={`rounded-sm p-3 text-center ${selectedMarketing.discrepancy > 0 ? 'bg-[#ffebee]' : selectedMarketing.discrepancy < 0 ? 'bg-[#fff3e0]' : 'bg-[#e8f5e9]'}`}>
                  <p className="text-xs text-[#878787] mb-1">Variance</p>
                  <p className={`text-lg font-medium ${selectedMarketing.discrepancy > 0 ? 'text-[#ff6161]' : selectedMarketing.discrepancy < 0 ? 'text-[#ff9f00]' : 'text-[#388e3c]'}`}>
                    {selectedMarketing.discrepancy > 0 ? '+' : ''}{formatCurrency(selectedMarketing.discrepancy)}
                  </p>
                </div>
                <div className="bg-[#f3e5f5] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Variance %</p>
                  <p className="text-lg font-medium text-[#9c27b0]">
                    {selectedMarketing.discrepancyPercent > 0 ? '+' : ''}{selectedMarketing.discrepancyPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#878787]">Status:</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                    selectedMarketing.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                    selectedMarketing.status === 'overbilled' ? 'bg-[#fff3e0] text-[#e65100]' :
                    selectedMarketing.status === 'partial_delivery' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                    'bg-[#ffebee] text-[#c62828]'
                  }`}>
                    {selectedMarketing.status === 'compliant' ? 'Compliant' :
                     selectedMarketing.status === 'overbilled' ? 'Overbilled' :
                     selectedMarketing.status === 'partial_delivery' ? 'Partial Delivery' : 'Flagged for Review'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!selectedMarketing.deliveryVerified && (
                    <button className="px-4 py-2 bg-[#ff9f00] text-white text-sm font-medium rounded-sm hover:bg-[#f57c00] transition-colors">
                      Verify Deliverables
                    </button>
                  )}
                  {(selectedMarketing.status === 'flagged' || selectedMarketing.status === 'overbilled') && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Initiate Recovery
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedMarketing(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Infrastructure Invoice Detail Modal */}
      {selectedInfrastructure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInfrastructure(null)}>
          <div className="bg-white rounded-sm w-full max-w-4xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Infrastructure Price Variance Analysis</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedInfrastructure.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedInfrastructure(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-[#878787] mb-1">Vendor</p>
                  <p className="text-sm font-medium text-[#212121]">{selectedInfrastructure.vendor}</p>
                  <p className="text-xs text-[#878787] capitalize mt-0.5">{selectedInfrastructure.vendorType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#878787] mb-1">Project</p>
                  <p className="text-sm font-medium text-[#212121]">{selectedInfrastructure.project}</p>
                  <p className="text-xs text-[#878787] mt-0.5">{selectedInfrastructure.location}</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#e8f0fe] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Invoice Date</p>
                  <p className="text-lg font-medium text-[#2874f0]">{selectedInfrastructure.invoiceDate}</p>
                </div>
                <div className="bg-[#e8f5e9] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Expected (Hist. Avg)</p>
                  <p className="text-lg font-medium text-[#388e3c]">{formatCurrency(selectedInfrastructure.totalExpected)}</p>
                </div>
                <div className="bg-[#f1f3f6] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Invoiced Amount</p>
                  <p className="text-lg font-medium text-[#212121]">{formatCurrency(selectedInfrastructure.totalAmount)}</p>
                </div>
                <div className={`rounded-sm p-3 text-center ${selectedInfrastructure.totalVariance > 0 ? 'bg-[#ffebee]' : 'bg-[#e8f5e9]'}`}>
                  <p className="text-xs text-[#878787] mb-1">Total Variance</p>
                  <p className={`text-lg font-medium ${selectedInfrastructure.totalVariance > 0 ? 'text-[#c62828]' : 'text-[#388e3c]'}`}>
                    {selectedInfrastructure.totalVariance > 0 ? '+' : ''}{formatCurrency(selectedInfrastructure.totalVariance)}
                    <span className="text-xs ml-1">({selectedInfrastructure.variancePercent > 0 ? '+' : ''}{selectedInfrastructure.variancePercent.toFixed(1)}%)</span>
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                  <Package size={16} className="text-[#2874f0]" />
                  Item-wise Price Comparison
                </h4>
                <div className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#f1f3f6]">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Item Code</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Description</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Qty</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Hist. Avg</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Unit Price</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Variance</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-[#878787]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e0e0]">
                      {selectedInfrastructure.items.map((item, idx) => (
                        <tr key={idx} className={item.status === 'outlier' ? 'bg-[#ffebee]' : item.status === 'high' ? 'bg-[#fff3e0]' : ''}>
                          <td className="px-3 py-2 text-xs font-mono text-[#2874f0]">{item.itemCode}</td>
                          <td className="px-3 py-2">
                            <p className="text-xs text-[#212121]">{item.itemName}</p>
                            <p className="text-[10px] text-[#878787] capitalize">{item.category.replace('_', ' ')}</p>
                          </td>
                          <td className="px-3 py-2 text-xs text-right text-[#212121]">{item.quantity}</td>
                          <td className="px-3 py-2 text-xs text-right text-[#878787]">₹{item.historicalAvgPrice.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-2 text-xs text-right text-[#212121]">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <span className={item.variance > 0 ? 'text-[#c62828]' : item.variance < 0 ? 'text-[#388e3c]' : 'text-[#212121]'}>
                              {item.variance > 0 ? '+' : ''}₹{item.variance.toLocaleString('en-IN')}
                            </span>
                            <span className={`block text-[10px] ${item.variancePercent > 20 ? 'text-[#c62828]' : item.variancePercent > 10 ? 'text-[#e65100]' : 'text-[#878787]'}`}>
                              ({item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                              item.status === 'normal' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                              item.status === 'high' ? 'bg-[#fff3e0] text-[#e65100]' :
                              'bg-[#ffebee] text-[#c62828]'
                            }`}>
                              {item.status === 'normal' ? 'Normal' : item.status === 'high' ? 'High' : 'Outlier'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Historical Context */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-sm font-medium text-[#212121] mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-[#2874f0]" />
                  Price Analysis Context
                </h4>
                <p className="text-xs text-[#878787] mb-2">
                  Historical average prices are calculated from all previous purchases across all projects and vendors.
                  Items are flagged as:
                </p>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#388e3c]"></span> Normal: ≤10% variance</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff9f00]"></span> High: 10-25% variance</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff6161]"></span> Outlier: &gt;25% variance</span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#878787]">Status:</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                      selectedInfrastructure.status === 'compliant' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                      selectedInfrastructure.status === 'variance' ? 'bg-[#fff3e0] text-[#e65100]' :
                      'bg-[#ffebee] text-[#c62828]'
                    }`}>
                      {selectedInfrastructure.status === 'compliant' ? 'Within Threshold' :
                       selectedInfrastructure.status === 'variance' ? 'High Variance' : 'Outlier - Flagged'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#878787]">GRN:</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                      selectedInfrastructure.grnVerified ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]'
                    }`}>
                      {selectedInfrastructure.grnVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!selectedInfrastructure.grnVerified && (
                    <button className="px-4 py-2 bg-[#ff9f00] text-white text-sm font-medium rounded-sm hover:bg-[#f57c00] transition-colors">
                      Verify GRN
                    </button>
                  )}
                  {selectedInfrastructure.status === 'flagged' && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Request Price Justification
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInfrastructure(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Invoice Detail Modal */}
      {selectedDuplicate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDuplicate(null)}>
          <div className="bg-white rounded-sm w-full max-w-3xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Duplicate Invoice Analysis</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedDuplicate.invoiceNumber}</p>
              </div>
              <button onClick={() => setSelectedDuplicate(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-[#878787] mb-1">Vendor</p>
                  <p className="text-sm font-medium text-[#212121]">{selectedDuplicate.vendor}</p>
                  <p className="text-xs text-[#878787] mt-0.5">Code: {selectedDuplicate.vendorCode}</p>
                </div>
                <div>
                  <p className="text-xs text-[#878787] mb-1">Department</p>
                  <p className="text-sm font-medium text-[#212121]">{selectedDuplicate.department}</p>
                  <p className="text-xs text-[#878787] mt-0.5">Approved by: {selectedDuplicate.approvedBy}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#e8f0fe] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Duplicate Amount</p>
                  <p className="text-lg font-medium text-[#ff6161]">{formatCurrency(selectedDuplicate.amount)}</p>
                </div>
                <div className="bg-[#e8f5e9] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Original Payment</p>
                  <p className="text-lg font-medium text-[#212121]">{selectedDuplicate.originalPaymentDate}</p>
                </div>
                <div className="bg-[#ffebee] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Duplicate Payment</p>
                  <p className="text-lg font-medium text-[#c62828]">{selectedDuplicate.duplicatePaymentDate}</p>
                </div>
                <div className="bg-[#f3e5f5] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Days Between</p>
                  <p className="text-lg font-medium text-[#7b1fa2]">{selectedDuplicate.daysBetween} days</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-[#f1f3f6] rounded-sm p-4 mb-6">
                <h4 className="text-sm font-medium text-[#212121] mb-3">Detection Details</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[#878787]">Source System</p>
                    <p className="font-medium text-[#212121]">{selectedDuplicate.source}</p>
                  </div>
                  <div>
                    <p className="text-[#878787]">Payment Method</p>
                    <p className="font-medium text-[#212121]">{selectedDuplicate.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-[#878787]">Matching Criteria</p>
                    <p className="font-medium text-[#212121]">Vendor + Invoice # + Amount</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-[#fff3e0] rounded-sm p-4 mb-6">
                <h4 className="text-sm font-medium text-[#e65100] mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Investigation Notes
                </h4>
                <p className="text-sm text-[#212121]">{selectedDuplicate.notes}</p>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#878787]">Status:</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                      selectedDuplicate.status === 'confirmed_duplicate' ? 'bg-[#ffebee] text-[#c62828]' :
                      selectedDuplicate.status === 'potential_duplicate' ? 'bg-[#fff3e0] text-[#e65100]' :
                      'bg-[#e3f2fd] text-[#1565c0]'
                    }`}>
                      {selectedDuplicate.status === 'confirmed_duplicate' ? 'Confirmed Duplicate' :
                       selectedDuplicate.status === 'potential_duplicate' ? 'Potential Duplicate' : 'Under Review'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#878787]">Recovery:</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-sm ${
                      selectedDuplicate.recoveryStatus === 'recovered' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                      selectedDuplicate.recoveryStatus === 'in_progress' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                      selectedDuplicate.recoveryStatus === 'pending' ? 'bg-[#fff3e0] text-[#e65100]' :
                      'bg-[#f5f5f5] text-[#757575]'
                    }`}>
                      {selectedDuplicate.recoveryStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedDuplicate.recoveryStatus === 'pending' && (
                    <button className="px-4 py-2 bg-[#ff9f00] text-white text-sm font-medium rounded-sm hover:bg-[#f57c00] transition-colors">
                      Initiate Recovery
                    </button>
                  )}
                  {selectedDuplicate.status === 'under_review' && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Mark as Confirmed
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedDuplicate(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Addendum Timing Issue Detail Modal */}
      {selectedAddendumIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAddendumIssue(null)}>
          <div className="bg-white rounded-sm w-full max-w-4xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#2874f0] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Addendum Timing Analysis</h3>
                <p className="text-blue-200 text-xs mt-0.5">{selectedAddendumIssue.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedAddendumIssue(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="text-white" size={18} />
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Invoice Details */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs text-[#878787] mb-1">Vendor</p>
                  <p className="text-sm font-medium text-[#212121]">{selectedAddendumIssue.vendor}</p>
                  <p className="text-xs text-[#878787] mt-0.5">{selectedAddendumIssue.category}</p>
                </div>
                <div>
                  <p className="text-xs text-[#878787] mb-1">Invoice Date</p>
                  <p className="text-sm font-medium text-[#212121]">{selectedAddendumIssue.invoiceDate}</p>
                  <p className="text-xs text-[#878787] mt-0.5">Payment: {selectedAddendumIssue.paymentDate}</p>
                </div>
                <div>
                  <p className="text-xs text-[#878787] mb-1">Contract Reference</p>
                  <p className="text-sm font-medium text-[#2874f0]">{selectedAddendumIssue.contractRef}</p>
                </div>
              </div>

              {/* Addendum Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#ffebee] rounded-sm p-4 border-l-4 border-[#c62828]">
                  <h4 className="text-sm font-medium text-[#c62828] mb-3">Applied Addendum (Incorrect)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#878787]">Version</span>
                      <span className="font-medium">V{selectedAddendumIssue.appliedAddendum.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#878787]">Effective Period</span>
                      <span className="font-medium">{selectedAddendumIssue.appliedAddendum.effectiveFrom} - {selectedAddendumIssue.appliedAddendum.effectiveTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#878787]">Status</span>
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                        selectedAddendumIssue.appliedAddendum.status === 'active' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                        selectedAddendumIssue.appliedAddendum.status === 'superseded' ? 'bg-[#fff3e0] text-[#e65100]' :
                        'bg-[#f5f5f5] text-[#757575]'
                      }`}>
                        {selectedAddendumIssue.appliedAddendum.status.charAt(0).toUpperCase() + selectedAddendumIssue.appliedAddendum.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#e8f5e9] rounded-sm p-4 border-l-4 border-[#2e7d32]">
                  <h4 className="text-sm font-medium text-[#2e7d32] mb-3">Correct Addendum (Should Apply)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#878787]">Version</span>
                      <span className="font-medium">V{selectedAddendumIssue.correctAddendum.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#878787]">Effective Period</span>
                      <span className="font-medium">{selectedAddendumIssue.correctAddendum.effectiveFrom} - {selectedAddendumIssue.correctAddendum.effectiveTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#878787]">Status</span>
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                        selectedAddendumIssue.correctAddendum.status === 'active' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                        selectedAddendumIssue.correctAddendum.status === 'superseded' ? 'bg-[#fff3e0] text-[#e65100]' :
                        'bg-[#f5f5f5] text-[#757575]'
                      }`}>
                        {selectedAddendumIssue.correctAddendum.status.charAt(0).toUpperCase() + selectedAddendumIssue.correctAddendum.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Comparison */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                  <Calculator size={16} className="text-[#2874f0]" />
                  Line Item Rate Comparison
                </h4>
                <div className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#f1f3f6]">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-[#878787]">Description</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Qty</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Applied Rate</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Correct Rate</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-[#878787]">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e0e0]">
                      {selectedAddendumIssue.lineItems.map((item, idx) => (
                        <tr key={idx} className={item.difference !== 0 ? (item.difference > 0 ? 'bg-[#ffebee]' : 'bg-[#e8f5e9]') : ''}>
                          <td className="px-3 py-2 text-xs text-[#212121]">{item.description}</td>
                          <td className="px-3 py-2 text-xs text-right text-[#212121]">{item.quantity}</td>
                          <td className="px-3 py-2 text-xs text-right text-[#878787]">₹{item.appliedRate.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-2 text-xs text-right text-[#212121]">₹{item.correctRate.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <span className={item.difference > 0 ? 'text-[#c62828]' : item.difference < 0 ? 'text-[#388e3c]' : 'text-[#212121]'}>
                              {item.difference > 0 ? '+' : ''}{formatCurrency(item.difference)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#f1f3f6] font-medium">
                        <td colSpan={4} className="px-3 py-2 text-xs text-right text-[#212121]">Total Variance:</td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span className={selectedAddendumIssue.potentialOvercharge > 0 ? 'text-[#c62828]' : 'text-[#388e3c]'}>
                            {selectedAddendumIssue.potentialOvercharge > 0 ? '+' : ''}{formatCurrency(selectedAddendumIssue.potentialOvercharge)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#f1f3f6] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Invoice Amount</p>
                  <p className="text-lg font-medium text-[#212121]">{formatCurrency(selectedAddendumIssue.invoiceAmount)}</p>
                </div>
                <div className="bg-[#e3f2fd] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Rate Difference</p>
                  <p className="text-lg font-medium text-[#1565c0]">{selectedAddendumIssue.rateDifference}%</p>
                </div>
                <div className={`rounded-sm p-3 text-center ${selectedAddendumIssue.potentialOvercharge > 0 ? 'bg-[#ffebee]' : 'bg-[#e8f5e9]'}`}>
                  <p className="text-xs text-[#878787] mb-1">{selectedAddendumIssue.potentialOvercharge > 0 ? 'Overcharge' : 'Undercharge'}</p>
                  <p className={`text-lg font-medium ${selectedAddendumIssue.potentialOvercharge > 0 ? 'text-[#c62828]' : 'text-[#388e3c]'}`}>
                    {formatCurrency(Math.abs(selectedAddendumIssue.potentialOvercharge))}
                  </p>
                </div>
                <div className="bg-[#f3e5f5] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#878787] mb-1">Status</p>
                  <p className={`text-lg font-medium ${
                    selectedAddendumIssue.status === 'flagged' ? 'text-[#c62828]' :
                    selectedAddendumIssue.status === 'confirmed' ? 'text-[#e65100]' :
                    selectedAddendumIssue.status === 'disputed' ? 'text-[#1565c0]' :
                    'text-[#388e3c]'
                  }`}>
                    {selectedAddendumIssue.status.charAt(0).toUpperCase() + selectedAddendumIssue.status.slice(1)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#878787]">
                  {selectedAddendumIssue.potentialOvercharge > 0
                    ? 'Amount recoverable from vendor'
                    : 'Amount may need to be paid to vendor'}
                </div>
                <div className="flex gap-2">
                  {selectedAddendumIssue.status === 'flagged' && (
                    <>
                      <button className="px-4 py-2 bg-[#388e3c] text-white text-sm font-medium rounded-sm hover:bg-[#2e7d32] transition-colors">
                        Confirm Issue
                      </button>
                      <button className="px-4 py-2 bg-[#ff9f00] text-white text-sm font-medium rounded-sm hover:bg-[#f57c00] transition-colors">
                        Dispute
                      </button>
                    </>
                  )}
                  {selectedAddendumIssue.status === 'confirmed' && selectedAddendumIssue.potentialOvercharge > 0 && (
                    <button className="px-4 py-2 bg-[#ff6161] text-white text-sm font-medium rounded-sm hover:bg-[#e53935] transition-colors">
                      Initiate Recovery
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAddendumIssue(null)}
                    className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFinding(null)}>
          <div className="bg-white rounded-sm w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5dc8] p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-mono text-sm bg-white/20 px-2 py-0.5 rounded">{selectedFinding.caseId}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      selectedFinding.severity === 'critical' ? 'bg-[#b71c1c] text-white' :
                      selectedFinding.severity === 'high' ? 'bg-[#ff6161] text-white' :
                      selectedFinding.severity === 'medium' ? 'bg-[#ff9f00] text-white' :
                      'bg-[#388e3c] text-white'
                    }`}>
                      {selectedFinding.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      selectedFinding.status === 'new' ? 'bg-white/90 text-[#2874f0]' :
                      selectedFinding.status === 'recovered' ? 'bg-[#388e3c] text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {selectedFinding.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-white font-medium text-lg">{selectedFinding.title}</h3>
                  <p className="text-blue-200 text-sm mt-1">{selectedFinding.description}</p>
                </div>
                <button onClick={() => setSelectedFinding(null)} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <X className="text-white" size={18} />
                </button>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffe500] to-[#ff9f00]"></div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Left Column - Details */}
                <div className="col-span-2 space-y-4">
                  {/* Financial Summary */}
                  <div className="bg-[#f1f3f6] rounded-sm p-4">
                    <h4 className="text-sm font-medium text-[#212121] mb-3">Financial Summary</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-sm p-3">
                        <p className="text-xs text-[#878787] mb-1">Leakage Amount</p>
                        <p className="text-xl font-bold text-[#ff6161]">{formatCurrency(selectedFinding.leakageAmount)}</p>
                      </div>
                      <div className="bg-white rounded-sm p-3">
                        <p className="text-xs text-[#878787] mb-1">Recovered</p>
                        <p className="text-xl font-bold text-[#388e3c]">{formatCurrency(selectedFinding.recoveredAmount)}</p>
                      </div>
                      <div className="bg-white rounded-sm p-3">
                        <p className="text-xs text-[#878787] mb-1">Pending Recovery</p>
                        <p className="text-xl font-bold text-[#2874f0]">{formatCurrency(selectedFinding.potentialSavings)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Related Transactions */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb]">
                      <h4 className="text-sm font-medium text-[#212121]">Related Transactions ({selectedFinding.relatedTransactions.length})</h4>
                    </div>
                    <div className="divide-y divide-[#e0e0e0]">
                      {selectedFinding.relatedTransactions.map((txn, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between hover:bg-[#f9fafb]">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                              txn.type === 'Payment' ? 'bg-[#e8f5e9]' :
                              txn.type === 'Invoice' ? 'bg-[#e8f0fe]' :
                              'bg-[#fff3e0]'
                            }`}>
                              {txn.type === 'Payment' ? <DollarSign size={14} className="text-[#388e3c]" /> :
                               txn.type === 'Invoice' ? <FileText size={14} className="text-[#2874f0]" /> :
                               <FileCheck size={14} className="text-[#e65100]" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#212121]">{txn.transactionId}</p>
                              <p className="text-xs text-[#878787]">{txn.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#212121]">{formatCurrency(txn.amount)}</p>
                            <p className="text-xs text-[#878787]">{txn.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause & Recommendation */}
                  {(selectedFinding.rootCause || selectedFinding.recommendation) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedFinding.rootCause && (
                        <div className="bg-[#fff3e0] rounded-sm p-4">
                          <h4 className="text-sm font-medium text-[#e65100] mb-2 flex items-center gap-2">
                            <AlertCircle size={14} />
                            Root Cause
                          </h4>
                          <p className="text-sm text-[#212121]">{selectedFinding.rootCause}</p>
                        </div>
                      )}
                      {selectedFinding.recommendation && (
                        <div className="bg-[#e8f5e9] rounded-sm p-4">
                          <h4 className="text-sm font-medium text-[#2e7d32] mb-2 flex items-center gap-2">
                            <Target size={14} />
                            Recommendation
                          </h4>
                          <p className="text-sm text-[#212121]">{selectedFinding.recommendation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Evidence */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb] flex items-center justify-between">
                      <h4 className="text-sm font-medium text-[#212121]">Evidence & Attachments ({selectedFinding.evidence.length})</h4>
                      <button className="text-xs text-[#2874f0] font-medium hover:underline flex items-center gap-1">
                        <Download size={12} />
                        Upload
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {selectedFinding.evidence.map(ev => (
                        <div key={ev.id} className="flex items-center justify-between p-2 bg-[#f9fafb] rounded-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                              ev.type === 'invoice' ? 'bg-[#e8f0fe]' :
                              ev.type === 'contract' ? 'bg-[#f3e8ff]' :
                              ev.type === 'report' ? 'bg-[#e8f5e9]' :
                              'bg-[#f1f3f6]'
                            }`}>
                              <FileText size={14} className={
                                ev.type === 'invoice' ? 'text-[#2874f0]' :
                                ev.type === 'contract' ? 'text-[#7b1fa2]' :
                                ev.type === 'report' ? 'text-[#388e3c]' :
                                'text-[#878787]'
                              } />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#212121]">{ev.name}</p>
                              <p className="text-xs text-[#878787]">Uploaded by {ev.uploadedBy} • {ev.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedEvidence(ev)}
                            className="text-xs text-[#2874f0] font-medium hover:underline"
                          >View</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Activity & Info */}
                <div className="space-y-4">
                  {/* Case Info */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb]">
                      <h4 className="text-sm font-medium text-[#212121]">Case Information</h4>
                    </div>
                    <div className="p-3 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-[#878787]">Category</span>
                        <span className="text-xs font-medium text-[#212121]">{selectedFinding.category.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#878787]">Priority</span>
                        <span className={`text-xs font-medium ${
                          selectedFinding.priority === 'urgent' ? 'text-[#c62828]' :
                          selectedFinding.priority === 'high' ? 'text-[#ff6161]' :
                          selectedFinding.priority === 'medium' ? 'text-[#ff9f00]' :
                          'text-[#388e3c]'
                        }`}>{selectedFinding.priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#878787]">Source</span>
                        <span className="text-xs font-medium text-[#212121]">{selectedFinding.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#878787]">Detection</span>
                        <span className="text-xs font-medium text-[#212121]">{selectedFinding.detectionMethod.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#878787]">Created</span>
                        <span className="text-xs font-medium text-[#212121]">{selectedFinding.createdAt.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#878787]">Due Date</span>
                        <span className="text-xs font-medium text-[#212121]">{selectedFinding.dueDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#878787]">SLA Status</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          selectedFinding.slaStatus === 'on_track' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          selectedFinding.slaStatus === 'at_risk' ? 'bg-[#fff3e0] text-[#e65100]' :
                          'bg-[#ffebee] text-[#c62828]'
                        }`}>{selectedFinding.slaStatus.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Info */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb]">
                      <h4 className="text-sm font-medium text-[#212121]">Vendor</h4>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-[#212121]">{selectedFinding.vendor.name}</p>
                      <p className="text-xs text-[#878787]">{selectedFinding.vendor.code}</p>
                      <p className="text-xs text-[#2874f0] mt-1">{selectedFinding.vendor.contact}</p>
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb] flex items-center justify-between">
                      <h4 className="text-sm font-medium text-[#212121]">Assignee</h4>
                      <button className="text-xs text-[#2874f0] font-medium hover:underline">Change</button>
                    </div>
                    <div className="p-3">
                      {selectedFinding.assignee ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#2874f0] rounded-full flex items-center justify-center text-white font-medium">
                            {selectedFinding.assignee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#212121]">{selectedFinding.assignee.name}</p>
                            <p className="text-xs text-[#878787]">{selectedFinding.assignee.department}</p>
                            <p className="text-xs text-[#2874f0]">{selectedFinding.assignee.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-sm text-[#ff9f00] font-medium">Unassigned</p>
                          <button className="mt-2 text-xs text-[#2874f0] font-medium hover:underline">Assign to me</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb]">
                      <h4 className="text-sm font-medium text-[#212121]">Tags</h4>
                    </div>
                    <div className="p-3 flex flex-wrap gap-1">
                      {selectedFinding.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-[#f1f3f6] text-[#878787] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="bg-white rounded-sm border border-[#e0e0e0] overflow-hidden">
                    <div className="p-3 border-b border-[#e0e0e0] bg-[#f9fafb]">
                      <h4 className="text-sm font-medium text-[#212121]">Activity Timeline</h4>
                    </div>
                    <div className="p-3 max-h-60 overflow-auto">
                      <div className="space-y-3">
                        {selectedFinding.activities.map((activity, idx) => (
                          <div key={activity.id} className="relative pl-6">
                            <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${
                              activity.type === 'status_change' ? 'bg-[#2874f0]' :
                              activity.type === 'comment' ? 'bg-[#878787]' :
                              activity.type === 'evidence' ? 'bg-[#388e3c]' :
                              activity.type === 'escalation' ? 'bg-[#ff6161]' :
                              activity.type === 'resolution' ? 'bg-[#388e3c]' :
                              'bg-[#ff9f00]'
                            }`}></div>
                            {idx < selectedFinding.activities.length - 1 && (
                              <div className="absolute left-[5px] top-4 w-0.5 h-full bg-[#e0e0e0]"></div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-[#212121]">{activity.action}</p>
                              <p className="text-xs text-[#878787]">{activity.details}</p>
                              <p className="text-[10px] text-[#878787] mt-1">{activity.user} • {activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#e0e0e0] bg-[#f9fafb] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="px-3 py-2 border border-[#e0e0e0] rounded-sm text-sm w-80 focus:outline-none focus:border-[#2874f0]"
                />
                <button className="px-4 py-2 bg-[#f1f3f6] text-[#212121] text-sm font-medium rounded-sm hover:bg-[#e0e0e0] transition-colors">
                  Comment
                </button>
              </div>
              <div className="flex gap-2">
                {selectedFinding.status === 'new' && (
                  <button className="px-4 py-2 bg-[#ff9f00] text-white text-sm font-medium rounded-sm hover:bg-[#f57c00] transition-colors">
                    Triage Case
                  </button>
                )}
                {(selectedFinding.status === 'triaged' || selectedFinding.status === 'new') && (
                  <button className="px-4 py-2 bg-[#7b1fa2] text-white text-sm font-medium rounded-sm hover:bg-[#6a1b9a] transition-colors">
                    Start Investigation
                  </button>
                )}
                {selectedFinding.status === 'investigating' && (
                  <button className="px-4 py-2 bg-[#0891b2] text-white text-sm font-medium rounded-sm hover:bg-[#0e7490] transition-colors">
                    Submit for Approval
                  </button>
                )}
                {selectedFinding.status === 'pending_approval' && (
                  <>
                    <button className="px-4 py-2 bg-[#388e3c] text-white text-sm font-medium rounded-sm hover:bg-[#2e7d32] transition-colors">
                      Approve Recovery
                    </button>
                    <button className="px-4 py-2 bg-[#f1f3f6] text-[#878787] text-sm font-medium rounded-sm hover:bg-[#e0e0e0] transition-colors">
                      Reject
                    </button>
                  </>
                )}
                {selectedFinding.status === 'recovery_initiated' && (
                  <button className="px-4 py-2 bg-[#388e3c] text-white text-sm font-medium rounded-sm hover:bg-[#2e7d32] transition-colors">
                    Mark as Recovered
                  </button>
                )}
                <button className="px-4 py-2 bg-[#f1f3f6] text-[#878787] text-sm font-medium rounded-sm hover:bg-[#e0e0e0] transition-colors">
                  Mark False Positive
                </button>
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="px-4 py-2 bg-[#2874f0] text-white text-sm font-medium rounded-sm hover:bg-[#1a5dc8] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Viewer Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedEvidence(null)}></div>
          <div className="relative bg-white rounded-sm w-[900px] max-h-[85vh] flex flex-col" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            {/* Header */}
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between bg-gradient-to-r from-[#2874f0] to-[#1a5dc8]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                  selectedEvidence.type === 'invoice' ? 'bg-white/20' :
                  selectedEvidence.type === 'contract' ? 'bg-white/20' :
                  selectedEvidence.type === 'email' ? 'bg-white/20' :
                  selectedEvidence.type === 'screenshot' ? 'bg-white/20' :
                  selectedEvidence.type === 'report' ? 'bg-white/20' :
                  'bg-white/20'
                }`}>
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedEvidence.name}</h3>
                  <p className="text-sm text-blue-100">
                    {selectedEvidence.type.charAt(0).toUpperCase() + selectedEvidence.type.slice(1)} • {selectedEvidence.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">
                  <Download size={18} />
                </button>
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Info Bar */}
            <div className="px-4 py-2 bg-[#f9fafb] border-b border-[#e0e0e0] flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[#878787]">
                <span>Uploaded by: <span className="text-[#212121] font-medium">{selectedEvidence.uploadedBy}</span></span>
                <span>•</span>
                <span>Date: <span className="text-[#212121] font-medium">{selectedEvidence.uploadedAt}</span></span>
                <span>•</span>
                <span>Type: <span className="text-[#212121] font-medium">{selectedEvidence.type.toUpperCase()}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs bg-white border border-[#e0e0e0] text-[#212121] rounded hover:bg-[#f1f3f6] transition-colors">
                  Print
                </button>
                <button className="px-3 py-1 text-xs bg-[#2874f0] text-white rounded hover:bg-[#1a5dc8] transition-colors">
                  Download
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-auto p-6 bg-[#f1f3f6]">
              {selectedEvidence.type === 'invoice' && (
                <div className="bg-white rounded-sm p-8 max-w-3xl mx-auto" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-[#2874f0]">
                    <div>
                      <h1 className="text-2xl font-bold text-[#2874f0]">TAX INVOICE</h1>
                      <p className="text-sm text-[#878787] mt-1">Original for Recipient</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#212121]">{selectedEvidence.name.split('_')[0] || 'VENDOR'}</p>
                      <p className="text-xs text-[#878787]">GSTIN: 27AABCT1332L1ZS</p>
                    </div>
                  </div>

                  {/* Invoice Details Grid */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#f9fafb] p-4 rounded">
                      <p className="text-xs text-[#878787] mb-1">Invoice Number</p>
                      <p className="text-sm font-bold text-[#212121]">{selectedEvidence.name.replace('.pdf', '').replace(/_/g, '-').toUpperCase()}</p>
                      <p className="text-xs text-[#878787] mt-3 mb-1">Invoice Date</p>
                      <p className="text-sm font-medium text-[#212121]">{selectedEvidence.uploadedAt.split(' ')[0]}</p>
                    </div>
                    <div className="bg-[#f9fafb] p-4 rounded">
                      <p className="text-xs text-[#878787] mb-1">Bill To</p>
                      <p className="text-sm font-bold text-[#212121]">Flipkart Internet Pvt Ltd</p>
                      <p className="text-xs text-[#878787]">Building Alyssa, Begonia &amp; Clover</p>
                      <p className="text-xs text-[#878787]">Embassy Tech Village, Outer Ring Road</p>
                      <p className="text-xs text-[#878787]">Bengaluru - 560103</p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <table className="w-full mb-8">
                    <thead>
                      <tr className="bg-[#2874f0] text-white">
                        <th className="px-4 py-2 text-left text-xs font-medium">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-medium">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium">Rate</th>
                        <th className="px-4 py-2 text-right text-xs font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#e0e0e0]">
                        <td className="px-4 py-3 text-sm text-[#212121]">Professional Services - Q4 2024</td>
                        <td className="px-4 py-3 text-sm text-[#212121] text-right">1</td>
                        <td className="px-4 py-3 text-sm text-[#212121] text-right">₹4,50,000</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#212121] text-right">₹4,50,000</td>
                      </tr>
                      <tr className="border-b border-[#e0e0e0]">
                        <td className="px-4 py-3 text-sm text-[#212121]">Additional Support Hours</td>
                        <td className="px-4 py-3 text-sm text-[#212121] text-right">24</td>
                        <td className="px-4 py-3 text-sm text-[#212121] text-right">₹5,000</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#212121] text-right">₹1,20,000</td>
                      </tr>
                      <tr className="border-b border-[#e0e0e0]">
                        <td className="px-4 py-3 text-sm text-[#212121]">License Fees - Enterprise</td>
                        <td className="px-4 py-3 text-sm text-[#212121] text-right">150</td>
                        <td className="px-4 py-3 text-sm text-[#212121] text-right">₹1,200</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#212121] text-right">₹1,80,000</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
                        <span className="text-sm text-[#878787]">Subtotal</span>
                        <span className="text-sm font-medium text-[#212121]">₹7,50,000</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
                        <span className="text-sm text-[#878787]">CGST (9%)</span>
                        <span className="text-sm font-medium text-[#212121]">₹67,500</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
                        <span className="text-sm text-[#878787]">SGST (9%)</span>
                        <span className="text-sm font-medium text-[#212121]">₹67,500</span>
                      </div>
                      <div className="flex justify-between py-3 bg-[#2874f0] text-white px-3 rounded mt-2">
                        <span className="text-sm font-bold">Total</span>
                        <span className="text-sm font-bold">₹8,85,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-[#e0e0e0]">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-[#878787] mb-2">Bank Details</p>
                        <p className="text-xs text-[#212121]">Bank: HDFC Bank Ltd</p>
                        <p className="text-xs text-[#212121]">A/C: 50200012345678</p>
                        <p className="text-xs text-[#212121]">IFSC: HDFC0001234</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#878787] mb-4">Authorized Signatory</p>
                        <div className="h-12 border-b border-[#212121] w-32 ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedEvidence.type === 'contract' && (
                <div className="bg-white rounded-sm p-8 max-w-3xl mx-auto" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                  {/* Contract Header */}
                  <div className="text-center mb-8 pb-6 border-b-2 border-[#7b1fa2]">
                    <h1 className="text-2xl font-bold text-[#7b1fa2]">MASTER SERVICE AGREEMENT</h1>
                    <p className="text-sm text-[#878787] mt-2">Contract Reference: {selectedEvidence.name.replace('.pdf', '').replace(/_/g, '-').toUpperCase()}</p>
                  </div>

                  {/* Parties */}
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">PARTIES TO THE AGREEMENT</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-[#f9fafb] p-4 rounded">
                        <p className="text-xs text-[#7b1fa2] font-bold mb-2">FIRST PARTY (Client)</p>
                        <p className="text-sm font-medium text-[#212121]">Flipkart Internet Private Limited</p>
                        <p className="text-xs text-[#878787]">Embassy Tech Village</p>
                        <p className="text-xs text-[#878787]">Bengaluru, Karnataka - 560103</p>
                      </div>
                      <div className="bg-[#f9fafb] p-4 rounded">
                        <p className="text-xs text-[#7b1fa2] font-bold mb-2">SECOND PARTY (Vendor)</p>
                        <p className="text-sm font-medium text-[#212121]">{selectedEvidence.name.split('_')[0] || 'Vendor Company'}</p>
                        <p className="text-xs text-[#878787]">Corporate Office</p>
                        <p className="text-xs text-[#878787]">Mumbai, Maharashtra - 400001</p>
                      </div>
                    </div>
                  </div>

                  {/* Contract Terms */}
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">CONTRACT TERMS</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-[#7b1fa2] mb-2">1. SCOPE OF SERVICES</h3>
                        <p className="text-xs text-[#212121] leading-relaxed">
                          The Vendor agrees to provide services as outlined in Schedule A, including but not limited to
                          professional consulting, software licenses, support services, and implementation assistance
                          as per the specifications detailed in the Statement of Work (SOW).
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#7b1fa2] mb-2">2. COMMERCIAL TERMS</h3>
                        <div className="bg-[#f9fafb] p-4 rounded">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-[#878787]">Contract Value</p>
                              <p className="font-bold text-[#212121]">₹24,50,000</p>
                            </div>
                            <div>
                              <p className="text-[#878787]">Payment Terms</p>
                              <p className="font-bold text-[#212121]">Net 30 Days</p>
                            </div>
                            <div>
                              <p className="text-[#878787]">Contract Duration</p>
                              <p className="font-bold text-[#212121]">12 Months</p>
                            </div>
                            <div>
                              <p className="text-[#878787]">Effective Date</p>
                              <p className="font-bold text-[#212121]">01-Apr-2024</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#7b1fa2] mb-2">3. RATE CARD</h3>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-[#7b1fa2] text-white">
                              <th className="px-3 py-2 text-left">Service Category</th>
                              <th className="px-3 py-2 text-right">Rate (Per Unit)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#e0e0e0]">
                              <td className="px-3 py-2">Senior Consultant (Per Day)</td>
                              <td className="px-3 py-2 text-right font-medium">₹15,000</td>
                            </tr>
                            <tr className="border-b border-[#e0e0e0]">
                              <td className="px-3 py-2">Technical Specialist (Per Day)</td>
                              <td className="px-3 py-2 text-right font-medium">₹12,000</td>
                            </tr>
                            <tr className="border-b border-[#e0e0e0]">
                              <td className="px-3 py-2">Software License (Per User/Month)</td>
                              <td className="px-3 py-2 text-right font-medium">₹1,200</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="mt-8 pt-6 border-t-2 border-[#e0e0e0]">
                    <h2 className="text-sm font-bold text-[#212121] mb-6">AUTHORIZED SIGNATURES</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="h-16 border-b border-[#212121]"></div>
                        <p className="text-xs text-[#212121] font-medium mt-2">For Flipkart Internet Pvt Ltd</p>
                        <p className="text-xs text-[#878787]">Authorized Signatory</p>
                      </div>
                      <div>
                        <div className="h-16 border-b border-[#212121]"></div>
                        <p className="text-xs text-[#212121] font-medium mt-2">For {selectedEvidence.name.split('_')[0] || 'Vendor'}</p>
                        <p className="text-xs text-[#878787]">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedEvidence.type === 'email' && (
                <div className="bg-white rounded-sm max-w-3xl mx-auto" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                  {/* Email Header */}
                  <div className="p-6 border-b border-[#e0e0e0]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#2874f0] flex items-center justify-center text-white font-bold text-lg">
                        {selectedEvidence.uploadedBy.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#212121]">Re: {selectedEvidence.name.replace('.eml', '').replace(/_/g, ' ')}</h3>
                          <span className="text-xs text-[#878787]">{selectedEvidence.uploadedAt}</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-[#212121]"><span className="text-[#878787]">From:</span> vendor.accounts@{selectedEvidence.name.split('_')[0]?.toLowerCase() || 'vendor'}.com</p>
                          <p className="text-xs text-[#212121]"><span className="text-[#878787]">To:</span> procurement@flipkart.com</p>
                          <p className="text-xs text-[#212121]"><span className="text-[#878787]">CC:</span> finance.audit@flipkart.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-[#212121] leading-relaxed mb-4">
                        Dear Procurement Team,
                      </p>
                      <p className="text-sm text-[#212121] leading-relaxed mb-4">
                        Thank you for bringing this matter to our attention. We have reviewed the invoice in question
                        and would like to provide the following clarification regarding the billing discrepancy.
                      </p>
                      <p className="text-sm text-[#212121] leading-relaxed mb-4">
                        Upon internal review, we have identified that the variance in the invoiced amount was due to:
                      </p>
                      <ul className="list-disc list-inside text-sm text-[#212121] mb-4 space-y-2">
                        <li>Application of revised rates effective from Q4 2024 as per Addendum #3</li>
                        <li>Additional services rendered during the emergency support period (Oct 15-18)</li>
                        <li>Pro-rata adjustment for the license upgrade mid-cycle</li>
                      </ul>
                      <p className="text-sm text-[#212121] leading-relaxed mb-4">
                        We acknowledge there may have been a communication gap regarding the rate revision timing.
                        Please find attached the supporting documentation for your review.
                      </p>
                      <p className="text-sm text-[#212121] leading-relaxed mb-4">
                        We are committed to resolving this amicably and await your feedback.
                      </p>
                      <p className="text-sm text-[#212121] leading-relaxed">
                        Best regards,<br />
                        <strong>Accounts Team</strong><br />
                        {selectedEvidence.name.split('_')[0] || 'Vendor Company'}<br />
                        <span className="text-[#2874f0]">accounts@vendor.com</span>
                      </p>
                    </div>

                    {/* Attachments */}
                    <div className="mt-6 pt-4 border-t border-[#e0e0e0]">
                      <p className="text-xs font-medium text-[#878787] mb-3">Attachments (2)</p>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#f9fafb] rounded border border-[#e0e0e0]">
                          <FileText size={16} className="text-[#ff6161]" />
                          <span className="text-xs text-[#212121]">Addendum_3_RateRevision.pdf</span>
                          <span className="text-xs text-[#878787]">(245 KB)</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#f9fafb] rounded border border-[#e0e0e0]">
                          <FileText size={16} className="text-[#388e3c]" />
                          <span className="text-xs text-[#212121]">Support_Log_Oct2024.xlsx</span>
                          <span className="text-xs text-[#878787]">(128 KB)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedEvidence.type === 'screenshot' && (
                <div className="bg-white rounded-sm p-4 max-w-4xl mx-auto" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                  {/* Screenshot Preview Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#212121]">{selectedEvidence.name}</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#f1f3f6] rounded">
                        <Search size={16} className="text-[#878787]" />
                      </button>
                    </div>
                  </div>

                  {/* Mock Screenshot - System Dashboard */}
                  <div className="bg-[#f1f3f6] rounded border border-[#e0e0e0] overflow-hidden">
                    {/* Mock Browser Chrome */}
                    <div className="bg-[#e0e0e0] px-3 py-2 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff6161]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ff9f00]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#388e3c]"></div>
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="bg-white rounded px-3 py-1 text-xs text-[#878787]">
                          https://erp.flipkart.com/procurement/invoices/INV-2024-00856
                        </div>
                      </div>
                    </div>

                    {/* Mock Screenshot Content */}
                    <div className="p-4">
                      <div className="bg-white rounded p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#2874f0] rounded"></div>
                            <span className="font-bold text-[#212121]">Flipkart Procurement ERP</span>
                          </div>
                          <div className="text-xs text-[#878787]">User: audit.user@flipkart.com</div>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <h4 className="text-sm font-bold text-[#212121] mb-3">Invoice Details - INV-2024-00856</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-[#f1f3f6]">
                                <span className="text-xs text-[#878787]">Vendor</span>
                                <span className="text-xs font-medium text-[#212121]">TechSupply Solutions</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-[#f1f3f6]">
                                <span className="text-xs text-[#878787]">Invoice Amount</span>
                                <span className="text-xs font-medium text-[#212121]">₹8,85,000</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-[#f1f3f6]">
                                <span className="text-xs text-[#878787]">Expected Amount</span>
                                <span className="text-xs font-medium text-[#212121]">₹7,50,000</span>
                              </div>
                              <div className="flex justify-between py-1 bg-[#ffebee] px-2 rounded">
                                <span className="text-xs text-[#c62828] font-medium">Variance</span>
                                <span className="text-xs font-bold text-[#c62828]">₹1,35,000 (18%)</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#fff3e0] p-3 rounded">
                            <div className="text-center">
                              <AlertTriangle className="w-8 h-8 text-[#ff9f00] mx-auto mb-2" />
                              <p className="text-xs font-bold text-[#e65100]">FLAGGED</p>
                              <p className="text-xs text-[#878787] mt-1">Rate Variance Detected</p>
                            </div>
                          </div>
                        </div>

                        {/* Highlighted Area */}
                        <div className="border-2 border-[#ff6161] border-dashed rounded p-3 bg-[#ffebee]/50">
                          <p className="text-xs text-[#c62828] font-medium">⚠️ Screenshot captured showing billing discrepancy in ERP system</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Annotation */}
                  <div className="mt-4 p-3 bg-[#fff3e0] rounded border border-[#ff9f00]">
                    <p className="text-xs text-[#e65100]">
                      <strong>Annotation:</strong> This screenshot shows the ERP system flagging Invoice INV-2024-00856
                      with an 18% variance from expected amount. The highlighted area indicates the discrepancy
                      that triggered the audit alert.
                    </p>
                  </div>
                </div>
              )}

              {selectedEvidence.type === 'report' && (
                <div className="bg-white rounded-sm p-8 max-w-3xl mx-auto" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                  {/* Report Header */}
                  <div className="text-center mb-8 pb-6 border-b-2 border-[#388e3c]">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#2874f0] rounded flex items-center justify-center">
                        <span className="text-white font-bold text-lg">F</span>
                      </div>
                    </div>
                    <h1 className="text-xl font-bold text-[#388e3c]">AUDIT ANALYSIS REPORT</h1>
                    <p className="text-sm text-[#878787] mt-2">{selectedEvidence.name.replace('.xlsx', '').replace('.pdf', '').replace(/_/g, ' ')}</p>
                    <p className="text-xs text-[#878787] mt-1">Generated: {selectedEvidence.uploadedAt}</p>
                  </div>

                  {/* Executive Summary */}
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">
                      EXECUTIVE SUMMARY
                    </h2>
                    <div className="bg-[#e8f5e9] p-4 rounded mb-4">
                      <p className="text-sm text-[#212121] leading-relaxed">
                        This report presents the findings from the procurement audit conducted for the period
                        Q3-Q4 FY2024. The analysis identified significant discrepancies in vendor billing
                        patterns that warrant immediate attention and remediation.
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-[#f9fafb] rounded">
                        <p className="text-2xl font-bold text-[#2874f0]">47</p>
                        <p className="text-xs text-[#878787]">Transactions Reviewed</p>
                      </div>
                      <div className="text-center p-3 bg-[#f9fafb] rounded">
                        <p className="text-2xl font-bold text-[#ff6161]">12</p>
                        <p className="text-xs text-[#878787]">Anomalies Found</p>
                      </div>
                      <div className="text-center p-3 bg-[#f9fafb] rounded">
                        <p className="text-2xl font-bold text-[#ff9f00]">₹18.5L</p>
                        <p className="text-xs text-[#878787]">Potential Leakage</p>
                      </div>
                      <div className="text-center p-3 bg-[#f9fafb] rounded">
                        <p className="text-2xl font-bold text-[#388e3c]">₹12.2L</p>
                        <p className="text-xs text-[#878787]">Recoverable</p>
                      </div>
                    </div>
                  </div>

                  {/* Findings Table */}
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">
                      KEY FINDINGS
                    </h2>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#388e3c] text-white">
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left">Finding</th>
                          <th className="px-3 py-2 text-center">Severity</th>
                          <th className="px-3 py-2 text-right">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#e0e0e0]">
                          <td className="px-3 py-2">1</td>
                          <td className="px-3 py-2">Rate card deviation - Logistics vendor</td>
                          <td className="px-3 py-2 text-center"><span className="px-2 py-0.5 bg-[#ffebee] text-[#c62828] rounded text-[10px]">High</span></td>
                          <td className="px-3 py-2 text-right font-medium">₹5,45,000</td>
                        </tr>
                        <tr className="border-b border-[#e0e0e0]">
                          <td className="px-3 py-2">2</td>
                          <td className="px-3 py-2">Duplicate payment - Same invoice processed twice</td>
                          <td className="px-3 py-2 text-center"><span className="px-2 py-0.5 bg-[#ffebee] text-[#c62828] rounded text-[10px]">Critical</span></td>
                          <td className="px-3 py-2 text-right font-medium">₹4,80,000</td>
                        </tr>
                        <tr className="border-b border-[#e0e0e0]">
                          <td className="px-3 py-2">3</td>
                          <td className="px-3 py-2">License over-billing - SaaS vendor</td>
                          <td className="px-3 py-2 text-center"><span className="px-2 py-0.5 bg-[#fff3e0] text-[#e65100] rounded text-[10px]">Medium</span></td>
                          <td className="px-3 py-2 text-right font-medium">₹3,25,000</td>
                        </tr>
                        <tr className="border-b border-[#e0e0e0]">
                          <td className="px-3 py-2">4</td>
                          <td className="px-3 py-2">Incorrect addendum rates applied</td>
                          <td className="px-3 py-2 text-center"><span className="px-2 py-0.5 bg-[#fff3e0] text-[#e65100] rounded text-[10px]">Medium</span></td>
                          <td className="px-3 py-2 text-right font-medium">₹2,80,000</td>
                        </tr>
                        <tr className="border-b border-[#e0e0e0]">
                          <td className="px-3 py-2">5</td>
                          <td className="px-3 py-2">Marketing deliverables not verified</td>
                          <td className="px-3 py-2 text-center"><span className="px-2 py-0.5 bg-[#e8f5e9] text-[#2e7d32] rounded text-[10px]">Low</span></td>
                          <td className="px-3 py-2 text-right font-medium">₹2,20,000</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#f9fafb] font-bold">
                          <td className="px-3 py-2" colSpan={3}>Total Identified Leakage</td>
                          <td className="px-3 py-2 text-right text-[#c62828]">₹18,50,000</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#e0e0e0]">
                      RECOMMENDATIONS
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-[#212121]">
                      <li>Implement automated rate card validation in invoice processing workflow</li>
                      <li>Enable duplicate detection rules in ERP system with stricter thresholds</li>
                      <li>Conduct quarterly license reconciliation with all SaaS vendors</li>
                      <li>Establish addendum effective date controls in contract management system</li>
                      <li>Require delivery verification sign-off before marketing invoice approval</li>
                    </ol>
                  </div>

                  {/* Footer */}
                  <div className="pt-6 border-t border-[#e0e0e0]">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-[#878787]">Prepared by</p>
                        <p className="text-sm font-medium text-[#212121]">{selectedEvidence.uploadedBy}</p>
                        <p className="text-xs text-[#2874f0]">Internal Audit Team</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#878787]">Classification</p>
                        <span className="px-3 py-1 bg-[#ff9f00] text-white text-xs font-medium rounded">CONFIDENTIAL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedEvidence.type === 'other' && (
                <div className="bg-white rounded-sm p-8 max-w-3xl mx-auto text-center" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#f1f3f6] rounded-full flex items-center justify-center">
                    <FileText size={40} className="text-[#878787]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#212121] mb-2">{selectedEvidence.name}</h3>
                  <p className="text-sm text-[#878787] mb-6">
                    Preview not available for this file type
                  </p>
                  <div className="bg-[#f9fafb] rounded p-4 max-w-sm mx-auto">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-left">
                        <p className="text-xs text-[#878787]">File Size</p>
                        <p className="font-medium text-[#212121]">{selectedEvidence.size}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-[#878787]">Type</p>
                        <p className="font-medium text-[#212121]">{selectedEvidence.type.toUpperCase()}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-[#878787]">Uploaded By</p>
                        <p className="font-medium text-[#212121]">{selectedEvidence.uploadedBy}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-[#878787]">Upload Date</p>
                        <p className="font-medium text-[#212121]">{selectedEvidence.uploadedAt.split(' ')[0]}</p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-6 px-6 py-2 bg-[#2874f0] text-white text-sm font-medium rounded hover:bg-[#1a5dc8] transition-colors">
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility Functions
function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}

// Mock Data
const mockTransactions: Transaction[] = [
  { transaction_id: 'TXN202400001', vendor_name: 'TechSupply Solutions', total_value: 2450000, current_stage: 'payment', total_cycle_time_days: 45, has_bottleneck: false, compliance_score: 92 },
  { transaction_id: 'TXN202400002', vendor_name: 'Global Logistics India', total_value: 1890000, current_stage: 'invoicing', total_cycle_time_days: 62, has_bottleneck: true, bottleneck_stage: 'contracting', compliance_score: 78 },
  { transaction_id: 'TXN202400003', vendor_name: 'CloudFirst Technologies', total_value: 980000, current_stage: 'payment', total_cycle_time_days: 38, has_bottleneck: false, compliance_score: 95 },
  { transaction_id: 'TXN202400004', vendor_name: 'PeopleFirst HR', total_value: 560000, current_stage: 'pr_po_creation', total_cycle_time_days: 28, has_bottleneck: false, compliance_score: 88 },
  { transaction_id: 'TXN202400005', vendor_name: 'MarketBoost Digital', total_value: 1250000, current_stage: 'payment', total_cycle_time_days: 55, has_bottleneck: true, bottleneck_stage: 'sourcing', compliance_score: 82 },
];

const mockKPIs = {
  summary: [
    { metric_name: 'End-to-End Cycle Time', value: 42.5, unit: 'days', trend: 'improving', change_percentage: -5.2 },
    { metric_name: 'First-Pass Yield', value: 87.3, unit: '%', trend: 'stable', change_percentage: 1.3 },
    { metric_name: 'On-Time Payment', value: 91.2, unit: '%', trend: 'improving', change_percentage: 3.8 },
    { metric_name: 'Compliance Rate', value: 94.5, unit: '%', trend: 'improving', change_percentage: 2.1 },
  ]
};

const mockSpendByCategory = [
  { category: 'Logistics & Supply Chain', amount: 485000000, percentage: 32.3 },
  { category: 'Technology (IT)', amount: 280000000, percentage: 18.7 },
  { category: 'Services', amount: 245000000, percentage: 16.3 },
  { category: 'Marketing & Advertising', amount: 195000000, percentage: 13.0 },
  { category: 'Facilities & Infrastructure', amount: 168000000, percentage: 11.2 },
  { category: 'Outsourcing', amount: 127000000, percentage: 8.5 },
];

// 24-month trend data with category breakdown - each category has distinct patterns
// Logistics: Spikes during festive/sale seasons (Oct-Nov BBD, Aug Independence Day)
// Technology: Steady with spikes in Apr (new FY budgets) and Oct (annual renewals)
// Services: Quarter-end peaks (Mar, Jun, Sep, Dec) for contract closures
// Marketing: Major spikes during BBD (Oct), Republic Day (Jan), Year-end sales
// Facilities: Mostly flat with occasional renovation/renewal spikes
// Outsourcing: Gradual growth, peaks during high-volume sale periods
const mockMonthlyTrendDetailed = [
  // FY 2023-24
  { month: 'Jan 24', year: '2024', logistics: 28000000, technology: 18000000, services: 14000000, marketing: 32000000, facilities: 11000000, outsourcing: 8000000, total: 111000000 },
  { month: 'Feb 24', year: '2024', logistics: 26000000, technology: 17000000, services: 13000000, marketing: 15000000, facilities: 10000000, outsourcing: 7500000, total: 88500000 },
  { month: 'Mar 24', year: '2024', logistics: 30000000, technology: 16000000, services: 22000000, marketing: 18000000, facilities: 25000000, outsourcing: 9000000, total: 120000000 },
  { month: 'Apr 24', year: '2024', logistics: 32000000, technology: 35000000, services: 15000000, marketing: 14000000, facilities: 12000000, outsourcing: 8000000, total: 116000000 },
  { month: 'May 24', year: '2024', logistics: 35000000, technology: 22000000, services: 16000000, marketing: 20000000, facilities: 11000000, outsourcing: 9000000, total: 113000000 },
  { month: 'Jun 24', year: '2024', logistics: 33000000, technology: 20000000, services: 21000000, marketing: 16000000, facilities: 10500000, outsourcing: 8500000, total: 109000000 },
  { month: 'Jul 24', year: '2024', logistics: 38000000, technology: 19000000, services: 17000000, marketing: 22000000, facilities: 11000000, outsourcing: 10000000, total: 117000000 },
  { month: 'Aug 24', year: '2024', logistics: 52000000, technology: 21000000, services: 18000000, marketing: 28000000, facilities: 10000000, outsourcing: 14000000, total: 143000000 },
  { month: 'Sep 24', year: '2024', logistics: 45000000, technology: 24000000, services: 23000000, marketing: 35000000, facilities: 12000000, outsourcing: 12000000, total: 151000000 },
  { month: 'Oct 24', year: '2024', logistics: 78000000, technology: 32000000, services: 20000000, marketing: 65000000, facilities: 11000000, outsourcing: 18000000, total: 224000000 },
  { month: 'Nov 24', year: '2024', logistics: 85000000, technology: 25000000, services: 19000000, marketing: 45000000, facilities: 10500000, outsourcing: 20000000, total: 204500000 },
  { month: 'Dec 24', year: '2024', logistics: 48000000, technology: 28000000, services: 26000000, marketing: 38000000, facilities: 18000000, outsourcing: 15000000, total: 173000000 },
  // FY 2024-25
  { month: 'Jan 25', year: '2025', logistics: 32000000, technology: 20000000, services: 16000000, marketing: 42000000, facilities: 12000000, outsourcing: 9000000, total: 131000000 },
  { month: 'Feb 25', year: '2025', logistics: 29000000, technology: 19000000, services: 15000000, marketing: 18000000, facilities: 11000000, outsourcing: 8500000, total: 100500000 },
  { month: 'Mar 25', year: '2025', logistics: 35000000, technology: 18000000, services: 28000000, marketing: 22000000, facilities: 30000000, outsourcing: 10000000, total: 143000000 },
  { month: 'Apr 25', year: '2025', logistics: 36000000, technology: 42000000, services: 17000000, marketing: 16000000, facilities: 13000000, outsourcing: 9000000, total: 133000000 },
  { month: 'May 25', year: '2025', logistics: 40000000, technology: 26000000, services: 18000000, marketing: 24000000, facilities: 12000000, outsourcing: 10000000, total: 130000000 },
  { month: 'Jun 25', year: '2025', logistics: 38000000, technology: 23000000, services: 25000000, marketing: 19000000, facilities: 11500000, outsourcing: 9500000, total: 126000000 },
  { month: 'Jul 25', year: '2025', logistics: 44000000, technology: 22000000, services: 19000000, marketing: 26000000, facilities: 12000000, outsourcing: 11000000, total: 134000000 },
  { month: 'Aug 25', year: '2025', logistics: 58000000, technology: 24000000, services: 20000000, marketing: 32000000, facilities: 11000000, outsourcing: 16000000, total: 161000000 },
  { month: 'Sep 25', year: '2025', logistics: 50000000, technology: 28000000, services: 27000000, marketing: 40000000, facilities: 13000000, outsourcing: 14000000, total: 172000000 },
  { month: 'Oct 25', year: '2025', logistics: 88000000, technology: 38000000, services: 22000000, marketing: 72000000, facilities: 12000000, outsourcing: 22000000, total: 254000000 },
  { month: 'Nov 25', year: '2025', logistics: 95000000, technology: 28000000, services: 21000000, marketing: 52000000, facilities: 11500000, outsourcing: 24000000, total: 231500000 },
  { month: 'Dec 25', year: '2025', logistics: 55000000, technology: 32000000, services: 30000000, marketing: 44000000, facilities: 22000000, outsourcing: 17000000, total: 200000000 },
];

// Legacy format for backward compatibility
const mockMonthlyTrend = mockMonthlyTrendDetailed.map(d => ({ month: d.month, amount: d.total }));

const mockTopVendors = [
  { vendor_name: 'Delhivery Logistics', amount: 125000000, category: 'Logistics & Supply Chain' },
  { vendor_name: 'Ecom Express', amount: 98000000, category: 'Logistics & Supply Chain' },
  { vendor_name: 'Dell Technologies', amount: 85000000, category: 'Technology (IT)' },
  { vendor_name: 'Google Cloud India', amount: 72000000, category: 'Technology (IT)' },
  { vendor_name: 'Dentsu Media', amount: 65000000, category: 'Marketing & Advertising' },
  { vendor_name: 'TeamLease Services', amount: 58000000, category: 'Services' },
  { vendor_name: 'JLL India', amount: 52000000, category: 'Facilities & Infrastructure' },
  { vendor_name: 'Teleperformance', amount: 48000000, category: 'Outsourcing' },
];

const mockSpendData = {
  total_spend: 1500000000,
  spend_by_category: mockSpendByCategory,
  monthly_trend: mockMonthlyTrend,
  top_vendors: mockTopVendors
};

const mockRiskData = {
  summary: {
    total_suppliers: 248,
    high_risk_count: 12,
    medium_risk_count: 45,
    low_risk_count: 191,
    spend_at_high_risk: 185000000
  }
};

const mockLeakageByType = [
  { type: 'Rate Card Violation', count: 6, value: 650000 },
  { type: 'Duplicate Invoice', count: 4, value: 420000 },
  { type: 'Quantity Mismatch', count: 5, value: 380000 },
  { type: 'Pricing Discrepancy', count: 3, value: 400000 },
];

const mockStatusBreakdown = [
  { status: 'New', count: 4, value: 380000 },
  { status: 'Under Investigation', count: 6, value: 520000 },
  { status: 'Recovery Initiated', count: 5, value: 450000 },
  { status: 'Closed', count: 3, value: 500000 },
];

const mockLeakageDashboard = {
  summary: {
    total_cases: 18,
    total_leakage_identified: 1850000,
    total_recovered: 920000,
    recovery_rate: 49.7,
    pending_investigation: 6
  },
  type_breakdown: mockLeakageByType,
  status_breakdown: mockStatusBreakdown,
  severity_breakdown: [
    { severity: 'High', count: 5, value: 980000 },
    { severity: 'Medium', count: 8, value: 620000 },
    { severity: 'Low', count: 5, value: 250000 },
  ]
};

// Documentation View Component
function DocumentationView() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const features = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: LayoutDashboard,
      color: '#2874f0',
      description: 'Flipkart Procurement AI Platform - End-to-end procurement intelligence',
      content: {
        summary: 'A comprehensive AI-powered procurement platform designed to optimize spend management, detect payment leakages, and provide actionable intelligence for procurement decisions.',
        highlights: [
          'Real-time spend analytics across 6 major categories',
          'AI-powered payment leakage detection',
          'Automated vendor risk assessment',
          'Natural language procurement assistant',
          'External market intelligence integration',
        ],
        metrics: [
          { label: 'Total Indirect Spend Tracked', value: '₹1,500 Cr' },
          { label: 'Categories Monitored', value: '6' },
          { label: 'Active Vendors', value: '248' },
          { label: 'Leakage Detection Rate', value: '94.5%' },
        ],
        dataIntegrations: {
          title: 'Platform Data Architecture',
          description: 'The platform integrates data from multiple enterprise systems into a unified procurement data lake for real-time analytics and AI-powered insights.',
          architecture: [
            { layer: 'Source Systems', systems: 'SAP S/4HANA, Oracle Fusion, Coupa, ServiceNow, Workday' },
            { layer: 'Integration Layer', systems: 'REST APIs, JDBC Connectors, File-based ETL, Change Data Capture' },
            { layer: 'Data Lake', systems: 'Centralized repository with 5.5M+ procurement records' },
            { layer: 'Analytics Engine', systems: 'Real-time aggregation, ML models, Anomaly detection' },
            { layer: 'Presentation', systems: 'React dashboards, D3.js visualizations, Recharts' },
          ],
          refreshRates: [
            { data: 'Transaction Data', frequency: 'Real-time (< 5 min)' },
            { data: 'Vendor Master', frequency: 'Daily batch' },
            { data: 'Contract Data', frequency: 'On-change sync' },
            { data: 'External Intelligence', frequency: 'Hourly' },
          ]
        }
      }
    },
    {
      id: 'dashboard',
      title: 'Executive Dashboard',
      icon: Home,
      color: '#2874f0',
      description: 'Real-time overview of procurement health and key metrics',
      content: {
        summary: 'The Executive Dashboard provides a bird\'s-eye view of all procurement activities with interactive visualizations and drill-down capabilities.',
        highlights: [
          'KPI cards showing total spend, savings, and leakage metrics',
          'Interactive treemap visualization of indirect spend by category',
          'Geographic distribution of vendor spend across India',
          'Quick access to pending approvals and action items',
          'Real-time alerts for compliance and risk issues',
        ],
        subFeatures: [
          {
            name: 'Spend Treemap',
            description: 'D3.js-powered hierarchical visualization showing spend distribution across Logistics, Technology, Services, Marketing, Facilities, and Outsourcing categories'
          },
          {
            name: 'India Map View',
            description: 'Geographic visualization of vendor concentration and regional spend patterns'
          },
          {
            name: 'Quick Stats Cards',
            description: 'At-a-glance metrics for Total Spend, Indirect Spend, Active Vendors, and Identified Savings'
          }
        ],
        dataIntegrations: {
          title: 'Dashboard Data Sources',
          description: 'The dashboard aggregates data from multiple backend APIs and displays real-time metrics through optimized queries.',
          apis: [
            { endpoint: '/api/dashboard/stats', description: 'Aggregated KPI metrics (total spend, vendor count, savings)', refresh: 'Every 5 minutes' },
            { endpoint: '/api/spend/by-category', description: 'Category-wise spend breakdown for pie charts and treemap', refresh: 'Real-time' },
            { endpoint: '/api/spend/by-region', description: 'Geographic spend distribution for India map visualization', refresh: 'Hourly' },
            { endpoint: '/api/alerts/pending', description: 'Active alerts and pending approvals', refresh: 'Real-time push' },
          ],
          dataFlow: [
            { step: 1, action: 'SAP/Oracle transaction data synced to data lake' },
            { step: 2, action: 'Aggregation jobs compute spend summaries by category, vendor, region' },
            { step: 3, action: 'API serves pre-computed aggregates for fast dashboard load' },
            { step: 4, action: 'D3.js/Recharts render interactive visualizations' },
            { step: 5, action: 'Click events trigger drill-down queries to transaction-level data' },
          ]
        }
      }
    },
    {
      id: 'lifecycle',
      title: 'Lifecycle Tracking',
      icon: GitBranch,
      color: '#388e3c',
      description: 'End-to-end procurement process monitoring and optimization',
      content: {
        summary: 'Track and optimize the complete procurement lifecycle from requisition to payment with AI-powered process mining capabilities.',
        highlights: [
          'Gantt chart timeline visualization of procurement stages',
          'Bottleneck detection and flow analysis',
          'Control lapse identification',
          'Process variant analysis',
          'System integration mapping',
        ],
        subFeatures: [
          {
            name: 'Gantt Timeline',
            description: 'Visual representation of procurement process stages: Requisition → Sourcing → Contracting → PO → Invoice → Payment'
          },
          {
            name: 'Bottleneck Flow Chart',
            description: 'Identify process bottlenecks and delays in the procurement workflow'
          },
          {
            name: 'Control Laps Detection',
            description: 'Automated detection of control failures and compliance gaps'
          },
          {
            name: 'Process Discovery',
            description: 'AI-powered analysis of actual vs. expected procurement processes'
          },
          {
            name: 'Variant Analysis',
            description: 'Compare process variations to identify inefficiencies and best practices'
          }
        ],
        dataIntegrations: {
          title: 'Process Mining Data Pipeline',
          description: 'Lifecycle tracking uses event log data from enterprise systems to reconstruct and analyze procurement processes.',
          eventSources: [
            { system: 'SAP S/4HANA', events: 'PR Created, PR Approved, RFQ Sent, PO Created, PO Approved, GRN Posted' },
            { system: 'Oracle Fusion', events: 'Requisition Submit, Sourcing Event, Award Decision, Contract Signed' },
            { system: 'Coupa', events: 'Invoice Received, Invoice Matched, Invoice Approved, Payment Scheduled' },
            { system: 'ServiceNow', events: 'Approval Workflows, Exception Handling, Escalations' },
          ],
          processingSteps: [
            { step: 'Event Collection', description: 'CDC (Change Data Capture) streams events from source systems' },
            { step: 'Event Correlation', description: 'Link events by PO number, vendor ID, and transaction references' },
            { step: 'Process Reconstruction', description: 'Build process instances from correlated event sequences' },
            { step: 'Conformance Check', description: 'Compare actual vs. expected process models' },
            { step: 'Bottleneck Analysis', description: 'Calculate cycle times, identify delays > SLA thresholds' },
          ],
          metrics: [
            { name: 'Avg. Cycle Time', calculation: 'End timestamp - Start timestamp per process' },
            { name: 'First-Pass Yield', calculation: 'Processes without rework / Total processes' },
            { name: 'SLA Compliance', calculation: 'On-time completions / Total completions' },
          ]
        }
      }
    },
    {
      id: 'agent',
      title: 'AI Procurement Agent',
      icon: Bot,
      color: '#6366f1',
      description: 'Natural language interface for procurement queries and actions',
      content: {
        summary: 'An intelligent conversational AI assistant that understands procurement context and provides actionable insights through natural language.',
        highlights: [
          'Natural language query processing',
          'Contextual understanding of procurement terminology',
          'Automated data retrieval and analysis',
          'Smart suggestions and recommendations',
          'Multi-turn conversation support',
        ],
        capabilities: [
          'Vendor performance inquiries',
          'Spend analysis by category, time period, or vendor',
          'Contract compliance status checks',
          'Savings opportunity identification',
          'Risk assessment queries',
          'Benchmark comparisons'
        ],
        exampleQueries: [
          '"Show me top 5 vendors by spend in Logistics"',
          '"What are the pending invoices over ₹50L?"',
          '"Analyze rate card compliance for IT services"',
          '"Find duplicate payments in last quarter"',
          '"Compare cloud spend vs budget YTD"'
        ],
        dataIntegrations: {
          title: 'AI Agent Architecture',
          description: 'The AI agent uses natural language processing to understand queries and retrieves data from the procurement data lake.',
          components: [
            { name: 'NLP Engine', technology: 'Intent classification, entity extraction, query understanding' },
            { name: 'Query Builder', technology: 'Converts natural language to structured API/SQL queries' },
            { name: 'Data Retrieval', technology: 'Executes queries against procurement data lake' },
            { name: 'Response Generator', technology: 'Formats results into human-readable responses' },
            { name: 'Context Manager', technology: 'Maintains conversation state for multi-turn queries' },
          ],
          supportedIntents: [
            { intent: 'spend_analysis', entities: ['category', 'vendor', 'time_period', 'amount_range'] },
            { intent: 'vendor_lookup', entities: ['vendor_name', 'vendor_id', 'category'] },
            { intent: 'invoice_status', entities: ['invoice_number', 'vendor', 'status', 'amount'] },
            { intent: 'compliance_check', entities: ['contract_id', 'vendor', 'compliance_type'] },
            { intent: 'savings_analysis', entities: ['category', 'time_period', 'savings_type'] },
          ],
          dataAccess: [
            { table: 'transactions', fields: 'amount, date, vendor, category, status' },
            { table: 'vendors', fields: 'name, id, category, risk_score, compliance_status' },
            { table: 'contracts', fields: 'rate_card, terms, validity, vendor_id' },
            { table: 'invoices', fields: 'number, amount, status, payment_date' },
          ]
        }
      }
    },
    {
      id: 'analytics',
      title: 'Insights & Analytics',
      icon: PieChartIcon,
      color: '#ff9f00',
      description: 'Deep-dive analytics with spend patterns and trend analysis',
      content: {
        summary: 'Comprehensive analytics module providing detailed spend analysis, trend visualization, and category-wise breakdowns.',
        highlights: [
          'Interactive pie charts for spend distribution',
          '24-month trend analysis with category filters',
          'Stacked area charts for multi-category comparison',
          'Drill-down from category to subcategory to transactions',
          'Vendor risk assessment and scoring',
        ],
        subFeatures: [
          {
            name: 'Spend by Category',
            description: 'Pie chart visualization with drill-down to subcategories and individual transactions'
          },
          {
            name: 'Monthly Spend Trend',
            description: '24-month historical trend with filters for All Categories, Logistics, Technology, Services, Marketing, Facilities, and Outsourcing'
          },
          {
            name: 'Category Breakdown',
            description: 'Detailed subcategory analysis with progress bars and spend percentages'
          },
          {
            name: 'Transaction Modal',
            description: 'Click-through to view vendor, category, contract, and spend details for each transaction'
          }
        ],
        dataIntegrations: {
          title: 'Analytics Data Pipeline',
          description: 'Analytics module processes transaction data through aggregation pipelines to generate visualizations.',
          dataSources: [
            { source: 'Transaction Fact Table', records: '2.4M+', granularity: 'Individual transactions' },
            { source: 'Category Dimension', records: '6 categories, 48 subcategories', granularity: 'Hierarchy' },
            { source: 'Vendor Dimension', records: '248 active vendors', granularity: 'Vendor master' },
            { source: 'Time Dimension', records: '24 months', granularity: 'Day/Month/Quarter/Year' },
          ],
          aggregations: [
            { name: 'Spend by Category', query: 'SUM(amount) GROUP BY category', caching: '15 min TTL' },
            { name: 'Monthly Trend', query: 'SUM(amount) GROUP BY month, category', caching: '1 hour TTL' },
            { name: 'Vendor Rankings', query: 'SUM(amount) GROUP BY vendor ORDER BY amount DESC', caching: '30 min TTL' },
            { name: 'Risk Scores', query: 'AVG(risk_indicators) GROUP BY vendor', caching: 'Daily refresh' },
          ],
          visualizations: [
            { chart: 'PieChart', library: 'Recharts', dataFormat: '{ category, amount, percentage }' },
            { chart: 'AreaChart', library: 'Recharts', dataFormat: '{ month, logistics, tech, services, ... }' },
            { chart: 'Treemap', library: 'D3.js', dataFormat: 'Hierarchical { name, children, value }' },
            { chart: 'BarChart', library: 'Recharts', dataFormat: '{ vendor, amount, category }' },
          ]
        }
      }
    },
    {
      id: 'intelligence',
      title: 'External Intelligence',
      icon: Globe,
      color: '#8b5cf6',
      description: 'Market data and external vendor intelligence integration',
      content: {
        summary: 'Real-time integration with external data sources to provide market intelligence, company information, and risk signals.',
        highlights: [
          'Company profile lookup with financial data',
          'Stock price tracking for public vendors',
          'News and sentiment analysis',
          'Market benchmark data',
          'Regulatory compliance checks',
        ],
        dataSources: [
          {
            name: 'API Ninjas',
            description: 'Company information, logos, and business data'
          },
          {
            name: 'Finnhub',
            description: 'Real-time stock prices and financial metrics'
          },
          {
            name: 'News APIs',
            description: 'Latest news and sentiment for vendor monitoring'
          }
        ],
        useCases: [
          'Vendor financial health assessment',
          'Pre-contract due diligence',
          'Ongoing vendor monitoring',
          'Market rate validation'
        ],
        detailedUseCases: [
          {
            name: 'Vendor Financial Health Assessment',
            icon: 'TrendingUp',
            description: 'Evaluate the financial stability of vendors before and during engagement to mitigate supply chain risks.',
            workflow: [
              'Search vendor by company name or stock ticker',
              'Retrieve company profile (industry, employees, founding year)',
              'Fetch real-time stock price and market cap for public companies',
              'Calculate financial health score based on stock performance, company size, and market position',
              'Display risk indicators and recommendations'
            ],
            dataUsed: ['Stock price trends', 'Market capitalization', 'Employee count', 'Years in business', 'Industry classification'],
            businessValue: 'Reduces vendor default risk by 40% through early detection of financial distress signals',
            example: 'Before renewing a ₹50 Cr logistics contract with Delhivery, procurement team checks their stock performance (-15% QoQ) and market cap trends to assess continued viability.'
          },
          {
            name: 'Pre-Contract Due Diligence',
            icon: 'FileCheck',
            description: 'Comprehensive vendor vetting before contract signing to ensure alignment with company standards.',
            workflow: [
              'Enter potential vendor name for evaluation',
              'Pull company information (headquarters, industry sector, company size)',
              'Retrieve company logo for verification',
              'Check stock exchange listing status',
              'Cross-reference with internal vendor database',
              'Generate due diligence report'
            ],
            dataUsed: ['Company profile', 'Industry sector', 'Exchange listing', 'Founded date', 'Logo verification'],
            businessValue: 'Streamlines vendor onboarding by 60% with automated background checks',
            example: 'When evaluating a new SaaS vendor for cloud infrastructure, the platform auto-fetches Freshworks company data, verifies NASDAQ listing, and flags any recent negative news.'
          },
          {
            name: 'Ongoing Vendor Monitoring',
            icon: 'Eye',
            description: 'Continuous surveillance of strategic vendor health to enable proactive risk management.',
            workflow: [
              'Configure watch list of critical vendors (top 20 by spend)',
              'Schedule automated daily/weekly stock price checks',
              'Set alert thresholds (e.g., >10% stock drop, negative news)',
              'Push notifications to procurement team on threshold breach',
              'Generate monthly vendor health report'
            ],
            dataUsed: ['Daily stock prices', 'Price change %', '52-week high/low', 'Trading volume'],
            businessValue: 'Enables 72-hour advance warning on vendor financial distress vs. reactive approach',
            example: 'System alerts procurement team when Teleperformance stock drops 12% in a week, triggering a review of the ₹48 Cr outsourcing contract and contingency planning.'
          },
          {
            name: 'Market Rate Validation',
            icon: 'Calculator',
            description: 'Benchmark vendor pricing against market data to ensure competitive procurement.',
            workflow: [
              'Identify vendor industry and size tier',
              'Retrieve comparable company data (employees, revenue indicators)',
              'Compare quoted rates with industry benchmarks',
              'Adjust for company size and geographic factors',
              'Generate rate competitiveness score'
            ],
            dataUsed: ['Industry classification', 'Company size (employees)', 'Market position', 'Geographic presence'],
            businessValue: 'Achieves 8-12% cost reduction through data-driven negotiations',
            example: 'When Dell quotes ₹85 Cr for IT hardware, platform pulls industry data showing comparable deals with similar-sized tech companies to validate pricing fairness.'
          },
          {
            name: 'Merger & Acquisition Impact Analysis',
            icon: 'GitBranch',
            description: 'Assess impact of vendor M&A activities on existing contracts and relationships.',
            workflow: [
              'Monitor news feeds for vendor M&A announcements',
              'Identify affected contracts in portfolio',
              'Evaluate acquiring company profile and stability',
              'Assess contract novation requirements',
              'Plan stakeholder communication'
            ],
            dataUsed: ['Company ownership changes', 'Stock price reactions', 'Industry news', 'Company profiles'],
            businessValue: 'Reduces contract disruption from M&A by 80% through early preparation',
            example: 'When AWS announces acquisition of a key SaaS vendor, system flags 3 affected contracts worth ₹15 Cr and initiates review workflow.'
          },
          {
            name: 'Competitive Intelligence',
            icon: 'Target',
            description: 'Gather market intelligence on vendors and their competitors for strategic negotiations.',
            workflow: [
              'Search for vendor and top 3 competitors',
              'Compare company sizes, market positions',
              'Analyze relative stock performance',
              'Identify alternative vendors in same sector',
              'Build negotiation leverage insights'
            ],
            dataUsed: ['Multi-company comparison', 'Industry sector peers', 'Market cap rankings', 'Employee counts'],
            businessValue: 'Improves negotiation outcomes by 15% with competitive intelligence',
            example: 'Before renegotiating with Google Cloud, procurement pulls data on AWS and Azure to understand relative market positions and leverage competitive alternatives.'
          }
        ],
        dataIntegrations: {
          title: 'External API Integrations',
          description: 'The platform connects to multiple external APIs to enrich vendor data with market intelligence.',
          apis: [
            {
              name: 'API Ninjas Company API',
              endpoint: 'https://api.api-ninjas.com/v1/company',
              auth: 'API Key (X-Api-Key header)',
              rateLimit: '10,000 requests/month (free tier)',
              dataReturned: 'Company name, ticker, exchange, industry, sector, employees, founded year',
              usage: 'Vendor profile enrichment, industry classification'
            },
            {
              name: 'API Ninjas Logo API',
              endpoint: 'https://api.api-ninjas.com/v1/logo',
              auth: 'API Key (X-Api-Key header)',
              rateLimit: '10,000 requests/month (free tier)',
              dataReturned: 'Company logo URL (PNG format)',
              usage: 'Visual vendor identification in dashboards'
            },
            {
              name: 'Finnhub Stock Quote API',
              endpoint: 'https://finnhub.io/api/v1/quote',
              auth: 'API Key (token parameter)',
              rateLimit: '60 calls/minute (free tier)',
              dataReturned: 'Current price, change, percent change, high, low, open, previous close',
              usage: 'Real-time stock tracking for public vendors'
            },
            {
              name: 'Finnhub Company Profile',
              endpoint: 'https://finnhub.io/api/v1/stock/profile2',
              auth: 'API Key (token parameter)',
              rateLimit: '60 calls/minute (free tier)',
              dataReturned: 'Market cap, shares outstanding, IPO date, website, logo',
              usage: 'Financial health assessment'
            },
          ],
          enrichmentFlow: [
            { step: 1, action: 'User searches for vendor by name or ticker symbol' },
            { step: 2, action: 'Frontend calls /api/intelligence/company with search term' },
            { step: 3, action: 'Backend fetches data from API Ninjas (company info + logo)' },
            { step: 4, action: 'If public company, backend fetches Finnhub stock quote' },
            { step: 5, action: 'Data merged and returned to frontend for display' },
            { step: 6, action: 'Results cached for 1 hour to reduce API calls' },
          ],
          configuration: [
            { key: 'VITE_API_NINJAS_KEY', description: 'API Ninjas authentication key', location: '.env file' },
            { key: 'VITE_FINNHUB_KEY', description: 'Finnhub API authentication token', location: '.env file' },
          ]
        }
      }
    },
    {
      id: 'leakage',
      title: 'Leakage Detection',
      icon: AlertTriangle,
      color: '#ff6161',
      description: 'AI-powered payment leakage identification and recovery',
      content: {
        summary: 'Advanced anomaly detection system that identifies payment leakages, duplicate invoices, rate card violations, and contract compliance issues.',
        highlights: [
          'Automated duplicate payment detection',
          'Rate card compliance monitoring',
          'Scope creep identification',
          'Tax calculation validation',
          'Contract vs. actuals comparison',
        ],
        leakageTypes: [
          {
            name: 'Scope Creep',
            description: 'Services billed outside contracted scope',
            typical: '35% of leakages'
          },
          {
            name: 'Rate Card Violation',
            description: 'Billing rates exceeding agreed contracts',
            typical: '25% of leakages'
          },
          {
            name: 'Pricing Discrepancy',
            description: 'Price variations from purchase orders',
            typical: '18% of leakages'
          },
          {
            name: 'Tax Calculation Error',
            description: 'Incorrect GST/tax computations',
            typical: '12% of leakages'
          },
          {
            name: 'Duplicate Invoice',
            description: 'Same invoice submitted multiple times',
            typical: '10% of leakages'
          }
        ],
        recoveryProcess: [
          'Automated case creation',
          'Evidence compilation',
          'Vendor notification',
          'Resolution tracking',
          'Recovery confirmation'
        ],
        dataIntegrations: {
          title: 'Leakage Detection Engine',
          description: 'The detection engine runs ML models against invoice and payment data to identify anomalies.',
          detectionModels: [
            {
              name: 'Duplicate Detection',
              algorithm: 'Fuzzy matching on invoice number, amount, vendor, date',
              dataSources: 'Invoice table, Payment records',
              threshold: '>85% similarity score flags for review'
            },
            {
              name: 'Rate Card Compliance',
              algorithm: 'Compare invoice line items against contracted rates',
              dataSources: 'Invoice line items, Contract rate cards',
              threshold: '>5% deviation triggers alert'
            },
            {
              name: 'Scope Validation',
              algorithm: 'NLP classification of invoice descriptions vs. contract scope',
              dataSources: 'Invoice descriptions, Contract SOW text',
              threshold: '<70% scope match flags for review'
            },
            {
              name: 'Tax Validation',
              algorithm: 'Recalculate GST based on HSN codes and state rules',
              dataSources: 'Invoice tax amounts, GST master, HSN codes',
              threshold: '>₹100 difference triggers alert'
            },
          ],
          dataFlow: [
            { step: 1, action: 'New invoice received and parsed (OCR if needed)' },
            { step: 2, action: 'Invoice data matched to PO and contract' },
            { step: 3, action: 'Run through duplicate detection model' },
            { step: 4, action: 'Validate rates against contract rate card' },
            { step: 5, action: 'Check scope against contract terms (NLP)' },
            { step: 6, action: 'Validate tax calculations' },
            { step: 7, action: 'Generate anomaly score and create case if threshold exceeded' },
          ],
          caseManagement: [
            { field: 'case_id', description: 'Unique identifier for leakage case' },
            { field: 'detection_type', description: 'Type of leakage detected' },
            { field: 'confidence_score', description: 'ML model confidence (0-100%)' },
            { field: 'potential_recovery', description: 'Estimated recoverable amount' },
            { field: 'evidence', description: 'Supporting documents and data points' },
            { field: 'status', description: 'Open, Under Review, Confirmed, Recovered, Dismissed' },
          ]
        }
      }
    },
    {
      id: 'data',
      title: 'Data Infrastructure',
      icon: Database,
      color: '#00bcd4',
      description: 'Enterprise data connectors and centralized data lake',
      content: {
        summary: 'Robust data infrastructure connecting to enterprise systems and maintaining a centralized procurement data lake.',
        highlights: [
          'Pre-built connectors for SAP, Oracle, Coupa',
          'Real-time data synchronization',
          'Historical data archival',
          'Data quality monitoring',
          'API-based integrations',
        ],
        connectors: [
          { name: 'SAP S/4HANA', status: 'Connected', records: '2.4M' },
          { name: 'Oracle Fusion', status: 'Connected', records: '1.8M' },
          { name: 'Coupa', status: 'Connected', records: '890K' },
          { name: 'ServiceNow', status: 'Connected', records: '450K' },
          { name: 'Workday', status: 'Pending', records: '-' }
        ],
        dataLake: [
          'Purchase Orders',
          'Invoices',
          'Contracts',
          'Vendor Master',
          'Payment Records',
          'GRN/SES Documents'
        ],
        dataIntegrations: {
          title: 'Data Lake Architecture',
          description: 'Centralized data repository with enterprise connectors and real-time synchronization.',
          connectorDetails: [
            {
              system: 'SAP S/4HANA',
              protocol: 'OData APIs + RFC/BAPI',
              tables: 'EKKO (PO Header), EKPO (PO Items), RBKP (Invoice Header), RSEG (Invoice Items), LFA1 (Vendor Master)',
              syncMethod: 'CDC via SAP SLT + Batch delta loads',
              frequency: 'Real-time for transactions, Daily for master data'
            },
            {
              system: 'Oracle Fusion',
              protocol: 'REST APIs + BI Publisher Reports',
              tables: 'PO_HEADERS_ALL, PO_LINES_ALL, AP_INVOICES_ALL, AP_INVOICE_LINES_ALL, HZ_PARTIES (Vendors)',
              syncMethod: 'Oracle Integration Cloud (OIC) + Scheduled extracts',
              frequency: 'Every 15 minutes for transactions'
            },
            {
              system: 'Coupa',
              protocol: 'Coupa REST API v3',
              tables: 'Requisitions, Purchase Orders, Invoices, Suppliers, Contracts',
              syncMethod: 'Webhook for real-time + API polling for reconciliation',
              frequency: 'Real-time webhooks + Hourly full sync'
            },
            {
              system: 'ServiceNow',
              protocol: 'ServiceNow Table API',
              tables: 'Approval workflows, Catalog items, Incidents',
              syncMethod: 'REST API polling',
              frequency: 'Every 5 minutes'
            },
          ],
          dataLakeSchema: [
            {
              table: 'fact_transactions',
              description: 'Core transaction fact table',
              columns: 'txn_id, po_number, invoice_number, vendor_id, amount, category_id, date_id, status',
              rowCount: '5.5M+'
            },
            {
              table: 'dim_vendors',
              description: 'Vendor master dimension',
              columns: 'vendor_id, name, category, region, risk_score, compliance_status, active_flag',
              rowCount: '248'
            },
            {
              table: 'dim_categories',
              description: 'Spend category hierarchy',
              columns: 'category_id, category_name, parent_id, level',
              rowCount: '54 (6 L1 + 48 L2)'
            },
            {
              table: 'dim_contracts',
              description: 'Contract master with rate cards',
              columns: 'contract_id, vendor_id, start_date, end_date, rate_card_json, scope_text',
              rowCount: '320'
            },
            {
              table: 'fact_leakage_cases',
              description: 'Detected leakage cases',
              columns: 'case_id, txn_id, type, confidence, amount, status, created_date',
              rowCount: '18 active'
            },
          ],
          dataQuality: [
            { check: 'Completeness', description: 'Null value monitoring on required fields', threshold: '>99%' },
            { check: 'Uniqueness', description: 'Duplicate detection on primary keys', threshold: '100%' },
            { check: 'Timeliness', description: 'Data freshness within SLA', threshold: '<15 min lag' },
            { check: 'Accuracy', description: 'Reconciliation with source systems', threshold: '99.9% match' },
          ],
          apiEndpoints: [
            { endpoint: 'GET /api/transactions', description: 'Query transactions with filters' },
            { endpoint: 'GET /api/vendors', description: 'List vendors with risk scores' },
            { endpoint: 'GET /api/spend/summary', description: 'Aggregated spend metrics' },
            { endpoint: 'GET /api/leakage/cases', description: 'Active leakage cases' },
            { endpoint: 'POST /api/connectors/sync', description: 'Trigger manual data sync' },
          ]
        }
      }
    },
    {
      id: 'rbac',
      title: 'Access Control (RBAC)',
      icon: Shield,
      color: '#ef4444',
      description: 'Role-based access control and security governance',
      content: {
        summary: 'Comprehensive Role-Based Access Control (RBAC) system ensuring secure, compliant access to procurement data and functionalities based on organizational roles and responsibilities.',
        highlights: [
          'Hierarchical role structure aligned with procurement organization',
          'Granular permissions at module, feature, and data levels',
          'Category and region-based data segregation',
          'Approval workflow integration',
          'Complete audit trail of all access and actions',
          'SSO integration with enterprise identity providers',
        ],
        roles: [
          {
            name: 'Platform Administrator',
            level: 'System',
            color: '#ef4444',
            description: 'Full system access for IT and security teams',
            users: '2-3 users',
            permissions: ['System configuration', 'User management', 'Connector setup', 'Audit log access', 'Security settings']
          },
          {
            name: 'Procurement Head',
            level: 'Executive',
            color: '#8b5cf6',
            description: 'Strategic oversight across all categories and regions',
            users: '3-5 users',
            permissions: ['All dashboards', 'All analytics', 'Approve high-value contracts', 'View all leakages', 'Budget management']
          },
          {
            name: 'Category Manager',
            level: 'Management',
            color: '#2874f0',
            description: 'Full access within assigned spend categories',
            users: '10-15 users',
            permissions: ['Category dashboard', 'Vendor management', 'Contract negotiation', 'Leakage investigation', 'Report generation']
          },
          {
            name: 'Regional Procurement Lead',
            level: 'Management',
            color: '#388e3c',
            description: 'Regional oversight with geographic data filtering',
            users: '5-8 users',
            permissions: ['Regional dashboard', 'Regional vendors', 'Local contracts', 'Regional compliance']
          },
          {
            name: 'Procurement Analyst',
            level: 'Operational',
            color: '#ff9f00',
            description: 'Day-to-day transaction processing and analysis',
            users: '20-30 users',
            permissions: ['Transaction view', 'Basic analytics', 'Report viewing', 'Invoice processing', 'Vendor queries']
          },
          {
            name: 'Finance Auditor',
            level: 'Compliance',
            color: '#00bcd4',
            description: 'Read-only access for audit and compliance reviews',
            users: '5-10 users',
            permissions: ['All transaction view', 'Leakage cases (read)', 'Audit reports', 'Compliance dashboards', 'Export data']
          },
          {
            name: 'Vendor Portal User',
            level: 'External',
            color: '#6b7280',
            description: 'Limited self-service access for vendors',
            users: '100+ users',
            permissions: ['Own profile', 'Own invoices', 'Own POs', 'Submit documents', 'Track payments']
          }
        ],
        permissionMatrix: [
          {
            module: 'Executive Dashboard',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'Full',
              'Category Manager': 'Category Only',
              'Regional Lead': 'Region Only',
              'Analyst': 'View Only',
              'Auditor': 'View Only',
              'Vendor': 'None'
            }
          },
          {
            module: 'Spend Analytics',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'Full',
              'Category Manager': 'Category Only',
              'Regional Lead': 'Region Only',
              'Analyst': 'View Only',
              'Auditor': 'Full (Read)',
              'Vendor': 'None'
            }
          },
          {
            module: 'Leakage Detection',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'Full',
              'Category Manager': 'Investigate',
              'Regional Lead': 'View Region',
              'Analyst': 'View Assigned',
              'Auditor': 'Full (Read)',
              'Vendor': 'None'
            }
          },
          {
            module: 'Vendor Management',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'Full',
              'Category Manager': 'CRUD Category',
              'Regional Lead': 'CRUD Region',
              'Analyst': 'View/Edit',
              'Auditor': 'View Only',
              'Vendor': 'Own Profile'
            }
          },
          {
            module: 'Contract Management',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'Approve All',
              'Category Manager': 'Create/Edit',
              'Regional Lead': 'View Region',
              'Analyst': 'View Only',
              'Auditor': 'View Only',
              'Vendor': 'Own Contracts'
            }
          },
          {
            module: 'AI Agent',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'Full',
              'Category Manager': 'Full',
              'Regional Lead': 'Limited',
              'Analyst': 'Basic Queries',
              'Auditor': 'Read Queries',
              'Vendor': 'None'
            }
          },
          {
            module: 'System Settings',
            permissions: {
              'Platform Admin': 'Full',
              'Procurement Head': 'View Only',
              'Category Manager': 'None',
              'Regional Lead': 'None',
              'Analyst': 'None',
              'Auditor': 'Audit Logs',
              'Vendor': 'None'
            }
          }
        ],
        dataSegregation: [
          {
            type: 'Category-Based',
            description: 'Users see only data for their assigned spend categories',
            implementation: 'Category IDs linked to user profile; all queries filtered by category_id',
            example: 'Technology Category Manager sees only IT Software, IT Hardware, and Cloud Services spend'
          },
          {
            type: 'Region-Based',
            description: 'Geographic filtering of vendors and transactions',
            implementation: 'Region codes (North, South, East, West) mapped to user; location-based query filters',
            example: 'South Region Lead sees vendors and transactions only from Karnataka, Tamil Nadu, Kerala, AP, Telangana'
          },
          {
            type: 'Amount Threshold',
            description: 'Transaction visibility based on value thresholds',
            implementation: 'Role-based amount limits; transactions above threshold require manager approval to view',
            example: 'Analysts can view transactions up to ₹50L; above requires Category Manager access'
          },
          {
            type: 'Vendor Scope',
            description: 'Vendor portal users see only their own data',
            implementation: 'Vendor ID hard-filtered from authentication token; no cross-vendor visibility',
            example: 'Delhivery can only see their own POs, invoices, and payment status'
          }
        ],
        approvalWorkflows: [
          {
            name: 'Contract Approval',
            thresholds: [
              { range: '< ₹10 Lakhs', approver: 'Category Manager', sla: '2 business days' },
              { range: '₹10L - ₹1 Cr', approver: 'Procurement Head', sla: '3 business days' },
              { range: '₹1 Cr - ₹10 Cr', approver: 'CFO', sla: '5 business days' },
              { range: '> ₹10 Cr', approver: 'Board Committee', sla: '10 business days' }
            ]
          },
          {
            name: 'Vendor Onboarding',
            thresholds: [
              { range: 'Standard Vendor', approver: 'Category Manager', sla: '3 business days' },
              { range: 'Strategic Vendor', approver: 'Procurement Head', sla: '5 business days' },
              { range: 'High-Risk Geography', approver: 'Compliance + Procurement Head', sla: '7 business days' }
            ]
          },
          {
            name: 'Leakage Case Closure',
            thresholds: [
              { range: '< ₹1 Lakh', approver: 'Category Manager', sla: '2 business days' },
              { range: '₹1L - ₹10L', approver: 'Procurement Head', sla: '3 business days' },
              { range: '> ₹10 Lakhs', approver: 'CFO + Legal', sla: '5 business days' }
            ]
          }
        ],
        auditLogging: {
          description: 'Comprehensive audit trail for compliance and security monitoring',
          capturedEvents: [
            { event: 'User Login/Logout', details: 'Timestamp, IP address, device info, success/failure' },
            { event: 'Data Access', details: 'What data was viewed, filters applied, export actions' },
            { event: 'Data Modification', details: 'Before/after values, user, timestamp, approval chain' },
            { event: 'Report Generation', details: 'Report type, parameters, recipient list' },
            { event: 'Permission Changes', details: 'Role assignments, permission grants/revokes' },
            { event: 'Failed Access Attempts', details: 'Unauthorized access attempts, blocked actions' }
          ],
          retention: '7 years for financial data (as per regulatory requirements)',
          access: 'Audit logs accessible only to Platform Administrators and Finance Auditors'
        },
        securityFeatures: [
          {
            feature: 'SSO Integration',
            description: 'Single Sign-On with enterprise identity providers',
            implementation: 'SAML 2.0 / OAuth 2.0 with Okta, Azure AD, Google Workspace',
            benefit: 'Centralized authentication, automatic deprovisioning'
          },
          {
            feature: 'Multi-Factor Authentication',
            description: 'Additional verification for sensitive operations',
            implementation: 'TOTP (Google Authenticator), SMS OTP, or hardware tokens',
            benefit: 'Required for contract approvals, data exports, settings changes'
          },
          {
            feature: 'Session Management',
            description: 'Controlled session duration and concurrent logins',
            implementation: '8-hour session timeout, single active session per user',
            benefit: 'Reduces risk of unauthorized access from unattended sessions'
          },
          {
            feature: 'IP Whitelisting',
            description: 'Restrict access to approved network ranges',
            implementation: 'Configurable IP allowlist for admin functions',
            benefit: 'Corporate network access enforcement'
          },
          {
            feature: 'Data Encryption',
            description: 'End-to-end encryption for sensitive data',
            implementation: 'TLS 1.3 in transit, AES-256 at rest, field-level encryption for PII',
            benefit: 'Compliance with data protection regulations'
          }
        ],
        complianceMapping: [
          { regulation: 'SOX (Sarbanes-Oxley)', requirement: 'Segregation of duties', implementation: 'Separate roles for requisition, approval, payment' },
          { regulation: 'GDPR', requirement: 'Data access controls', implementation: 'Role-based PII access, audit logging, right to erasure support' },
          { regulation: 'ISO 27001', requirement: 'Access management', implementation: 'Documented RBAC policy, regular access reviews, least privilege' },
          { regulation: 'Indian IT Act', requirement: 'Data localization', implementation: 'India-hosted data, local admin access only' },
          { regulation: 'GST Compliance', requirement: 'Invoice audit trail', implementation: 'Immutable invoice records, complete transaction history' }
        ],
        implementationRoadmap: [
          { phase: 'Phase 1', timeline: 'Month 1-2', scope: 'Core RBAC framework, 4 base roles, SSO integration' },
          { phase: 'Phase 2', timeline: 'Month 3-4', scope: 'Category/Region segregation, approval workflows' },
          { phase: 'Phase 3', timeline: 'Month 5-6', scope: 'Vendor portal, external user management' },
          { phase: 'Phase 4', timeline: 'Month 7-8', scope: 'Advanced audit logging, compliance reports' },
          { phase: 'Phase 5', timeline: 'Ongoing', scope: 'Quarterly access reviews, continuous refinement' }
        ]
      }
    }
  ];

  const activeFeature = features.find(f => f.id === activeSection) || features[0];

  return (
    <div className="p-5 bg-[#f1f3f6] min-h-full">
      {/* Header */}
      <div className="mb-6 rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
        <div className="h-1 bg-gradient-to-r from-[#ffe500] via-[#ff9f00] to-[#ff6161]"></div>
        <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5dc8] p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-sm flex items-center justify-center">
              <BookOpen size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-medium">Platform Documentation</h1>
              <p className="text-blue-200 text-sm mt-1">
                Comprehensive guide to Flipkart Procurement AI features and capabilities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-sm overflow-hidden sticky top-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            <div className="p-3 border-b border-[#e0e0e0] bg-[#f1f3f6]">
              <h3 className="text-xs font-medium text-[#878787] uppercase tracking-wider">Features</h3>
            </div>
            <nav className="p-2">
              {features.map(feature => (
                <button
                  key={feature.id}
                  onClick={() => setActiveSection(feature.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all mb-1 ${
                    activeSection === feature.id
                      ? 'bg-[#e8f0fe] text-[#2874f0]'
                      : 'text-[#212121] hover:bg-[#f1f3f6]'
                  }`}
                >
                  <feature.icon
                    size={16}
                    style={{ color: activeSection === feature.id ? feature.color : '#878787' }}
                  />
                  <span className={`text-sm ${activeSection === feature.id ? 'font-medium' : ''}`}>
                    {feature.title}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
            {/* Feature Header */}
            <div className="p-6 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: activeFeature.color }}
                >
                  <activeFeature.icon size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-[#212121]">{activeFeature.title}</h2>
                  <p className="text-sm text-[#878787] mt-0.5">{activeFeature.description}</p>
                </div>
              </div>
            </div>

            {/* Feature Content */}
            <div className="p-6">
              {/* Summary */}
              <div className="mb-6">
                <p className="text-[#212121] leading-relaxed">{activeFeature.content.summary}</p>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                  <Zap size={16} style={{ color: activeFeature.color }} />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {activeFeature.content.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-[#388e3c] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#212121]">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics (if exists) */}
              {activeFeature.content.metrics && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Activity size={16} style={{ color: activeFeature.color }} />
                    Platform Metrics
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {activeFeature.content.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-[#f1f3f6] rounded-sm p-4 text-center">
                        <div className="text-2xl font-medium" style={{ color: activeFeature.color }}>
                          {metric.value}
                        </div>
                        <div className="text-xs text-[#878787] mt-1">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub Features (if exists) */}
              {activeFeature.content.subFeatures && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Layers size={16} style={{ color: activeFeature.color }} />
                    Components
                  </h3>
                  <div className="space-y-3">
                    {activeFeature.content.subFeatures.map((subFeature, idx) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                        <h4 className="font-medium text-[#212121] text-sm">{subFeature.name}</h4>
                        <p className="text-xs text-[#878787] mt-1">{subFeature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capabilities (if exists - for Agent) */}
              {activeFeature.content.capabilities && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Shield size={16} style={{ color: activeFeature.color }} />
                    Capabilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeFeature.content.capabilities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#e8f0fe] text-[#2874f0] text-xs rounded-full"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Queries (if exists - for Agent) */}
              {activeFeature.content.exampleQueries && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Send size={16} style={{ color: activeFeature.color }} />
                    Example Queries
                  </h3>
                  <div className="bg-[#1a1a2e] rounded-sm p-4 font-mono">
                    {activeFeature.content.exampleQueries.map((query, idx) => (
                      <div key={idx} className="text-sm text-[#a5f3fc] py-1">
                        <span className="text-[#878787]">→</span> {query}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Sources (if exists - for Intelligence) */}
              {activeFeature.content.dataSources && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Globe size={16} style={{ color: activeFeature.color }} />
                    Data Sources
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {activeFeature.content.dataSources.map((source, idx) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                        <h4 className="font-medium text-[#212121] text-sm">{source.name}</h4>
                        <p className="text-xs text-[#878787] mt-1">{source.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leakage Types (if exists - for Leakage) */}
              {activeFeature.content.leakageTypes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} style={{ color: activeFeature.color }} />
                    Leakage Categories
                  </h3>
                  <div className="space-y-3">
                    {activeFeature.content.leakageTypes.map((type, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-[#e0e0e0] rounded-sm p-4">
                        <div>
                          <h4 className="font-medium text-[#212121] text-sm">{type.name}</h4>
                          <p className="text-xs text-[#878787] mt-0.5">{type.description}</p>
                        </div>
                        <span className="text-sm font-medium" style={{ color: activeFeature.color }}>
                          {type.typical}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connectors (if exists - for Data) */}
              {activeFeature.content.connectors && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Database size={16} style={{ color: activeFeature.color }} />
                    System Connectors
                  </h3>
                  <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f1f3f6]">
                          <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">System</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Status</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-[#878787] uppercase">Records</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0e0e0]">
                        {activeFeature.content.connectors.map((connector, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-sm font-medium text-[#212121]">{connector.name}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                connector.status === 'Connected'
                                  ? 'bg-[#e8f5e9] text-[#388e3c]'
                                  : 'bg-[#fff3e0] text-[#ff9f00]'
                              }`}>
                                {connector.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#212121] text-right">{connector.records}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Use Cases (if exists - simple list for non-intelligence sections) */}
              {activeFeature.content.useCases && !(activeFeature.content as any).detailedUseCases && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Target size={16} style={{ color: activeFeature.color }} />
                    Use Cases
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(activeFeature.content.useCases as string[]).map((useCase: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#f1f3f6] rounded-sm px-3 py-2">
                        <ChevronRight size={14} style={{ color: activeFeature.color }} />
                        <span className="text-sm text-[#212121]">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Use Cases (for External Intelligence) */}
              {activeFeature.content.detailedUseCases && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <Target size={16} style={{ color: activeFeature.color }} />
                    Detailed Use Cases
                  </h3>
                  <div className="space-y-4">
                    {activeFeature.content.detailedUseCases.map((useCase: any, idx: number) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                        {/* Use Case Header */}
                        <div className="bg-[#f1f3f6] p-4 border-b border-[#e0e0e0]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: activeFeature.color }}>
                              <span className="text-white font-bold text-sm">{idx + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-[#212121]">{useCase.name}</h4>
                              <p className="text-xs text-[#878787] mt-0.5">{useCase.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Use Case Content */}
                        <div className="p-4 space-y-4">
                          {/* Workflow */}
                          <div>
                            <h5 className="text-xs font-medium text-[#878787] uppercase mb-2">Workflow Steps</h5>
                            <div className="space-y-2">
                              {useCase.workflow.map((step: string, sidx: number) => (
                                <div key={sidx} className="flex items-start gap-2">
                                  <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: activeFeature.color }}>
                                    {sidx + 1}
                                  </span>
                                  <span className="text-sm text-[#212121]">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Data Used */}
                          <div>
                            <h5 className="text-xs font-medium text-[#878787] uppercase mb-2">Data Points Used</h5>
                            <div className="flex flex-wrap gap-2">
                              {useCase.dataUsed.map((data: string, didx: number) => (
                                <span key={didx} className="text-xs px-2 py-1 bg-[#e8f0fe] text-[#2874f0] rounded">
                                  {data}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Business Value */}
                          <div className="bg-[#e8f5e9] rounded-sm p-3">
                            <h5 className="text-xs font-medium text-[#388e3c] uppercase mb-1">Business Value</h5>
                            <p className="text-sm text-[#212121]">{useCase.businessValue}</p>
                          </div>

                          {/* Example */}
                          <div className="bg-[#fff8e1] rounded-sm p-3">
                            <h5 className="text-xs font-medium text-[#ff9f00] uppercase mb-1">Real-World Example</h5>
                            <p className="text-sm text-[#212121] italic">{useCase.example}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recovery Process (if exists - for Leakage) */}
              {activeFeature.content.recoveryProcess && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <RefreshCw size={16} style={{ color: activeFeature.color }} />
                    Recovery Workflow
                  </h3>
                  <div className="flex items-center gap-2">
                    {activeFeature.content.recoveryProcess.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex items-center gap-2 bg-[#f1f3f6] rounded-sm px-3 py-2">
                          <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ backgroundColor: activeFeature.color }}>
                            {idx + 1}
                          </span>
                          <span className="text-xs text-[#212121]">{step}</span>
                        </div>
                        {idx < (activeFeature.content.recoveryProcess?.length || 0) - 1 && (
                          <ChevronRight size={16} className="text-[#878787]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Lake Items (if exists) */}
              {activeFeature.content.dataLake && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-3 flex items-center gap-2">
                    <Layers size={16} style={{ color: activeFeature.color }} />
                    Data Lake Contents
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeFeature.content.dataLake.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 border border-[#e0e0e0] text-[#212121] text-xs rounded-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Integrations Section */}
              {activeFeature.content.dataIntegrations && (
                <div className="mt-6 pt-6 border-t border-[#e0e0e0]">
                  <h3 className="text-lg font-medium text-[#212121] mb-2 flex items-center gap-2">
                    <Database size={20} style={{ color: activeFeature.color }} />
                    {activeFeature.content.dataIntegrations.title}
                  </h3>
                  <p className="text-sm text-[#878787] mb-6">{activeFeature.content.dataIntegrations.description}</p>

                  {/* Architecture Layers */}
                  {activeFeature.content.dataIntegrations.architecture && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Architecture Layers</h4>
                      <div className="space-y-2">
                        {activeFeature.content.dataIntegrations.architecture.map((layer: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#f1f3f6] rounded-sm p-3">
                            <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0" style={{ backgroundColor: activeFeature.color }}>
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <span className="font-medium text-sm text-[#212121]">{layer.layer}</span>
                              <span className="text-[#878787] text-sm ml-2">— {layer.systems}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Refresh Rates */}
                  {activeFeature.content.dataIntegrations.refreshRates && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Data Refresh Rates</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {activeFeature.content.dataIntegrations.refreshRates.map((rate: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-3 flex justify-between">
                            <span className="text-sm text-[#212121]">{rate.data}</span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${activeFeature.color}20`, color: activeFeature.color }}>
                              {rate.frequency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APIs */}
                  {activeFeature.content.dataIntegrations.apis && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">API Endpoints / External APIs</h4>
                      <div className="space-y-3">
                        {activeFeature.content.dataIntegrations.apis.map((api: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                              <code className="text-xs bg-[#1a1a2e] text-[#a5f3fc] px-2 py-1 rounded">{api.endpoint || api.name}</code>
                              {api.refresh && <span className="text-xs text-[#878787]">{api.refresh}</span>}
                              {api.rateLimit && <span className="text-xs text-[#878787]">{api.rateLimit}</span>}
                            </div>
                            <p className="text-sm text-[#212121]">{api.description}</p>
                            {api.auth && <p className="text-xs text-[#878787] mt-1"><strong>Auth:</strong> {api.auth}</p>}
                            {api.dataReturned && <p className="text-xs text-[#878787] mt-1"><strong>Returns:</strong> {api.dataReturned}</p>}
                            {api.usage && <p className="text-xs text-[#878787] mt-1"><strong>Usage:</strong> {api.usage}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Flow */}
                  {activeFeature.content.dataIntegrations.dataFlow && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Data Flow</h4>
                      <div className="bg-[#f1f3f6] rounded-sm p-4">
                        {activeFeature.content.dataIntegrations.dataFlow.map((flow: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                            <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: activeFeature.color }}>
                              {flow.step}
                            </span>
                            <span className="text-sm text-[#212121]">{flow.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Event Sources */}
                  {activeFeature.content.dataIntegrations.eventSources && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Event Sources</h4>
                      <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#f1f3f6]">
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">System</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Events Captured</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e0e0e0]">
                            {activeFeature.content.dataIntegrations.eventSources.map((source: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm font-medium text-[#212121]">{source.system}</td>
                                <td className="px-4 py-3 text-xs text-[#878787]">{source.events}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Processing Steps */}
                  {activeFeature.content.dataIntegrations.processingSteps && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Processing Pipeline</h4>
                      <div className="space-y-2">
                        {activeFeature.content.dataIntegrations.processingSteps.map((step: any, idx: number) => (
                          <div key={idx} className="border-l-4 pl-4 py-2" style={{ borderColor: activeFeature.color }}>
                            <span className="font-medium text-sm text-[#212121]">{step.step}</span>
                            <p className="text-xs text-[#878787] mt-0.5">{step.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Components */}
                  {activeFeature.content.dataIntegrations.components && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Architecture Components</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {activeFeature.content.dataIntegrations.components.map((comp: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${activeFeature.color}20` }}>
                              <span className="text-xs font-bold" style={{ color: activeFeature.color }}>{idx + 1}</span>
                            </div>
                            <div>
                              <span className="font-medium text-sm text-[#212121]">{comp.name}</span>
                              <p className="text-xs text-[#878787]">{comp.technology}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supported Intents */}
                  {activeFeature.content.dataIntegrations.supportedIntents && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Supported Query Intents</h4>
                      <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#f1f3f6]">
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Intent</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Extracted Entities</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e0e0e0]">
                            {activeFeature.content.dataIntegrations.supportedIntents.map((intent: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm font-mono" style={{ color: activeFeature.color }}>{intent.intent}</td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {intent.entities.map((entity: string, eidx: number) => (
                                      <span key={eidx} className="text-xs px-2 py-0.5 bg-[#f1f3f6] rounded">{entity}</span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Data Sources for Analytics */}
                  {activeFeature.content.dataIntegrations.dataSources && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Data Sources</h4>
                      <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#f1f3f6]">
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Source</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Records</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Granularity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e0e0e0]">
                            {activeFeature.content.dataIntegrations.dataSources.map((ds: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm font-medium text-[#212121]">{ds.source}</td>
                                <td className="px-4 py-3 text-sm" style={{ color: activeFeature.color }}>{ds.records}</td>
                                <td className="px-4 py-3 text-xs text-[#878787]">{ds.granularity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Aggregations */}
                  {activeFeature.content.dataIntegrations.aggregations && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Pre-computed Aggregations</h4>
                      <div className="space-y-2">
                        {activeFeature.content.dataIntegrations.aggregations.map((agg: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm text-[#212121]">{agg.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-[#e8f0fe] text-[#2874f0] rounded">{agg.caching}</span>
                            </div>
                            <code className="text-xs text-[#878787] font-mono">{agg.query}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visualizations */}
                  {activeFeature.content.dataIntegrations.visualizations && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Visualization Components</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {activeFeature.content.dataIntegrations.visualizations.map((viz: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-[#212121]">{viz.chart}</span>
                              <span className="text-xs px-2 py-0.5 bg-[#f1f3f6] rounded">{viz.library}</span>
                            </div>
                            <code className="text-xs text-[#878787]">{viz.dataFormat}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enrichment Flow */}
                  {activeFeature.content.dataIntegrations.enrichmentFlow && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Data Enrichment Flow</h4>
                      <div className="bg-[#f1f3f6] rounded-sm p-4">
                        {activeFeature.content.dataIntegrations.enrichmentFlow.map((flow: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                            <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: activeFeature.color }}>
                              {flow.step}
                            </span>
                            <span className="text-sm text-[#212121]">{flow.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Configuration */}
                  {activeFeature.content.dataIntegrations.configuration && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Configuration</h4>
                      <div className="bg-[#1a1a2e] rounded-sm p-4 font-mono">
                        {activeFeature.content.dataIntegrations.configuration.map((config: any, idx: number) => (
                          <div key={idx} className="mb-2 last:mb-0">
                            <span className="text-[#a5f3fc]">{config.key}</span>
                            <span className="text-[#878787]"> = </span>
                            <span className="text-[#fcd34d]">"..."</span>
                            <span className="text-[#6b7280] text-xs ml-4"># {config.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detection Models */}
                  {activeFeature.content.dataIntegrations.detectionModels && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Detection Models</h4>
                      <div className="space-y-3">
                        {activeFeature.content.dataIntegrations.detectionModels.map((model: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                            <h5 className="font-medium text-sm text-[#212121] mb-2">{model.name}</h5>
                            <div className="space-y-1 text-xs">
                              <p><span className="text-[#878787]">Algorithm:</span> <span className="text-[#212121]">{model.algorithm}</span></p>
                              <p><span className="text-[#878787]">Data Sources:</span> <span className="text-[#212121]">{model.dataSources}</span></p>
                              <p><span className="text-[#878787]">Threshold:</span> <span style={{ color: activeFeature.color }}>{model.threshold}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Case Management Fields */}
                  {activeFeature.content.dataIntegrations.caseManagement && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Case Management Schema</h4>
                      <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#f1f3f6]">
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Field</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-[#878787] uppercase">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e0e0e0]">
                            {activeFeature.content.dataIntegrations.caseManagement.map((field: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm font-mono" style={{ color: activeFeature.color }}>{field.field}</td>
                                <td className="px-4 py-3 text-xs text-[#878787]">{field.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Connector Details */}
                  {activeFeature.content.dataIntegrations.connectorDetails && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Connector Details</h4>
                      <div className="space-y-4">
                        {activeFeature.content.dataIntegrations.connectorDetails.map((conn: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                            <h5 className="font-medium text-sm text-[#212121] mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeFeature.color }}></span>
                              {conn.system}
                            </h5>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-[#878787] block mb-1">Protocol</span>
                                <span className="text-[#212121]">{conn.protocol}</span>
                              </div>
                              <div>
                                <span className="text-[#878787] block mb-1">Sync Method</span>
                                <span className="text-[#212121]">{conn.syncMethod}</span>
                              </div>
                              <div>
                                <span className="text-[#878787] block mb-1">Frequency</span>
                                <span className="text-[#212121]">{conn.frequency}</span>
                              </div>
                              <div>
                                <span className="text-[#878787] block mb-1">Tables</span>
                                <span className="text-[#212121] text-[10px]">{conn.tables}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Lake Schema */}
                  {activeFeature.content.dataIntegrations.dataLakeSchema && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Data Lake Schema</h4>
                      <div className="space-y-3">
                        {activeFeature.content.dataIntegrations.dataLakeSchema.map((table: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                              <code className="text-sm font-mono" style={{ color: activeFeature.color }}>{table.table}</code>
                              <span className="text-xs px-2 py-0.5 bg-[#f1f3f6] rounded">{table.rowCount} rows</span>
                            </div>
                            <p className="text-xs text-[#878787] mb-2">{table.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {table.columns.split(', ').map((col: string, cidx: number) => (
                                <span key={cidx} className="text-[10px] px-1.5 py-0.5 bg-[#1a1a2e] text-[#a5f3fc] rounded font-mono">{col}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Quality Checks */}
                  {activeFeature.content.dataIntegrations.dataQuality && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#212121] mb-3">Data Quality Checks</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {activeFeature.content.dataIntegrations.dataQuality.map((check: any, idx: number) => (
                          <div key={idx} className="border border-[#e0e0e0] rounded-sm p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-[#212121]">{check.check}</span>
                              <span className="text-xs font-medium" style={{ color: activeFeature.color }}>{check.threshold}</span>
                            </div>
                            <p className="text-xs text-[#878787]">{check.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* API Endpoints */}
                  {activeFeature.content.dataIntegrations.apiEndpoints && (
                    <div>
                      <h4 className="text-sm font-medium text-[#212121] mb-3">REST API Endpoints</h4>
                      <div className="bg-[#1a1a2e] rounded-sm p-4 font-mono text-xs">
                        {activeFeature.content.dataIntegrations.apiEndpoints.map((ep: any, idx: number) => (
                          <div key={idx} className="mb-2 last:mb-0">
                            <span className="text-[#86efac]">{ep.endpoint.split(' ')[0]}</span>
                            <span className="text-[#a5f3fc]"> {ep.endpoint.split(' ').slice(1).join(' ')}</span>
                            <span className="text-[#6b7280] ml-4"># {ep.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RBAC Roles Section */}
              {activeFeature.content.roles && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <Users size={16} style={{ color: activeFeature.color }} />
                    User Roles
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {(activeFeature.content.roles as any[]).map((role: any, idx: number) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                        <div className="p-4 flex items-start gap-4" style={{ borderLeft: `4px solid ${role.color}` }}>
                          <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${role.color}20` }}>
                            <Shield size={20} style={{ color: role.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-[#212121]">{role.name}</h4>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
                                {role.level}
                              </span>
                            </div>
                            <p className="text-xs text-[#878787] mb-2">{role.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 3).map((perm: string, pidx: number) => (
                                  <span key={pidx} className="text-[10px] px-2 py-0.5 bg-[#f1f3f6] text-[#212121] rounded">
                                    {perm}
                                  </span>
                                ))}
                                {role.permissions.length > 3 && (
                                  <span className="text-[10px] px-2 py-0.5 bg-[#f1f3f6] text-[#878787] rounded">
                                    +{role.permissions.length - 3} more
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#878787]">{role.users}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission Matrix */}
              {activeFeature.content.permissionMatrix && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <Key size={16} style={{ color: activeFeature.color }} />
                    Permission Matrix
                  </h3>
                  <div className="overflow-x-auto border border-[#e0e0e0] rounded-sm">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#f1f3f6]">
                          <th className="px-3 py-2 text-left font-medium text-[#878787] border-b border-[#e0e0e0] sticky left-0 bg-[#f1f3f6]">Module</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Admin</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Head</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Category Mgr</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Regional</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Analyst</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Auditor</th>
                          <th className="px-3 py-2 text-center font-medium text-[#878787] border-b border-[#e0e0e0]">Vendor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeFeature.content.permissionMatrix as any[]).map((row: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                            <td className="px-3 py-2 font-medium text-[#212121] border-b border-[#e0e0e0] sticky left-0" style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                              {row.module}
                            </td>
                            {['Platform Admin', 'Procurement Head', 'Category Manager', 'Regional Lead', 'Analyst', 'Auditor', 'Vendor'].map((role, ridx) => {
                              const perm = row.permissions[role] || 'None';
                              const getPermColor = (p: string) => {
                                if (p === 'Full') return '#388e3c';
                                if (p === 'None') return '#9e9e9e';
                                if (p.includes('Read') || p.includes('View')) return '#2874f0';
                                return '#ff9f00';
                              };
                              return (
                                <td key={ridx} className="px-3 py-2 text-center border-b border-[#e0e0e0]">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${getPermColor(perm)}15`, color: getPermColor(perm) }}>
                                    {perm}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Data Segregation */}
              {activeFeature.content.dataSegregation && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <Layers size={16} style={{ color: activeFeature.color }} />
                    Data Segregation Rules
                  </h3>
                  <div className="space-y-3">
                    {(activeFeature.content.dataSegregation as any[]).map((seg: any, idx: number) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                        <h4 className="font-medium text-[#212121] text-sm mb-2">{seg.type}</h4>
                        <p className="text-xs text-[#878787] mb-3">{seg.description}</p>
                        <div className="bg-[#f1f3f6] rounded-sm p-3 mb-2">
                          <span className="text-xs font-medium text-[#878787]">Implementation: </span>
                          <span className="text-xs text-[#212121]">{seg.implementation}</span>
                        </div>
                        <div className="bg-[#fff8e1] rounded-sm p-3">
                          <span className="text-xs font-medium text-[#ff9f00]">Example: </span>
                          <span className="text-xs text-[#212121] italic">{seg.example}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Workflows */}
              {activeFeature.content.approvalWorkflows && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: activeFeature.color }} />
                    Approval Workflows
                  </h3>
                  <div className="space-y-4">
                    {(activeFeature.content.approvalWorkflows as any[]).map((workflow: any, idx: number) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm overflow-hidden">
                        <div className="bg-[#f1f3f6] px-4 py-2 border-b border-[#e0e0e0]">
                          <h4 className="font-medium text-[#212121] text-sm">{workflow.name}</h4>
                        </div>
                        <div className="p-4">
                          <table className="w-full text-xs">
                            <thead>
                              <tr>
                                <th className="text-left pb-2 text-[#878787] font-medium">Threshold</th>
                                <th className="text-left pb-2 text-[#878787] font-medium">Approver</th>
                                <th className="text-right pb-2 text-[#878787] font-medium">SLA</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workflow.thresholds.map((t: any, tidx: number) => (
                                <tr key={tidx} className="border-t border-[#e0e0e0]">
                                  <td className="py-2 text-[#212121]">{t.range}</td>
                                  <td className="py-2" style={{ color: activeFeature.color }}>{t.approver}</td>
                                  <td className="py-2 text-right text-[#878787]">{t.sla}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Logging */}
              {activeFeature.content.auditLogging && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <FileText size={16} style={{ color: activeFeature.color }} />
                    Audit Logging
                  </h3>
                  <div className="border border-[#e0e0e0] rounded-sm p-4">
                    <p className="text-sm text-[#212121] mb-4">{(activeFeature.content.auditLogging as any).description}</p>
                    <h4 className="text-xs font-medium text-[#878787] uppercase mb-2">Captured Events</h4>
                    <div className="space-y-2 mb-4">
                      {(activeFeature.content.auditLogging as any).capturedEvents.map((event: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 bg-[#f1f3f6] rounded-sm p-2">
                          <span className="text-xs font-medium text-[#212121] min-w-[140px]">{event.event}</span>
                          <span className="text-xs text-[#878787]">{event.details}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#e8f5e9] rounded-sm p-3">
                        <span className="text-xs font-medium text-[#388e3c] block mb-1">Retention Period</span>
                        <span className="text-xs text-[#212121]">{(activeFeature.content.auditLogging as any).retention}</span>
                      </div>
                      <div className="bg-[#e8f0fe] rounded-sm p-3">
                        <span className="text-xs font-medium text-[#2874f0] block mb-1">Access Control</span>
                        <span className="text-xs text-[#212121]">{(activeFeature.content.auditLogging as any).access}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Features */}
              {activeFeature.content.securityFeatures && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <Shield size={16} style={{ color: activeFeature.color }} />
                    Security Features
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {(activeFeature.content.securityFeatures as any[]).map((feature: any, idx: number) => (
                      <div key={idx} className="border border-[#e0e0e0] rounded-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-[#212121] text-sm">{feature.feature}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${activeFeature.color}20`, color: activeFeature.color }}>
                            Security
                          </span>
                        </div>
                        <p className="text-xs text-[#878787] mb-2">{feature.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#f1f3f6] rounded-sm p-2">
                            <span className="text-[#878787] block mb-0.5">Implementation</span>
                            <span className="text-[#212121]">{feature.implementation}</span>
                          </div>
                          <div className="bg-[#e8f5e9] rounded-sm p-2">
                            <span className="text-[#878787] block mb-0.5">Benefit</span>
                            <span className="text-[#212121]">{feature.benefit}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance Mapping */}
              {activeFeature.content.complianceMapping && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <FileCheck size={16} style={{ color: activeFeature.color }} />
                    Compliance Mapping
                  </h3>
                  <div className="overflow-hidden border border-[#e0e0e0] rounded-sm">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#f1f3f6]">
                          <th className="px-4 py-2 text-left font-medium text-[#878787]">Regulation</th>
                          <th className="px-4 py-2 text-left font-medium text-[#878787]">Requirement</th>
                          <th className="px-4 py-2 text-left font-medium text-[#878787]">Implementation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0e0e0]">
                        {(activeFeature.content.complianceMapping as any[]).map((comp: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium" style={{ color: activeFeature.color }}>{comp.regulation}</td>
                            <td className="px-4 py-3 text-[#212121]">{comp.requirement}</td>
                            <td className="px-4 py-3 text-[#878787]">{comp.implementation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Implementation Roadmap */}
              {activeFeature.content.implementationRoadmap && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#212121] mb-4 flex items-center gap-2">
                    <Activity size={16} style={{ color: activeFeature.color }} />
                    Implementation Roadmap
                  </h3>
                  <div className="relative">
                    {(activeFeature.content.implementationRoadmap as any[]).map((phase: any, idx: number) => (
                      <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: activeFeature.color }}>
                            {idx + 1}
                          </div>
                          {idx < (activeFeature.content.implementationRoadmap as any[]).length - 1 && (
                            <div className="w-0.5 flex-1 my-2" style={{ backgroundColor: `${activeFeature.color}30` }}></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[#212121] text-sm">{phase.phase}</span>
                            <span className="text-xs px-2 py-0.5 bg-[#f1f3f6] rounded text-[#878787]">{phase.timeline}</span>
                          </div>
                          <p className="text-xs text-[#878787]">{phase.scope}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Version Info */}
          <div className="mt-4 text-center text-xs text-[#878787]">
            Flipkart Procurement AI Platform v2.0 • Last updated: January 2025
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
