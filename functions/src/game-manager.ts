import { addCard, addCards, deal, dealOne, shuffle } from "./deck";
import { createQuorumDeck } from "./quorum";
import {
    ActiveBasestar,
    BasestarDamage,
    CharacterId,
    CivilianShip,
    CrisisCardId,
    DestinationCardId,
    GalacticaDamage,
    LocatedCivilianShips,
    LocationCounts,
    LocationId,
    LoyaltyCardId,
    QuorumCardId,
    SkillCard,
    SkillType,
    TurnPhase,
    ViewableGameData
} from "../../src/models/game-data";
import { createSkillDecks, SkillDecks } from "./skills";
import { createCivilianPile } from "./civilians";
import { loyaltyDeck } from "./loyalty";
import { createCrisisDeck, createSuperCrisisDeck } from "./crisis";
import { createDestinationDeck } from "./destination";

export interface FullPlayer {
    userId: string;
    characterId?: CharacterId;
    admiral?: boolean;
    president?: boolean;
    location?: LocationId;
    loyaltyCards?: LoyaltyCardId[];
    skillCards?: SkillCard[];
}

export interface FullGameData {
    state: TurnPhase;

    players: FullPlayer[];
    currentPlayer: number;

    jumpPosition: number;

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
    civilianShips: CivilianShip[];
    galacticaDamage: GalacticaDamage[];
    basestarDamage: BasestarDamage[];
    nukes: number;

    damagedVipers: number;
    damagedLocations: LocationId[]

    // all the various ships that can be on the board
    activeVipers: LocationCounts;
    activeRaiders: LocationCounts;
    activeHeavyRaiders: LocationCounts;
    activeCivilians: LocatedCivilianShips;
    activeBasestars: ActiveBasestar[];

    boardedCenturions: number[];

    quorumHand?: QuorumCardId[];
    quorumDeck?: QuorumCardId[];
    destinationDeck?: DestinationCardId[];
    skillDecks?: SkillDecks;
    destinyDeck?: SkillCard[];
    crisisDeck?: CrisisCardId[];
    superCrisisDeck?: CrisisCardId[];
    loyaltyDeck?: LoyaltyCardId[];
}

export interface GameDocument {
    gameId: string;
    full: FullGameData;
    viewable?: ViewableGameData;
}

function makePlayerData (userId: string): FullPlayer {
    return {
        userId: userId,
        loyaltyCards: [],
        skillCards: []
    }
}

function createActiveBasestar(location: LocationId): ActiveBasestar {
    return {
        location: location,
        damage: []
    }
}

function createGalacticaDamageTokens(): GalacticaDamage[] {
    return [
        GalacticaDamage.Hangar,
        GalacticaDamage.AdmiralsQuarters,
        GalacticaDamage.Armory,
        GalacticaDamage.Command,
        GalacticaDamage.WeaponsControl,
        GalacticaDamage.FtlControl,
        GalacticaDamage.Food,
        GalacticaDamage.Population
    ];
}

function createBasestarDamageTokens(): BasestarDamage[] {
    return [
        BasestarDamage.CriticalHit,
        BasestarDamage.DisabledHanger,
        BasestarDamage.DisabledWeapons,
        BasestarDamage.StructuralDamage
    ]
}

export function newGame(userIds: string[]): FullGameData {
    return {
        state: TurnPhase.Setup,
        players: userIds.map(u => makePlayerData(u)),
        currentPlayer: 0,
        food: 8,
        fuel: 8,
        morale: 10,
        population: 12,
        vipers: 8,
        raptors: 4,
        raiders: 16,
        heavyRaiders: 4,
        centurions: 4,
        basestars: 2,
        jumpPosition: 0,
        galacticaDamage: createGalacticaDamageTokens(),
        basestarDamage: createBasestarDamageTokens(),
        civilianShips: createCivilianPile(),
        nukes: 2,

        damagedVipers: 0,
        damagedLocations: [],
        activeVipers: {},
        activeRaiders: {},
        activeHeavyRaiders: {},
        activeCivilians: {},
        activeBasestars: [],

        boardedCenturions: [],
    }
}

