import {ReactNode} from 'react';
import {clsx} from 'clsx';

interface CardProps {
    children: ReactNode,
    className?: string,
    padding?: 'sm' | 'md' | 'lg',
    onClick?: (() => void) | undefined,
    variant?: string,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void
}

export function Card({children, className, padding = 'md', onClick, variant, onMouseEnter, onMouseLeave}: CardProps) {
    return (
        <div
            className={clsx(
                'bg-white rounded-lg border border-gray-200 shadow-sm',
                {
                    'p-3': padding === 'sm',
                    'p-6': padding === 'md',
                    'p-8': padding === 'lg',
                },
                className
            )}
        >
            {children}
        </div>
    );
}