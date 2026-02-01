"""
Procurement AI - Excel Data Generator
Generates comprehensive Excel file with all procurement data for the application
"""

import pandas as pd
from datetime import datetime, timedelta
import random
import os

# Output file path
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'procurement_master_data.xlsx')


def generate_transactions():
    """Generate procurement transactions data"""
    vendors = [
        'BlueDart Express', 'Delhivery Logistics', 'SafeExpress', 'XpressBees',
        'TCS Logistics', 'Salesforce India', 'Microsoft Azure', 'AWS India',
        'TechMahindra', 'Infosys BPM', 'Wipro Technologies', 'HCL Services'
    ]
    stages = ['Request Intake', 'Sourcing', 'Contracting', 'PR/PO Creation', 'Payment', 'Completed']

    data = []
    for i in range(1, 151):
        vendor = random.choice(vendors)
        stage = random.choice(stages)
        has_bottleneck = random.random() < 0.2

        data.append({
            'Transaction ID': f'TXN-2024-{str(i).zfill(5)}',
            'Vendor Name': vendor,
            'Category': random.choice(['Logistics', 'IT Services', 'SaaS', 'Marketing', 'Infrastructure']),
            'Total Value (INR)': round(random.uniform(50000, 5000000), 2),
            'Current Stage': stage,
            'Start Date': (datetime.now() - timedelta(days=random.randint(10, 90))).strftime('%Y-%m-%d'),
            'Total Cycle Time (Days)': random.randint(5, 60),
            'Has Bottleneck': has_bottleneck,
            'Bottleneck Stage': random.choice(['Sourcing', 'Contracting', 'Payment']) if has_bottleneck else '',
            'Compliance Score': random.randint(70, 100),
            'Priority': random.choice(['High', 'Medium', 'Low']),
            'Requestor': random.choice(['Procurement Team', 'Finance', 'Operations', 'IT', 'Marketing']),
            'Approver': random.choice(['Rajesh Kumar', 'Priya Sharma', 'Amit Verma', 'Sneha Patel'])
        })

    return pd.DataFrame(data)


