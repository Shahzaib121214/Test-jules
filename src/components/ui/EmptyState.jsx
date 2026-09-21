import React from 'react';
import { cn } from '../../lib/utils';
import { PackageOpen } from 'lucide-react';

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "No data found",
  description = "There is currently no data to display here.",
  action,
  className
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      <p className="mt-1 text-sm text-gray-400 max-w-sm">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
