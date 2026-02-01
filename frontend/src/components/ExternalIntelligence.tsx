import { useState, useEffect, useCallback } from 'react';
import {
  Globe, TrendingUp, TrendingDown, AlertTriangle,
  Newspaper, BarChart3, MapPin, Building, RefreshCw, Filter,
  ChevronDown, ChevronRight, Eye, ExternalLink, AlertCircle,
  ThumbsUp, ThumbsDown, Minus, Search, Star, Wifi
} from 'lucide-react';
import IndiaMap from './IndiaMap';
import { fetchIndiaCommodityPrices, fetchExchangeRate, type CommodityPrice } from '../services/externalDataApi';

interface MarketIntelligence {
  id: string;
  category: string;
  commodity: string;
  currentPrice: number;
  priceUnit: string;
  change24h: number;
  change30d: number;
  forecast: 'bullish' | 'bearish' | 'neutral';
  forecastConfidence: number;
  lastUpdated: string;
  source: string;
  impactedCategories: string[];
}

interface SupplierFinancialHealth {
  id: string;
  vendorName: string;
  vendorId: string;
  creditRating: string;
  creditScore: number;
  financialStability: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  bankruptcyRisk: number;
  paymentHistory: number;
  revenueGrowth: number;
  debtToEquity: number;
  currentRatio: number;
  lastAssessment: string;
  source: string;
  alerts: string[];
}

