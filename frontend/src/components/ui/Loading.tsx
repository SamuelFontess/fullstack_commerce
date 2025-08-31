interface LoadingProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text = "Carregando...", size = 'md' }: LoadingProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
}