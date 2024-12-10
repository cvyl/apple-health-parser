#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { extractHealthData, HealthRecord } from './parser';
import { generateChart } from './chartGenerator';
import { healthDataTypeMap, HealthDataTypeMap } from './types/HealthDataTypeMap';
import { HealthDataType } from './types/HealthDataTypes';

/**
 * Exports the extracted data as JSON.
 * @param data Extracted health data.
 * @param outputDir Directory to save the JSON file.
 */
const exportAsJSON = (data: Record<HealthDataType, HealthRecord[]>, outputDir: string): void => {
    const outputFilePath = path.join(outputDir, 'health-data.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`JSON data exported to: ${outputFilePath}`);
};

/**
 * Processes Apple Health data by extracting specified data types and generating charts.
 * @param filePath Path to the Apple Health export XML file.
 * @param friendlyTypes Array of user-friendly type names.
 * @param exportFormat Export format options (json, png).
 */
const processHealthData = async (
    filePath: string,
    friendlyTypes: string[],
    exportFormat: { json?: boolean; png?: boolean } = { json: true, png: true }
) => {
    console.log('Processing Apple Health data...');

    // Map friendly names to HealthDataType constants
    const mappedTypes: HealthDataType[] = friendlyTypes.map((type) => {
        const mappedType = healthDataTypeMap[type.toLowerCase()];
        if (!mappedType) {
            throw new Error(`Unknown health data type: ${type}`);
        }
        return mappedType;
    });

    const extractedData = await extractHealthData(filePath, mappedTypes);

    const outputDir = path.resolve('./output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Export as JSON
    if (exportFormat.json) {
        exportAsJSON(extractedData, outputDir);
    }

    // Generate charts
    if (exportFormat.png) {
        for (const [type, records] of Object.entries(extractedData)) {
            console.log(`Processing ${records.length} records for type: ${type}`);
            if (records.length) {
                const chartTitle = type
                    .replace(/HKQuantityTypeIdentifier|HKCategoryTypeIdentifier|HKDataType/, '')
                    .replace(/([A-Z])/g, ' $1')
                    .trim();
                await generateChart(records, chartTitle, `Value (${records[0]?.unit || ''})`, outputDir);
            }
        }
    }

    console.log(`All charts and JSON data saved to: ${outputDir}`);
};

/**
 * Entry Point
 */
const main = async () => {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error('Usage: npx apple-health-parser <export.xml> [types...] [--format json,png]');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    // Separate types and format arguments
    const formatArgIndex = args.findIndex((arg) => arg.startsWith('--format'));
    const formatArg = formatArgIndex >= 0 ? args[formatArgIndex] : null;

    const types = args.slice(1, formatArgIndex >= 0 ? formatArgIndex : args.length).filter((arg) => !arg.startsWith('--'));

    const defaultTypes = [
        'height',
        'bodyMass',
        'stepCount',
        'activeEnergyBurned',
        'distanceWalkingRunning',
        'flightsClimbed',
        'walkingSpeed',
        'walkingAsymmetryPercentage',
        'walkingDoubleSupportPercentage',
        'walkingStepLength',
        'heartRate',
        'respiratoryRate',
        'oxygenSaturation',
        'basalEnergyBurned',
        'sleepDurationGoal',
        'sleepAnalysis',
        'physicalEffort',
    ];

    const selectedTypes = types.length ? types : defaultTypes;

    // Parse export format
    let exportFormat = { json: false, png: false };
    if (formatArg) {
        const formats = formatArg.split('=')[1]?.split(',').map((f) => f.trim().toLowerCase());
        exportFormat.json = formats?.includes('json');
        exportFormat.png = formats?.includes('png');
    } else {
        exportFormat = { json: true, png: true }; // Default to both formats
    }

    try {
        await processHealthData(filePath, selectedTypes, exportFormat);
    } catch (error) {
        console.error('Error processing Apple Health data:', error);
    }
};

main();
