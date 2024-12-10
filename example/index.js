import path from 'path';
import fs from 'fs';
import { extractHealthData } from '../dist/parser.js';
import { generateChart } from '../dist/chartGenerator.js';
import { healthDataTypeMap } from '../dist/types/HealthDataTypeMap.js';

(async () => {
    const filePath = path.resolve('../export.xml'); // Path to the Apple Health export XML file
    const friendlyTypes = ['height', 'bodyMass', 'stepCount']; // User-friendly type names

    // Validate input file existence
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    // Map friendly type names to internal constants
    const mappedTypes = friendlyTypes.map((type) => {
        const mappedType = healthDataTypeMap[type.toLowerCase()];
        if (!mappedType) {
            throw new Error(`Unknown health data type: ${type}`);
        }
        return mappedType;
    });

    try {
        // Extract health data
        console.log('Extracting health data...');
        const extractedData = await extractHealthData(filePath, mappedTypes);

        // Ensure output directory exists
        const outputDir = path.resolve('./output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Export data and generate charts
        console.log('Generating charts...');
        for (const [type, records] of Object.entries(extractedData)) {
            const chartTitle = type
                .replace(/HKQuantityTypeIdentifier|HKCategoryTypeIdentifier|HKDataType/, '')
                .replace(/([A-Z])/g, ' $1')
                .trim();
            await generateChart(records, chartTitle, 'Value', outputDir);
        }

        console.log('Processing complete. Data and charts saved in the output directory.');
    } catch (error) {
        console.error('An error occurred while processing:', error);
    }
})();
