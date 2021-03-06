import { addCard, addCards, deal, dealOne, shuffle } from "./deck";
import { createQuorumDeck } from "./quorum";
import {
    ActionId,
    ActiveBasestar,
    BasestarDamage,
    CharacterId,
    CivilianShip,
    CrisisCardId,
    DestinationCardId,
    GalacticaDamage,
    GameState,
    LocationCounts,
    LocationId,
    LocationIdKeys,
    LoyaltyCardId,
    QuorumCardId,
    SkillCard,
    SkillType,
    SkillTypeKeys,
    ViewableGameData
} from "../../src/models/game-data";
import { createSkillDecks, SkillDecks } from "./skills";
import { createCivilianPile, LocatedCivilianShips } from "./civilians";
import { loyaltyDeck } from "./loyalty";
import { createCrisisDeck, createSuperCrisisDeck } from "./crisis";
import { createDestinationDeck } from "./destination";
import { refreshView } from "./viewable";
import { InputId, InputRequest, InputResponse } from "../../src/models/inputs";
import { CharacterPool, initCharacterPool } from "../../src/models/character";

export interface FullPlayer {
    userId: string;
    bot: boolean;
    characterId?: CharacterId;
    admiral?: boolean;
    president?: boolean;
    revealedCylon?: boolean;
    location?: LocationId;
    loyaltyCards?: LoyaltyCardId[];
    skillCards?: SkillCard[];
    quorumHand?: QuorumCardId[];
}

export interface ActionCtx {
    action: ActionId,
    ctx?: any;
}

export interface FullGameData {
    inputRequest: InputRequest<any>,
    state: GameState;
    userIds: string[];
    currentPlayer: number;

    // this is only defined at the beginning of the game
    characterPool: CharacterPool;

    jumpPosition: number;

    distance: number;

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
    damagedLocations?: LocationId[]

    // all the various ships that can be on the board
    activeVipers?: LocationCounts;
    activeRaiders?: LocationCounts;
    activeHeavyRaiders?: LocationCounts;
    activeCivilians?: LocatedCivilianShips;
    activeBasestars?: ActiveBasestar[];

    boardedCenturions?: number[];

    quorumDeck?: QuorumCardId[];
    discardedQuorumDeck?: QuorumCardId[];
    destinationDeck?: DestinationCardId[];
    skillDecks?: SkillDecks;
    discardedSkillDecks? : SkillDecks;
    destinyDeck?: SkillCard[];
    crisisDeck?: CrisisCardId[];
    superCrisisDeck?: CrisisCardId[];
    loyaltyDeck?: LoyaltyCardId[];

    currentAction?: ActionCtx;
}

export interface GameDocument {
    gameId: string;
    players: { [key: string]: FullPlayer }
    gameState: FullGameData;
    view?: ViewableGameData;
    responses: { [key: string]: InputResponse<any> }
}

function makeFullPlayer (userId: string, bot: boolean): FullPlayer {
    return {
        userId: userId,
        bot: bot,
        characterId: null,
        admiral: false,
        president: false,
        loyaltyCards: [],
        skillCards: [],
        quorumHand: []
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

function makeFullPlayers(userIds: string[]): { [key: string]: FullPlayer } {
    const result = {};
    userIds.forEach((u, i) => result[u] = makeFullPlayer(u, i !==0 ));
    return result;
}

export function newGame(gameId: string, userIds: string[]): GameDocument {
    const gameState = newGameState(userIds);
    const players = makeFullPlayers(userIds);
    const view = refreshView(gameState, players);
    return {
        gameId: gameId,
        gameState: gameState,
        players: players,
        view: view,
        responses: null
    }
}

function newGameState(userIds: string[]): FullGameData {
    const characterPool = initCharacterPool();
    return {
        inputRequest: {
            userId: userIds[0],
            inputId: InputId.SelectCharacter,
            ctx: characterPool
        } as InputRequest<CharacterPool>,
        characterPool: characterPool,
        state: GameState.CharacterSelection,
        userIds: userIds,
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
        boardedCenturions: new Array(4).fill(0),
        galacticaDamage: createGalacticaDamageTokens(),
        basestarDamage: createBasestarDamageTokens(),
        civilianShips: createCivilianPile(),
        nukes: 2,
        damagedVipers: 0,
        distance: 0
    }
}

function findPlayerByCharacter(players: FullPlayer[], character: CharacterId) : FullPlayer {
    return players.filter(p => p.characterId === character)[0];
}

export function distributeTitles(players: FullPlayer[]) {
    flagPresident(players);
    flagAdmiral(players);
}

export function setupDecks(game: FullGameData) {
    game.quorumDeck = createQuorumDeck();
    game.crisisDeck = createCrisisDeck();
    game.superCrisisDeck = createSuperCrisisDeck();
    game.destinationDeck = createDestinationDeck();
    game.skillDecks = createSkillDecks();
}

export function setupDestinyDeck(game: FullGameData) {
    const destiny: SkillCard[] = [];
    addCards(destiny, deal(skillDeck(game, SkillType.Tactics), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Engineering), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Piloting), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Politics), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Leadership), 2));
    shuffle(destiny);
    game.destinyDeck = destiny;
}

export function setupLoyalty(gameDoc: GameDocument) {
    const players = Object.values(gameDoc.players);
    const extraHumans = players.filter(
        p => p.characterId === CharacterId.GaiusBaltar ||
        p.characterId === CharacterId.SharonValerii).length;
    const loyalties = loyaltyDeck(gameDoc.gameState.userIds.length, extraHumans);
    players.forEach(p => addCard(p.loyaltyCards!, dealOne(loyalties.distributed)));
    const baltar = findPlayerByCharacter(players, CharacterId.GaiusBaltar);
    if (baltar) {
        addCard(baltar.loyaltyCards!, dealOne(loyalties.distributed));
    }
    gameDoc.gameState.loyaltyDeck = loyalties.remaining;
}

