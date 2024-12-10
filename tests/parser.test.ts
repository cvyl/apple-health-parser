import path from 'path';
import fs from 'fs';
import { extractHealthData, HealthRecord } from '../src/parser';
import { HealthDataType } from '../src/types/HealthDataTypes';

describe('extractHealthData', () => {
    const sampleXmlPath = path.resolve(__dirname, 'sample.xml');

    beforeAll(() => {
        if (!fs.existsSync(sampleXmlPath)) {
            throw new Error(`Sample XML file not found at path: ${sampleXmlPath}`);
        }
    });

    it('should extract Step Count records correctly', async () => {
        const result = await extractHealthData(sampleXmlPath, [HealthDataType.StepCount]);
        expect(result[HealthDataType.StepCount]).toBeDefined();
        expect(result[HealthDataType.StepCount].length).toBeGreaterThan(0);
        const record: HealthRecord = result[HealthDataType.StepCount][0];
        expect(record.type).toBe(HealthDataType.StepCount);
        expect(record.value).toBe(1000);
        expect(record.unit).toBe('count');
        expect(record.sourceName).toBe('Health');
    });

    it('should extract Body Mass records correctly', async () => {
        const result = await extractHealthData(sampleXmlPath, [HealthDataType.BodyMass]);
        expect(result[HealthDataType.BodyMass]).toBeDefined();
        expect(result[HealthDataType.BodyMass].length).toBeGreaterThan(0);
        const record: HealthRecord = result[HealthDataType.BodyMass][0];
        expect(record.type).toBe(HealthDataType.BodyMass);
        expect(record.value).toBe(65);
        expect(record.unit).toBe('kg');
        expect(record.sourceName).toBe('Health');
    });

    it('should extract Height records correctly', async () => {
        const result = await extractHealthData(sampleXmlPath, [HealthDataType.Height]);
        expect(result[HealthDataType.Height]).toBeDefined();
        expect(result[HealthDataType.Height].length).toBeGreaterThan(0);
        const record: HealthRecord = result[HealthDataType.Height][0];
        expect(record.type).toBe(HealthDataType.Height);
        expect(record.value).toBe(170);
        expect(record.unit).toBe('cm');
        expect(record.sourceName).toBe('Health');
    });
});
