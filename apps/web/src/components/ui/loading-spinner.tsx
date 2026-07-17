import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', sizeMap[size], className)}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-10 text-slate-500"
      />
      <path
        d="M25 5 A20 20 0 0 1 45 25"
        stroke="url(#spinner-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
