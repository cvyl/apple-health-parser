import fs from 'fs';
import path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { HealthRecord } from './parser';

const chartWidth = 8000; // Increased width for extensive data
const chartHeight = 1000; // Adjusted height for readability

const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: chartWidth,
    height: chartHeight,
    backgroundColour: 'white', // Set background to white
});

/**
 * Generates a line chart from health data.
 * @param data Array of health records.
 * @param title Title of the chart.
 * @param yLabel Label for the Y-axis.
 * @param outputDir Directory to save the chart.
 */
export const generateChart = async (
    data: HealthRecord[],
    title: string,
    yLabel: string,
    outputDir: string
): Promise<void> => {
    if (!data.length) {
        console.log(`No data to chart for ${title}`);
        return;
    }

    // Sort data by startDate
    data.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const labels = data.map((item) => item.startDate.toISOString().split('T')[0]);
    const values = data.map((item) => item.value);

    const configuration = {
        type: 'line' as const, // Type assertion
        data: {
            labels,
            datasets: [
                {
                    label: title,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: false, // Disable responsiveness for fixed size
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 24,
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 18,
                        },
                    },
                    ticks: {
                        maxTicksLimit: 20, // Adjust based on data density
                        autoSkip: true,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel,
                        font: {
                            size: 18,
                        },
                    },
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 10,
                        autoSkip: true,
                    },
                },
            },
        },
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration, 'image/png');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const outputFilePath = path.join(outputDir, `${sanitizedTitle}.png`);
    fs.writeFileSync(outputFilePath, imageBuffer);
    console.log(`Chart saved: ${outputFilePath}`);
};
