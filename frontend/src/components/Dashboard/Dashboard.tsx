/**
 * Dashboard Component - Bento Grid Layout
 * AI-Centric Command Center design
 */
import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Activity,
    Clock,
    Tag,
    X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAppStore } from '@/store/appStore';
import { mockUsers, mockMetrics, mockScheduledJobs, dashboardStats } from '@/data/mockData';

export function Dashboard() {
    const {
        filters,
        clearFilters,
        chartOverlays,
        removeChartOverlay,
        scheduledJobs,
        userTags,
        isScanning,
        scanResults,
        transformingField,
        mergeProgress,
        taggingProgress,
    } = useAppStore();

    // Filter users based on current filters
    const filteredUsers = useMemo(() => {
        return mockUsers.filter((user) => {
            if (filters.segment && user.segment !== filters.segment.toLowerCase()) return false;
            if (filters.location && !user.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
            return true;
        });
    }, [filters]);

    // Combine chart data with overlays
    const chartData = useMemo(() => {
        return mockMetrics.map((metric) => {
            const point: Record<string, unknown> = { ...metric };
            chartOverlays.forEach((overlay) => {
                const overlayPoint = overlay.data.find((d) => d.date === metric.date);
                if (overlayPoint) {
                    point[overlay.id] = overlayPoint.value;
                }
            });
            return point;
        });
    }, [chartOverlays]);

    const allScheduledJobs = [...mockScheduledJobs, ...scheduledJobs];

    return (
        <div className="space-y-4">
            {/* Active Filters Banner */}
            {Object.keys(filters).length > 0 && (
                <Card className="border-orange-500/20 bg-orange-500/5">
                    <CardContent className="py-3 flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Active Filters:</span>
                        {filters.segment && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                Segment: {filters.segment}
                            </Badge>
                        )}
                        {filters.location && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                Location: {filters.location}
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto h-7 text-xs">
                            Clear all
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Scanning Progress */}
            {isScanning && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
                                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-medium text-blue-600">Scanning for Anomalies...</h3>
                                <p className="text-sm text-muted-foreground">Analyzing login logs and security events</p>
                            </div>
                        </div>
                        <Progress value={66} className="mt-4" />
                    </CardContent>
                </Card>
            )}

            {/* Scan Results */}
            {scanResults && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-amber-600 text-base">
                            <Activity className="w-4 h-4" />
                            Security Scan Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {scanResults.map((result, i) => (
                                <div
                                    key={i}
                                    className={`rounded-lg border p-3 ${result.severity === 'high'
                                        ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
                                        : result.severity === 'medium'
                                            ? 'border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10'
                                            : 'border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10'
                                        }`}
                                >
                                    <div className="text-2xl font-bold">{result.count}</div>
                                    <div className="text-sm text-muted-foreground">{result.type}</div>
                                    <Badge
                                        variant="outline"
                                        className={`mt-2 text-xs ${result.severity === 'high'
                                            ? 'text-red-600 border-red-300'
                                            : result.severity === 'medium'
                                                ? 'text-amber-600 border-amber-300'
                                                : 'text-green-600 border-green-300'
                                            }`}
                                    >
                                        {result.severity.toUpperCase()}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tagging/Merge Progress */}
            {(taggingProgress || mergeProgress) && (
                <Card className="border-orange-500/20 bg-orange-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <Tag className="w-5 h-5 text-orange-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {taggingProgress ? 'Tagging Records...' : 'Merging Duplicates...'}
                                </p>
                                <Progress
                                    value={
                                        taggingProgress
                                            ? (taggingProgress.current / taggingProgress.total) * 100
                                            : mergeProgress
                                                ? (mergeProgress.merged / mergeProgress.found) * 100
                                                : 0
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {taggingProgress
                                    ? `${taggingProgress.current}/${taggingProgress.total}`
                                    : `${mergeProgress?.merged}/${mergeProgress?.found}`}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Row 1: Metric Cards (Bento Grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={<DollarSign className="w-4 h-4" />}
                    label="Total Revenue"
                    value={dashboardStats.totalRevenue}
                    change={dashboardStats.revenueChange}
                    positive
                />
                <MetricCard
                    icon={<Users className="w-4 h-4" />}
                    label="Active Users"
                    value={dashboardStats.activeUsers}
                    change={dashboardStats.usersChange}
                    positive
                />
                <MetricCard
                    icon={<Activity className="w-4 h-4" />}
                    label="Churn Rate"
                    value={dashboardStats.churnRate}
                    change={dashboardStats.churnChange}
                    positive
                />
                <MetricCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="MRR"
                    value={dashboardStats.mrr}
                    change={dashboardStats.mrrChange}
                    positive
                />
            </div>

            {/* Row 2: Chart (70%) + Scheduled Jobs (30%) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                {/* Revenue Chart */}
                <Card className="lg:col-span-7">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">Revenue & Metrics</CardTitle>
                            {chartOverlays.length > 0 && (
                                <div className="flex gap-1 overflow-x-auto pb-1">
                                    {chartOverlays.map((overlay) => (
                                        <Button
                                            key={overlay.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeChartOverlay(overlay.id)}
                                            className="h-6 text-xs gap-1 whitespace-nowrap"
                                            style={{ borderColor: overlay.color, color: overlay.color }}
                                        >
                                            {overlay.label}
                                            <X className="w-3 h-3" />
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] md:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="date" className="text-xs" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                                    <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} name="Revenue" />
                                    <Line type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2} dot={false} name="MRR" />
                                    {chartOverlays.map((overlay) => (
                                        <Line
                                            key={overlay.id}
                                            type="monotone"
                                            dataKey={overlay.id}
                                            stroke={overlay.color}
                                            strokeWidth={2}
                                            strokeDasharray={overlay.type === 'projection' ? '5 5' : undefined}
                                            dot={false}
                                            name={overlay.label}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Scheduled Jobs */}
                <Card className="lg:col-span-3 flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Scheduled Jobs</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2 overflow-auto max-h-[300px] lg:max-h-none">
                        {allScheduledJobs.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No scheduled jobs</p>
                        ) : (
                            allScheduledJobs.map((job) => (
                                <div key={job.id} className="rounded-lg border bg-muted/30 p-3 min-h-[44px]">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{job.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{job.schedule}</p>
                                        </div>
                                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="shrink-0 text-xs">
                                            {job.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        Next: {job.nextRun}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Row 3: Users Table */}
            <Card className="min-w-0 w-full rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Users ({filteredUsers.length})</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border w-full max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Company</TableHead>
                                    <TableHead>Segment</TableHead>
                                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                                    <TableHead>Spend</TableHead>
                                    <TableHead className={`hidden xl:table-cell ${transformingField === 'phone_number' ? 'animate-glitch' : ''}`}>
                                        Phone
                                    </TableHead>
                                    <TableHead>Tags</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const additionalTags = userTags[user.id] || [];
                                    const allUserTags = [...user.tags, ...additionalTags];
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm">{user.company}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.segment === 'enterprise'
                                                            ? 'text-purple-600 border-purple-300'
                                                            : user.segment === 'startup'
                                                                ? 'text-blue-600 border-blue-300'
                                                                : user.segment === 'smb'
                                                                    ? 'text-green-600 border-green-300'
                                                                    : ''
                                                    }
                                                >
                                                    {user.segment}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm">{user.location}</TableCell>
                                            <TableCell className="text-sm">${user.spend.toLocaleString()}</TableCell>
                                            <TableCell className={`hidden xl:table-cell text-sm ${transformingField === 'phone_number' ? 'animate-glitch' : ''}`}>
                                                {user.phone}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {allUserTags.map((tag, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant={tag === 'VIP' ? 'default' : tag === 'admin' ? 'destructive' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Flat Metric Card (clean, minimal borders)
function MetricCard({
    icon,
    label,
    value,
    change,
    positive,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
    positive?: boolean;
}) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-md bg-muted text-muted-foreground">{icon}</span>
                    <span
                        className={`flex items-center gap-0.5 text-xs ${positive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change}
                    </span>
                </div>
                <div className="text-xl font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
        </Card>
    );
}
