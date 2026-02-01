import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Filter, ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineStep {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  source: string;
  owner: string;
  status: 'completed' | 'in_progress' | 'planned';
  children?: TimelineStep[];
}

interface GanttTimelineProps {
  transactionId?: string;
  vendorName?: string;
  totalValue?: number;
  onClose?: () => void;
}

const mockTimelineData: TimelineStep[] = [
  {
    id: 'request',
    name: 'Request Intake',
    startDate: '2024-01-05',
    endDate: '2024-01-19',
    source: 'SAP Ariba',
    owner: '',
    status: 'completed',
    children: [
      { id: 'submit', name: 'Submit procurement request', startDate: '2024-01-05', endDate: '2024-01-09', source: '', owner: 'A. Requestor', status: 'completed' },
      { id: 'initial-review', name: 'Initial review & validation', startDate: '2024-01-10', endDate: '2024-01-12', source: '', owner: 'A. Procurement Tea...', status: 'completed' },
      { id: 'budget', name: 'Budget verification', startDate: '2024-01-15', endDate: '2024-01-16', source: '', owner: 'A. Finance', status: 'completed' },
      { id: 'manager', name: 'Manager approval', startDate: '2024-01-17', endDate: '2024-01-19', source: '', owner: 'A. Department Man...', status: 'completed' },
    ]
  },
  {
    id: 'sourcing',
    name: 'Sourcing',
    startDate: '2024-01-22',
    endDate: '2024-02-16',
    source: 'SAP Ariba',
    owner: '',
    status: 'completed',
    children: [
      { id: 'define-sourcing', name: 'Define sourcing strategy', startDate: '2024-01-22', endDate: '2024-01-24', source: '', owner: 'A. Category Manag...', status: 'completed' },
      { id: 'create-rfq', name: 'Create RFP/RFQ', startDate: '2024-01-25', endDate: '2024-01-31', source: '', owner: 'A. Procurement Lead', status: 'completed' },
      { id: 'vendor-outreach', name: 'Vendor outreach', startDate: '2024-02-01', endDate: '2024-02-05', source: '', owner: 'A. Procurement Tea...', status: 'completed' },
      { id: 'bid-evaluation', name: 'Bid evaluation', startDate: '2024-02-07', endDate: '2024-02-14', source: '', owner: 'A. Evaluation Com...', status: 'completed' },
      { id: 'award', name: 'Award decision', startDate: '2024-02-15', endDate: '2024-02-16', source: '', owner: 'A. Procurement Lead', status: 'completed' },
    ]
  },
  {
    id: 'contracting',
    name: 'Contracting',
    startDate: '2024-02-19',
    endDate: '2024-03-15',
    source: 'Simplicontract',
    owner: '',
    status: 'completed',
    children: [
      { id: 'draft', name: 'Draft contract terms', startDate: '2024-02-19', endDate: '2024-02-23', source: '', owner: 'A. Legal', status: 'completed' },
      { id: 'internal-legal', name: 'Internal legal review', startDate: '2024-02-26', endDate: '2024-03-01', source: '', owner: 'A. Legal', status: 'completed' },
      { id: 'vendor-negotiation', name: 'Vendor negotiation', startDate: '2024-03-04', endDate: '2024-03-08', source: '', owner: 'A. Procurement Lead', status: 'completed' },
      { id: 'final-approval', name: 'Final approval & signature', startDate: '2024-03-11', endDate: '2024-03-13', source: '', owner: 'A. Executive Sponsor', status: 'completed' },
    ]
  },
  {
    id: 'vendor-onboarding',
    name: 'Vendor Onboarding',
    startDate: '2024-03-14',
    endDate: '2024-03-29',
    source: 'Vendor Portal',
    owner: '',
    status: 'in_progress',
    children: [
      { id: 'send-onboard', name: 'Send onboarding invite', startDate: '2024-03-14', endDate: '2024-03-19', source: '', owner: 'A. Procurement Tea...', status: 'completed' },
      { id: 'vendor-registration', name: 'Vendor registration', startDate: '2024-03-20', endDate: '2024-03-25', source: '', owner: 'A. Vendor', status: 'completed' },
      { id: 'compliance-verification', name: 'Compliance verification', startDate: '2024-03-26', endDate: '2024-03-29', source: '', owner: 'A. Compliance Team', status: 'in_progress' },
      { id: 'system-setup', name: 'System setup & integration', startDate: '2024-04-01', endDate: '2024-04-05', source: '', owner: 'A. IT Team', status: 'planned' },
    ]
  },
  {
    id: 'prpo',
    name: 'PR/PO Creation',
    startDate: '2024-04-08',
    endDate: '2024-04-19',
    source: 'Oracle Fusion',
    owner: '',
    status: 'planned',
    children: [
      { id: 'create-pr', name: 'Create purchase requisition', startDate: '2024-04-08', endDate: '2024-04-10', source: '', owner: 'A. Requestor', status: 'planned' },
      { id: 'pr-approval', name: 'PR approval workflow', startDate: '2024-04-11', endDate: '2024-04-15', source: '', owner: 'A. Approvers', status: 'planned' },
      { id: 'convert-po', name: 'Convert PR to PO', startDate: '2024-04-16', endDate: '2024-04-17', source: '', owner: 'A. Buyer', status: 'planned' },
      { id: 'send-po', name: 'Send PO to vendor', startDate: '2024-04-18', endDate: '2024-04-19', source: '', owner: 'A. Procurement Tea...', status: 'planned' },
    ]
  },
  {
    id: 'payment',
    name: 'Payment',
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    source: 'Oracle EBS',
    owner: '',
    status: 'planned',
    children: [
      { id: 'goods-receipt', name: 'Goods/service receipt', startDate: '2024-05-01', endDate: '2024-05-10', source: '', owner: 'A. Requestor', status: 'planned' },
      { id: 'invoice-receipt', name: 'Invoice receipt & matching', startDate: '2024-05-13', endDate: '2024-05-17', source: '', owner: 'A. AP Team', status: 'planned' },
      { id: 'payment-approval', name: 'Payment approval', startDate: '2024-05-20', endDate: '2024-05-24', source: '', owner: 'A. Finance Manager', status: 'planned' },
      { id: 'payment-execution', name: 'Payment execution', startDate: '2024-05-27', endDate: '2024-05-31', source: '', owner: 'A. Treasury', status: 'planned' },
    ]
  },
];