def generate_vendors():
    """Generate vendor master data"""
    data = [
        {'Vendor Code': 'V-BD-001', 'Vendor Name': 'BlueDart Express', 'Category': 'Logistics', 'Type': '3PL', 'Location': 'Mumbai', 'State': 'Maharashtra', 'GST Number': '27AABCB1234A1Z5', 'PAN': 'AABCB1234A', 'Contact Email': 'finance@bluedart.com', 'Contact Phone': '+91-22-66666666', 'Payment Terms': 'Net 30', 'Rating': 4.5, 'Status': 'Active', 'Onboarded Date': '2020-01-15'},
        {'Vendor Code': 'V-DL-002', 'Vendor Name': 'Delhivery Logistics', 'Category': 'Logistics', 'Type': '3PL', 'Location': 'Gurgaon', 'State': 'Haryana', 'GST Number': '06AABCD1234A1Z5', 'PAN': 'AABCD1234A', 'Contact Email': 'accounts@delhivery.com', 'Contact Phone': '+91-124-4567890', 'Payment Terms': 'Net 30', 'Rating': 4.3, 'Status': 'Active', 'Onboarded Date': '2019-06-20'},
        {'Vendor Code': 'V-SE-003', 'Vendor Name': 'SafeExpress', 'Category': 'Logistics', 'Type': '3PL', 'Location': 'Delhi', 'State': 'Delhi', 'GST Number': '07AABCE1234A1Z5', 'PAN': 'AABCE1234A', 'Contact Email': 'accounts@safexpress.com', 'Contact Phone': '+91-11-45678901', 'Payment Terms': 'Net 45', 'Rating': 4.0, 'Status': 'Active', 'Onboarded Date': '2018-03-10'},
        {'Vendor Code': 'V-XB-004', 'Vendor Name': 'XpressBees', 'Category': 'Logistics', 'Type': '3PL', 'Location': 'Pune', 'State': 'Maharashtra', 'GST Number': '27AABCF1234A1Z5', 'PAN': 'AABCF1234A', 'Contact Email': 'finance@xpressbees.com', 'Contact Phone': '+91-20-67890123', 'Payment Terms': 'Net 30', 'Rating': 4.2, 'Status': 'Active', 'Onboarded Date': '2021-02-28'},
        {'Vendor Code': 'V-SF-005', 'Vendor Name': 'Salesforce India', 'Category': 'SaaS', 'Type': 'Software', 'Location': 'Hyderabad', 'State': 'Telangana', 'GST Number': '36AABCG1234A1Z5', 'PAN': 'AABCG1234A', 'Contact Email': 'billing@salesforce.com', 'Contact Phone': '+91-40-78901234', 'Payment Terms': 'Annual', 'Rating': 4.8, 'Status': 'Active', 'Onboarded Date': '2019-01-01'},
        {'Vendor Code': 'V-MS-006', 'Vendor Name': 'Microsoft India', 'Category': 'SaaS', 'Type': 'Software', 'Location': 'Bangalore', 'State': 'Karnataka', 'GST Number': '29AABCH1234A1Z5', 'PAN': 'AABCH1234A', 'Contact Email': 'enterprise@microsoft.com', 'Contact Phone': '+91-80-89012345', 'Payment Terms': 'Annual', 'Rating': 4.9, 'Status': 'Active', 'Onboarded Date': '2017-04-15'},
        {'Vendor Code': 'V-AWS-007', 'Vendor Name': 'AWS India', 'Category': 'Cloud', 'Type': 'IaaS', 'Location': 'Mumbai', 'State': 'Maharashtra', 'GST Number': '27AABCI1234A1Z5', 'PAN': 'AABCI1234A', 'Contact Email': 'aws-billing@amazon.com', 'Contact Phone': '+91-22-90123456', 'Payment Terms': 'Monthly', 'Rating': 4.7, 'Status': 'Active', 'Onboarded Date': '2018-08-20'},
        {'Vendor Code': 'V-TM-008', 'Vendor Name': 'TechMahindra', 'Category': 'IT Services', 'Type': 'Consulting', 'Location': 'Pune', 'State': 'Maharashtra', 'GST Number': '27AABCJ1234A1Z5', 'PAN': 'AABCJ1234A', 'Contact Email': 'accounts@techmahindra.com', 'Contact Phone': '+91-20-01234567', 'Payment Terms': 'Net 60', 'Rating': 4.1, 'Status': 'Active', 'Onboarded Date': '2020-05-10'},
        {'Vendor Code': 'V-INF-009', 'Vendor Name': 'Infosys BPM', 'Category': 'BPO', 'Type': 'Outsourcing', 'Location': 'Bangalore', 'State': 'Karnataka', 'GST Number': '29AABCK1234A1Z5', 'PAN': 'AABCK1234A', 'Contact Email': 'finance@infosys.com', 'Contact Phone': '+91-80-12345678', 'Payment Terms': 'Net 45', 'Rating': 4.4, 'Status': 'Active', 'Onboarded Date': '2019-09-01'},
        {'Vendor Code': 'V-WIP-010', 'Vendor Name': 'Wipro Technologies', 'Category': 'IT Services', 'Type': 'Consulting', 'Location': 'Bangalore', 'State': 'Karnataka', 'GST Number': '29AABCL1234A1Z5', 'PAN': 'AABCL1234A', 'Contact Email': 'billing@wipro.com', 'Contact Phone': '+91-80-23456789', 'Payment Terms': 'Net 60', 'Rating': 4.2, 'Status': 'Active', 'Onboarded Date': '2018-11-15'},
        {'Vendor Code': 'V-ABC-011', 'Vendor Name': 'ABC Recruiters', 'Category': 'HR Services', 'Type': 'Recruitment', 'Location': 'Mumbai', 'State': 'Maharashtra', 'GST Number': '27AABCM1234A1Z5', 'PAN': 'AABCM1234A', 'Contact Email': 'hr@abcrecruiters.com', 'Contact Phone': '+91-22-34567890', 'Payment Terms': 'Net 30', 'Rating': 3.9, 'Status': 'Active', 'Onboarded Date': '2021-07-01'},
        {'Vendor Code': 'V-OGI-012', 'Vendor Name': 'Ogilvy India', 'Category': 'Marketing', 'Type': 'Agency', 'Location': 'Mumbai', 'State': 'Maharashtra', 'GST Number': '27AABCN1234A1Z5', 'PAN': 'AABCN1234A', 'Contact Email': 'accounts@ogilvy.com', 'Contact Phone': '+91-22-45678901', 'Payment Terms': 'Net 45', 'Rating': 4.6, 'Status': 'Active', 'Onboarded Date': '2019-03-20'},
    ]
    return pd.DataFrame(data)


def generate_rate_cards():
    """Generate logistics rate card data"""
    vendors = ['Delhivery Logistics', 'SafeExpress', 'XpressBees', 'BlueDart Express']
    routes = [
        ('BLR', 'MUM', 'Bangalore', 'Mumbai', 980),
        ('BLR', 'HYD', 'Bangalore', 'Hyderabad', 570),
        ('DEL', 'MUM', 'Delhi', 'Mumbai', 1420),
        ('MUM', 'CHN', 'Mumbai', 'Chennai', 1340),
        ('DEL', 'BLR', 'Delhi', 'Bangalore', 2150),
        ('HYD', 'CHN', 'Hyderabad', 'Chennai', 630),
        ('PUN', 'MUM', 'Pune', 'Mumbai', 150),
        ('DEL', 'JAI', 'Delhi', 'Jaipur', 280),
    ]
    vehicle_types = ['32ft MXL', '20ft Container', '14ft Truck', 'Tempo', 'Mini Truck']

    data = []
    for i, vendor in enumerate(vendors):
        for j, (orig_code, dest_code, origin, destination, distance) in enumerate(routes):
            for k, vehicle in enumerate(vehicle_types):
                base_rate = random.uniform(12, 22)
                data.append({
                    'Rate Card ID': f'RC-{str(i*100 + j*10 + k + 1).zfill(4)}',
                    'Vendor': vendor,
                    'Route Code': f'{orig_code}-{dest_code}',
                    'Origin': origin,
                    'Destination': destination,
                    'Distance (KM)': distance,
                    'Vehicle Type': vehicle,
                    'Contracted Rate/KM (INR)': round(base_rate, 2),
                    'Fuel Surcharge %': random.choice([0, 2, 3, 5]),
                    'Effective From': '2024-01-01',
                    'Effective To': '2024-12-31',
                    'Contract Ref': f'CON-LOG-2024-{str(i+1).zfill(3)}',
                    'PO Number': f'PO-LOG-2024-{str(i*10 + j + 1).zfill(4)}',
                    'Status': 'Active'
                })

    return pd.DataFrame(data)


