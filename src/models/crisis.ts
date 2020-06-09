import { shuffle } from "./deck";

export enum CrisisType {
    CylonAttack,
    SkillCheck,
    Event
}

export enum CrisisCardId {
    // cylon attack
    JammedAssault,
    BoardingParties,
    ThirtyThree,
    RaidingParty,
    TacticalStrike,
    Surrounded,
    CylonSwarm,
    Ambush,
    HeavyAssault,
    Besieged,

    // super crisis cylon attack
    MassiveAssault,

    // events
    RescueMission,
    Riots,
    FoodShortage,
    WaterShortage,
    RescueTheFleet,
    RescueCapricaSurvivors,
    BuildCylonDetector,
    RequestedResignation,
    SleepDeprivation,
    DeclareMartialLaw,

    // skill checks
    ScoutingForWater,
    UnidentifiedShip,
    UnexpectedReunion,
    DetectorSabotage,
    AdmiralGrilled,
    CylonVirus,
    SendSurveyTeam,
    GuiltByCollusion,
    WeaponMalfunction,
    PrisonLabor,
    LegendaryDiscovery,
    SecurityBreach,
    WitchHunt,
    PrisonerRevolt,
    JumpComputerFailure,
    MissingG4Explosives,
    NetworkComputers,
    CrippledRadar,
    Resistance,
    HangarAccident,
    BombThreat,
    FulfillerOfProphecy,
    ATraitorAccused,
    TerroristInvestigations,
    ColonialDay,
    MandatoryTesting,
    TheOlympicCarrier,
    ElectionsLoom,
    LossOfAFriend,
    CylonTrackingDevice,
    CrashLanding,
    CylonScreenings,
    AnalyzeEnemyFighter,
    ScoutingForFuel,
    LowSupplies,
    WaterSabotaged,
    KeepTabsOnVisitor,
    ForcedWaterMining,
    TerroristBomber,
    CylonAccusation,

    // super crisis skill check
    InboundNukes,
    BombOnColonialOne,
    CylonIntruders,
    FleetMobilization,
}

export function createSuperCrisisDeck(): CrisisCardId[] {
    return shuffle([
        CrisisCardId.InboundNukes,
        CrisisCardId.BombOnColonialOne,
        CrisisCardId.CylonIntruders,
        CrisisCardId.FleetMobilization,
        CrisisCardId.MassiveAssault
    ]);
}

export function createCrisisDeck(): CrisisCardId[] {
    return shuffle([
        // cylon attack
        CrisisCardId.JammedAssault,
        CrisisCardId.BoardingParties,
        CrisisCardId.ThirtyThree,
        CrisisCardId.RaidingParty,
        CrisisCardId.TacticalStrike,
        CrisisCardId.Surrounded,
        CrisisCardId.CylonSwarm,
        CrisisCardId.Ambush,
        CrisisCardId.HeavyAssault,
        CrisisCardId.Besieged,

        // events
        CrisisCardId.RescueMission,
        CrisisCardId.Riots,
        CrisisCardId.FoodShortage,
        CrisisCardId.WaterShortage,
        CrisisCardId.RescueTheFleet,
        CrisisCardId.RescueCapricaSurvivors,
        CrisisCardId.BuildCylonDetector,
        CrisisCardId.RequestedResignation,
        CrisisCardId.SleepDeprivation,
        CrisisCardId.DeclareMartialLaw,

        // skill checks
        CrisisCardId.ScoutingForWater,
        CrisisCardId.UnidentifiedShip,
        CrisisCardId.UnexpectedReunion,
        CrisisCardId.DetectorSabotage,
        CrisisCardId.AdmiralGrilled,
        CrisisCardId.CylonVirus,
        CrisisCardId.SendSurveyTeam,
        CrisisCardId.GuiltByCollusion,
        CrisisCardId.WeaponMalfunction,
        CrisisCardId.PrisonLabor,
        CrisisCardId.LegendaryDiscovery,
        CrisisCardId.SecurityBreach,
        CrisisCardId.WitchHunt,
        CrisisCardId.PrisonerRevolt,
        CrisisCardId.JumpComputerFailure,
        CrisisCardId.MissingG4Explosives,
        CrisisCardId.NetworkComputers,
        CrisisCardId.CrippledRadar,
        CrisisCardId.Resistance,
        CrisisCardId.HangarAccident,
        CrisisCardId.BombThreat,
        CrisisCardId.FulfillerOfProphecy,
        CrisisCardId.ATraitorAccused,
        CrisisCardId.TerroristInvestigations,
        CrisisCardId.ColonialDay,
        CrisisCardId.MandatoryTesting,
        CrisisCardId.TheOlympicCarrier,
        CrisisCardId.ElectionsLoom,
        CrisisCardId.LossOfAFriend,
        CrisisCardId.CylonTrackingDevice,
        CrisisCardId.CrashLanding,
        CrisisCardId.CylonScreenings,
        CrisisCardId.AnalyzeEnemyFighter,
        CrisisCardId.ScoutingForFuel,
        CrisisCardId.LowSupplies,
        CrisisCardId.WaterSabotaged,
        CrisisCardId.KeepTabsOnVisitor,
        CrisisCardId.ForcedWaterMining,
        CrisisCardId.TerroristBomber,
        CrisisCardId.CylonAccusation,
    ]);
}
