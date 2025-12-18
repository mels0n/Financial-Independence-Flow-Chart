'use client';

import { useWalletStore } from '@entities/wallet/model/store';
// import { Card } from '@shared/ui/card'; // Removed
import { useState } from 'react';

export function SimulatorSidebar() {
    const { monthlyIncome, expenses, setIncome, setExpense, currentBalance, resetBalance } = useWalletStore();
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute bottom-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-lg"
            >
                Open Simulator
            </button>
        );
    }

    return (
        <div className="absolute top-4 left-4 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg dark:text-white">Real Numbers Simulator</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Monthly Income (Net)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={monthlyIncome || ''}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mt-4">Essential Expenses</h3>

                    {[
                        { label: 'Rent / Mortgage', key: 'rent' as const },
                        { label: 'Utilities', key: 'utilities' as const },
                        { label: 'Food / Groceries', key: 'otherEssentials' as const }, // Mapping 'otherEssentials' to food/etc for simplicity for now
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1.5 text-xs text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={expenses[field.key] || ''}
                                    onChange={(e) => setExpense(field.key, Number(e.target.value))}
                                    className="w-full pl-6 pr-3 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Remaining to Assign</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        ${currentBalance.toLocaleString()}
                    </div>
                    <button
                        onClick={resetBalance}
                        className="text-xs text-blue-600 dark:text-blue-400 underline mt-2 hover:text-blue-800"
                    >
                        Recalculate
                    </button>
                </div>
            </div>
        </div>
    );
}
