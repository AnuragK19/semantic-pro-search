/**
 * AI Feedback Strip Component
 * Shows the last AI action with undo capability
 */
import { Sparkles, X, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

export function AIFeedbackStrip() {
    const { lastAIAction, clearFilters, clearChartOverlays } = useAppStore();

    if (!lastAIAction) return null;

    const handleUndo = () => {
        // Clear relevant state based on action type
        if (lastAIAction.action === 'FILTER_SEGMENT') {
            clearFilters();
        } else if (lastAIAction.action === 'COMPARE_METRICS' || lastAIAction.action === 'SIMULATE_PROJECTION') {
            clearChartOverlays();
        }
        useAppStore.getState().clearLastAIAction();
    };

    const handleDismiss = () => {
        useAppStore.getState().clearLastAIAction();
    };

    // Format action for display
    const formatAction = (action: string, params?: Record<string, unknown>) => {
        switch (action) {
            case 'FILTER_SEGMENT':
                return `Filtered by "${params?.segment || params?.location || 'criteria'}"`;
            case 'COMPARE_METRICS':
                return `Comparing ${params?.metric || 'metrics'}: ${params?.period_a} vs ${params?.period_b}`;
            case 'BULK_TAG':
                return `Tagged ${params?.criteria || 'records'} as "${params?.tag}"`;
            case 'SIMULATE_PROJECTION':
                return `Projected ${params?.change_percentage}% ${params?.variable} change`;
            case 'SCAN_ANOMALIES':
                return 'Scanned for security anomalies';
            case 'SCHEDULE_JOB':
                return `Scheduled ${params?.job_type} job`;
            case 'TRIGGER_WEBHOOK':
                return `Synced data to ${params?.destination}`;
            case 'DATA_TRANSFORMATION':
                return `Transformed ${params?.field} to ${params?.format}`;
            case 'MERGE_DUPLICATES':
                return `Merged duplicates by ${params?.match_key}`;
            default:
                return action.replace('_', ' ').toLowerCase();
        }
    };

    const timeAgo = () => {
        const diff = Date.now() - lastAIAction.timestamp;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins === 1) return '1m ago';
        return `${mins}m ago`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-2.5">
                {/* AI Icon */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-500/10">
                    <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                </div>

                {/* Action Text */}
                <div className="flex-1 min-w-0">
                    <span className="text-sm">
                        <span className="font-medium text-orange-600">AI Applied:</span>{' '}
                        <span className="text-foreground">{formatAction(lastAIAction.action, lastAIAction.params)}</span>
                        <span className="text-muted-foreground"> • {timeAgo()}</span>
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUndo}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <Undo2 className="h-3.5 w-3.5 mr-1" />
                        Undo
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDismiss}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
