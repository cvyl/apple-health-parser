import { HealthDataType } from './HealthDataTypes';

export interface HealthDataTypeMap {
    [key: string]: HealthDataType;
}

export const healthDataTypeMap: HealthDataTypeMap = {
    height: HealthDataType.Height,
    bodymass: HealthDataType.BodyMass,
    stepcount: HealthDataType.StepCount,
    activeenergyburned: HealthDataType.ActiveEnergyBurned,
    distancewalkingrunning: HealthDataType.DistanceWalkingRunning,
    flightsclimbed: HealthDataType.FlightsClimbed,
    walkingspeed: HealthDataType.WalkingSpeed,
    walkingasymmetrypercentage: HealthDataType.WalkingAsymmetryPercentage,
    walkingdoublesupportpercentage: HealthDataType.WalkingDoubleSupportPercentage,
    walkingsteplength: HealthDataType.WalkingStepLength,
    heartratevariabilitysdnn: HealthDataType.HeartRateVariabilitySDNN,
    physicaleffort: HealthDataType.PhysicalEffort,
    heartrate: HealthDataType.HeartRate,
    respiratoryrate: HealthDataType.RespiratoryRate,
    mindfulsession: HealthDataType.MindfulSession,
    cervicalmucusquality: HealthDataType.CervicalMucusQuality,
    oxygensaturation: HealthDataType.OxygenSaturation,
    headphoneaudioexposure: HealthDataType.HeadphoneAudioExposure,
    applewalkingsteadiness: HealthDataType.AppleWalkingSteadiness,
    sleepdurationgoal: HealthDataType.SleepDurationGoal,
    sleepanalysis: HealthDataType.SleepAnalysis,
    basalenergyburned: HealthDataType.BasalEnergyBurned,
};
