import { Loader2, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
    trigger: ReactNode;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'destructive' | 'default';
    icon?: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
};

export default function ConfirmDialog({
    trigger,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'destructive',
    icon,
    onConfirm,
    onCancel,
    open,
    onOpenChange,
    loading = false,
    disabled = false,
    className,
    children,
}: ConfirmDialogProps) {
    const defaultIcon = (
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="size-6 text-destructive" />
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                className={cn(
                    'sm:max-w-md border-border/60 shadow-2xl',
                    className
                )}
                onPointerDownOutside={(e) => {
                    if (loading) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (loading) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader className="items-center text-center">
                    {icon ?? defaultIcon}
                    <DialogTitle className="mt-3 text-lg">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {children}

                <DialogFooter className="flex-row gap-2 sm:justify-center">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            disabled={loading}
                            onClick={onCancel}
                        >
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <Button
                        variant={confirmVariant}
                        className="flex-1 sm:flex-none"
                        disabled={disabled || loading}
                        onClick={onConfirm}
                    >
                        {loading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : null}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
