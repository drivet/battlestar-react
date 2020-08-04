import { InputRequest } from "./inputs";
import { SkillCardDecks } from "../../functions/src/skill-cards";

export enum CharacterId {
    LeeAdama, GaiusBaltar, GalenTyrol, SaulTigh,
    LauraRoslin, TomZarek, KaraThrace, SharonValerii,
    WilliamAdama, KarlAgathon
}

export type CharacterIdKeys = keyof typeof CharacterId;

export enum CharacterType {
    Pilot, Military, Political, Support
}
export type CharacterTypeKeys = keyof typeof CharacterType;

export enum SkillType {
    Tactics,
    Piloting,
    Leadership,
    Engineering,
    Politics
}
export type SkillTypeKeys = keyof typeof SkillType;

export type SkillDeckCounts = {
    [key in SkillTypeKeys]?: number;
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
type SkillCardTypeKeys = keyof typeof SkillCardType;

export interface SkillCard {
    type: SkillType;
    cardType: SkillCardType;
    strength: number;
}

export function skillCard(skillType: SkillType, card: SkillCardType, strength: number): SkillCard {
    return {
        cardType: card,
        type: skillType,
        strength: strength
    }
}

export enum SkillCardId {
    ConsolidatePower1,
    ConsolidatePower2,
    InvestigativeCommittee3,
    InvestigativeCommittee4,
    InvestigativeCommittee5,

    LaunchScout1,
    LaunchScout2,
    StrategicPlanning3,
    StrategicPlanning4,
    StrategicPlanning5,

    ExecutiveOrder1,
    ExecutiveOrder2,
    DeclareEmergency3,
    DeclareEmergency4,
    DeclareEmergency5,

    Repair1,
    Repair2,
    ScientificResearch3,
    ScientificResearch4,
    ScientificResearch5,

    EvasiveManeuvers1,
    EvasiveManeuvers2,
    MaximumFirepower3,
    MaximumFirepower4,
    MaximumFirepower5,
}

export type SkillCardIdKeys = keyof typeof SkillCardId;

export const SkillCards: { [key in SkillCardIdKeys]?: SkillCard } = {
    [SkillCardId[SkillCardId.LaunchScout1]]: skillCard(SkillType.Tactics, SkillCardType.LaunchScout,1),
    [SkillCardId[SkillCardId.LaunchScout2]]: skillCard(SkillType.Tactics, SkillCardType.LaunchScout,2),
    [SkillCardId[SkillCardId.StrategicPlanning3]]: skillCard(SkillType.Tactics, SkillCardType.StrategicPlanning,3),
    [SkillCardId[SkillCardId.StrategicPlanning4]]: skillCard(SkillType.Tactics, SkillCardType.StrategicPlanning,4),
    [SkillCardId[SkillCardId.StrategicPlanning5]]: skillCard(SkillType.Tactics, SkillCardType.StrategicPlanning,5),

    [SkillCardId[SkillCardId.ExecutiveOrder1]]: skillCard(SkillType.Leadership, SkillCardType.ExecutiveOrder,1),
    [SkillCardId[SkillCardId.ExecutiveOrder2]]: skillCard(SkillType.Leadership, SkillCardType.ExecutiveOrder,2),
    [SkillCardId[SkillCardId.DeclareEmergency3]]: skillCard(SkillType.Leadership, SkillCardType.DeclareEmergency,3),
    [SkillCardId[SkillCardId.DeclareEmergency4]]: skillCard(SkillType.Leadership, SkillCardType.DeclareEmergency,4),
    [SkillCardId[SkillCardId.DeclareEmergency5]]: skillCard(SkillType.Leadership, SkillCardType.DeclareEmergency,5),

    [SkillCardId[SkillCardId.ConsolidatePower1]]: skillCard(SkillType.Politics, SkillCardType.ConsolidatePower,1),
    [SkillCardId[SkillCardId.ConsolidatePower2]]: skillCard(SkillType.Politics, SkillCardType.ConsolidatePower,2),
    [SkillCardId[SkillCardId.InvestigativeCommittee3]]: skillCard(SkillType.Politics, SkillCardType.InvestigativeCommittee,3),
    [SkillCardId[SkillCardId.InvestigativeCommittee4]]: skillCard(SkillType.Politics, SkillCardType.InvestigativeCommittee,4),
    [SkillCardId[SkillCardId.InvestigativeCommittee5]]: skillCard(SkillType.Politics, SkillCardType.InvestigativeCommittee,5),

    [SkillCardId[SkillCardId.Repair1]]: skillCard(SkillType.Engineering, SkillCardType.Repair,1),
    [SkillCardId[SkillCardId.Repair2]]: skillCard(SkillType.Engineering, SkillCardType.Repair,2),
    [SkillCardId[SkillCardId.ScientificResearch3]]: skillCard(SkillType.Engineering, SkillCardType.ScientificResearch,3),
    [SkillCardId[SkillCardId.ScientificResearch4]]: skillCard(SkillType.Engineering, SkillCardType.ScientificResearch,4),
    [SkillCardId[SkillCardId.ScientificResearch5]]: skillCard(SkillType.Engineering, SkillCardType.ScientificResearch,5),

    [SkillCardId[SkillCardId.EvasiveManeuvers1]]: skillCard(SkillType.Piloting, SkillCardType.EvasiveManeuvers,1),
    [SkillCardId[SkillCardId.EvasiveManeuvers2]]: skillCard(SkillType.Piloting, SkillCardType.EvasiveManeuvers,2),
    [SkillCardId[SkillCardId.MaximumFirepower3]]: skillCard(SkillType.Piloting, SkillCardType.MaximumFirepower,3),
    [SkillCardId[SkillCardId.MaximumFirepower4]]: skillCard(SkillType.Piloting, SkillCardType.MaximumFirepower,4),
    [SkillCardId[SkillCardId.MaximumFirepower5]]: skillCard(SkillType.Piloting, SkillCardType.MaximumFirepower,5),
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
export type LocationIdKeys = keyof typeof LocationId;

export interface Character {
    id: CharacterId;
    type: CharacterType;
    name: string;
    startLocation?: LocationId;
    cardsDue: SkillCardDue[];
}

export const Characters: { [key in CharacterIdKeys]?: Character } = {
    [CharacterId[CharacterId.KaraThrace]]: {
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
    [CharacterId[CharacterId.WilliamAdama]]: {
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
    [CharacterId[CharacterId.SharonValerii]]: {
        id: CharacterId.SharonValerii,
        name: 'Sharon "Boomer" Valeri',
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
    [CharacterId[CharacterId.LeeAdama]]: {
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
    [CharacterId[CharacterId.KarlAgathon]]: {
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
    [CharacterId[CharacterId.GaiusBaltar]]: {
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
    [CharacterId[CharacterId.GalenTyrol]]: {
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
    [CharacterId[CharacterId.SaulTigh]]: {
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

    [CharacterId[CharacterId.LauraRoslin]]: {
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
    [CharacterId[CharacterId.TomZarek]]: {
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

// before cards are added to skill check, but after any skill check setup.
export enum BeforeSkillCheckId {
    ScientificResearch3,
    ScientificResearch4,
    ScientificResearch5,
    InvestigativeCommittee3,
    InvestigativeCommittee4,
    InvestigativeCommittee5,
    FILP_Increase,
    FILP_Decrease,
    AssignArbitrator_Increase,
    AssignArbitrator_Decrease,
    CylonHatred,
}

// after cards have been added but before totalling
export enum AfterSkillCheckAddedId {
    BlindDevotion
}

// after cards have been totalled
export enum AfterSkillCheckTotalId {
    DeclareEmergency3,
    DeclareEmergency4,
    DeclareEmergency5,
}

export enum SkillCheckType {
    Administration,
    AdmiralsQuarters,
    Brig,
    Crisis
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

export enum ActionId {
    Nothing,

    // Title actions
    LaunchNuke,
    DrawQuorumCard,

    // Pilot Action
    ActivateViper,

    // Character actions
    UnconventionalTactics,
    DeclareMartialLaw,
    CAG,
    CylonDetector,
    SkilledPolitician,

    // Quorum
    InspirationalSpeech,
    ArrestOrder,
    AcceptProphecy,
    PresidentialPardon,
    EncourageMutiny,
    AssignArbitrator,
    AssignVicePresident,
    ReleaseMugshots,
    FoodRationing,
    BrutalForce,
    AssignMissionSpecialist,

    // action from skills - distinguished by which skill cards are used
    MaximumFirepower3,
    MaximumFirepower4,
    MaximumFirepower5,
    Repair1,
    Repair2,
    ConsolidatePower1,
    ConsolidatePower2,
    ExecutiveOrder1,
    ExecutiveOrder2,
    LaunchScout1,
    LaunchScout2,

    // Galactica Location
    PressRoom,
    PresidentsOffice,
    Administration,
    FtlControl,
    WeaponsControl,
    Command,
    Communications,
    AdmiralsQuarters,
    ResearchLab,
    HangarDeck,
    Armory,
    Brig,

    // Cylon reveal
    SendToBrig,
    DamageGalactica,
    ReduceMorale,
    SendToSickbay,

    // Cylon Location
    Caprica,
    CylonFleet,
    HumanFleet,
    ResurrectionShip,
}

export interface SelectedAction {
    actionId: ActionId;
    skillCard?: SkillCard;
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
    InformingThePublic,

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
    [key in LocationIdKeys]?: number;
}

export enum GalacticaDamage {
    Food,
    Population,
    Armory,
    Hangar,
    WeaponsControl,
    Command,
    FtlControl,
    AdmiralsQuarters
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

// publicly visible player data
export interface PlayerData {
    userId: string;
    characterId?: CharacterId;
    admiral?: boolean;
    president?: boolean;
    location?: LocationId;
    skillCounts?: SkillDeckCounts;
    quorumCount?: number;
    loyaltyCount?: number;
    vicePresident?: boolean;
}

export enum GameState {
    CharacterSelection,
    CharacterSetup,
    SetupCards,
    InitialSkillSelection,
    SetupDestiny,
    SetupInitialShips,
    ReceiveSkills,
    Movement,
    ActionSelection,
    Action,
    Crisis
}

export interface ViewableGameData {
    inputRequest: InputRequest,
    state: GameState;
    players: PlayerData[];
    currentPlayer: number;

    // this is only defined at the beginning of the game
    selectableCharacters: CharacterId[];

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
    distance: number;

    quorumDeck: number;
    destinationDeck: number;
    skillDecks: SkillDeckCounts;
    discardedSkillDecks: SkillCardDecks;
    destinyDeck: number;
    crisisDeck: number;
    superCrisisDeck: number;
    loyaltyDeck: number;
}

export function getCharacter(characterId: CharacterId): Character {
    return Characters[CharacterId[characterId]];
}