interface GeopoliticalRisk {
  id: string;
  country: string;
  countryCode: string;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high' | 'severe';
  riskScore: number;
  factors: RiskFactor[];
  impactedSuppliers: number;
  impactedSpend: number;
  lastUpdated: string;
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

interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface NewsSentiment {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  relevance: number;
  entities: string[];
  category: string;
  url: string;
  summary: string;
}

interface SentimentTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

const marketIntelligence: MarketIntelligence[] = [
  {
    id: 'mi1',
    category: 'Logistics',
    commodity: 'Diesel Fuel',
    currentPrice: 89.50,
    priceUnit: '₹/L',
    change24h: 0.8,
    change30d: 5.2,
    forecast: 'bullish',
    forecastConfidence: 72,
    lastUpdated: '2024-01-30 10:30:00',
    source: 'Platts',
    impactedCategories: ['Logistics & Transportation', 'Last Mile Delivery']
  },
  {
    id: 'mi2',
    category: 'Technology',
    commodity: 'DRAM Memory',
    currentPrice: 2.85,
    priceUnit: '$/GB',
    change24h: -1.2,
    change30d: -8.5,
    forecast: 'bearish',
    forecastConfidence: 68,
    lastUpdated: '2024-01-30 09:00:00',
    source: 'DRAMeXchange',
    impactedCategories: ['IT Hardware', 'Data Center Equipment']
  },
  {
    id: 'mi3',
    category: 'Packaging',
    commodity: 'Corrugated Board',
    currentPrice: 32500,
    priceUnit: '₹/MT',
    change24h: 0.2,
    change30d: 3.8,
    forecast: 'bullish',
    forecastConfidence: 65,
    lastUpdated: '2024-01-30 08:00:00',
    source: 'RISI',
    impactedCategories: ['Packaging Supplies', 'Warehousing']
  },
  {
    id: 'mi4',
    category: 'Energy',
    commodity: 'Electricity (Industrial)',
    currentPrice: 7.25,
    priceUnit: '₹/kWh',
    change24h: 0.0,
    change30d: 2.1,
    forecast: 'neutral',
    forecastConfidence: 58,
    lastUpdated: '2024-01-30 10:00:00',
    source: 'IEX',
    impactedCategories: ['Facilities', 'Data Centers', 'Warehousing']
  },
  {
    id: 'mi5',
    category: 'Labor',
    commodity: 'IT Services Rate',
    currentPrice: 2500,
    priceUnit: '₹/hr',
    change24h: 0.0,
    change30d: 4.5,
    forecast: 'bullish',
    forecastConfidence: 75,
    lastUpdated: '2024-01-30 00:00:00',
    source: 'NASSCOM',
    impactedCategories: ['Technology Services', 'Software Development']
  },
  {
    id: 'mi6',
    category: 'Shipping',
    commodity: 'Container Freight Index',
    currentPrice: 1850,
    priceUnit: '$/FEU',
    change24h: 2.5,
    change30d: 15.8,
    forecast: 'bullish',
    forecastConfidence: 82,
    lastUpdated: '2024-01-30 06:00:00',
    source: 'Freightos',
    impactedCategories: ['International Logistics', 'Import/Export']
  }
];

const supplierFinancialHealth: SupplierFinancialHealth[] = [
  {
    id: 'sfh1',
    vendorName: 'Delhivery Logistics',
    vendorId: 'V001',
    creditRating: 'A',
    creditScore: 78,
    financialStability: 'good',
    bankruptcyRisk: 5,
    paymentHistory: 98,
    revenueGrowth: 24.5,
    debtToEquity: 0.45,
    currentRatio: 1.8,
    lastAssessment: '2024-01-15',
    source: 'D&B / CRISIL',
    alerts: []
  },
  {
    id: 'sfh2',
    vendorName: 'Ecom Express',
    vendorId: 'V002',
    creditRating: 'BBB+',
    creditScore: 72,
    financialStability: 'good',
    bankruptcyRisk: 8,
    paymentHistory: 95,
    revenueGrowth: 18.2,
    debtToEquity: 0.62,
    currentRatio: 1.5,
    lastAssessment: '2024-01-12',
    source: 'D&B / CRISIL',
    alerts: []
  },
  {
    id: 'sfh3',
    vendorName: 'TechSupply Solutions',
    vendorId: 'V015',
    creditRating: 'BB',
    creditScore: 58,
    financialStability: 'fair',
    bankruptcyRisk: 18,
    paymentHistory: 88,
    revenueGrowth: -5.2,
    debtToEquity: 1.25,
    currentRatio: 1.1,
    lastAssessment: '2024-01-20',
    source: 'D&B / CRISIL',
    alerts: ['Revenue decline for 2 quarters', 'High debt levels']
  },
  {
    id: 'sfh4',
    vendorName: 'Global Logistics India',
    vendorId: 'V008',
    creditRating: 'B',
    creditScore: 45,
    financialStability: 'poor',
    bankruptcyRisk: 32,
    paymentHistory: 78,
    revenueGrowth: -12.8,
    debtToEquity: 2.1,
    currentRatio: 0.85,
    lastAssessment: '2024-01-25',
    source: 'D&B / CRISIL',
    alerts: ['Cash flow concerns', 'Late payments reported', 'Leadership changes']
  },
  {
    id: 'sfh5',
    vendorName: 'Dell Technologies',
    vendorId: 'V003',
    creditRating: 'AA-',
    creditScore: 88,
    financialStability: 'excellent',
    bankruptcyRisk: 2,
    paymentHistory: 100,
    revenueGrowth: 8.5,
    debtToEquity: 0.35,
    currentRatio: 2.2,
    lastAssessment: '2024-01-18',
    source: 'S&P / Moody\'s',
    alerts: []
  },
  {
    id: 'sfh6',
    vendorName: 'SecureIT Solutions',
    vendorId: 'V022',
    creditRating: 'CCC',
    creditScore: 32,
    financialStability: 'critical',
    bankruptcyRisk: 58,
    paymentHistory: 65,
    revenueGrowth: -28.5,
    debtToEquity: 3.5,
    currentRatio: 0.6,
    lastAssessment: '2024-01-28',
    source: 'D&B / CRISIL',
    alerts: ['Bankruptcy risk elevated', 'Multiple payment defaults', 'Key client losses']
  }
];

const geopoliticalRisks: GeopoliticalRisk[] = [
  {
    id: 'gr1',
    country: 'China',
    countryCode: 'CN',
    riskLevel: 'elevated',
    riskScore: 62,
    factors: [
      { type: 'Trade Policy', severity: 'high', description: 'Ongoing trade tensions and tariff uncertainties' },
      { type: 'Supply Chain', severity: 'medium', description: 'Port congestion and logistics delays' },
      { type: 'Regulatory', severity: 'medium', description: 'Data localization requirements' }
    ],
    impactedSuppliers: 45,
    impactedSpend: 285000000,
    lastUpdated: '2024-01-30'
  },
  {
    id: 'gr2',
    country: 'Taiwan',
    countryCode: 'TW',
    riskLevel: 'high',
    riskScore: 75,
    factors: [
      { type: 'Geopolitical', severity: 'high', description: 'Cross-strait tensions affecting semiconductor supply' },
      { type: 'Natural Disaster', severity: 'medium', description: 'Earthquake and typhoon exposure' }
    ],
    impactedSuppliers: 12,
    impactedSpend: 125000000,
    lastUpdated: '2024-01-30'
  },
  {
    id: 'gr3',
    country: 'United States',
    countryCode: 'US',
    riskLevel: 'low',
    riskScore: 25,
    factors: [
      { type: 'Regulatory', severity: 'low', description: 'Standard compliance requirements' },
      { type: 'Currency', severity: 'medium', description: 'USD/INR volatility' }
    ],
    impactedSuppliers: 28,
    impactedSpend: 180000000,
    lastUpdated: '2024-01-30'
  },
  {
    id: 'gr4',
    country: 'Germany',
    countryCode: 'DE',
    riskLevel: 'low',
    riskScore: 22,
    factors: [
      { type: 'Economic', severity: 'low', description: 'Stable business environment' },
      { type: 'Energy', severity: 'medium', description: 'Energy cost fluctuations' }
    ],
    impactedSuppliers: 8,
    impactedSpend: 65000000,
    lastUpdated: '2024-01-30'
  },
  {
    id: 'gr5',
    country: 'Vietnam',
    countryCode: 'VN',
    riskLevel: 'moderate',
    riskScore: 45,
    factors: [
      { type: 'Infrastructure', severity: 'medium', description: 'Developing logistics infrastructure' },
      { type: 'Labor', severity: 'low', description: 'Competitive labor costs with some skill gaps' }
    ],
    impactedSuppliers: 15,
    impactedSpend: 52000000,
    lastUpdated: '2024-01-30'
  }
];

const indiaStateRisks: IndiaStateRisk[] = [
  {
    id: 'MH',
    state: 'Maharashtra',
    stateCode: 'MH',
    riskLevel: 'low',
    riskScore: 22,
    supplierCount: 85,
    warehouseCount: 28,
    spendAmount: 425000000,
    factors: [
      { type: 'Infrastructure', severity: 'low', description: 'Well-developed logistics and port infrastructure' },
      { type: 'Labor', severity: 'low', description: 'Skilled workforce availability' }
    ],
    keyCategories: ['IT Services', 'Logistics', 'Manufacturing']
  },
  {
    id: 'KA',
    state: 'Karnataka',
    stateCode: 'KA',
    riskLevel: 'low',
    riskScore: 18,
    supplierCount: 72,
    warehouseCount: 22,
    spendAmount: 380000000,
    factors: [
      { type: 'Technology Hub', severity: 'low', description: 'Strong IT ecosystem and innovation' },
      { type: 'Infrastructure', severity: 'low', description: 'Good road and air connectivity' }
    ],
    keyCategories: ['Technology', 'Software', 'E-commerce Services']
  },
  {
    id: 'TN',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    riskLevel: 'moderate',
    riskScore: 35,
    supplierCount: 58,
    warehouseCount: 18,
    spendAmount: 285000000,
    factors: [
      { type: 'Political', severity: 'medium', description: 'Occasional labor strikes and political disruptions' },
      { type: 'Water', severity: 'medium', description: 'Seasonal water scarcity issues' }
    ],
    keyCategories: ['Auto Components', 'Manufacturing', 'Textiles']
  },
  {
    id: 'DL',
    state: 'Delhi NCR',
    stateCode: 'DL',
    riskLevel: 'elevated',
    riskScore: 48,
    supplierCount: 45,
    warehouseCount: 35,
    spendAmount: 320000000,
    factors: [
      { type: 'Pollution', severity: 'high', description: 'Air quality restrictions affecting operations' },
      { type: 'Traffic', severity: 'medium', description: 'Congestion impacting last-mile delivery' },
      { type: 'Regulatory', severity: 'medium', description: 'Frequent policy changes' }
    ],
    keyCategories: ['Warehousing', 'Distribution', 'Corporate Services']
  },
  {
    id: 'GJ',
    state: 'Gujarat',
    stateCode: 'GJ',
    riskLevel: 'low',
    riskScore: 20,
    supplierCount: 42,
    warehouseCount: 15,
    spendAmount: 195000000,
    factors: [
      { type: 'Business Environment', severity: 'low', description: 'Pro-business policies and ease of operations' },
      { type: 'Port Access', severity: 'low', description: 'Excellent port connectivity' }
    ],
    keyCategories: ['Chemicals', 'Textiles', 'Pharmaceuticals']
  },
  {
    id: 'WB',
    state: 'West Bengal',
    stateCode: 'WB',
    riskLevel: 'elevated',
    riskScore: 52,
    supplierCount: 28,
    warehouseCount: 12,
    spendAmount: 145000000,
    factors: [
      { type: 'Political', severity: 'high', description: 'Frequent political disruptions and bandhs' },
      { type: 'Infrastructure', severity: 'medium', description: 'Aging infrastructure in some areas' }
    ],
    keyCategories: ['Jute', 'Tea', 'Steel']
  },
  {
    id: 'UP',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    riskLevel: 'moderate',
    riskScore: 38,
    supplierCount: 52,
    warehouseCount: 25,
    spendAmount: 175000000,
    factors: [
      { type: 'Infrastructure', severity: 'medium', description: 'Improving but still developing road network' },
      { type: 'Power', severity: 'medium', description: 'Occasional power supply issues' }
    ],
    keyCategories: ['FMCG', 'Agriculture', 'Handicrafts']
  },
  {
    id: 'RJ',
    state: 'Rajasthan',
    stateCode: 'RJ',
    riskLevel: 'moderate',
    riskScore: 42,
    supplierCount: 25,
    warehouseCount: 10,
    spendAmount: 95000000,
    factors: [
      { type: 'Water', severity: 'high', description: 'Severe water scarcity in many regions' },
      { type: 'Connectivity', severity: 'medium', description: 'Limited connectivity in rural areas' }
    ],
    keyCategories: ['Textiles', 'Marble', 'Tourism Services']
  },
  {
    id: 'TS',
    state: 'Telangana',
    stateCode: 'TS',
    riskLevel: 'low',
    riskScore: 25,
    supplierCount: 48,
    warehouseCount: 16,
    spendAmount: 245000000,
    factors: [
      { type: 'Technology', severity: 'low', description: 'Growing tech hub with good infrastructure' },
      { type: 'Policy', severity: 'low', description: 'Stable governance and business policies' }
    ],
    keyCategories: ['IT Services', 'Pharmaceuticals', 'Biotech']
  },
  {
    id: 'AP',
    state: 'Andhra Pradesh',
    stateCode: 'AP',
    riskLevel: 'moderate',
    riskScore: 40,
    supplierCount: 32,
    warehouseCount: 14,
    spendAmount: 125000000,
    factors: [
      { type: 'Political', severity: 'medium', description: 'Policy uncertainty with government changes' },
      { type: 'Natural Disaster', severity: 'medium', description: 'Cyclone-prone coastal areas' }
    ],
    keyCategories: ['Aquaculture', 'Agriculture', 'Ports']
  },
  {
    id: 'KL',
    state: 'Kerala',
    stateCode: 'KL',
    riskLevel: 'elevated',
    riskScore: 45,
    supplierCount: 22,
    warehouseCount: 8,
    spendAmount: 85000000,
    factors: [
      { type: 'Labor', severity: 'high', description: 'Strong unions and frequent strikes' },
      { type: 'Natural Disaster', severity: 'medium', description: 'Flood-prone during monsoons' }
    ],
    keyCategories: ['Spices', 'Rubber', 'Tourism']
  },
  {
    id: 'MP',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    riskLevel: 'moderate',
    riskScore: 35,
    supplierCount: 18,
    warehouseCount: 8,
    spendAmount: 65000000,
    factors: [
      { type: 'Infrastructure', severity: 'medium', description: 'Developing road and rail connectivity' },
      { type: 'Skill', severity: 'medium', description: 'Limited skilled workforce in some sectors' }
    ],
    keyCategories: ['Agriculture', 'Mining', 'Textiles']
  },
  {
    id: 'HR',
    state: 'Haryana',
    stateCode: 'HR',
    riskLevel: 'low',
    riskScore: 28,
    supplierCount: 38,
    warehouseCount: 20,
    spendAmount: 165000000,
    factors: [
      { type: 'Proximity', severity: 'low', description: 'Close to NCR with good connectivity' },
      { type: 'Industrial', severity: 'low', description: 'Well-developed industrial zones' }
    ],
    keyCategories: ['Auto', 'Manufacturing', 'IT']
  },
  {
    id: 'PB',
    state: 'Punjab',
    stateCode: 'PB',
    riskLevel: 'moderate',
    riskScore: 38,
    supplierCount: 22,
    warehouseCount: 10,
    spendAmount: 78000000,
    factors: [
      { type: 'Political', severity: 'medium', description: 'Periodic farmer agitations affecting supply chains' },
      { type: 'Border', severity: 'low', description: 'Cross-border trade opportunities' }
    ],
    keyCategories: ['Agriculture', 'Textiles', 'Sports Goods']
  },
  {
    id: 'OR',
    state: 'Odisha',
    stateCode: 'OR',
    riskLevel: 'elevated',
    riskScore: 55,
    supplierCount: 15,
    warehouseCount: 6,
    spendAmount: 55000000,
    factors: [
      { type: 'Natural Disaster', severity: 'high', description: 'Highly cyclone-prone coastal region' },
      { type: 'Infrastructure', severity: 'medium', description: 'Limited logistics infrastructure' }
    ],
    keyCategories: ['Mining', 'Steel', 'Handicrafts']
  },
  {
    id: 'AS',
    state: 'Assam',
    stateCode: 'AS',
    riskLevel: 'high',
    riskScore: 65,
    supplierCount: 12,
    warehouseCount: 5,
    spendAmount: 42000000,
    factors: [
      { type: 'Connectivity', severity: 'high', description: 'Poor road and rail connectivity' },
      { type: 'Flood', severity: 'high', description: 'Annual flooding disrupts operations' },
      { type: 'Political', severity: 'medium', description: 'Occasional ethnic tensions' }
    ],
    keyCategories: ['Tea', 'Oil & Gas', 'Bamboo']
  },
  {
    id: 'JK',
    state: 'Jammu & Kashmir',
    stateCode: 'JK',
    riskLevel: 'severe',
    riskScore: 78,
    supplierCount: 5,
    warehouseCount: 2,
    spendAmount: 18000000,
    factors: [
      { type: 'Security', severity: 'high', description: 'Security concerns affecting operations' },
      { type: 'Connectivity', severity: 'high', description: 'Weather-dependent connectivity' },
      { type: 'Political', severity: 'high', description: 'Periodic disruptions and internet shutdowns' }
    ],
    keyCategories: ['Handicrafts', 'Horticulture', 'Tourism']
  },
  {
    id: 'LA',
    state: 'Ladakh',
    stateCode: 'LA',
    riskLevel: 'severe',
    riskScore: 82,
    supplierCount: 2,
    warehouseCount: 1,
    spendAmount: 8000000,
    factors: [
      { type: 'Connectivity', severity: 'high', description: 'Extreme weather limits accessibility for months' },
      { type: 'Infrastructure', severity: 'high', description: 'Limited logistics and supply chain infrastructure' },
      { type: 'Security', severity: 'medium', description: 'Border area with occasional tensions' }
    ],
    keyCategories: ['Tourism', 'Handicrafts', 'Agriculture']
  },
  {
    id: 'BR',
    state: 'Bihar',
    stateCode: 'BR',
    riskLevel: 'high',
    riskScore: 62,
    supplierCount: 10,
    warehouseCount: 6,
    spendAmount: 35000000,
    factors: [
      { type: 'Infrastructure', severity: 'high', description: 'Poor road and power infrastructure' },
      { type: 'Flood', severity: 'high', description: 'Annual flooding in many districts' },
      { type: 'Governance', severity: 'medium', description: 'Bureaucratic challenges' }
    ],
    keyCategories: ['Agriculture', 'Food Processing', 'Handicrafts']
  }
];

const newsSentiments: NewsSentiment[] = [
  {
    id: 'ns1',
    headline: 'Delhivery reports 35% YoY growth in Q3, expands warehouse network',
    source: 'Economic Times',
    publishedAt: '2024-01-30 08:30:00',
    sentiment: 'positive',
    sentimentScore: 0.85,
    relevance: 0.95,
    entities: ['Delhivery', 'Logistics'],
    category: 'Supplier News',
    url: '#',
    summary: 'Strong quarterly performance indicates financial stability and expansion capability.'
  },
  {
    id: 'ns2',
    headline: 'Global chip shortage easing as TSMC ramps up production',
    source: 'Reuters',
    publishedAt: '2024-01-30 06:15:00',
    sentiment: 'positive',
    sentimentScore: 0.72,
    relevance: 0.88,
    entities: ['TSMC', 'Semiconductors', 'Taiwan'],
    category: 'Market Intelligence',
    url: '#',
    summary: 'Improved chip availability may lead to better IT hardware pricing in coming quarters.'
  },
  {
    id: 'ns3',
    headline: 'Red Sea shipping disruptions force rerouting, costs surge 40%',
    source: 'Bloomberg',
    publishedAt: '2024-01-30 05:00:00',
    sentiment: 'negative',
    sentimentScore: -0.78,
    relevance: 0.92,
    entities: ['Shipping', 'Red Sea', 'Supply Chain'],
    category: 'Risk Alert',
    url: '#',
    summary: 'International shipping costs expected to remain elevated through Q1 2024.'
  },
  {
    id: 'ns4',
    headline: 'India IT services sector outlook positive for 2024: NASSCOM',
    source: 'Business Standard',
    publishedAt: '2024-01-29 14:00:00',
    sentiment: 'positive',
    sentimentScore: 0.65,
    relevance: 0.75,
    entities: ['IT Services', 'NASSCOM', 'India'],
    category: 'Market Intelligence',
    url: '#',
    summary: 'Strong demand expected for technology services, potential impact on vendor rates.'
  },
  {
    id: 'ns5',
    headline: 'Major logistics provider faces financial restructuring amid debt concerns',
    source: 'Financial Express',
    publishedAt: '2024-01-29 11:30:00',
    sentiment: 'negative',
    sentimentScore: -0.82,
    relevance: 0.85,
    entities: ['Global Logistics India', 'Restructuring'],
    category: 'Supplier News',
    url: '#',
    summary: 'Financial difficulties at key supplier may require contingency planning.'
  },
  {
    id: 'ns6',
    headline: 'E-commerce packaging demand drives corrugated board prices higher',
    source: 'Mint',
    publishedAt: '2024-01-29 09:45:00',
    sentiment: 'neutral',
    sentimentScore: -0.15,
    relevance: 0.70,
    entities: ['Packaging', 'E-commerce', 'Commodities'],
    category: 'Market Intelligence',
    url: '#',
    summary: 'Rising packaging costs may impact fulfillment expenses in coming quarters.'
  },
  {
    id: 'ns7',
    headline: 'Dell announces new AI-optimized server lineup for enterprise',
    source: 'TechCrunch',
    publishedAt: '2024-01-28 16:00:00',
    sentiment: 'positive',
    sentimentScore: 0.58,
    relevance: 0.68,
    entities: ['Dell', 'AI', 'Servers'],
    category: 'Supplier News',
    url: '#',
    summary: 'New product offerings from key IT vendor may present procurement opportunities.'
  },
  {
    id: 'ns8',
    headline: 'China export controls on rare earth elements tighten',
    source: 'South China Morning Post',
    publishedAt: '2024-01-28 10:00:00',
    sentiment: 'negative',
    sentimentScore: -0.68,
    relevance: 0.72,
    entities: ['China', 'Rare Earth', 'Export Controls'],
    category: 'Risk Alert',
    url: '#',
    summary: 'New restrictions may impact electronics and battery supply chains.'
  }
];

const sentimentTrends: SentimentTrend[] = [
  { date: 'Jan 24', positive: 45, negative: 25, neutral: 30 },
  { date: 'Jan 25', positive: 42, negative: 32, neutral: 26 },
  { date: 'Jan 26', positive: 48, negative: 28, neutral: 24 },
  { date: 'Jan 27', positive: 52, negative: 22, neutral: 26 },
  { date: 'Jan 28', positive: 38, negative: 35, neutral: 27 },
  { date: 'Jan 29', positive: 44, negative: 30, neutral: 26 },
  { date: 'Jan 30', positive: 50, negative: 28, neutral: 22 }
];

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'low': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
    case 'moderate': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
    case 'elevated': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
    case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
    case 'severe': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
  }
};

