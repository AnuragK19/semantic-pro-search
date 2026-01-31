/**
 * Command Palette Component
 * Professional modal with shadcn/ui Dialog and prompt suggestions
 */
import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { promptCategories } from '@/data/prompts';

export function CommandPalette() {
    const { isCommandPaletteOpen, closeCommandPalette, isProcessing, setIsProcessing, setCurrentAction, addToast } = useAppStore();
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isCommandPaletteOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isCommandPaletteOpen]);

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                useAppStore.getState().toggleCommandPalette();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = async (prompt?: string) => {
        const query = prompt || input;
        if (!query.trim() || isProcessing) return;

        setIsProcessing(true);
        closeCommandPalette();
        setInput(''); // Clear input immediately

        try {
            // Determine API URL (Env var for prod, relative for dev/proxy)
            const apiUrl = import.meta.env.VITE_API_URL
                ? `${import.meta.env.VITE_API_URL}/command`
                : '/api/command';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: query }),
            });

            const data = await response.json();

            if (response.status === 429) {
                addToast({
                    type: 'error',
                    title: 'Rate Limit Exceeded',
                    message: 'You have reached the daily limit of 10 commands.',
                });
            } else {
                setCurrentAction(data);
            }
        } catch (error) {
            console.error('Command failed:', error);
            addToast({
                type: 'error',
                title: 'Connection Error',
                message: 'Failed to connect to the AI service.',
            });
        } finally {
            setIsProcessing(false);
            // closeCommandPalette(); // Already closed at start for better UX
        }
    };

    const handlePromptClick = (prompt: string) => {
        setInput(prompt);
        setTimeout(() => handleSubmit(prompt), 100);
    };

    return (
        <Dialog open={isCommandPaletteOpen} onOpenChange={(open) => !open && closeCommandPalette()}>
            <DialogContent className="w-[calc(100%-2rem)] rounded-xl md:w-full max-w-2xl p-0 gap-0 max-h-[85vh] overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>AI Command Palette</DialogTitle>
                </DialogHeader>

                {/* Input Section */}
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </div>
                        <Input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Ask anything... e.g. 'Tag VIP users' or 'Run a revenue simulation'"
                            className="pl-10 pr-16 h-12 text-base"
                            disabled={isProcessing}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                Enter
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Suggestions Section (when input is empty) */}
                {!input && !isProcessing && (
                    <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
                        <div className="flex items-center gap-2 mb-4 md:mb-5">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Try asking...</span>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            {promptCategories.map((category) => (
                                <div key={category.id}>
                                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                                        <span className="text-lg">{category.icon}</span>
                                        <span className="text-sm font-medium">{category.name}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.prompts.map((prompt, i) => (
                                            <Button
                                                key={i}
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handlePromptClick(prompt)}
                                                className="h-auto py-2 px-3 text-sm text-left font-normal whitespace-normal"
                                            >
                                                {prompt}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rate Limit Info */}
                        <div className="mt-6 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground text-center">
                                💡 Tip: You can run up to 10 AI commands per day
                            </p>
                        </div>
                    </div>
                )}

                {/* Processing State */}
                {isProcessing && (
                    <div className="p-8 text-center">
                        <Badge variant="secondary" className="gap-2 px-4 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing your command...
                        </Badge>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
