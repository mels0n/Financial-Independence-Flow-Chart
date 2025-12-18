'use client';

import { Controls as ReactFlowControls, ControlButton } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize, Minus, Plus } from 'lucide-react';

export function ChartControls() {
    return (
        <ReactFlowControls
            showInteractive={false}
            className="bg-white/80 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg overflow-hidden p-1"
        >
            <ControlButton className="!border-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 !text-gray-700 dark:!text-gray-200">
                <Plus className="w-4 h-4" />
            </ControlButton>
            <ControlButton className="!border-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 !text-gray-700 dark:!text-gray-200">
                <Minus className="w-4 h-4" />
            </ControlButton>
            <ControlButton className="!border-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 !text-gray-700 dark:!text-gray-200">
                <Maximize className="w-4 h-4" />
            </ControlButton>
        </ReactFlowControls>
    );
}
