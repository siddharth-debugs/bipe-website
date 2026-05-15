"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/admin/utils";

/**
 * Dialog primitive — shadcn-flavoured wrapper around Radix Dialog.
 *
 * Layout primitives:
 *   <Dialog>
 *     <DialogTrigger />
 *     <DialogContent>           // shell that constrains max-h and lays out
 *       <DialogHeader>          // fixed (non-scrolling) top
 *         <DialogTitle />
 *         <DialogDescription />
 *       </DialogHeader>
 *       <DialogBody>            // scrollable middle (overflow-y-auto)
 *         …form / details …
 *       </DialogBody>
 *       <DialogFooter />        // fixed (non-scrolling) bottom
 *     </DialogContent>
 *   </Dialog>
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--ink)_55%,transparent)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Total width cap. */
    size?: "sm" | "md" | "lg" | "xl";
    /** Hide the close X. */
    hideClose?: boolean;
  }
>(({ className, children, size = "md", hideClose, ...props }, ref) => {
  const widthCls =
    size === "sm" ? "max-w-md" :
    size === "md" ? "max-w-2xl" :
    size === "lg" ? "max-w-4xl" :
    "max-w-6xl";
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Centred, with a hard max-height so the body can scroll without
          // pushing the footer off-screen.
          "fixed left-[50%] top-[50%] z-50 grid w-[calc(100vw-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0",
          "max-h-[calc(100vh-3rem)] grid-rows-[auto_1fr_auto]",
          "border border-[var(--line)] bg-[var(--white)] shadow-xl rounded-xl overflow-hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          widthCls,
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-sm p-1 text-[var(--ink-3)] opacity-70 transition-opacity hover:opacity-100 hover:bg-[var(--paper-2)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Sticky-style top — sits in the first row of the grid, doesn't scroll.
      "px-6 py-4 border-b border-[var(--line)] bg-[var(--white)]",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  // Middle row, scrolls when content exceeds viewport.
  <div
    className={cn(
      "px-6 py-5 overflow-y-auto",
      className,
    )}
    {...props}
  />
);
DialogBody.displayName = "DialogBody";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-6 py-3 border-t border-[var(--line)] bg-[var(--white)] flex justify-end gap-2 flex-wrap",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold tracking-tight text-[var(--ink)] leading-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--ink-3)] mt-1", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
