/**
 * Danger Modal Component
 * shadcn/ui AlertDialog for destructive actions
 */
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/appStore';

export function DangerModal() {
    const { dangerModal, closeDangerModal } = useAppStore();

    if (!dangerModal?.isOpen) return null;

    const handleConfirm = () => {
        dangerModal.onConfirm();
        closeDangerModal();
    };

    return (
        <AlertDialog open={dangerModal.isOpen} onOpenChange={(open) => !open && closeDangerModal()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        ⚠️ {dangerModal.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {dangerModal.message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Confirm Action
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
