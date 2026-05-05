"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Eye, Phone, MessageCircle, Copy, Trash2, Ban } from "lucide-react";

export interface RowAction {
  type: "view" | "call" | "whatsapp" | "copy-phone" | "copy-email" | "spam" | "delete";
  label?: string;
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface ActionMenuProps {
  /** Phone number — when provided, "Call" + "Copy phone" + "WhatsApp" auto-render. */
  phone?: string;
  /** Email — when provided, "Copy email" auto-renders. */
  email?: string;
  /** Trigger when the user clicks "View details". */
  onView?: () => void;
  /** Trigger to mark spam. */
  onMarkSpam?: () => void;
  /** Trigger to delete. */
  onDelete?: () => void;
}

export function ActionMenu({ phone, email, onView, onMarkSpam, onDelete }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="admin-btn-icon"
          aria-label="Row actions"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="admin-menu-content" align="end" sideOffset={6}>
          {onView && (
            <DropdownMenu.Item className="admin-menu-item" onSelect={onView}>
              <Eye size={14} />
              View details
            </DropdownMenu.Item>
          )}

          {phone && (
            <>
              <DropdownMenu.Separator className="admin-menu-separator" />
              <DropdownMenu.Item
                className="admin-menu-item"
                onSelect={() => window.location.assign(`tel:${phone}`)}
              >
                <Phone size={14} />
                Call {phone}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="admin-menu-item"
                onSelect={() => {
                  const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                <MessageCircle size={14} />
                Open WhatsApp
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="admin-menu-item"
                onSelect={() => navigator.clipboard?.writeText(phone)}
              >
                <Copy size={14} />
                Copy phone
              </DropdownMenu.Item>
            </>
          )}

          {email && (
            <DropdownMenu.Item
              className="admin-menu-item"
              onSelect={() => navigator.clipboard?.writeText(email)}
            >
              <Copy size={14} />
              Copy email
            </DropdownMenu.Item>
          )}

          {(onMarkSpam || onDelete) && <DropdownMenu.Separator className="admin-menu-separator" />}

          {onMarkSpam && (
            <DropdownMenu.Item className="admin-menu-item admin-menu-item-danger" onSelect={onMarkSpam}>
              <Ban size={14} />
              Mark as spam
            </DropdownMenu.Item>
          )}
          {onDelete && (
            <DropdownMenu.Item className="admin-menu-item admin-menu-item-danger" onSelect={onDelete}>
              <Trash2 size={14} />
              Delete row
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