export function setupInitialShips(game: FullGameData) {
    game.activeBasestars = [createActiveBasestar(LocationId.Front)];
    placeVipers(game, LocationId.FrontBelow, 1);
    placeVipers(game, LocationId.BackBelow, 1);
    placeRaiders(game, LocationId.Front, 3);
    placeCivilians(game, LocationId.Back, 2);
}

export function dealSkillCard(game: FullGameData, skillType: SkillType): SkillCard {
    const skillKey = SkillType[skillType] as SkillTypeKeys;
    if (game.skillDecks[skillKey].length === 0) {
        game.skillDecks[skillKey] = shuffle(game.discardedSkillDecks[skillKey]);
        game.discardedSkillDecks[skillKey] = [];
    }
    return dealOne(game.skillDecks[skillKey]);
}

export function dealSkillCards(game: FullGameData, skillType: SkillType, count: number): SkillCard[] {
    const cards = [];
    for (let i = 0; i < count; i++) {
        cards.push(dealSkillCard(game, skillType))
    }
    return cards;
}

export function dealQuorumCard(game: FullGameData): QuorumCardId {
    if (game.quorumDeck.length === 0) {
        game.quorumDeck = shuffle(game.discardedQuorumDeck);
        game.discardedQuorumDeck = [];
    }
    return dealOne(game.quorumDeck);
}

export function dealQuorumCards(game: FullGameData, count: number): QuorumCardId[] {
    const cards = [];
    for (let i = 0; i < count; i++) {
        cards.push(dealQuorumCard(game))
    }
    return cards;
}

export function discardQuorumCard(game: FullGameData, player: FullPlayer, card: QuorumCardId) {
    const index = player.quorumHand.findIndex(q => q === card);
    const usedCard = player.quorumHand.splice(index, 1);
    addCards(game.discardedQuorumDeck, usedCard);
}

export function removeQuorumCard(game: FullGameData, player: FullPlayer, card: QuorumCardId) {
    const index = player.quorumHand.findIndex(q => q === card);
    player.quorumHand.splice(index, 1);
}

function placeVipers(game: FullGameData, location: LocationId, count: number) {
    game.activeVipers = game.activeVipers ? game.activeVipers : {};
    for (let i = 0; i < count; i++) {
        if (game.vipers === 0) {
            return;
        }

        game.vipers--;
        const key = LocationId[location] as LocationIdKeys;
        if (game.activeVipers![key] === undefined) {
            game.activeVipers![key] = 0;
        }
        game.activeVipers![key]!++;
    }
}

function placeRaiders(game: FullGameData, location: LocationId, count: number) {
    game.activeRaiders = game.activeRaiders ? game.activeRaiders : {};
    for (let i = 0; i < count; i++) {
        if (game.raiders === 0) {
            return;
        }

        game.raiders--;
        const key = LocationId[location] as LocationIdKeys;
        if (game.activeRaiders![key] === undefined) {
            game.activeRaiders![key] = 0;
        }
        game.activeRaiders![key]!++;
    }
}


function placeHeavyRaiders(game: FullGameData, location: LocationId, count: number) {
    game.activeHeavyRaiders = game.activeHeavyRaiders ? game.activeHeavyRaiders : {};
    for (let i = 0; i < count; i++) {
        if (game.heavyRaiders === 0) {
            return;
        }

        game.heavyRaiders--;
        const key = LocationId[location] as LocationIdKeys;
        if (game.activeHeavyRaiders![key] === undefined) {
            game.activeHeavyRaiders![key] = 0;
        }
        game.activeHeavyRaiders![key]!++;
    }
}

function placeCivilians(game: FullGameData, location: LocationId, count: number) {
    game.activeCivilians = game.activeCivilians ? game.activeCivilians : {};
    for (let i = 0; i < count; i++) {
        if (game.civilianShips.length === 0) {
            return;
        }

        const civilian = dealOne(game.civilianShips);
        const key = LocationId[location] as LocationIdKeys;
        if (game.activeCivilians![key] === undefined) {
            game.activeCivilians![key] = [];
        }
        game.activeCivilians![key]!.push(civilian);
    }
}

function skillDeck(game: FullGameData, skill: SkillType): SkillCard[] {
    const key = SkillType[skill] as SkillTypeKeys;
    return game.skillDecks![key]!;
}

function flagPresident(players: FullPlayer[]) {

    const laura = findPlayerByCharacter(players, CharacterId.LauraRoslin);
    if (laura) {
        laura.president = true;
        return;
    }
    const gaius = findPlayerByCharacter(players, CharacterId.GaiusBaltar);
    if (gaius) {
        gaius.president = true;
        return;
    }
    const tom = findPlayerByCharacter(players, CharacterId.TomZarek);
    if (tom) {
        tom.president = true;
        return;
    }
}

function flagAdmiral(players: FullPlayer[]) {
    const will = findPlayerByCharacter(players, CharacterId.WilliamAdama);
    if (will) {
        will.admiral = true;
        return;
    }
    const saul = findPlayerByCharacter(players, CharacterId.SaulTigh);
    if (saul) {
        saul.admiral = true;
        return;
    }
    const helo = findPlayerByCharacter(players, CharacterId.KarlAgathon);
    if (helo) {
        helo.admiral = true;
        return;
    }
}

export function getCurrentPlayer(gameDoc: GameDocument): FullPlayer {
    return gameDoc.players[gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer]];
}

export function getPlayer(gameDoc: GameDocument, userId: string): FullPlayer {
    return gameDoc.players[userId];
}

export function roll(): number {
    return Math.floor(Math.random() * 8) + 1;
}