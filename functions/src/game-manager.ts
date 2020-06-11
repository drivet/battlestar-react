import { SelectedCharacter, SkillCardChoices } from "../../src/models/character";
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
    isSpace,
    LocatedCivilianShips,
    LocationId,
    LoyaltyCardId,
    PlayerData,
    PlayerHand,
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

export interface GameDocument {
    gameId: string;

    // player data that is meant to be secret
    playerHands: { [key: string]: PlayerHand };

    // stockpile of ships and tokens, kept here because they are a surprise
    civilianShips: CivilianShip[];
    galacticaDamage: GalacticaDamage[];
    basestarDamage: BasestarDamage[];

    // the actual civilian ships located on the board
    // kept here because the damage they do when destroyed is a surprise
    activeCivilians: LocatedCivilianShips;

    quorumDeck?: QuorumCardId[];
    destinationDeck?: DestinationCardId[];
    skillDecks?: SkillDecks;
    destinyDeck?: SkillCard[];
    crisisDeck?: CrisisCardId[];
    superCrisisDeck?: CrisisCardId[];
    loyaltyDeck?: LoyaltyCardId[];

    // public state sent to clients
    viewable: ViewableGameData;
}

function makePlayerData (userId: string): PlayerData {
    return {
        userId: userId,
    }
}

function createActiveBasestar(location: LocationId): ActiveBasestar {
    return {
        location: location,
        damage: []
    }
}

export function newGame(gameId: string, userIds: string[]): GameDocument {
    const civilianPile = createCivilianPile();
    return {
        gameId: gameId,
        viewable: {
            state: TurnPhase.Setup,
            players: userIds.map(u => makePlayerData(u)),
            currentPlayer: 0,
            food: 8,
            fuel: 8,
            morale: 10,
            population: 12,
            vipers: 8,
            civilianShips: civilianPile.length,
            raptors: 4,
            raiders: 16,
            heavyRaiders: 4,
            basestars: 2,
            centurions: 4,
            damagedVipers: 0,
            galacticaDamage: 0,
            basestarDamage: 0,
            nukes: 2,
            damagedLocations: [],
            jumpPosition: 0,
            boardedCenturions: [],
            activeVipers: {},
            activeRaiders: {},
            activeHeavyRaiders: {},
            activeCivilians: {},
            activeBasestars: [],

            quorumDeck: 0,
            destinationDeck: 0,
            skillDecks: {},
            destinyDeck: 0,
            crisisDeck: 0,
            superCrisisDeck: 0,
            loyaltyDeck: 0,
        },
        playerHands: {},

        galacticaDamage: [],
        basestarDamage: [],
        activeCivilians: {},
        civilianShips: civilianPile,
    }
}

type Player = [PlayerData, PlayerHand];

function extractHands(game: GameDocument): PlayerHand[] {
    return Object.values(game.playerHands);
}

function extractPlayers(game: GameDocument): Player[] {
    return game.viewable.players.map((p, i) => ([p, game.playerHands[i]]));
}

function findPlayerByCharacter(game: GameDocument, character: CharacterId) : Player {
    return extractPlayers(game).filter(p => p[0].characterId === character)[0];
}

function distributeTitles(game: GameDocument) {
    flagPresident(game);
    flagAdmiral(game);
}

function setupDecks(game: GameDocument) {
    game.quorumDeck = createQuorumDeck();
    game.crisisDeck = createCrisisDeck();
    game.superCrisisDeck = createSuperCrisisDeck();
    game.destinationDeck = createDestinationDeck();
    game.skillDecks = createSkillDecks();

    // update viewable board
    // TODO: do this via triggers
    game.viewable.quorumDeck = game.quorumDeck.length;
    game.viewable.crisisDeck = game.crisisDeck.length;
    game.viewable.superCrisisDeck = game.superCrisisDeck.length;
    game.viewable.destinationDeck = game.destinationDeck.length;
    game.viewable.skillDecks = {
        [SkillType.Tactics]: game.skillDecks[SkillType.Tactics].length,
        [SkillType.Engineering]:  game.skillDecks[SkillType.Engineering].length,
        [SkillType.Piloting]:  game.skillDecks[SkillType.Piloting].length,
        [SkillType.Engineering]:  game.skillDecks[SkillType.Engineering].length,
        [SkillType.Leadership]:  game.skillDecks[SkillType.Leadership].length,,
    }
}

function setupDestinyDeck(game: GameDocument) {
    const destiny: SkillCard[] = [];
    addCards(destiny, deal(skillDeck(game, SkillType.Tactics), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Engineering), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Piloting), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Politics), 2));
    addCards(destiny, deal(skillDeck(game, SkillType.Leadership), 2));
    shuffle(destiny);
    game.destinyDeck = destiny;
}