const getFinancialHealthColor = (stability: string) => {
  switch (stability) {
    case 'excellent': return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'good': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
    case 'fair': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'poor': return { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' };
    case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: ThumbsUp };
    case 'negative': return { bg: 'bg-red-100', text: 'text-red-700', icon: ThumbsDown };
    case 'neutral': return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Minus };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Minus };
  }
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

export default function ExternalIntelligence() {
  const [viewMode, setViewMode] = useState<'market' | 'financial' | 'geopolitical' | 'news'>('market');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierFinancialHealth | null>(null);
  const [selectedState, setSelectedState] = useState<IndiaStateRisk | null>(null);
  const [newsFilter, setNewsFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Live API data state
  const [liveCommodityPrices, setLiveCommodityPrices] = useState<CommodityPrice[]>([]);
  const [usdToInr, setUsdToInr] = useState<number>(83.5);
  const [isLiveDataLoading, setIsLiveDataLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  // Fetch live commodity prices
  const fetchLiveData = useCallback(async () => {
    setIsLiveDataLoading(true);
    try {
      const [prices, rate] = await Promise.all([
        fetchIndiaCommodityPrices(),
        fetchExchangeRate('USD', 'INR')
      ]);
      setLiveCommodityPrices(prices);
      setUsdToInr(rate);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching live data:', error);
    } finally {
      setIsLiveDataLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchLiveData();

    // Poll every 60 seconds when live mode is enabled
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isLiveEnabled) {
      intervalId = setInterval(fetchLiveData, 60000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchLiveData, isLiveEnabled]);

  const criticalSuppliers = supplierFinancialHealth.filter(s => s.financialStability === 'critical' || s.financialStability === 'poor');
  const highRiskCountries = geopoliticalRisks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'severe');
  const negativeNews = newsSentiments.filter(n => n.sentiment === 'negative');

  const filteredNews = newsSentiments.filter(n =>
    (newsFilter === 'all' || n.sentiment === newsFilter) &&
    (searchTerm === '' || n.headline.toLowerCase().includes(searchTerm.toLowerCase()) || n.entities.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Globe className="text-indigo-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">External Intelligence</h2>
              <p className="text-sm text-gray-500">Market data, supplier health, geopolitical risks & news sentiment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('market')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'market' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                Market Intel
              </button>
              <button
                onClick={() => setViewMode('financial')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'financial' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                Supplier Health
              </button>
              <button
                onClick={() => setViewMode('geopolitical')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'geopolitical' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                Geo Risk
              </button>
              <button
                onClick={() => setViewMode('news')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'news' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600'
                }`}
              >
                News Sentiment
              </button>
            </div>
            {/* Live Indicator */}
            <button
              onClick={() => setIsLiveEnabled(!isLiveEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                isLiveEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {isLiveEnabled ? 'Live' : 'Paused'}
            </button>
            <button
              onClick={fetchLiveData}
              disabled={isLiveDataLoading}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLiveDataLoading ? 'animate-spin' : ''} />
              {isLiveDataLoading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>
        {/* Last Update Time */}
        <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500">
          <Wifi size={12} className={isLiveEnabled ? 'text-emerald-500' : 'text-gray-400'} />
          Last updated: {lastRefresh.toLocaleTimeString()} | USD/INR: ₹{usdToInr.toFixed(2)}
        </div>
      </div>

      {/* Alert Banner */}
      {(criticalSuppliers.length > 0 || highRiskCountries.length > 0 || negativeNews.length >= 3) && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-600" />
            <span className="text-sm text-amber-800">
              <strong>Attention Required:</strong>
              {criticalSuppliers.length > 0 && ` ${criticalSuppliers.length} suppliers with financial concerns.`}
              {highRiskCountries.length > 0 && ` ${highRiskCountries.length} high-risk regions.`}
              {negativeNews.length >= 3 && ` ${negativeNews.length} negative news alerts.`}
            </span>
          </div>
          <button className="text-amber-700 hover:underline text-sm font-medium">Review All</button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b">
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Commodities</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{marketIntelligence.length}</p>
          <p className="text-xs text-gray-500">tracked</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Building size={16} className="text-purple-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Suppliers Scored</p>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">{supplierFinancialHealth.length}</p>
          <p className="text-xs text-red-500">{criticalSuppliers.length} at risk</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-amber-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Countries</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{geopoliticalRisks.length}</p>
          <p className="text-xs text-orange-500">{highRiskCountries.length} high risk</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <Newspaper size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">News Articles</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{newsSentiments.length}</p>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <ThumbsUp size={16} className="text-green-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Positive</p>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {newsSentiments.filter(n => n.sentiment === 'positive').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <ThumbsDown size={16} className="text-red-500" />
            <p className="text-xs text-gray-500 uppercase font-medium">Negative</p>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{negativeNews.length}</p>
        </div>
      </div>

      {viewMode === 'market' && (
        <div className="p-4">
          {/* Live India Commodity Prices */}
          {liveCommodityPrices.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">Live India Commodity Prices</h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <span className="text-xs text-gray-500">Source: MCX/NCDEX • Updates every 60s</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {liveCommodityPrices.map((commodity) => (
                  <div key={commodity.name} className="bg-gradient-to-br from-slate-50 to-slate-100 border rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{commodity.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-gray-800">
                        {commodity.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-xs text-gray-500">{commodity.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-xs font-medium ${Math.random() > 0.5 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                      </span>
                      <span className="text-xs text-gray-400">vs yesterday</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Market Intelligence & Forecasts</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-gray-600">Bullish</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={14} className="text-red-500" />
                <span className="text-gray-600">Bearish</span>
              </div>
              <div className="flex items-center gap-1">
                <Minus size={14} className="text-gray-500" />
                <span className="text-gray-600">Neutral</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {marketIntelligence.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">{item.category}</span>
                    <h4 className="font-semibold text-gray-800">{item.commodity}</h4>
                  </div>
                  {item.forecast === 'bullish' ? (
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp size={20} className="text-emerald-600" />
                    </div>
                  ) : item.forecast === 'bearish' ? (
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown size={20} className="text-red-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Minus size={20} className="text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-800">{item.currentPrice.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{item.priceUnit}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">24h Change</p>
                    <p className={`font-medium ${item.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">30d Change</p>
                    <p className={`font-medium ${item.change30d >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.change30d >= 0 ? '+' : ''}{item.change30d}%
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Forecast Confidence</span>
                    <span className="font-medium">{item.forecastConfidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        item.forecast === 'bullish' ? 'bg-emerald-500' :
                        item.forecast === 'bearish' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${item.forecastConfidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">Impacted Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.impactedCategories.map((cat, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Source: {item.source}</span>
                  <span>{item.lastUpdated.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'financial' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Supplier Financial Health Monitoring</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {supplierFinancialHealth.map((supplier) => {
              const healthColor = getFinancialHealthColor(supplier.financialStability);
              const isSelected = selectedSupplier?.id === supplier.id;

              return (
                <div
                  key={supplier.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    supplier.financialStability === 'critical' || supplier.financialStability === 'poor'
                      ? 'border-red-200'
                      : ''
                  } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      supplier.financialStability === 'critical' ? 'bg-red-50' :
                      supplier.financialStability === 'poor' ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => setSelectedSupplier(isSelected ? null : supplier)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-gray-400">
                          {isSelected ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${healthColor.dot}`}></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">{supplier.vendorName}</span>
                              <span className="text-xs text-gray-500">({supplier.vendorId})</span>
                              {supplier.alerts.length > 0 && (
                                <AlertCircle size={16} className="text-red-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500">Last assessed: {supplier.lastAssessment}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Credit Rating</p>
                          <p className="font-bold text-lg text-gray-800">{supplier.creditRating}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Credit Score</p>
                          <p className={`font-bold text-lg ${
                            supplier.creditScore >= 70 ? 'text-emerald-600' :
                            supplier.creditScore >= 50 ? 'text-amber-600' : 'text-red-600'
                          }`}>{supplier.creditScore}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Bankruptcy Risk</p>
                          <p className={`font-bold text-lg ${
                            supplier.bankruptcyRisk <= 10 ? 'text-emerald-600' :
                            supplier.bankruptcyRisk <= 30 ? 'text-amber-600' : 'text-red-600'
                          }`}>{supplier.bankruptcyRisk}%</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${healthColor.bg} ${healthColor.text}`}>
                          {supplier.financialStability}
                        </span>
                      </div>
                    </div>

                    {supplier.alerts.length > 0 && (
                      <div className="mt-3 ml-10 flex flex-wrap gap-2">
                        {supplier.alerts.map((alert, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded flex items-center gap-1">
                            <AlertTriangle size={12} /> {alert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500">Payment History</p>
                          <p className={`text-xl font-bold ${supplier.paymentHistory >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {supplier.paymentHistory}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500">Revenue Growth</p>
                          <p className={`text-xl font-bold ${supplier.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {supplier.revenueGrowth > 0 ? '+' : ''}{supplier.revenueGrowth}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500">Debt/Equity</p>
                          <p className={`text-xl font-bold ${supplier.debtToEquity <= 1 ? 'text-emerald-600' : supplier.debtToEquity <= 2 ? 'text-amber-600' : 'text-red-600'}`}>
                            {supplier.debtToEquity}x
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500">Current Ratio</p>
                          <p className={`text-xl font-bold ${supplier.currentRatio >= 1.5 ? 'text-emerald-600' : supplier.currentRatio >= 1 ? 'text-amber-600' : 'text-red-600'}`}>
                            {supplier.currentRatio}
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <button className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                            <Eye size={14} /> Full Report
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Data source: {supplier.source}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'geopolitical' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">India Procurement Risk Map</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-amber-500"></div>
                <span>Elevated</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>Severe</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* India Map */}
            <div className="col-span-2 border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <IndiaMap
                stateRisks={indiaStateRisks}
                selectedState={selectedState}
                onStateClick={setSelectedState}
              />
            </div>

            {/* State Details Panel */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-4">
                {selectedState ? selectedState.state : 'Select a State'}
              </h4>
              {selectedState ? (
                <div className="space-y-4">
                  {/* Risk Summary */}
                  <div className={`p-3 rounded-lg ${getRiskLevelColor(selectedState.riskLevel).bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${getRiskLevelColor(selectedState.riskLevel).text}`}>
                        {selectedState.riskLevel.charAt(0).toUpperCase() + selectedState.riskLevel.slice(1)} Risk
                      </span>
                      <span className={`text-2xl font-bold ${getRiskLevelColor(selectedState.riskLevel).text}`}>
                        {selectedState.riskScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-xs text-blue-600">Suppliers</p>
                      <p className="text-xl font-bold text-blue-700">{selectedState.supplierCount}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <p className="text-xs text-purple-600">Warehouses</p>
                      <p className="text-xl font-bold text-purple-700">{selectedState.warehouseCount}</p>
                    </div>
                    <div className="col-span-2 p-3 bg-emerald-50 rounded-lg text-center">
                      <p className="text-xs text-emerald-600">Total Spend</p>
                      <p className="text-xl font-bold text-emerald-700">{formatCurrency(selectedState.spendAmount)}</p>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Risk Factors</h5>
                    <div className="space-y-2">
                      {selectedState.factors.map((factor, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{factor.type}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                              factor.severity === 'high' ? 'bg-red-100 text-red-700' :
                              factor.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {factor.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Categories */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Key Categories</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedState.keyCategories.map((cat, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                    <Eye size={14} /> View State Suppliers
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-400">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p>Click on a state to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* State Risk Summary Table */}
          <div className="mt-6 border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Risk</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Suppliers</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Warehouses</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Spend</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Risk Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {indiaStateRisks.sort((a, b) => b.riskScore - a.riskScore).slice(0, 8).map((state) => {
                  const riskColor = getRiskLevelColor(state.riskLevel);
                  const topFactor = state.factors.find(f => f.severity === 'high') || state.factors[0];
                  return (
                    <tr
                      key={state.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedState?.id === state.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => setSelectedState(state)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{state.state}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${riskColor.bg} ${riskColor.text}`}>
                          {state.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{state.supplierCount}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{state.warehouseCount}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">{formatCurrency(state.spendAmount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{topFactor.type}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'news' && (
        <div className="p-4">
          {/* Sentiment Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="col-span-3 border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Sentiment Trend (Last 7 Days)</h4>
              <div className="flex items-end justify-between h-32 px-4">
                {sentimentTrends.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="flex flex-col-reverse" style={{ height: '100px' }}>
                      <div className="w-8 bg-emerald-400 rounded-t" style={{ height: `${day.positive}px` }}></div>
                      <div className="w-8 bg-gray-300" style={{ height: `${day.neutral}px` }}></div>
                      <div className="w-8 bg-red-400 rounded-b" style={{ height: `${day.negative}px` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{day.date.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                  <span>Positive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span>Negative</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Overall Sentiment</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-600">Positive</span>
                    <span className="font-medium">{Math.round((newsSentiments.filter(n => n.sentiment === 'positive').length / newsSentiments.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(newsSentiments.filter(n => n.sentiment === 'positive').length / newsSentiments.length) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Neutral</span>
                    <span className="font-medium">{Math.round((newsSentiments.filter(n => n.sentiment === 'neutral').length / newsSentiments.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gray-400" style={{ width: `${(newsSentiments.filter(n => n.sentiment === 'neutral').length / newsSentiments.length) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">Negative</span>
                    <span className="font-medium">{Math.round((negativeNews.length / newsSentiments.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: `${(negativeNews.length / newsSentiments.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">News Feed</h4>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-48"
                />
              </div>
              <select
                value={newsFilter}
                onChange={(e) => setNewsFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredNews.map((news) => {
              const sentimentColor = getSentimentColor(news.sentiment);
              const SentimentIcon = sentimentColor.icon;

              return (
                <div key={news.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  news.sentiment === 'negative' ? 'border-red-200 bg-red-50' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${sentimentColor.bg} ${sentimentColor.text} flex items-center gap-1`}>
                          <SentimentIcon size={12} /> {news.sentiment}
                        </span>
                        <span className="text-xs text-gray-500">{news.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{news.source}</span>
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-2">{news.headline}</h5>
                      <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                      <div className="flex items-center gap-2">
                        {news.entities.map((entity, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Relevance</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= Math.round(news.relevance * 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{news.publishedAt.split(' ')[1]}</p>
                      <button className="text-indigo-600 hover:underline text-xs flex items-center gap-1">
                        Read more <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
