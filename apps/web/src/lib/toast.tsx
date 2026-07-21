'use client';

import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// Re-export toast
export { toast };

// Toast provider component - add to app layout
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          direction: 'rtl',
          fontFamily: 'Vazirmatn, system-ui, sans-serif',
          borderRadius: '1rem',
          padding: '12px 16px',
          fontSize: '0.875rem',
          fontWeight: 600,
          maxWidth: '380px',
        },
        success: {
          style: {
            background: '#DCFCE7',
            color: '#16A34A',
            border: '1px solid #BBF7D0',
          },
          icon: <CheckCircle2 size={20} className="text-green-600" />,
        },
        error: {
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
          icon: <AlertCircle size={20} className="text-red-600" />,
        },
        loading: {
          style: {
            background: '#EFF6FF',
            color: '#2563EB',
            border: '1px solid #BFDBFE',
          },
        },
      }}
    />
  );
}

// Helper functions
export const showSuccess = (msg: string) => toast.success(msg);
export const showError = (msg: string) => toast.error(msg);
export const showInfo = (msg: string) => toast(msg, {
  icon: <Info size={20} className="text-blue-600" />,
  style: { background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' },
});
export const showWarning = (msg: string) => toast(msg, {
  icon: <AlertTriangle size={20} className="text-amber-600" />,
  style: { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
});
