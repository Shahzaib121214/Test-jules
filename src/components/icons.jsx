import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const VerifiedBadge = ({ className = "w-5 h-5 text-blue-500" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} title="Verified Seller">
      <ShieldCheck className="w-full h-full fill-blue-500/10" strokeWidth={2} />
    </div>
  );
};

export const Logo = ({ className = "h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="10"
        y="45"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="40"
        fill="currentColor"
        style={{ letterSpacing: '-1px' }}
      >
        REHIX<span className="text-blue-500">PK</span>
      </text>
    </svg>
  );
};

export const LogoIcon = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="60" rx="12" fill="currentColor" className="text-gray-900" />
      <text
        x="12"
        y="42"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="white"
      >
        R<span className="text-blue-500">P</span>
      </text>
    </svg>
  );
};