function findPlayerByCharacter(game: FullGameData, character: CharacterId) : FullPlayer {
    return game.players.filter(p => p.characterId === character)[0];
}

function distributeTitles(game: FullGameData) {
    flagPresident(game);
    flagAdmiral(game);
}

function setupDecks(game: FullGameData) {
    game.quorumDeck = createQuorumDeck();
    game.crisisDeck = createCrisisDeck();
    game.superCrisisDeck = createSuperCrisisDeck();
    game.destinationDeck = createDestinationDeck();
    game.skillDecks = createSkillDecks();
}

function setupDestinyDeck(game: FullGameData) {
    const destiny: SkillCard[] = [];
    addCards(destiny, deal(skillDeck(game, SkillType.Tactics), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Engineering), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Piloting), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Politics), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Leadership), 2));
    shuffle(destiny);
    game.destinyDeck = destiny;
}

function setupLoyalty(game: FullGameData) {
    const extraHumans = game.players.filter(
        p => p.characterId === CharacterId.GaiusBaltar ||
        p.characterId === CharacterId.SharonValerii).length;
    const loyalties = loyaltyDeck(game.players.length, extraHumans);
    game.players.forEach(p => addCard(p.loyaltyCards!, dealOne(loyalties.distributed)));
    const baltar = findPlayerByCharacter(game, CharacterId.GaiusBaltar);
    if (baltar) {
        addCard(baltar.loyaltyCards!, dealOne(loyalties.distributed));
    }
    game.loyaltyDeck = loyalties.remaining;
}

function setupInitialShips(game: FullGameData) {
    game.activeBasestars = [createActiveBasestar(LocationId.Front)];
    placeViper(game, LocationId.FrontBelow);
    placeViper(game, LocationId.BackBelow);
    placeRaiders(game, LocationId.Front, 3);
    placeCivilians(game, LocationId.Back, 2);
}

function placeViper(game: FullGameData, location: LocationId) {
    if (game.vipers === 0) {
        return;
    }

    game.vipers--;
    if (game.activeVipers[location] === undefined) {
        game.activeVipers[location] = 0;
    }
    game.activeVipers[location]++;
}

function placeRaiders(game: FullGameData, location: LocationId, count: number) {
    for (let i = 0; i < count; i++) {
        if (game.raiders === 0) {
            return;
        }

        game.raiders--;
        if (game.activeRaiders[location] === undefined) {
            game.activeRaiders[location] = 0;
        }
        game.activeRaiders[location]++;
    }
}

function placeCivilians(game: FullGameData, location: LocationId, count: number) {
    for (let i = 0; i < count; i++) {
        if (game.civilianShips.length === 0) {
            return;
        }

        const civilian = dealOne(game.civilianShips);
        if (game.activeCivilians[location] === undefined) {
            game.activeCivilians[location] = [];
        }
        game.activeCivilians[location].push(civilian);
    }
}

function skillDeck(game: FullGameData, skill: SkillType): SkillCard[] {
    return game.skillDecks![skill];
}

function flagPresident(game: FullGameData) {
    const laura = findPlayerByCharacter(game, CharacterId.LauraRoslin);
    if (laura) {
        laura.president = true;
        return;
    }
    const gaius = findPlayerByCharacter(game, CharacterId.GaiusBaltar);
    if (gaius) {
        gaius.president = true;
        return;
    }
    const tom = findPlayerByCharacter(game, CharacterId.TomZarek);
    if (tom) {
        tom.president = true;
        return;
    }
}

function flagAdmiral(game: FullGameData) {
    const will = findPlayerByCharacter(game, CharacterId.WilliamAdama);
    if (will) {
        will.admiral = true;
        return;
    }
    const saul = findPlayerByCharacter(game, CharacterId.SaulTigh);
    if (saul) {
        saul.admiral = true;
        return;
    }
    const helo = findPlayerByCharacter(game, CharacterId.KarlAgathon);
    if (helo) {
        helo.admiral = true;
        return;
    }
}
