'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {clsx} from "clsx";

interface FilterSection {
    title: string;
    key: string;
    options: { label: string; value: string; count?: number }[];
}

const filterSections: FilterSection[] = [
    {
        title: 'Categoria',
        key: 'category',
        options: [
            { label: 'Eletrônicos', value: 'electronics', count: 45 },
            { label: 'Roupas', value: 'clothing', count: 32 },
            { label: 'Casa', value: 'home', count: 28 },
            { label: 'Esportes', value: 'sports', count: 19 }
        ]
    },
    {
        title: 'Preço',
        key: 'price',
        options: [
            { label: 'Até R$ 50', value: '0-50' },
            { label: 'R$ 50 - R$ 100', value: '50-100' },
            { label: 'R$ 100 - R$ 200', value: '100-200' },
            { label: 'Acima de R$ 200', value: '200+' }
        ]
    }
];

interface ProductFiltersProps {
    filters: Record<string, string[]>;
    onFiltersChange: (filters: Record<string, string[]>) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
    const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price']);

    const toggleSection = (sectionKey: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionKey)
                ? prev.filter(key => key !== sectionKey)
                : [...prev, sectionKey]
        );
    };

    const handleFilterChange = (sectionKey: string, value: string, checked: boolean) => {
        const currentFilters = filters[sectionKey] || [];
        const newFilters = checked
            ? [...currentFilters, value]
            : currentFilters.filter(f => f !== value);

        onFiltersChange({
            ...filters,
            [sectionKey]: newFilters
        });
    };

    const clearAllFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

    return (
        <Card className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filtros</h3>
                {hasActiveFilters && (
                    <Button size="sm" onClick={clearAllFilters}>
                        Limpar
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {filterSections.map(section => (
                    <div key={section.key} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <button
                            onClick={() => toggleSection(section.key)}
                            className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {section.title}
                            <ChevronDownIcon
                                className={clsx(
                                    'w-4 h-4 transition-transform',
                                    expandedSections.includes(section.key) ? 'rotate-180' : ''
                                )}
                            />
                        </button>

                        {expandedSections.includes(section.key) && (
                            <div className="mt-3 space-y-2">
                                {section.options.map(option => (
                                    <label key={option.value} className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={(filters[section.key] || []).includes(option.value)}
                                            onChange={(e) => handleFilterChange(section.key, option.value, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                      {option.label}
                    </span>
                                        {option.count && (
                                            <span className="text-xs text-gray-500">({option.count})</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}