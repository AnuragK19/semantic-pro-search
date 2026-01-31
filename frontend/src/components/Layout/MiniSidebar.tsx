/**
 * Mini Sidebar Component
 * Icon-only navigation rail with tooltips
 */
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Calendar,
    Settings,
    Sparkles,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
    icon: React.ElementType;
    label: string;
    active?: boolean;
}

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Calendar, label: 'Scheduled Jobs' },
];

const bottomItems: NavItem[] = [
    { icon: Settings, label: 'Settings' },
];

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function MiniSidebar() {
    return (
        <TooltipProvider delayDuration={0}>
            <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-16 flex-col border-r border-border bg-background">
                {/* Logo */}
                <div className="flex h-16 items-center justify-center border-b border-border">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                        <Sparkles className="h-5 w-5" />
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-1 flex-col items-center gap-2 py-4">
                    {navItems.map((item) => (
                        <NavButton key={item.label} item={item} />
                    ))}
                </nav>

                {/* Bottom Navigation */}
                <div className="flex flex-col items-center gap-2 border-t border-border py-4">
                    {bottomItems.map((item) => (
                        <NavButton key={item.label} item={item} />
                    ))}
                </div>
            </aside>
        </TooltipProvider>
    );
}

export function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                    <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <SheetHeader className="border-b pb-4 mb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="font-bold">Semantic Pro</span>
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <MobileNavButton key={item.label} item={item} />
                    ))}
                    <div className="my-2 border-t" />
                    {bottomItems.map((item) => (
                        <MobileNavButton key={item.label} item={item} />
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

function MobileNavButton({ item }: { item: NavItem }) {
    const Icon = item.icon;
    return (
        <button
            className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
        >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
        </button>
    );
}

function NavButton({ item }: { item: NavItem }) {
    const Icon = item.icon;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                        item.active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
                {item.label}
            </TooltipContent>
        </Tooltip>
    );
}
