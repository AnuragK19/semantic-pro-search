/**
 * App Store - Zustand State Management
 * Manages command palette, actions, dashboard state
 */
import { create } from 'zustand';
import type { ScheduledJob } from '@/data/mockData';

export interface ActionResult {
    action: string;
    params?: Record<string, unknown>;
    error?: string;
    rate_limit?: {
        remaining: number;
        used: number;
        limit: number;
    };
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
}

export interface ChartOverlay {
    id: string;
    type: 'comparison' | 'projection';
    data: Array<{ date: string; value: number }>;
    label: string;
    color: string;
}

interface AppState {
    // Command Palette
    isCommandPaletteOpen: boolean;
    openCommandPalette: () => void;
    closeCommandPalette: () => void;
    toggleCommandPalette: () => void;

    // Current Action
    currentAction: ActionResult | null;
    isProcessing: boolean;
    setCurrentAction: (action: ActionResult | null) => void;
    setIsProcessing: (processing: boolean) => void;

    // Dashboard Filters
    filters: {
        segment?: string;
        location?: string;
        timeRange?: string;
    };
    setFilters: (filters: Partial<AppState['filters']>) => void;
    clearFilters: () => void;

    // Chart Overlays
    chartOverlays: ChartOverlay[];
    addChartOverlay: (overlay: ChartOverlay) => void;
    removeChartOverlay: (id: string) => void;
    clearChartOverlays: () => void;

    // Scheduled Jobs
    scheduledJobs: ScheduledJob[];
    addScheduledJob: (job: ScheduledJob) => void;

    // User Tags (for bulk operations)
    userTags: Record<string, string[]>;
    addUserTag: (userId: string, tag: string) => void;

    // Toasts
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;

    // Modals
    dangerModal: {
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    } | null;
    showDangerModal: (modal: { title: string; message: string; onConfirm: () => void }) => void;
    closeDangerModal: () => void;

    // Scanning State
    isScanning: boolean;
    scanResults: { type: string; count: number; severity: string }[] | null;
    setIsScanning: (scanning: boolean) => void;
    setScanResults: (results: { type: string; count: number; severity: string }[] | null) => void;

    // Data Transformation
    transformingField: string | null;
    setTransformingField: (field: string | null) => void;

    // Merge Progress
    mergeProgress: { found: number; merged: number } | null;
    setMergeProgress: (progress: { found: number; merged: number } | null) => void;

    // Tagging Progress
    taggingProgress: { total: number; current: number } | null;
    setTaggingProgress: (progress: { total: number; current: number } | null) => void;

    // Last AI Action (for feedback strip)
    lastAIAction: { action: string; params?: Record<string, unknown>; timestamp: number } | null;
    setLastAIAction: (action: { action: string; params?: Record<string, unknown> }) => void;
    clearLastAIAction: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Command Palette
    isCommandPaletteOpen: false,
    openCommandPalette: () => set({ isCommandPaletteOpen: true }),
    closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
    toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

    // Current Action
    currentAction: null,
    isProcessing: false,
    setCurrentAction: (action) => set({ currentAction: action }),
    setIsProcessing: (processing) => set({ isProcessing: processing }),

    // Dashboard Filters
    filters: {},
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    clearFilters: () => set({ filters: {} }),

    // Chart Overlays
    chartOverlays: [],
    addChartOverlay: (overlay) => set((state) => ({ chartOverlays: [...state.chartOverlays, overlay] })),
    removeChartOverlay: (id) => set((state) => ({ chartOverlays: state.chartOverlays.filter((o) => o.id !== id) })),
    clearChartOverlays: () => set({ chartOverlays: [] }),

    // Scheduled Jobs
    scheduledJobs: [],
    addScheduledJob: (job) => set((state) => ({ scheduledJobs: [...state.scheduledJobs, job] })),

    // User Tags
    userTags: {},
    addUserTag: (userId, tag) => set((state) => ({
        userTags: {
            ...state.userTags,
            [userId]: [...(state.userTags[userId] || []), tag],
        },
    })),

    // Toasts
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).slice(2, 9);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        // Auto-remove after 5 seconds
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 5000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

    // Modals
    dangerModal: null,
    showDangerModal: (modal) => set({ dangerModal: { isOpen: true, ...modal } }),
    closeDangerModal: () => set({ dangerModal: null }),

    // Scanning
    isScanning: false,
    scanResults: null,
    setIsScanning: (scanning) => set({ isScanning: scanning }),
    setScanResults: (results) => set({ scanResults: results }),

    // Transformation
    transformingField: null,
    setTransformingField: (field) => set({ transformingField: field }),

    // Merge
    mergeProgress: null,
    setMergeProgress: (progress) => set({ mergeProgress: progress }),

    // Tagging
    taggingProgress: null,
    setTaggingProgress: (progress) => set({ taggingProgress: progress }),

    // Last AI Action
    lastAIAction: null,
    setLastAIAction: (action) => set({ lastAIAction: { ...action, timestamp: Date.now() } }),
    clearLastAIAction: () => set({ lastAIAction: null }),
}));
