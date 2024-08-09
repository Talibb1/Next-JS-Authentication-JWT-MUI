"use client";

import React, { useEffect, useCallback } from 'react';
import { toast, Toaster, ToastOptions } from 'react-hot-toast';
import { NotificationType } from '@/lib/types';

interface ToastNotificationProps {
  type?: NotificationType;
  message?: string;
  options?: ToastOptions;
  trigger: boolean; // Prop to control when to trigger the toast
  onClear: () => void; // Prop to clear the trigger
}

const ToastNotification: React.FC<ToastNotificationProps> = React.memo(({ type, message, options, trigger, onClear }) => {
  const showToast = useCallback(() => {
    if (type && message) {
      // Clear any previous toast notifications
      toast.dismiss();

      // Show the new toast based on type
      switch (type) {
        case 'success':
          toast.success(message, options);
          break;
        case 'error':
          toast.error(message, options);
          break;
        case 'loading':
          toast.loading(message, options);
          break;
        case 'custom':
          toast(message, options);
          break;
        default:
          toast(message, options);
          break;
      }
    }
  }, [type, message, options]);

  useEffect(() => {
    if (trigger) {
      showToast();
      onClear(); // Reset trigger state after showing toast
    }
  }, [trigger, showToast, onClear]);

  return <Toaster />;
});

ToastNotification.displayName = "ToastNotification";

export default ToastNotification;
