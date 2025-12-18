export type NodeType = 'step' | 'decision' | 'start' | 'info';

export interface FlowNodeData extends Record<string, unknown> {
    label: string;
    type?: NodeType; // optional in data if 'type' is on the Node itself, but good to have
    description?: string;
    actionType?: 'save' | 'spend' | 'invest' | 'pay_debt';
    targetPercent?: number;
    targetAmount?: number;
    termIds?: string[];
}

export interface FlowNode {
    id: string;
    type: NodeType;
    data: FlowNodeData;
}
