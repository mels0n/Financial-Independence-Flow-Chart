'use client';

import { ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeCard } from '@entities/flow-node/ui/NodeCard';
import { ChartControls } from '@features/chart-navigation/ui/Controls';
import { SimulatorSidebar } from '@features/flow-simulation/ui/SimulatorSidebar';
import { FlowNodeData } from '@entities/flow-node/model/types';

const nodeTypes = {
    'flow-node': NodeCard,
};

const initialNodes: Node<FlowNodeData>[] = [
    {
        id: 'start',
        type: 'flow-node',
        position: { x: 250, y: 0 },
        data: { label: 'Create a Budget', type: 'start', description: 'Fundamental to sound financial footing.' }
    },
    {
        id: 'emergency-fund',
        type: 'flow-node',
        position: { x: 250, y: 150 },
        data: { label: 'Build Small Emergency Fund', type: 'step', description: '$1000 or one month expenses.' }
    },
    {
        id: 'employer-match',
        type: 'flow-node',
        position: { x: 250, y: 300 },
        data: { label: 'Employer Match', type: 'decision', description: 'Does employer offer match?' }
    }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'start', target: 'emergency-fund' },
    { id: 'e2-3', source: 'emergency-fund', target: 'employer-match' },
];

export function FlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="w-full h-screen bg-gray-50 dark:bg-gray-900">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <ChartControls />
                <SimulatorSidebar />
            </ReactFlow>
        </div>
    );
}
