# Apple Health Parser

A custom TypeScript NPM package for parsing Apple Health XML exports and generating visualizations.

## Features

- **Efficient Parsing**: Stream-based parsing using `xml-stream` to handle large XML files.
- **Flexible Export Options**: Extract data as JSON and generate PNG charts.
- **User-Friendly Type Mapping**: Use friendly type names like `height`, `bodyMass` instead of Apple Health constants.
- **TypeScript Support**: Fully typed for better developer experience.
- **Command-Line and Programmatic Usage**: Use directly in your terminal or integrate it into your applications.

---

## Installation

### As a Dependency

```bash
npm install @cvyl/apple-health-parser
```

### Or Run Directly with npx

```bash
npx @cvyl/apple-health-parser <file_path> [types...] [--format json,png]
```

---

## Usage

### Command-Line Interface (CLI)

> [!WARNING]
> This is a beta feature that is not guaranteed to work

The package can be run directly using `npx` or `npm start`.

#### Command Syntax

```bash
npx apple-health-parser <file_path> [types...] [--format json,png]
```

#### Parameters

- `<file_path>`: **(Required)** Path to the Apple Health export XML file.
- `[types...]`: **(Optional)** User-friendly health data types to extract. Examples: `height`, `bodyMass`, `stepCount`. Defaults to common types if omitted.
- `--format=`: **(Optional)** Specify export formats:
  - `json`: Export extracted data to JSON.
  - `png`: Generate charts as PNG images.

#### Examples

1. Extract default data types and export as JSON and PNG:

   ```bash
   npx apple-health-parser export.xml
   ```

2. Extract specific data types (`height`, `bodyMass`, and `stepCount`):

   ```bash
   npx apple-health-parser export.xml height bodyMass stepCount
   ```

3. Extract data types and export only as JSON:

   ```bash
   npx apple-health-parser export.xml height bodyMass --format=json
   ```

4. Extract data types and export only as PNG charts:

   ```bash
   npx apple-health-parser export.xml height bodyMass --format=png
   ```

---

### Programmatic Usage

Integrate the parser directly into your projects.

#### Installation

```bash
npm install @cvyl/apple-health-parser
```

#### Example Usage

> [!TIP]
> Or take a look at the [example](./example/index.js).

```typescript
import path from 'path';
import fs from 'fs';
import { extractHealthData } from '../dist/parser.js';
import { generateChart } from '../dist/chartGenerator.js';
import { healthDataTypeMap } from '../dist/types/HealthDataTypeMap.js';

(async () => {
    const filePath = path.resolve('../export.xml');
    const friendlyTypes = ['height', 'bodyMass', 'stepCount'];

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const mappedTypes = friendlyTypes.map((type) => {
        const mappedType = healthDataTypeMap[type.toLowerCase()];
        if (!mappedType) {
            throw new Error(`Unknown health data type: ${type}`);
        }
        return mappedType;
    });

    try {
        console.log('Extracting health data...');
        const extractedData = await extractHealthData(filePath, mappedTypes);

        const outputDir = path.resolve('./output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

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
```

---

## Supported Data Types

| User-Friendly Name              | Apple Health Constant                                  |
|---------------------------------|-------------------------------------------------------|
| `walkingAsymmetryPercentage`    | `HKQuantityTypeIdentifierWalkingAsymmetryPercentage`  |
| `flightsClimbed`                | `HKQuantityTypeIdentifierFlightsClimbed`             |
| `headphoneAudioExposure`        | `HKQuantityTypeIdentifierHeadphoneAudioExposure`      |
| `appleWalkingSteadiness`        | `HKQuantityTypeIdentifierAppleWalkingSteadiness`      |
| `walkingSpeed`                  | `HKQuantityTypeIdentifierWalkingSpeed`               |
| `bodyMass`                      | `HKQuantityTypeIdentifierBodyMass`                   |
| `height`                        | `HKQuantityTypeIdentifierHeight`                     |
| `activeEnergyBurned`            | `HKQuantityTypeIdentifierActiveEnergyBurned`         |
| `distanceWalkingRunning`        | `HKQuantityTypeIdentifierDistanceWalkingRunning`     |
| `sleepDurationGoal`             | `HKDataTypeSleepDurationGoal`                        |
| `sleepAnalysis`                 | `HKCategoryTypeIdentifierSleepAnalysis`             |
| `basalEnergyBurned`             | `HKQuantityTypeIdentifierBasalEnergyBurned`          |
| `stepCount`                     | `HKQuantityTypeIdentifierStepCount`                  |
| `walkingDoubleSupportPercentage`| `HKQuantityTypeIdentifierWalkingDoubleSupportPercentage` |
| `walkingStepLength`             | `HKQuantityTypeIdentifierWalkingStepLength`          |
| `heartRateVariabilitySDNN`      | `HKQuantityTypeIdentifierHeartRateVariabilitySDNN`   |
| `physicalEffort`                | `HKQuantityTypeIdentifierPhysicalEffort`            |
| `heartRate`                     | `HKQuantityTypeIdentifierHeartRate`                 |
| `respiratoryRate`               | `HKQuantityTypeIdentifierRespiratoryRate`           |
| `mindfulSession`                | `HKCategoryTypeIdentifierMindfulSession`            |
| `cervicalMucusQuality`          | `HKCategoryTypeIdentifierCervicalMucusQuality`      |
| `oxygenSaturation`              | `HKQuantityTypeIdentifierOxygenSaturation`          |

---

## Development

### Running the Project

```bash
npm start -- export.xml height bodyMass stepCount
```

### Running Tests

```bash
npm test
```

### Building the Project

```bash
npm run build
```

### Contributing

Feel free to submit issues and pull requests for new features or improvements.

---

## License

MIT
