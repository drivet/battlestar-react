export enum CharacterId {
    LeeAdama, GaiusBaltar, GalenTyrol, SaulTigh,
    LauraRoslin, TomZarek, KaraThrace, SharonValerii,
    WilliamAdama, KarlAgathon
}

export enum CharacterType {
    Pilot, Military, Political, Support
}

export enum SkillType {
    Tactics,
    Piloting,
    Leadership,
    Engineering,
    Politics
}

export type SkillDeckCounts = {
    [key in SkillType]?: number;
}

export enum SkillCardType {
    ScientificResearch,
    Repair,
    EvasiveManeuvers,
    MaximumFirepower,
    LaunchScout,
    StrategicPlanning,
    ExecutiveOrder,
    DeclareEmergency,
    ConsolidatePower,
    InvestigativeCommittee,
}

export interface SkillCard {
    type: SkillType;
    cardType: SkillCardType;
    strength: number;
}

export interface SkillCardDue {
    skills: SkillType[];
    count: number;
}

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

export function isSpace(location: LocationId): boolean {
    return location in [LocationId.Back, LocationId.Front,
        LocationId.FrontBelow, LocationId.FrontAbove,
        LocationId.BackBelow, LocationId.BackAbove];
}

export interface Character {
    id: CharacterId;
    type: CharacterType;
    name: string;
    startLocation?: LocationId;
    cardsDue: SkillCardDue[];
}

export const Characters: { [key in CharacterId]: Character } = {
    [CharacterId.KaraThrace]: {
        id: CharacterId.KaraThrace,
        name: 'Kara "Starbuck" Thrace',
        type: CharacterType.Pilot,
        startLocation: LocationId.HangarDeck,
        cardsDue: [
            {
                skills: [SkillType.Tactics],
                count: 2
            },
            {
                skills: [SkillType.Piloting],
                count: 2
            },
            {
                skills: [SkillType.Leadership, SkillType.Engineering],
                count: 1
            }
        ]
    },
    [CharacterId.WilliamAdama]: {
        id: CharacterId.WilliamAdama,
        name: "William Adama",
        type: CharacterType.Military,
        startLocation: LocationId.AdmiralsQuarters,
        cardsDue: [
            {
                skills: [SkillType.Leadership],
                count: 3
            },
            {
                skills: [SkillType.Tactics],
                count: 2
            }
        ]
    },
    [CharacterId.SharonValerii]: {
        id: CharacterId.SharonValerii,
        name: 'Sharon, "Boomer" Valeri',
        type: CharacterType.Pilot,
        startLocation: LocationId.Armory,
        cardsDue: [
            {
                skills: [SkillType.Tactics],
                count: 2
            },
            {
                skills: [SkillType.Piloting],
                count: 2
            },
            {
                skills: [SkillType.Engineering],
                count: 1
            }
        ]
    },
    [CharacterId.LeeAdama]: {
        id: CharacterId.LeeAdama,
        name: 'Lee "Apollo" Adama',
        type: CharacterType.Pilot,
        cardsDue: [
            {
                skills: [SkillType.Tactics],
                count: 1
            },
            {
                skills: [SkillType.Piloting],
                count: 2
            },
            {
                skills: [SkillType.Leadership, SkillType.Politics],
                count: 2
            }
        ]
    },
    [CharacterId.KarlAgathon]: {
        id: CharacterId.KarlAgathon,
        name: 'Karl "Helo" Agathon',
        type: CharacterType.Military,
        cardsDue: [
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Tactics],
                count: 2
            },
            {
                skills: [SkillType.Piloting],
                count: 1
            }
        ]
    },
    [CharacterId.GaiusBaltar]: {
        id: CharacterId.GaiusBaltar,
        name: "Gaius Baltar",
        type: CharacterType.Political,
        startLocation: LocationId.ResearchLab,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 2
            },
            {
                skills: [SkillType.Leadership],
                count: 1
            },
            {
                skills: [SkillType.Engineering],
                count: 1
            }
        ]
    },
    [CharacterId.GalenTyrol]: {
        id: CharacterId.GalenTyrol,
        name: '"Chief" Galen Tyrol',
        type: CharacterType.Support,
        startLocation: LocationId.HangarDeck,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 1
            },
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Engineering],
                count: 2
            }
        ]
    },
    [CharacterId.SaulTigh]: {
        id: CharacterId.SaulTigh,
        name: "Saul Tigh",
        type: CharacterType.Military,
        startLocation: LocationId.Command,
        cardsDue: [
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Tactics],
                count: 3
            }
        ]

    },

    [CharacterId.LauraRoslin]: {
        id: CharacterId.LauraRoslin,
        name: "Laura Roslin",
        type: CharacterType.Political,
        startLocation: LocationId.PresidentsOffice,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 3
            },
            {
                skills: [SkillType.Leadership],
                count: 2
            }
        ]
    },
    [CharacterId.TomZarek]: {
        id: CharacterId.TomZarek,
        name: "Tom Zarek",
        type: CharacterType.Political,
        startLocation: LocationId.Administration,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 2
            },
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Tactics],
                count: 1
            }
        ]
    }
}


