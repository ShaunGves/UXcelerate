import React from 'react';

interface ToastBannerProps {
  message: string | null;
  icon?: string;
  colorClass?: string;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({
  message,
  icon = 'info',
  colorClass = 'text-primary',
}) => {
  if (!message) return null;

  return (
    <div
      id="toast-banner"
      className="fixed top-28 sm:top-32 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 flex items-center justify-between p-space-sm rounded-xl bg-surface-container-highest text-on-surface shadow-2xl border border-surface-container-high animate-bounce-short transition-all"
    >
      <div className="flex items-center gap-space-xs min-w-0">
        <span className={`material-symbols-outlined text-[22px] shrink-0 ${colorClass}`}>
          {icon}
        </span>
        <span className="font-label-tactical text-[11px] sm:text-[12px] truncate uppercase font-bold text-on-surface">
          {message}
        </span>
      </div>
      <span className="font-telemetry-sm text-[10px] text-secondary shrink-0 ml-3 font-bold">
        ACK
      </span>
    </div>
  );
};
