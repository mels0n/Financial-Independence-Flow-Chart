export default function HowToPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex justify-center">
            <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">How to Use This Chart</h1>

                <div className="prose dark:prose-invert max-w-none space-y-4">
                    <p>
                        This interactive flowchart is designed to guide you through the optimal order of operations for managing your personal finances.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">Getting Started</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Start at the top:</strong> Begin with "Create a Budget" and follow the arrows.</li>
                        <li><strong>Interactive Nodes:</strong> Hover over steps for more details.</li>
                        <li><strong>Jargon Buster:</strong> Click on blue highlighted terms (like <span className="text-blue-600 font-semibold">IRA</span>) to see a definition.</li>
                        <li><strong>Simulation Mode:</strong> Open the "Real Numbers Simulator" in the bottom left to verify if you can afford the next step based on your income and expenses.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">Navigation</h2>
                    <p>
                        You can zoom in/out with your mouse wheel or the controls on the screen. Drag the canvas to pan around.
                    </p>
                </div>
            </div>
        </div>
    );
}
