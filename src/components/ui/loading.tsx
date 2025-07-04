import React from 'react';
import { cn } from '@/lib/utils';

// 现代化的 Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'white';
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    white: 'border-white'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700',
        sizeClasses[size],
        `border-t-2 ${colorClasses[color]}`,
        className
      )}
      style={{
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}

// 脉冲加载效果
interface LoadingPulseProps {
  className?: string;
}

export function LoadingPulse({ className }: LoadingPulseProps) {
  return (
    <div className={cn('flex space-x-2', className)}>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
}

// 骨架屏组件
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-gray-200 dark:bg-gray-700 before:absolute before:inset-0 before:shimmer';

  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              'h-4'
            )}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '1rem' : undefined),
      }}
    />
  );
}

// 卡片骨架屏
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flat-card p-6 space-y-4 animate-fade-in-up', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <Skeleton lines={3} />
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Skeleton width={80} height={32} variant="rectangular" />
          <Skeleton width={60} height={32} variant="rectangular" />
        </div>
        <Skeleton width={24} height={24} variant="circular" />
      </div>
    </div>
  );
}

// 页面加载组件
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = '加载中...',
  className
}: PageLoadingProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in-up',
      className
    )}>
      <div className="relative">
        <LoadingSpinner size="xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full animate-bounce-gentle"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
          {message}
        </p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

// 按钮加载状态
interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLoading({
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonLoadingProps) {
  return (
    <button
      className={cn(
        'btn-primary relative flex items-center justify-center space-x-2',
        loading && 'cursor-not-allowed opacity-75',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <div className={cn(
        'flex items-center justify-center space-x-2 transition-opacity duration-200',
        loading ? 'opacity-0' : 'opacity-100'
      )}>
        {children}
      </div>
    </button>
  );
}

// 内容加载状态
export function ContentLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <Skeleton width="80%" height={32} />
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
      </div>
      
      <div className="flat-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton width="40%" height={20} />
            <div className="flex space-x-2">
              <Skeleton width={80} height={32} variant="rectangular" />
              <Skeleton width={60} height={32} variant="rectangular" />
            </div>
          </div>
          <Skeleton lines={8} />
        </div>
      </div>
    </div>
  );
}
