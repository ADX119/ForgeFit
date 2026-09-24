"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive, DropdownMenu, Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "./utils";

// Overlays are built on Radix primitives: they handle focus trapping, Escape, returning focus on
// close, and screen-reader semantics. These wrappers only add ForgeFit styling.

const overlayClasses = "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm";

const closeButtonClasses =
  "grid size-11 place-items-center rounded-lg text-muted hover:bg-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

// ---------------------------------------------------------------------------------------------
// Dialog: confirmations and blocking decisions only.

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClasses} />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-line bg-surface p-6 shadow-2xl shadow-black/50 focus:outline-none",
          "sm:inset-x-0 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2",
          className,
        )}
      >
        <DialogPrimitive.Title className="text-lg font-semibold text-ink">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="mt-2 text-sm leading-6 text-muted">
            {description}
          </DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * "Delete this workout?" style confirmation. The confirm button is labelled with the verb and
 * sits on the right; destructive actions get the red button.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  open,
  onOpenChange,
}: {
  trigger?: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent title={title} description={description}>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="secondary">{cancelLabel}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={destructive ? "danger-solid" : "primary"} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------------------------
// Sheet: pickers, instructions and entry forms. Bottom sheet on phones, right drawer on larger screens.

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClasses} />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-2xl border border-line bg-surface shadow-2xl shadow-black/50 focus:outline-none",
          "md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-none md:rounded-l-2xl",
          className,
        )}
      >
        <div
          className="mx-auto mt-2 h-1 w-10 rounded-full bg-line-strong/60 md:hidden"
          aria-hidden="true"
        />
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <DialogPrimitive.Title className="text-lg font-semibold text-ink">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-1 text-sm text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className={closeButtonClasses} aria-label="Close">
            <X className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// ---------------------------------------------------------------------------------------------
// Tabs: segmented control for 2–4 peer views. Arrow keys move between tabs.

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex rounded-lg border border-line bg-surface p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "min-h-10 rounded-md px-4 text-sm font-medium text-muted transition-colors hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "data-[state=active]:bg-raised data-[state=active]:text-ink",
        className,
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------------------------
// Menu: the ⋯ overflow menu. Destructive items go last, in red.

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

export function MenuContent({ className, ...props }: ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        className={cn(
          "z-50 min-w-48 rounded-xl border border-line bg-surface p-1 shadow-2xl shadow-black/50",
          className,
        )}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function MenuItem({
  destructive = false,
  className,
  ...props
}: ComponentProps<typeof DropdownMenu.Item> & { destructive?: boolean }) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm outline-none",
        "data-[highlighted]:bg-raised data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        destructive ? "text-danger" : "text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-line" />;
}
