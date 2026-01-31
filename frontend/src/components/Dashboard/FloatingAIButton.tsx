/**
 * Floating AI Button (FAB)
 * Professional button with cycling tooltip hints using shadcn/ui
 */
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore } from '@/store/appStore';
import { getRandomPrompt } from '@/data/prompts';

export function FloatingAIButton() {
    const { openCommandPalette } = useAppStore();
    const [hint, setHint] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);

    // Cycle through hints every 12-18 seconds
    useEffect(() => {
        const displayHint = () => {
            const prompt = getRandomPrompt();
            setHint(`Try: "${prompt}"`);
            setShowHint(true);
            // Hide after 5 seconds
            setTimeout(() => setShowHint(false), 5000);
        };

        // Initial hint after 3 seconds
        const initialTimeout = setTimeout(displayHint, 3000);

        // Then every 12-18 seconds
        const interval = setInterval(() => {
            displayHint();
        }, 12000 + Math.random() * 6000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <TooltipProvider>
            <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-30">
                {/* Floating Hint Card */}
                {showHint && hint && (
                    <div className="absolute bottom-full right-0 mb-3 w-64 md:w-72 animate-slide-up">
                        <div className="bg-card border border-border rounded-lg p-3 md:p-4 shadow-lg">
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{hint}</p>
                        </div>
                    </div>
                )}

                {/* FAB Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={openCommandPalette}
                            size="lg"
                            className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-primary"
                        >
                            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="sr-only">Open AI Command Palette</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="flex flex-col gap-1">
                        <span className="font-medium">Ask AI</span>
                        <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">Ctrl+K</kbd>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
