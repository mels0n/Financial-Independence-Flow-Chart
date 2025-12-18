import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { FlowNodeData } from '../model/types';
import { cn } from '@shared/lib/cn';
import { TermHighlighter } from '@features/jargon-buster/ui/TermHighlighter';

export function NodeCard({ data }: NodeProps<Node<FlowNodeData>>) {
    const isDecision = data.type === 'decision';

    return (
        <div className={cn(
            "px-4 py-2 shadow-md rounded-md border-2 min-w-[150px] text-center transition-all hover:scale-105",
            isDecision ? "bg-amber-100 border-amber-400 dark:bg-amber-900/30 dark:border-amber-600" : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        )}>
            <Handle type="target" position={Position.Top} className="!bg-gray-400" />

            <div className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
                <TermHighlighter text={data.label} />
            </div>

            {data.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    <TermHighlighter text={data.description} />
                </div>
            )}

            {/* Decision handles (Yes/No) usually handled by edge labeling, but we provide source handles */}
            <Handle type="source" position={Position.Bottom} className="!bg-gray-500" />
        </div>
    );
}
