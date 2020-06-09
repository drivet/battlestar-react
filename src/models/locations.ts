export enum LocationId {
    PressRoom,
    Administration,
    PresidentsOffice,

    CylonFleet,
    HumanFleet,
    ResurrectionShip,
    Caprica,

    Command,
    FtlControl,
    WeaponsControl,
    HangarDeck,
    Communications,
    Brig,
    Sickbay,
    ResearchLab,
    Armory,
    AdmiralsQuarters,
    BackAbove,
    FrontAbove,
    Back,
    Front,
    FrontBelow,
    BackBelow
}

export type LocationIdKeys = keyof typeof LocationId;

export function isSpace(location: LocationId): boolean {
    return location in [LocationId.Back, LocationId.Front,
        LocationId.FrontBelow, LocationId.FrontAbove,
        LocationId.BackBelow, LocationId.BackAbove];
}
