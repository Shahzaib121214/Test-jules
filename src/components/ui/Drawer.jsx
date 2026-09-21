import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function Drawer({ isOpen, onClose, children, side = 'right', className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sideClasses = {
    left: 'left-0 border-r',
    right: 'right-0 border-l',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 bottom-0 z-50 w-full max-w-sm bg-gray-900 border-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300",
          sideClasses[side],
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-100 bg-gray-800 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
