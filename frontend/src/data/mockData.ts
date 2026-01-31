/**
 * Mock Data for Dashboard
 * Simulates a SaaS Analytics Dashboard with users, metrics, and activity
 */

export interface User {
    id: string;
    name: string;
    email: string;
    company: string;
    segment: 'enterprise' | 'startup' | 'smb' | 'free';
    location: string;
    spend: number;
    joinedAt: string;
    lastLogin: string;
    tags: string[];
    phone: string;
}

export interface Metric {
    date: string;
    revenue: number;
    churn: number;
    users: number;
    mrr: number;
}

export interface ScheduledJob {
    id: string;
    name: string;
    type: string;
    schedule: string;
    nextRun: string;
    status: 'active' | 'paused';
}

// Generate mock users
export const mockUsers: User[] = [
    { id: '1', name: 'Yuki Tanaka', email: 'yuki@acme.jp', company: 'Acme Corp', segment: 'enterprise', location: 'Japan', spend: 12500, joinedAt: '2024-01-15', lastLogin: '2024-01-28', tags: ['VIP'], phone: '+81-3-1234-5678' },
    { id: '2', name: 'Hans Mueller', email: 'hans@tech.de', company: 'TechGmbH', segment: 'enterprise', location: 'Germany', spend: 8900, joinedAt: '2024-01-20', lastLogin: '2024-01-25', tags: [], phone: '+49 30 12345678' },
    { id: '3', name: 'Sarah Chen', email: 'sarah@startup.io', company: 'StartupIO', segment: 'startup', location: 'USA', spend: 2400, joinedAt: '2024-01-22', lastLogin: '2024-01-30', tags: [], phone: '(415) 555-0123' },
    { id: '4', name: 'Pierre Dubois', email: 'pierre@corp.fr', company: 'CorpFR', segment: 'enterprise', location: 'France', spend: 15200, joinedAt: '2023-11-10', lastLogin: '2024-01-29', tags: ['VIP', 'Priority'], phone: '+33 1 23 45 67 89' },
    { id: '5', name: 'Maria Garcia', email: 'maria@smb.es', company: 'SMB España', segment: 'smb', location: 'Spain', spend: 1100, joinedAt: '2024-01-25', lastLogin: '2024-01-30', tags: [], phone: '612 345 678' },
    { id: '6', name: 'Kenji Yamamoto', email: 'kenji@bigco.jp', company: 'BigCo Japan', segment: 'enterprise', location: 'Japan', spend: 22000, joinedAt: '2023-12-05', lastLogin: '2024-01-28', tags: ['VIP', 'Strategic'], phone: '03-9876-5432' },
    { id: '7', name: 'Emily Watson', email: 'emily@venture.uk', company: 'Venture UK', segment: 'startup', location: 'UK', spend: 3200, joinedAt: '2024-01-18', lastLogin: '2024-01-27', tags: [], phone: '020 7123 4567' },
    { id: '8', name: 'Alex Kim', email: 'alex@free.com', company: 'Freelancer', segment: 'free', location: 'USA', spend: 0, joinedAt: '2024-01-28', lastLogin: '2024-01-30', tags: [], phone: '555-0199' },
    { id: '9', name: 'Sofia Rossi', email: 'sofia@enterprise.it', company: 'Enterprise IT', segment: 'enterprise', location: 'Italy', spend: 7800, joinedAt: '2023-10-20', lastLogin: '2023-12-15', tags: [], phone: '+39 02 1234567' },
    { id: '10', name: 'James Wilson', email: 'james@admin.com', company: 'AdminCo', segment: 'smb', location: 'USA', spend: 950, joinedAt: '2024-01-10', lastLogin: '2023-12-01', tags: ['admin'], phone: '(212) 555-0145' },
];

// Generate mock metrics for charts
export const mockMetrics: Metric[] = [
    { date: '2023-07', revenue: 125000, churn: 2.1, users: 1250, mrr: 125000 },
    { date: '2023-08', revenue: 132000, churn: 1.9, users: 1320, mrr: 132000 },
    { date: '2023-09', revenue: 141000, churn: 2.3, users: 1410, mrr: 141000 },
    { date: '2023-10', revenue: 148000, churn: 1.8, users: 1480, mrr: 148000 },
    { date: '2023-11', revenue: 152000, churn: 2.5, users: 1520, mrr: 152000 },
    { date: '2023-12', revenue: 165000, churn: 2.0, users: 1650, mrr: 165000 },
    { date: '2024-01', revenue: 178000, churn: 1.7, users: 1780, mrr: 178000 },
];

// Mock scheduled jobs
export const mockScheduledJobs: ScheduledJob[] = [
    { id: '1', name: 'Weekly Revenue Report', type: 'export_pdf', schedule: 'Every Monday 9:00 AM', nextRun: '2024-02-05 09:00', status: 'active' },
    { id: '2', name: 'Daily Backup', type: 'backup', schedule: 'Daily 2:00 AM', nextRun: '2024-02-01 02:00', status: 'active' },
];

// Stats summary
export const dashboardStats = {
    totalRevenue: '$178,000',
    revenueChange: '+8.5%',
    activeUsers: '1,780',
    usersChange: '+7.9%',
    churnRate: '1.7%',
    churnChange: '-0.3%',
    mrr: '$178,000',
    mrrChange: '+8.5%',
};
