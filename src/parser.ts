import fs from 'fs';
import XmlStream from 'xml-stream';
import { HealthDataType } from './types/HealthDataTypes';

export interface HealthRecord {
    type: HealthDataType;
    startDate: Date;
    endDate: Date;
    value: number | null;
    unit: string;
    sourceName: string;
}

export const extractHealthData = (
    filePath: string,
    dataTypes: HealthDataType[]
): Promise<Record<HealthDataType, HealthRecord[]>> => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const xml = new XmlStream(stream);

        const extractedData: Record<HealthDataType, HealthRecord[]> = {} as Record<HealthDataType, HealthRecord[]>;
        dataTypes.forEach((type) => {
            extractedData[type] = [];
        });

        xml.collect('Record');
        xml.on('endElement: Record', (record: any) => {
            const recordType: HealthDataType = record.$?.type;
            if (recordType && dataTypes.includes(recordType)) {
                extractedData[recordType].push({
                    type: recordType,
                    startDate: new Date(record.$.startDate),
                    endDate: new Date(record.$.endDate),
                    value: record.$.value ? parseFloat(record.$.value) : null,
                    unit: record.$.unit || '',
                    sourceName: record.$.sourceName,
                });
            }
        });

        xml.on('end', () => resolve(extractedData));
        xml.on('error', (err) => reject(err));
    });
};
