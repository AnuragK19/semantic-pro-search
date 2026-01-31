import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

export function MobileFAB() {
    const { openCommandPalette } = useAppStore();

    return (
        <Button
            onClick={openCommandPalette}
            size="icon"
            className="fixed bottom-6 right-6 md:hidden z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
        >
            <Sparkles className="h-6 w-6" />
        </Button>
    );
}