export enum LoyaltyCardId {
    Human, Sympathizer, ReduceMorale, SendCharToSickbay, DamageGalactica, SendCharToBrig
}

export enum QuorumCardId {
    AssignMissionSpecialist,
    AuthorizationOfBrutalForce,
    FoodRationing,
    ReleaseCylonMugshots,
    AssignVicePresident,
    AssignArbitrator,
    EncourageMutiny,
    PresidentialPardon,
    AcceptProphecy,
    ArrestOrder,
    InspirationalSpeech
}


export enum DestinationCardId {
    DesolateMoon,
    RagnarAnchorage,
    CylonAmbush,
    CylonRefinery,
    AsteroidField,
    DeepSpace,
    RemotePlanet,
    IcyMoon,
    BarrenPlanet,
    TyliumPlanet,
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

export enum CrisisType {
    CylonAttack,
    SkillCheck,
    Event
}

export type LocationCounts = {
    [key in LocationId]?: number;
}

export interface GalacticaDamage {
    locationId?: LocationId;
    food?: number;
    fuel?: number;
    morale?: number;
    population?: number;
}

export enum BasestarDamage {
    CriticalHit,
    DisabledHanger,
    DisabledWeapons,
    StructuralDamage
}

export interface ActiveBasestar {
    location: LocationId;
    damage: BasestarDamage[];
}

export interface CivilianShip {
    food: number;
    fuel: number;
    morale: number;
    population: number;
}

export type LocatedCivilianShips = {
    [key in LocationId]?: CivilianShip[];
}

// only visible to the player identified by the userId
export interface PlayerHand {
    userId: string;
    loyaltyCards: LoyaltyCardId[];
    skillCards: SkillCard[];

    // only president has these
    quorumCards?: QuorumCardId[];
}

// publicly visible player data
export interface PlayerData {
    userId: string;
    characterId?: CharacterId;
    admiral?: boolean;
    president?: boolean;
    location?: LocationId;
}

export enum TurnPhase {
    NotStarted,
    Setup,
    ReceiveSkills,
    Movement,
    Action,
    Crisis
}

export interface ViewableGameData {
    state: TurnPhase;
    players: PlayerData[];
    currentPlayer: number;

    // resource counters
    food: number;
    fuel: number;
    morale: number;
    population: number;

    // ships and tokens in reserve
    vipers: number;
    raptors: number;
    raiders: number;
    heavyRaiders: number;
    centurions: number;
    basestars: number;
    civilianShips: number;
    galacticaDamage: number;
    basestarDamage: number;

    damagedVipers: number;

    damagedLocations: LocationId[];

    // all the various ships that can be on the board
    activeVipers: LocationCounts;
    activeRaiders: LocationCounts;
    activeHeavyRaiders: LocationCounts;
    activeCivilians: LocationCounts;
    activeBasestars: ActiveBasestar[];

    boardedCenturions: number[];

    nukes: number;

    jumpPosition: number;

    quorumDeck: number;
    destinationDeck: number;
    skillDecks: SkillDeckCounts;
    destinyDeck: number;
    crisisDeck: number;
    superCrisisDeck: number;
    loyaltyDeck: number;
}