function setupLoyalty(game: GameDocument) {
    const extraHumans = game.viewable.players.filter(p => p.characterId === CharacterId.GaiusBaltar ||
        p.characterId === CharacterId.SharonValerii)
        .length;
    const loyalties = loyaltyDeck(game.viewable.players.length, extraHumans);
    extractHands(game).forEach(p => addCard(p.loyaltyCards, dealOne(loyalties.distributed)));
    const baltar = findPlayerByCharacter(game, CharacterId.GaiusBaltar);
    if (baltar) {
        addCard(baltar[1].loyaltyCards, dealOne(loyalties.distributed));
    }
    game.loyaltyDeck = loyalties.remaining;
}

function setupInitialShips(game: GameDocument) {
    game.viewable.activeBasestars = [createActiveBasestar(LocationId.Front)];
    placeViper(game, LocationId.FrontBelow);
    placeViper(game, LocationId.BackBelow);
    placeRaiders(game, LocationId.Front, 3);
    placeCivilians(game, LocationId.Back, 2);
}

function placeViper(game: GameDocument, location: LocationId) {
    if (game.viewable.vipers === 0) {
        throw new Error('There are no more vipers');
    }

    game.viewable.vipers--;
    if (game.viewable.activeVipers[location] === undefined) {
        game.viewable.activeVipers[location] = 0;
    }
    game.viewable.activeVipers[location]++;
}

function placeRaiders(game: GameDocument, location: LocationId, count: number) {
    for (let i = 0; i < count; i++) {
        if (game.viewable.raiders === 0) {
            return;
        }

        game.viewable.raiders--;
        if (game.viewable.activeRaiders[location] === undefined) {
            game.viewable.activeRaiders[location] = 0;
        }
        game.viewable.activeRaiders[location]++;
    }
}

function placeCivilians(game: GameDocument, location: LocationId, count: number) {
    for (let i = 0; i < count; i++) {
        if (game.civilianShips.length === 0) {
            return;
        }

        const civilian = dealOne(game.civilianShips);
        if (game.activeCivilians[location] === undefined) {
            game.activeCivilians[location] = [];
        }
        game.activeCivilians[location].push(civilian);

        game.viewable.civilianShips--;
        if (game.viewable.activeCivilians[location] === undefined) {
            game.viewable.activeCivilians[location] = 0;
        }
        game.viewable.activeCivilians[location]++;
    }
}

function skillDeck(game: GameDocument, skill: SkillType): SkillCard[] {
    return game.skillDecks[skill];
}

function flagPresident(game: GameDocument) {
    const laura = findPlayerByCharacter(game, CharacterId.LauraRoslin);
    if (laura) {
        laura[0].president = true;
        return;
    }
    const gaius = findPlayerByCharacter(game, CharacterId.GaiusBaltar);
    if (gaius) {
        gaius[0].president = true;
        return;
    }
    const tom = findPlayerByCharacter(game, CharacterId.TomZarek);
    if (tom) {
        tom[0].president = true;
        return;
    }
}

function flagAdmiral(game: GameDocument) {
    const will = findPlayerByCharacter(game, CharacterId.WilliamAdama);
    if (will) {
        will[0].admiral = true;
        return;
    }
    const saul = findPlayerByCharacter(game, CharacterId.SaulTigh);
    if (saul) {
        saul[0].admiral = true;
        return;
    }
    const helo = findPlayerByCharacter(game, CharacterId.KarlAgathon);
    if (helo) {
        helo[0].admiral = true;
        return;
    }
}

function selectCharacter(game: GameDocument, selectedCharacter: SelectedCharacter) {
    const player = this.gameData.players[this.gameData.currentPlayer];
    player.characterId = selectedCharacter.character;
    if (selectedCharacter.location) {
        if(isSpace(selectedCharacter.location)) {
            this.placeViper(selectedCharacter.location)
        }
        player.location = selectedCharacter.location;
    }
    this.gameData.currentPlayer++;
}

export class GameData2 {

    constructor(public gameData: GameData) {}

    currentPlayer(): PlayerData {
        return this.gameData.players[this.gameData.currentPlayer]
    }

    player(userId: string): PlayerData {
        return this.gameData.players.find(p => p.userId === userId);
    }


    receiveSkills(player: PlayerData, skillCards: SkillCardChoices) {
        skillCards.forEach(c => addCards(player.skillCards, deal(this.skillDeck(c.skill), c.count)));
    }

}