// Generate months for header
const generateMonths = () => {
  const months = [];
  const startDate = new Date('2023-12-01');
  for (let i = 0; i < 8; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    months.push({
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });
  }
  return months;
};

const months = generateMonths();
const totalDays = months.reduce((acc, m) => acc + (m.end.getTime() - m.start.getTime()) / (1000 * 60 * 60 * 24) + 1, 0);
const startOfTimeline = months[0].start;

const getBarPosition = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDiff = (start.getTime() - startOfTimeline.getTime()) / (1000 * 60 * 60 * 24);
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

  const left = (startDiff / totalDays) * 100;
  const width = (duration / totalDays) * 100;

  return { left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - left)}%` };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-500';
    case 'in_progress': return 'bg-violet-500';
    case 'planned': return 'bg-gray-300';
    default: return 'bg-gray-300';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-50';
    case 'in_progress': return 'bg-violet-50';
    case 'planned': return 'bg-gray-50';
    default: return 'bg-gray-50';
  }
};

const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

export default function GanttTimeline({ onClose }: GanttTimelineProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['request', 'sourcing', 'contracting', 'vendor-onboarding', 'prpo', 'payment']));

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  // Calculate progress
  const allSteps = mockTimelineData.flatMap(s => s.children || []);
  const completedSteps = allSteps.filter(s => s.status === 'completed').length;
  const inProgressSteps = allSteps.filter(s => s.status === 'in_progress').length;
  const progress = Math.round((completedSteps / allSteps.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Procurement Timeline</h2>
            <p className="text-sm text-gray-500">End-to-end procurement lifecycle tracking</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              &times;
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{completedSteps}/{allSteps.length}</span>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{inProgressSteps}</span>
            <span className="text-sm text-gray-500">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{progress}%</span>
            <span className="text-sm text-gray-500">Progress</span>
          </div>
          <div className="flex-1">
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-emerald-600">{progress}% Complete</span>
        </div>
      </div>

      {/* Legend & Toolbar */}
      <div className="px-6 py-3 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-gray-700">Procurement Timeline</span>
          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-gray-600">Planned</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
            <Search size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
            <Filter size={16} />
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-500">Expand/Collapse All</span>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
            <ZoomIn size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
            <ZoomOut size={16} />
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Column Headers */}
          <div className="flex border-b bg-gray-50 sticky top-0 z-10">
            <div className="w-[280px] flex-shrink-0 px-4 py-2 text-xs font-medium text-gray-500 uppercase border-r">
              Milestone / Step
            </div>
            <div className="w-[100px] flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-500 uppercase border-r">
              Start Event
            </div>
            <div className="w-[100px] flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-500 uppercase border-r">
              End Event
            </div>
            <div className="w-[120px] flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-500 uppercase border-r">
              Source / Owner
            </div>
            <div className="flex-1 flex">
              {months.map((month, idx) => (
                <div
                  key={idx}
                  className="flex-1 px-2 py-2 text-xs font-medium text-gray-500 text-center border-r last:border-r-0"
                >
                  {month.label}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Rows */}
          <div className="divide-y">
            {mockTimelineData.map((section) => (
              <React.Fragment key={section.id}>
                {/* Section Header */}
                <div className={`flex items-center hover:bg-gray-50 ${getStatusBgColor(section.status)}`}>
                  <div className="w-[280px] flex-shrink-0 px-4 py-2.5 border-r">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-800"
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(section.status)}`}></div>
                      {section.name}
                    </button>
                  </div>
                  <div className="w-[100px] flex-shrink-0 px-3 py-2.5 text-xs text-gray-600 border-r">
                    {section.startDate.split('-').slice(1).join('/')}
                  </div>
                  <div className="w-[100px] flex-shrink-0 px-3 py-2.5 text-xs text-gray-600 border-r">
                    {section.endDate.split('-').slice(1).join('/')}
                  </div>
                  <div className="w-[120px] flex-shrink-0 px-3 py-2.5 text-xs text-gray-600 font-medium border-r">
                    {section.source}
                  </div>
                  <div className="flex-1 relative h-10">
                    <div className="absolute inset-0 flex">
                      {months.map((_, idx) => (
                        <div key={idx} className="flex-1 border-r last:border-r-0 border-gray-100"></div>
                      ))}
                    </div>
                    <div
                      className={`absolute top-2 h-6 rounded ${getStatusColor(section.status)} flex items-center justify-center`}
                      style={getBarPosition(section.startDate, section.endDate)}
                    >
                      <span className="text-xs text-white font-medium px-2 truncate">
                        {formatDateRange(section.startDate, section.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Children */}
                {expandedSections.has(section.id) && section.children?.map((child) => (
                  <div key={child.id} className="flex items-center hover:bg-gray-50">
                    <div className="w-[280px] flex-shrink-0 px-4 py-2 pl-10 border-r">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(child.status)}`}></div>
                        {child.name}
                      </div>
                    </div>
                    <div className="w-[100px] flex-shrink-0 px-3 py-2 text-xs text-gray-500 border-r">
                      {child.startDate.split('-').slice(1).join('/')}
                    </div>
                    <div className="w-[100px] flex-shrink-0 px-3 py-2 text-xs text-gray-500 border-r">
                      {child.endDate.split('-').slice(1).join('/')}
                    </div>
                    <div className="w-[120px] flex-shrink-0 px-3 py-2 text-xs text-gray-500 border-r truncate">
                      {child.owner}
                    </div>
                    <div className="flex-1 relative h-8">
                      <div className="absolute inset-0 flex">
                        {months.map((_, idx) => (
                          <div key={idx} className="flex-1 border-r last:border-r-0 border-gray-50"></div>
                        ))}
                      </div>
                      <div
                        className={`absolute top-1.5 h-5 rounded ${getStatusColor(child.status)} opacity-80`}
                        style={getBarPosition(child.startDate, child.endDate)}
                      >
                        <span className="text-[10px] text-white font-medium px-1.5 whitespace-nowrap">
                          {Math.ceil((new Date(child.endDate).getTime() - new Date(child.startDate).getTime()) / (1000 * 60 * 60 * 24))}d
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
