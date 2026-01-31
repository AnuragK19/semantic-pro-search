/**
 * Action Handler Component
 * Processes AI responses and triggers appropriate visual feedback
 */
import { useEffect } from 'react';
import { useAppStore, type ActionResult } from '@/store/appStore';
import { mockUsers, mockMetrics } from '@/data/mockData';

export function ActionHandler() {
    const {
        currentAction,
        setCurrentAction,
        setFilters,
        addChartOverlay,
        addScheduledJob,
        addUserTag,
        addToast,
        showDangerModal,
        setIsScanning,
        setScanResults,
        setTransformingField,
        setMergeProgress,
        setTaggingProgress,
        setLastAIAction,
    } = useAppStore();

    useEffect(() => {
        if (!currentAction) return;

        handleAction(currentAction);
        // Clear action after processing
        setTimeout(() => setCurrentAction(null), 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAction]);

    const handleAction = (action: ActionResult) => {
        const { action: actionType, params } = action;

        // Track last AI action for feedback strip
        if (actionType !== 'UNKNOWN') {
            setLastAIAction({ action: actionType, params });
        }

        switch (actionType) {
            case 'FILTER_SEGMENT':
                handleFilterSegment(params);
                break;
            case 'COMPARE_METRICS':
                handleCompareMetrics(params);
                break;
            case 'BULK_TAG':
                handleBulkTag(params);
                break;
            case 'REVOKE_ACCESS':
                handleRevokeAccess(params);
                break;
            case 'SIMULATE_PROJECTION':
                handleSimulateProjection(params);
                break;
            case 'SCAN_ANOMALIES':
                handleScanAnomalies();
                break;
            case 'SCHEDULE_JOB':
                handleScheduleJob(params);
                break;
            case 'TRIGGER_WEBHOOK':
                handleTriggerWebhook(params);
                break;
            case 'DATA_TRANSFORMATION':
                handleDataTransformation(params);
                break;
            case 'MERGE_DUPLICATES':
                handleMergeDuplicates(params);
                break;
            case 'UNKNOWN':
            default:
                addToast({
                    type: 'error',
                    title: 'Unknown Command',
                    message: 'Sorry, I couldn\'t understand that request. Try one of the suggested prompts.',
                });
        }
    };

    // Action Handlers

    const handleFilterSegment = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        setFilters({
            segment: params.segment as string | undefined,
            location: params.location as string | undefined,
            timeRange: params.time_range as string | undefined,
        });

        const filterParts = [];
        if (params.segment) filterParts.push(params.segment);
        if (params.location) filterParts.push(`from ${params.location}`);
        if (params.time_range) filterParts.push(`(${(params.time_range as string).replace('_', ' ')})`);

        addToast({
            type: 'success',
            title: 'Filters Applied',
            message: `Showing ${filterParts.join(' ')} users`,
        });
    };

    const handleCompareMetrics = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        const comparisonData = mockMetrics.map((m) => ({
            date: m.date,
            value: m.revenue * (0.85 + Math.random() * 0.15),
        }));

        addChartOverlay({
            id: `comparison-${Date.now()}`,
            type: 'comparison',
            data: comparisonData,
            label: `${params.metric} (${params.period_b})`,
            color: '#f59e0b',
        });

        addToast({
            type: 'info',
            title: 'Comparison Added',
            message: `Comparing ${params.metric}: ${params.period_a} vs ${params.period_b}`,
        });
    };

    const handleBulkTag = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        const matchingUsers = mockUsers.filter((u) => {
            if ((params.criteria as string)?.includes('spend > 5000')) {
                return u.spend > 5000;
            }
            return true;
        });

        const total = matchingUsers.length;
        setTaggingProgress({ total, current: 0 });

        let current = 0;
        const interval = setInterval(() => {
            current += 1;
            setTaggingProgress({ total, current });

            if (current >= total) {
                clearInterval(interval);
                setTaggingProgress(null);

                matchingUsers.forEach((user) => {
                    addUserTag(user.id, params.tag as string);
                });

                addToast({
                    type: 'success',
                    title: 'Tagging Complete',
                    message: `Tagged ${total} users as "${params.tag}"`,
                });
            }
        }, 100);
    };

    const handleRevokeAccess = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        showDangerModal({
            title: 'Revoke Access',
            message: `This will revoke ${params.role} access for users who haven't logged in for 30+ days. This action cannot be undone.`,
            onConfirm: () => {
                setTimeout(() => {
                    addToast({
                        type: 'warning',
                        title: 'Access Revoked',
                        message: `Revoked ${params.role} access for 3 inactive users`,
                    });
                }, 1000);
            },
        });
    };

    const handleSimulateProjection = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        addToast({
            type: 'info',
            title: 'Running Simulation...',
            message: `Projecting ${params.target} with ${params.change_percentage}% ${params.variable} change`,
        });

        setTimeout(() => {
            const changeMultiplier = 1 + (params.change_percentage as number) / 100;
            const projectionData = mockMetrics.map((m) => ({
                date: m.date,
                value: m.revenue * changeMultiplier * (0.95 + Math.random() * 0.1),
            }));

            addChartOverlay({
                id: `projection-${Date.now()}`,
                type: 'projection',
                data: projectionData,
                label: `Projected (${(params.change_percentage as number) > 0 ? '+' : ''}${params.change_percentage}% ${params.variable})`,
                color: '#a855f7',
            });

            addToast({
                type: 'success',
                title: 'Simulation Complete',
                message: `Projection shows ~${Math.round((changeMultiplier - 1) * 100)}% ${params.target} impact`,
            });
        }, 2000);
    };

    const handleScanAnomalies = () => {
        setIsScanning(true);
        setScanResults(null);

        setTimeout(() => {
            setIsScanning(false);
            setScanResults([
                { type: 'Failed Login Attempts', count: 47, severity: 'medium' },
                { type: 'Unusual IP Locations', count: 12, severity: 'high' },
                { type: 'After-hours Access', count: 23, severity: 'low' },
            ]);

            addToast({
                type: 'warning',
                title: 'Scan Complete',
                message: 'Found 82 potential security events',
            });
        }, 3000);
    };

    const handleScheduleJob = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        const job = {
            id: `job-${Date.now()}`,
            name: `${(params.job_type as string).replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} - Scheduled`,
            type: params.job_type as string,
            schedule: `${(params.recurrence as string).charAt(0).toUpperCase() + (params.recurrence as string).slice(1)} ${params.day ? `(${params.day})` : ''} at ${params.time}`,
            nextRun: 'Pending...',
            status: 'active' as const,
        };

        addScheduledJob(job);

        addToast({
            type: 'success',
            title: 'Job Scheduled',
            message: `${job.name} will run ${params.recurrence}`,
        });
    };

    const handleTriggerWebhook = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        addToast({
            type: 'info',
            title: `Connecting to ${(params.destination as string).charAt(0).toUpperCase() + (params.destination as string).slice(1)}...`,
            message: 'Syncing data from current view',
        });

        setTimeout(() => {
            addToast({
                type: 'success',
                title: 'Sync Complete! ✓',
                message: `Successfully synced 50 records to ${params.destination}`,
            });
        }, 2500);
    };

    const handleDataTransformation = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        setTransformingField(params.field as string);

        setTimeout(() => {
            setTransformingField(null);
            addToast({
                type: 'success',
                title: 'Data Transformed',
                message: `All ${params.field} values now in ${params.format} format`,
            });
        }, 1500);
    };

    const handleMergeDuplicates = (params: Record<string, unknown> | undefined) => {
        if (!params) return;

        const found = 12;
        setMergeProgress({ found, merged: 0 });

        let merged = 0;
        const interval = setInterval(() => {
            merged += 1;
            setMergeProgress({ found, merged });

            if (merged >= found) {
                clearInterval(interval);
                setTimeout(() => {
                    setMergeProgress(null);
                    addToast({
                        type: 'success',
                        title: 'Merge Complete',
                        message: `Successfully merged ${found} duplicate records by ${params.match_key}`,
                    });
                }, 500);
            }
        }, 200);
    };

    return null;
}
