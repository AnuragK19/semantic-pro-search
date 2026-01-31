/**
 * Sample Prompts Data
 * Organized by 5 categories for the Command Palette empty state
 */

export interface PromptCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    prompts: string[];
}

export const promptCategories: PromptCategory[] = [
    {
        id: 'analytics',
        name: 'SQL / Analysis',
        icon: '📊',
        color: 'from-blue-500 to-cyan-500',
        prompts: [
            'Show me enterprise users from Japan.',
            'Filter for users who joined last week.',
            'Compare churn rate: this month vs last November.',
        ],
    },
    {
        id: 'bulk',
        name: 'Bulk Actions',
        icon: '⚡',
        color: 'from-amber-500 to-orange-500',
        prompts: [
            "Tag all users with > $5k spend as 'VIP'.",
            'Revoke admin access for inactive users (>30 days).',
        ],
    },
    {
        id: 'simulations',
        name: 'Simulations',
        icon: '🔮',
        color: 'from-purple-500 to-pink-500',
        prompts: [
            'What happens to revenue if we raise prices by 20%?',
            'Scan logs for suspicious login anomalies.',
        ],
    },
    {
        id: 'automation',
        name: 'Automation',
        icon: '🤖',
        color: 'from-emerald-500 to-teal-500',
        prompts: [
            'Email me a PDF of this report every Monday at 9 AM.',
            'Sync these 50 leads to HubSpot.',
        ],
    },
    {
        id: 'cleanup',
        name: 'Cleanup',
        icon: '🧹',
        color: 'from-rose-500 to-red-500',
        prompts: [
            'Fix phone numbers to E.164 format.',
            'Merge duplicate accounts by email.',
        ],
    },
];

// Flat list of all prompts for cycling hints
export const allPrompts: string[] = promptCategories.flatMap((cat) => cat.prompts);

// Get random prompt for FAB hints
export const getRandomPrompt = (): string => {
    return allPrompts[Math.floor(Math.random() * allPrompts.length)] as string;
};
