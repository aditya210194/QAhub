// src/components/ChartRenderer.js
import {
    Bar,
    Line,
    Pie,
    Doughnut,
    Radar
} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function ChartRenderer({ chartType, data, options, caption }) {
    const chartComponents = {
        bar: Bar,
        line: Line,
        pie: Pie,
        doughnut: Doughnut,
        radar: Radar
    };

    const ChartComponent = chartComponents[chartType] || Bar;

    return (
        <div className="my-4">
            <div style={{ height: '400px' }}>
                <ChartComponent
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        ...options
                    }}
                />
            </div>
            {caption && <p className="text-center text-muted mt-2">{caption}</p>}
        </div>
    );
}