'use client';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MultiSelectProps<T> {
    label?: string;
    options: T[];
    selected: T[];
    onChange: (selected: T[]) => void;
    placeholder?: string;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
}

export function MultiSelect<T>({
                                   label,
                                   options,
                                   selected,
                                   onChange,
                                   placeholder = 'Selecione...',
                                   getOptionLabel,
                                   getOptionValue
                               }: MultiSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (option: T) => {
        const optionValue = getOptionValue(option);
        const isSelected = selected.some(item => getOptionValue(item) === optionValue);

        if (isSelected) {
            onChange(selected.filter(item => getOptionValue(item) !== optionValue));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleRemoveOption = (option: T) => {
        const optionValue = getOptionValue(option);
        onChange(selected.filter(item => getOptionValue(item) !== optionValue));
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length === 0 ? (
                            <span className="text-gray-500">{placeholder}</span>
                        ) : (
                            selected.map((option) => (
                                <span
                                    key={getOptionValue(option)}
                                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                                >
                  {getOptionLabel(option)}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveOption(option);
                                        }}
                                        className="hover:text-blue-600"
                                    >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
                            ))
                        )}
                    </div>
                    <ChevronDownIcon
                        className={clsx(
                            'absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                        {options.map((option) => {
                            const isSelected = selected.some(item => getOptionValue(item) === getOptionValue(option));
                            return (
                                <button
                                    key={getOptionValue(option)}
                                    type="button"
                                    onClick={() => handleToggleOption(option)}
                                    className={clsx(
                                        'flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50',
                                        isSelected && 'bg-blue-50 text-blue-600'
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}}
                                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {getOptionLabel(option)}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}