'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CogIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigation: { name: string; href: string }[];
    user: any;
    isAdmin: boolean;
}

export function MobileMenu({ isOpen, onClose, navigation, user, isAdmin }: MobileMenuProps) {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Menu
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                                        onClick={onClose}
                                                    >
                                                        <XMarkIcon className="h-6 w-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <nav className="space-y-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={onClose}
                                                        className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}

                                                {isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={onClose}
                                                        className="flex items-center text-purple-600 hover:text-purple-700 font-medium py-2"
                                                    >
                                                        <CogIcon className="w-4 h-4 mr-2" />
                                                        Admin
                                                    </Link>
                                                )}

                                                {!user && (
                                                    <div className="pt-4 border-t border-gray-200">
                                                        <Link href="/login" onClick={onClose}>
                                                            <Button className="w-full mb-2">Entrar</Button>
                                                        </Link>
                                                        <Link href="/register" onClick={onClose}>
                                                            <Button variant="outline" className="w-full">Cadastrar</Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}