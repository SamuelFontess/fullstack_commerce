'use client';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {clsx} from "clsx";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ value: propValue, onChange, onSearch, placeholder = "Buscar..." }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(propValue);

    useEffect(() => {
        setInputValue(propValue);
    }, [propValue]);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative max-w-md">
            <div className={clsx(
                'relative flex items-center transition-all duration-200',
                isFocused ? 'scale-105' : ''
            )}>
                <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch(inputValue);
                        }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {inputValue && (
                    <button
                        onClick={() => {
                            setInputValue('');
                            onSearch('');
                        }}
                        className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
}
