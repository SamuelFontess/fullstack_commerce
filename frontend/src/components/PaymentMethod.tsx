'use client';
import { Card } from '@/components/ui/Card';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface PaymentMethodProps {
    selected: string;
    onChange: (method: string) => void;
}

export function PaymentMethod({ selected, onChange }: PaymentMethodProps) {
    const methods = [
        {
            id: 'credit_card',
            name: 'Cartão de Crédito',
            icon: CreditCardIcon,
            description: 'Visa, Mastercard, American Express'
        },
        {
            id: 'pix',
            name: 'PIX',
            icon: BanknotesIcon,
            description: 'Pagamento instantâneo'
        },
        {
            id: 'boleto',
            name: 'Boleto Bancário',
            icon: BanknotesIcon,
            description: 'Vencimento em 3 dias úteis'
        }
    ];

    return (
        <div className="space-y-3">
            {methods.map((method) => (
                <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                        selected === method.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onChange(method.id)}
                >
                    <div className="p-4 flex items-center">
                        <input
                            type="radio"
                            checked={selected === method.id}
                            onChange={() => onChange(method.id)}
                            className="mr-3"
                        />
                        <method.icon className="w-6 h-6 mr-3 text-gray-600" />
                        <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}