def generate_logistics_invoices():
    """Generate logistics invoices with potential discrepancies"""
    data = []
    vendors = ['Delhivery Logistics', 'SafeExpress', 'XpressBees', 'BlueDart Express']
    routes = [('BLR', 'HYD'), ('DEL', 'MUM'), ('MUM', 'CHN'), ('BLR', 'MUM'), ('DEL', 'BLR')]
    vehicles = ['32ft MXL', '20ft Container', '14ft Truck']

    for i in range(1, 51):
        vendor = random.choice(vendors)
        orig, dest = random.choice(routes)
        vehicle = random.choice(vehicles)
        trip_kms = random.randint(400, 2500)
        contracted_rate = round(random.uniform(14, 18), 2)
        expected_cost = round(trip_kms * contracted_rate, 2)

        # Add some discrepancies
        if random.random() < 0.3:
            discrepancy_pct = random.uniform(0.05, 0.25)
            invoiced = round(expected_cost * (1 + discrepancy_pct), 2)
            status = 'flagged' if discrepancy_pct > 0.1 else 'minor_variance'
        else:
            invoiced = expected_cost
            status = 'compliant'

        discrepancy = round(invoiced - expected_cost, 2)

        data.append({
            'Invoice ID': f'INV-LOG-2024-{str(i).zfill(4)}',
            'Trip Sheet ID': f'TS-2024-{str(random.randint(1000, 9999))}',
            'Vendor': vendor,
            'Invoice Date': (datetime.now() - timedelta(days=random.randint(1, 60))).strftime('%Y-%m-%d'),
            'Origin': orig,
            'Destination': dest,
            'Vehicle Type': vehicle,
            'Vehicle Number': f'KA-{random.randint(1, 72):02d}-{random.choice(["AB", "CD", "EF"])}-{random.randint(1000, 9999)}',
            'Trip Sheet KMs': trip_kms,
            'Contracted Rate/KM': contracted_rate,
            'Expected Cost (INR)': expected_cost,
            'Invoiced Amount (INR)': invoiced,
            'Discrepancy (INR)': discrepancy,
            'Discrepancy %': round((discrepancy / expected_cost) * 100, 2) if expected_cost > 0 else 0,
            'Status': status,
            'Rate Card Ref': f'RC-{str(random.randint(1, 50)).zfill(4)}',
            'Payment Status': random.choice(['Pending', 'Processed', 'On Hold'])
        })

    return pd.DataFrame(data)


