import { FlowNode } from '@entities/flow-node/model/types';
import { useWalletStore } from '@entities/wallet/model/store';

// This function will be called by the FlowChart to calculate the status of each node
// based on the wallet's current balance.
export function calculateNodeStatus(node: FlowNode, currentBalance: number): 'pending' | 'active' | 'completed' | 'skipped' {
    // Placeholder logic
    if (node.type === 'start') return 'completed';
    if (currentBalance <= 0) return 'pending';

    // Real logic will need to track "remaining balance" as we traverse the graph.
    // This requires a graph traversal algorithm, not just a per-node check.
    // For now, we'll return 'active' if there's money.
    return 'active';
}
