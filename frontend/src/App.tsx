/**
 * Pro Semantic Command Palette
 * AI-Centric Command Center Layout
 */
import { MiniSidebar, MobileNav, HeroCommandBar, AIFeedbackStrip, MobileFAB } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { CommandPalette } from '@/components/CommandPalette';
import { ActionHandler } from '@/components/ActionHandler';
import { ToastContainer, DangerModal } from '@/components/ui';
import '@/index.css';

function App() {
    return (
        <div className="flex min-h-screen bg-muted/30 w-full overflow-x-hidden">
            {/* Desktop Sidebar */}
            <MiniSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:ml-16">
                {/* Mobile Sticky Header */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:hidden">
                    <div className="flex items-center gap-2">
                        <MobileNav />
                        <span className="font-semibold">Semantic Pro</span>
                    </div>
                    {/* Ask AI removed as per request - mostly redundant with FAB */}
                </header>

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-6 space-y-6 w-full">
                    {/* Desktop Hero Command Bar */}
                    <div className="hidden md:block">
                        <HeroCommandBar />
                    </div>

                    {/* AI Feedback Strip */}
                    <AIFeedbackStrip />

                    {/* Dashboard Content */}
                    <Dashboard />
                </div>
            </main>

            {/* Mobile Floating Action Button */}
            <MobileFAB />

            {/* Command Palette Modal */}
            <CommandPalette />

            {/* Action Handler (processes AI responses) */}
            <ActionHandler />

            {/* UI Overlays */}
            <ToastContainer />
            <DangerModal />
        </div>
    );
}

export default App;
