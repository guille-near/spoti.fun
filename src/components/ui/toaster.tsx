import React from "react";
import { Toast, ToastClose } from "./toast";
import { useToast } from "@/hooks/use-toast";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  action?: ToastAction;
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div>
      {toasts && toasts.map(({ id, title, description, action }) => (
        <Toast key={id}>
          <div>
            {title && <div>{title}</div>}
            {description && <div>{description}</div>}
          </div>
          {action && (
            <button onClick={action.onClick} className="toast-action">
              {action.label}
            </button>
          )}
          <ToastClose />
        </Toast>
      ))}
    </div>
  );
}
