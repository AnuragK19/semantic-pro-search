/**
 * Hero Command Bar Component
 * Floating, centered AI command input with glassmorphism
 */
import { Sparkles, Command } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function HeroCommandBar() {
    const { openCommandPalette } = useAppStore();

    return (
        <div className="w-full max-w-2xl mx-auto">
            <button
                onClick={openCommandPalette}
                className="group w-full flex items-center gap-3 rounded-2xl border border-border bg-background/80 backdrop-blur-xl px-5 py-4 shadow-lg transition-all hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            >
                {/* Left Icon */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                    <Sparkles className="h-4 w-4" />
                </div>

                {/* Placeholder Text */}
                <span className="flex-1 text-left text-muted-foreground group-hover:text-foreground/70 transition-colors">
                    Ask Semantic Pro to analyze, filter, or automate...
                </span>

                {/* Keyboard Shortcut Badge */}
                <div className="hidden sm:flex items-center gap-1 rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-muted-foreground">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                </div>
            </button>
        </div>
    );
}
