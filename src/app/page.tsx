import { FlowChart } from '@widgets/interactive-chart/ui/FlowChart';
import { DefinitionModal } from '@widgets/term-modal/ui/DefinitionModal';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <FlowChart />
      <DefinitionModal />
    </main>
  );
}