def generate_saas_contracts():
    """Generate SaaS contract data"""
    data = [
        {'Contract ID': 'CON-SAAS-001', 'Vendor': 'Salesforce India', 'Product': 'Sales Cloud', 'License Type': 'per_user', 'Contracted Licenses': 320, 'Unit Price (INR)': 15000, 'Billing Cycle': 'Annual', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31', 'PO Number': 'PO-SAAS-2024-001', 'Total Contract Value': 57600000, 'Auto Renewal': True},
        {'Contract ID': 'CON-SAAS-002', 'Vendor': 'Salesforce India', 'Product': 'Service Cloud', 'License Type': 'per_user', 'Contracted Licenses': 150, 'Unit Price (INR)': 12000, 'Billing Cycle': 'Annual', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31', 'PO Number': 'PO-SAAS-2024-002', 'Total Contract Value': 21600000, 'Auto Renewal': True},
        {'Contract ID': 'CON-SAAS-003', 'Vendor': 'Microsoft India', 'Product': 'Office 365 E3', 'License Type': 'per_user', 'Contracted Licenses': 2500, 'Unit Price (INR)': 2100, 'Billing Cycle': 'Annual', 'Contract Start': '2024-04-01', 'Contract End': '2025-03-31', 'PO Number': 'PO-SAAS-2024-003', 'Total Contract Value': 63000000, 'Auto Renewal': True},
        {'Contract ID': 'CON-SAAS-004', 'Vendor': 'Microsoft India', 'Product': 'Power BI Pro', 'License Type': 'per_user', 'Contracted Licenses': 200, 'Unit Price (INR)': 850, 'Billing Cycle': 'Monthly', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31', 'PO Number': 'PO-SAAS-2024-004', 'Total Contract Value': 2040000, 'Auto Renewal': False},
        {'Contract ID': 'CON-SAAS-005', 'Vendor': 'Slack Technologies', 'Product': 'Slack Business+', 'License Type': 'per_user', 'Contracted Licenses': 1500, 'Unit Price (INR)': 1200, 'Billing Cycle': 'Annual', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31', 'PO Number': 'PO-SAAS-2024-005', 'Total Contract Value': 21600000, 'Auto Renewal': True},
        {'Contract ID': 'CON-SAAS-006', 'Vendor': 'Zoom Video', 'Product': 'Zoom Business', 'License Type': 'per_user', 'Contracted Licenses': 500, 'Unit Price (INR)': 1650, 'Billing Cycle': 'Annual', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31', 'PO Number': 'PO-SAAS-2024-006', 'Total Contract Value': 9900000, 'Auto Renewal': True},
    ]
    return pd.DataFrame(data)


def generate_saas_invoices():
    """Generate SaaS invoices with utilization issues"""
    data = []
    contracts = [
        ('Salesforce India', 'Sales Cloud', 320, 15000),
        ('Salesforce India', 'Service Cloud', 150, 12000),
        ('Microsoft India', 'Office 365 E3', 2500, 2100),
        ('Slack Technologies', 'Slack Business+', 1500, 1200),
    ]

    for i, (vendor, product, contracted, unit_price) in enumerate(contracts):
        for month in range(1, 4):
            # Some vendors over-bill
            if random.random() < 0.25:
                billed_licenses = contracted + random.randint(10, 50)
                status = 'over_licensed'
            elif random.random() < 0.3:
                billed_licenses = contracted
                status = 'under_utilized'  # Contracted but not used
            else:
                billed_licenses = contracted
                status = 'compliant'

            actual_usage = int(contracted * random.uniform(0.7, 0.95))
            expected_amount = contracted * unit_price
            invoiced_amount = billed_licenses * unit_price

            data.append({
                'Invoice ID': f'INV-SAAS-2024-{str(i*10 + month).zfill(4)}',
                'Vendor': vendor,
                'Product': product,
                'Invoice Date': f'2024-{str(month).zfill(2)}-01',
                'Billing Period': f'2024-{str(month).zfill(2)}',
                'Licenses in Contract': contracted,
                'Licenses Billed': billed_licenses,
                'Actual Usage': actual_usage,
                'Utilization %': round((actual_usage / contracted) * 100, 1),
                'Unit Price (INR)': unit_price,
                'Expected Amount (INR)': expected_amount,
                'Invoiced Amount (INR)': invoiced_amount,
                'License Diff': billed_licenses - contracted,
                'Amount Diff (INR)': invoiced_amount - expected_amount,
                'Status': status,
                'Contract Ref': f'CON-SAAS-{str(i+1).zfill(3)}',
            })

    return pd.DataFrame(data)


def generate_leakage_cases():
    """Generate leakage detection cases"""
    data = [
        {'Case ID': 'CASE-2024-0001', 'Title': 'Duplicate Payment to BlueDart - Invoice INV-BD-2024-1234', 'Category': 'Duplicate Payment', 'Sub-Category': 'Same Invoice Number', 'Vendor': 'BlueDart Express', 'Vendor Code': 'V-BD-001', 'Severity': 'Critical', 'Priority': 'Urgent', 'Status': 'Recovery Initiated', 'Leakage Amount (INR)': 485000, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 485000, 'Detection Method': 'AI Detected', 'Source System': 'Oracle EBS', 'Created Date': '2024-01-28', 'Due Date': '2024-02-05', 'Assignee': 'Priya Sharma', 'Department': 'Accounts Payable', 'Root Cause': 'Invoice processed in both ERP batch and manual payment', 'Recommendation': 'Implement real-time duplicate detection'},
        {'Case ID': 'CASE-2024-0002', 'Title': 'Rate Card Violation - SafeExpress Overcharged ₹67K', 'Category': 'Rate Card Violation', 'Sub-Category': 'Rate Overcharge', 'Vendor': 'SafeExpress', 'Vendor Code': 'V-SE-003', 'Severity': 'High', 'Priority': 'High', 'Status': 'Investigating', 'Leakage Amount (INR)': 67200, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 67200, 'Detection Method': 'Rule Based', 'Source System': 'Simplicontract', 'Created Date': '2024-01-27', 'Due Date': '2024-02-03', 'Assignee': 'Amit Verma', 'Department': 'Logistics Finance', 'Root Cause': 'Under Investigation', 'Recommendation': 'Pending investigation'},
        {'Case ID': 'CASE-2024-0003', 'Title': 'SaaS Over-Licensing - Salesforce 45 Excess Licenses', 'Category': 'License Compliance', 'Sub-Category': 'Over-Licensing', 'Vendor': 'Salesforce India', 'Vendor Code': 'V-SF-005', 'Severity': 'High', 'Priority': 'Medium', 'Status': 'Pending Approval', 'Leakage Amount (INR)': 810000, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 810000, 'Detection Method': 'Usage Analysis', 'Source System': 'IT Asset Management', 'Created Date': '2024-01-25', 'Due Date': '2024-02-10', 'Assignee': 'Sneha Patel', 'Department': 'IT Procurement', 'Root Cause': 'No license reconciliation process', 'Recommendation': 'Implement quarterly license audits'},
        {'Case ID': 'CASE-2024-0004', 'Title': 'Recruitment Fee Overcharge - ABC Recruiters', 'Category': 'Contract Violation', 'Sub-Category': 'Fee Overcharge', 'Vendor': 'ABC Recruiters', 'Vendor Code': 'V-ABC-011', 'Severity': 'Medium', 'Priority': 'Medium', 'Status': 'New', 'Leakage Amount (INR)': 125000, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 125000, 'Detection Method': 'Rule Based', 'Source System': 'HR System', 'Created Date': '2024-01-30', 'Due Date': '2024-02-15', 'Assignee': 'Unassigned', 'Department': '', 'Root Cause': 'Pending Investigation', 'Recommendation': ''},
        {'Case ID': 'CASE-2024-0005', 'Title': 'Marketing SOW Overbilling - Ogilvy Campaign', 'Category': 'SOW Violation', 'Sub-Category': 'Deliverable Overbilling', 'Vendor': 'Ogilvy India', 'Vendor Code': 'V-OGI-012', 'Severity': 'Medium', 'Priority': 'Low', 'Status': 'Triaged', 'Leakage Amount (INR)': 245000, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 245000, 'Detection Method': 'Manual Review', 'Source System': 'Marketing Portal', 'Created Date': '2024-01-22', 'Due Date': '2024-02-08', 'Assignee': 'Vikram Singh', 'Department': 'Marketing Finance', 'Root Cause': 'Deliverables not verified before payment', 'Recommendation': 'Implement deliverable sign-off workflow'},
        {'Case ID': 'CASE-2024-0006', 'Title': 'Duplicate Invoice - Delhivery Jan Billing', 'Category': 'Duplicate Payment', 'Sub-Category': 'Similar Invoice', 'Vendor': 'Delhivery Logistics', 'Vendor Code': 'V-DL-002', 'Severity': 'High', 'Priority': 'High', 'Status': 'Recovered', 'Leakage Amount (INR)': 325000, 'Recovered Amount (INR)': 325000, 'Potential Savings (INR)': 0, 'Detection Method': 'AI Detected', 'Source System': 'Oracle EBS', 'Created Date': '2024-01-15', 'Due Date': '2024-01-25', 'Assignee': 'Priya Sharma', 'Department': 'Accounts Payable', 'Root Cause': 'Invoice number variance not caught', 'Recommendation': 'Enhanced fuzzy matching for invoices'},
        {'Case ID': 'CASE-2024-0007', 'Title': 'Contract Addendum Not Applied - XpressBees Discount', 'Category': 'Contract Violation', 'Sub-Category': 'Addendum Timing', 'Vendor': 'XpressBees', 'Vendor Code': 'V-XB-004', 'Severity': 'Low', 'Priority': 'Low', 'Status': 'Disputed', 'Leakage Amount (INR)': 45000, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 45000, 'Detection Method': 'Rule Based', 'Source System': 'Simplicontract', 'Created Date': '2024-01-20', 'Due Date': '2024-02-20', 'Assignee': 'Amit Verma', 'Department': 'Logistics Finance', 'Root Cause': 'Addendum effective date not communicated', 'Recommendation': 'Automate addendum notification to AP'},
        {'Case ID': 'CASE-2024-0008', 'Title': 'Infrastructure Billing Error - AWS Reserved Instances', 'Category': 'Cloud Billing', 'Sub-Category': 'Unused Reservations', 'Vendor': 'AWS India', 'Vendor Code': 'V-AWS-007', 'Severity': 'High', 'Priority': 'High', 'Status': 'Investigating', 'Leakage Amount (INR)': 890000, 'Recovered Amount (INR)': 0, 'Potential Savings (INR)': 890000, 'Detection Method': 'Usage Analysis', 'Source System': 'Cloud Cost Management', 'Created Date': '2024-01-29', 'Due Date': '2024-02-12', 'Assignee': 'Karthik Reddy', 'Department': 'Cloud Ops', 'Root Cause': 'Unused EC2 reservations', 'Recommendation': 'Implement RI utilization monitoring'},
    ]
    return pd.DataFrame(data)


def generate_recruitment_data():
    """Generate recruitment contracts and invoices"""
    contracts = [
        {'Contract ID': 'CON-REC-001', 'Vendor': 'ABC Recruiters', 'Vendor Type': 'Agency', 'Salary Range Min': 0, 'Salary Range Max': 1000000, 'Fee %': 8.33, 'Replacement Period (Days)': 90, 'Payment Terms': 'Net 30', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31'},
        {'Contract ID': 'CON-REC-001', 'Vendor': 'ABC Recruiters', 'Vendor Type': 'Agency', 'Salary Range Min': 1000001, 'Salary Range Max': 2500000, 'Fee %': 10.0, 'Replacement Period (Days)': 90, 'Payment Terms': 'Net 30', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31'},
        {'Contract ID': 'CON-REC-001', 'Vendor': 'ABC Recruiters', 'Vendor Type': 'Agency', 'Salary Range Min': 2500001, 'Salary Range Max': 99999999, 'Fee %': 12.0, 'Replacement Period (Days)': 90, 'Payment Terms': 'Net 30', 'Contract Start': '2024-01-01', 'Contract End': '2024-12-31'},
    ]

    invoices = []
    candidates = [
        ('Rahul Verma', 'Software Engineer', 'Technology', 1500000, 10.0, 150000),
        ('Meera Nair', 'Product Manager', 'Product', 2800000, 12.0, 336000),
        ('Arjun Patel', 'Data Analyst', 'Analytics', 1200000, 10.0, 120000),
        ('Priyanka Singh', 'UX Designer', 'Design', 1800000, 10.0, 180000),
        ('Karan Mehta', 'DevOps Engineer', 'Technology', 2200000, 10.0, 220000),
    ]

    for i, (name, position, dept, ctc, fee_pct, expected_fee) in enumerate(candidates):
        # Add some discrepancies
        if random.random() < 0.3:
            invoiced = expected_fee + random.randint(10000, 30000)
            status = 'overcharged'
        else:
            invoiced = expected_fee
            status = 'compliant'

        invoices.append({
            'Invoice ID': f'INV-REC-2024-{str(i+1).zfill(4)}',
            'Vendor': 'ABC Recruiters',
            'Invoice Date': (datetime.now() - timedelta(days=random.randint(5, 45))).strftime('%Y-%m-%d'),
            'Candidate Name': name,
            'Position': position,
            'Department': dept,
            'Joining Date': (datetime.now() - timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d'),
            'Candidate CTC (INR)': ctc,
            'Contracted Fee %': fee_pct,
            'Expected Fee (INR)': expected_fee,
            'Invoiced Amount (INR)': invoiced,
            'Discrepancy (INR)': invoiced - expected_fee,
            'Status': status,
            'Contract Ref': 'CON-REC-001',
            'Salary Verified': True
        })

    return pd.DataFrame(contracts), pd.DataFrame(invoices)


def generate_marketing_data():
    """Generate marketing SOW and invoices"""
    sow_data = [
        {'SOW ID': 'SOW-MKT-001', 'Vendor': 'Ogilvy India', 'Project': 'Big Billion Days 2024', 'Campaign Type': 'Digital Campaign', 'Total Value (INR)': 15000000, 'Start Date': '2024-01-01', 'End Date': '2024-03-31', 'Deliverables': 'Social Media (100 posts), Video Ads (20), Display Banners (50)'},
        {'SOW ID': 'SOW-MKT-002', 'Vendor': 'Dentsu India', 'Project': 'Brand Refresh 2024', 'Campaign Type': 'Branding', 'Total Value (INR)': 8000000, 'Start Date': '2024-02-01', 'End Date': '2024-04-30', 'Deliverables': 'Brand Guidelines, Logo Refresh, Collateral Design (25 items)'},
    ]

    invoices = []
    line_items = [
        ('Social Media Posts', 100, 25000, 95),
        ('Video Ads Production', 20, 150000, 18),
        ('Display Banners', 50, 15000, 50),
        ('Campaign Management', 1, 500000, 1),
    ]

    for i, (desc, qty_sow, unit_price, qty_delivered) in enumerate(line_items):
        qty_billed = qty_delivered if random.random() > 0.3 else qty_sow  # Sometimes overbill
        expected = qty_delivered * unit_price
        billed = qty_billed * unit_price

        invoices.append({
            'Invoice ID': f'INV-MKT-2024-{str(i+1).zfill(4)}',
            'Vendor': 'Ogilvy India',
            'Project': 'Big Billion Days 2024',
            'Invoice Date': (datetime.now() - timedelta(days=random.randint(5, 30))).strftime('%Y-%m-%d'),
            'Deliverable': desc,
            'Quantity in SOW': qty_sow,
            'Quantity Delivered': qty_delivered,
            'Quantity Billed': qty_billed,
            'Unit Price (INR)': unit_price,
            'Expected Amount (INR)': expected,
            'Billed Amount (INR)': billed,
            'Variance (INR)': billed - expected,
            'Status': 'overbilled' if billed > expected else ('partial' if qty_delivered < qty_sow else 'delivered'),
            'SOW Ref': 'SOW-MKT-001'
        })

    return pd.DataFrame(sow_data), pd.DataFrame(invoices)


def generate_state_risk_data():
    """Generate India state risk data for supplier risk map"""
    data = [
        {'State Code': 'MH', 'State': 'Maharashtra', 'Risk Level': 'Low', 'Risk Score': 22, 'Suppliers': 85, 'Warehouses': 28, 'Total Spend (INR)': 425000000, 'Key Risk Factor': 'None - Well developed', 'Key Categories': 'IT Services, Logistics, Manufacturing'},
        {'State Code': 'KA', 'State': 'Karnataka', 'Risk Level': 'Low', 'Risk Score': 18, 'Suppliers': 72, 'Warehouses': 22, 'Total Spend (INR)': 380000000, 'Key Risk Factor': 'None - Strong IT hub', 'Key Categories': 'Technology, Software, E-commerce'},
        {'State Code': 'TN', 'State': 'Tamil Nadu', 'Risk Level': 'Moderate', 'Risk Score': 35, 'Suppliers': 58, 'Warehouses': 18, 'Total Spend (INR)': 285000000, 'Key Risk Factor': 'Political - Labor strikes', 'Key Categories': 'Auto Components, Manufacturing'},
        {'State Code': 'DL', 'State': 'Delhi NCR', 'Risk Level': 'Elevated', 'Risk Score': 48, 'Suppliers': 45, 'Warehouses': 35, 'Total Spend (INR)': 320000000, 'Key Risk Factor': 'Pollution - Air quality restrictions', 'Key Categories': 'Warehousing, Distribution'},
        {'State Code': 'GJ', 'State': 'Gujarat', 'Risk Level': 'Low', 'Risk Score': 20, 'Suppliers': 42, 'Warehouses': 15, 'Total Spend (INR)': 195000000, 'Key Risk Factor': 'None - Pro-business', 'Key Categories': 'Chemicals, Textiles'},
        {'State Code': 'WB', 'State': 'West Bengal', 'Risk Level': 'Elevated', 'Risk Score': 52, 'Suppliers': 28, 'Warehouses': 12, 'Total Spend (INR)': 145000000, 'Key Risk Factor': 'Political - Frequent bandhs', 'Key Categories': 'Jute, Tea, Steel'},
        {'State Code': 'UP', 'State': 'Uttar Pradesh', 'Risk Level': 'Moderate', 'Risk Score': 38, 'Suppliers': 52, 'Warehouses': 25, 'Total Spend (INR)': 175000000, 'Key Risk Factor': 'Infrastructure - Developing roads', 'Key Categories': 'FMCG, Agriculture'},
        {'State Code': 'RJ', 'State': 'Rajasthan', 'Risk Level': 'Moderate', 'Risk Score': 42, 'Suppliers': 25, 'Warehouses': 10, 'Total Spend (INR)': 95000000, 'Key Risk Factor': 'Water - Severe scarcity', 'Key Categories': 'Textiles, Marble'},
        {'State Code': 'TS', 'State': 'Telangana', 'Risk Level': 'Low', 'Risk Score': 25, 'Suppliers': 48, 'Warehouses': 16, 'Total Spend (INR)': 245000000, 'Key Risk Factor': 'None - Growing tech hub', 'Key Categories': 'IT Services, Pharma'},
        {'State Code': 'AP', 'State': 'Andhra Pradesh', 'Risk Level': 'Moderate', 'Risk Score': 40, 'Suppliers': 32, 'Warehouses': 14, 'Total Spend (INR)': 125000000, 'Key Risk Factor': 'Natural Disaster - Cyclone prone', 'Key Categories': 'Aquaculture, Agriculture'},
        {'State Code': 'KL', 'State': 'Kerala', 'Risk Level': 'Elevated', 'Risk Score': 45, 'Suppliers': 22, 'Warehouses': 8, 'Total Spend (INR)': 85000000, 'Key Risk Factor': 'Labor - Strong unions', 'Key Categories': 'Spices, Rubber'},
        {'State Code': 'HR', 'State': 'Haryana', 'Risk Level': 'Low', 'Risk Score': 28, 'Suppliers': 38, 'Warehouses': 20, 'Total Spend (INR)': 165000000, 'Key Risk Factor': 'None - Good NCR proximity', 'Key Categories': 'Auto, Manufacturing'},
        {'State Code': 'AS', 'State': 'Assam', 'Risk Level': 'High', 'Risk Score': 65, 'Suppliers': 12, 'Warehouses': 5, 'Total Spend (INR)': 42000000, 'Key Risk Factor': 'Connectivity - Poor roads', 'Key Categories': 'Tea, Oil & Gas'},
        {'State Code': 'JK', 'State': 'Jammu & Kashmir', 'Risk Level': 'Severe', 'Risk Score': 78, 'Suppliers': 5, 'Warehouses': 2, 'Total Spend (INR)': 18000000, 'Key Risk Factor': 'Security - Operational concerns', 'Key Categories': 'Handicrafts, Horticulture'},
        {'State Code': 'BR', 'State': 'Bihar', 'Risk Level': 'High', 'Risk Score': 62, 'Suppliers': 10, 'Warehouses': 6, 'Total Spend (INR)': 35000000, 'Key Risk Factor': 'Infrastructure - Poor roads', 'Key Categories': 'Agriculture, Food Processing'},
    ]
    return pd.DataFrame(data)


def generate_duplicate_invoices():
    """Generate duplicate invoice detection data"""
    data = [
        {'Detection ID': 'DUP-001', 'Original Invoice': 'INV-BD-2024-1234', 'Duplicate Invoice': 'INV-BD-2024-1234-A', 'Vendor': 'BlueDart Express', 'Amount (INR)': 485000, 'Original Date': '2024-01-10', 'Duplicate Date': '2024-01-25', 'Match Type': 'Exact Invoice Number', 'Confidence': 99, 'Status': 'Confirmed Duplicate', 'Action': 'Recovery Initiated'},
        {'Detection ID': 'DUP-002', 'Original Invoice': 'INV-DL-2024-5678', 'Duplicate Invoice': 'INV-DL-2024-5679', 'Vendor': 'Delhivery Logistics', 'Amount (INR)': 325000, 'Original Date': '2024-01-05', 'Duplicate Date': '2024-01-18', 'Match Type': 'Similar Amount + Date', 'Confidence': 92, 'Status': 'Confirmed Duplicate', 'Action': 'Recovered'},
        {'Detection ID': 'DUP-003', 'Original Invoice': 'INV-SE-2024-9012', 'Duplicate Invoice': 'INV-SE-2024-9013', 'Vendor': 'SafeExpress', 'Amount (INR)': 178000, 'Original Date': '2024-01-12', 'Duplicate Date': '2024-01-12', 'Match Type': 'Same Day + Vendor + Amount', 'Confidence': 95, 'Status': 'Under Review', 'Action': 'Investigating'},
    ]
    return pd.DataFrame(data)


def generate_excel():
    """Generate the master Excel file with all data"""
    print("Generating Procurement Master Data Excel...")

    with pd.ExcelWriter(OUTPUT_FILE, engine='openpyxl') as writer:
        # Summary sheet
        summary = pd.DataFrame({
            'Sheet Name': ['Transactions', 'Vendors', 'Rate_Cards', 'Logistics_Invoices',
                          'SaaS_Contracts', 'SaaS_Invoices', 'Leakage_Cases',
                          'Recruitment_Contracts', 'Recruitment_Invoices',
                          'Marketing_SOW', 'Marketing_Invoices', 'State_Risk_Data',
                          'Duplicate_Invoices'],
            'Description': [
                'All procurement transactions with lifecycle tracking',
                'Master vendor database with contact and compliance info',
                'Logistics vendor rate cards by route and vehicle type',
                'Logistics invoices with discrepancy analysis',
                'SaaS/Software license contracts',
                'SaaS invoices with utilization tracking',
                'Leakage detection cases with recovery status',
                'Recruitment agency fee structures',
                'Recruitment invoices with fee verification',
                'Marketing Statement of Work data',
                'Marketing invoices with deliverable tracking',
                'India state-wise procurement risk assessment',
                'Duplicate invoice detection results'
            ],
            'Record Count': [150, 12, 160, 50, 6, 12, 8, 3, 5, 2, 4, 15, 3]
        })
        summary.to_excel(writer, sheet_name='Summary', index=False)

        # Generate and write all data sheets
        generate_transactions().to_excel(writer, sheet_name='Transactions', index=False)
        generate_vendors().to_excel(writer, sheet_name='Vendors', index=False)
        generate_rate_cards().to_excel(writer, sheet_name='Rate_Cards', index=False)
        generate_logistics_invoices().to_excel(writer, sheet_name='Logistics_Invoices', index=False)
        generate_saas_contracts().to_excel(writer, sheet_name='SaaS_Contracts', index=False)
        generate_saas_invoices().to_excel(writer, sheet_name='SaaS_Invoices', index=False)
        generate_leakage_cases().to_excel(writer, sheet_name='Leakage_Cases', index=False)

        rec_contracts, rec_invoices = generate_recruitment_data()
        rec_contracts.to_excel(writer, sheet_name='Recruitment_Contracts', index=False)
        rec_invoices.to_excel(writer, sheet_name='Recruitment_Invoices', index=False)

        mkt_sow, mkt_invoices = generate_marketing_data()
        mkt_sow.to_excel(writer, sheet_name='Marketing_SOW', index=False)
        mkt_invoices.to_excel(writer, sheet_name='Marketing_Invoices', index=False)

        generate_state_risk_data().to_excel(writer, sheet_name='State_Risk_Data', index=False)
        generate_duplicate_invoices().to_excel(writer, sheet_name='Duplicate_Invoices', index=False)

    print(f"Excel file generated successfully: {OUTPUT_FILE}")
    return OUTPUT_FILE


if __name__ == '__main__':
    generate_excel()
