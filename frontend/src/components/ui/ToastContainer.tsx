/**
 * Toast Container using Sonner
 * shadcn/ui toast implementation
 */
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';

export function ToastContainer() {
    const { toasts, removeToast } = useAppStore();

    useEffect(() => {
        toasts.forEach((t) => {
            const toastFn = t.type === 'error' ? toast.error
                : t.type === 'success' ? toast.success
                    : t.type === 'warning' ? toast.warning
                        : toast.info;

            toastFn(t.title, {
                description: t.message,
                id: t.id,
                onDismiss: () => removeToast(t.id),
            });
        });
    }, [toasts, removeToast]);

    return <Toaster position="top-right" theme="light" richColors closeButton />;
}
