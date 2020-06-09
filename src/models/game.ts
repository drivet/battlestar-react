import { createSkillDecks, SkillCard, SkillDecks, SkillType } from "./skills";
import { LoyaltyCardId, loyaltyDeck } from "./loyalty";
import { addCard, addCards, deal, dealOne, shuffle } from "./deck";
import { CharacterId, SelectedCharacter, SkillCardChoices } from "./character";
import { isSpace, LocationId, LocationIdKeys } from "./locations";
import { createQuorumDeck, QuorumCardId } from "./quorum";
import { createCrisisDeck, createSuperCrisisDeck, CrisisCardId } from "./crisis";
import { createDestinationDeck, DestinationCardId } from "./destination";
import { CivilianShip, createCivilianPile } from "./civilians";


function createActiveBasestar(location: LocationId) {
    return {
        location: location,
        damage: []
    }
}

export interface GameEntry {
    gameId: string;
    users: number;
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

export type LocationCounts = {
    [key in LocationIdKeys]?: number;
}

export type LocatedCivilians = {
    [key in LocationIdKeys]?: CivilianShip[];
}

export interface PlayerData {
    userId: string;
    characterId: CharacterId;
    admiral: boolean;
    president: boolean;
    location: LocationId;
    loyaltyCards: LoyaltyCardId[];
    skillCards: SkillCard[];
}

export interface GameData {
    gameId: string;
    players: PlayerData[];
    currentPlayer: number;

    // stockpile of ships and tokens
    vipers: number;
    raptors: number;
    civilianShips: CivilianShip[];
    raiders: number;
    heavyRaiders: number;
    centurions: number;
    basestars: number;
    galacticaDamage: GalacticaDamage[];
    basestarDamage: BasestarDamage[];

    // resource counters
    food: number;
    fuel: number;
    morale: number;
    population: number;

    damagedVipers: number;
    activeVipers: LocationCounts;
    activeRaiders: LocationCounts;
    activeHeavyRaiders: LocationCounts;
    boardedCenturions: number[];
    activeBasestars: ActiveBasestar[];
    activeCivilians: LocatedCivilians;

    // can only be used by the Admiral
    nukes: number;

    // can only be used by the President
    quorumDeck: QuorumCardId[];
    destinationDeck: DestinationCardId[];
    jumpPosition: number;
    skillDecks: SkillDecks;
    destinyDeck: SkillCard[];
    crisisDeck: CrisisCardId[];
    superCrisisDeck: CrisisCardId[];
    loyaltyDeck: LoyaltyCardId[];
    damagedLocations: LocationId[];
}

export class Game {
    static newGame(gameId: string, users: string[]): GameData {
        return {
            gameId: gameId,
            players: users.map(u => ({
                userId: u,
                characterId: null,
                admiral: false,
                president: false,
                location: null,
                loyaltyCards: [],
                skillCards: []
            })),
            currentPlayer: 0,
            vipers: 8,
            raptors: 4,
            raiders: 16,
            heavyRaiders: 4,
            basestars: 2,
            centurions: 4,
            damagedVipers: 0,
            nukes: 2,
            food: 8,
            fuel: 8,
            morale: 10,
            population: 12,
            galacticaDamage: [],
            basestarDamage: [],
            boardedCenturions: [],
            jumpPosition: 0,
            activeVipers: {},
            activeRaiders: {},
            activeHeavyRaiders: {},
            activeBasestars: [],
            activeCivilians: {},
            damagedLocations: [],
            quorumDeck: [],
            destinationDeck: [],
            skillDecks: createSkillDecks(),
            destinyDeck: [],
            crisisDeck: [],
            civilianShips: createCivilianPile(),
            loyaltyDeck: [],
            superCrisisDeck: []
        }
    }

    constructor(public game: GameData) {}

    selectCharacter(selectedCharacter: SelectedCharacter) {
        const player = this.game.players[this.game.currentPlayer];
        player.characterId = selectedCharacter.character;
        if (selectedCharacter.location) {
            if(isSpace(selectedCharacter.location)) {
                this.placeViper(selectedCharacter.location)
            }
            player.location = selectedCharacter.location;
        }
        this.game.currentPlayer++;
    }

    distributeTitles() {
        this.flagPresident();
        this.flagAdmiral();
    }

    setupLoyalty() {
        const extraHumans = this.game.players.filter(p => p.characterId === CharacterId.GaiusBaltar ||
            p.characterId === CharacterId.SharonValeri)
            .length;
        const loyalties = loyaltyDeck(this.game.players.length, extraHumans);
        this.game.players.forEach(p => addCard(p.loyaltyCards, dealOne(loyalties.distributed)));
        this.game.loyaltyDeck = loyalties.remaining;
    }

    setupDecks() {
        this.game.quorumDeck = createQuorumDeck();
        this.game.crisisDeck = createCrisisDeck();
        this.game.superCrisisDeck = createSuperCrisisDeck();
        this.game.destinationDeck = createDestinationDeck();
        this.game.skillDecks = createSkillDecks();
    }

    receiveSkills(player: PlayerData, skillCards: SkillCardChoices) {
        skillCards.forEach(c => addCards(player.skillCards, deal(this.skillDeck(c.skill), c.count)));
    }

    setupDestinyDeck() {
        const destiny: SkillCard[] = [];
        addCards(destiny, deal(this.skillDeck(SkillType.Tactics), 2));
        addCards(destiny, deal(this.skillDeck(SkillType.Engineering), 2));
        addCards(destiny, deal(this.skillDeck(SkillType.Piloting), 2));
        addCards(destiny, deal(this.skillDeck(SkillType.Politics), 2));
        addCards(destiny, deal(this.skillDeck(SkillType.Leadership), 2));
        shuffle(destiny);
        this.game.destinyDeck = destiny;
    }

    setupInitialShips() {
        this.game.activeBasestars = [createActiveBasestar(LocationId.Front)];
        this.placeViper(LocationId.FrontBelow);
        this.placeViper(LocationId.BackBelow);
        this.placeRaiders(LocationId.Front, 3);
        this.placeCivilians(LocationId.Back, 2);
    }

    private skillDeck(skill: SkillType): SkillCard[] {
        return this.game.skillDecks[SkillType[skill]];
    }

    private placeViper(location: LocationId) {
        if (this.game.vipers === 0) {
            throw new Error('There are no more vipers');
        }

        this.game.vipers--;
        const locationKey = LocationId[location];
        if (this.game.activeVipers[locationKey] === undefined) {
            this.game.activeVipers[locationKey] = 0;
        }
        this.game.activeVipers[locationKey]++;
    }

    private placeRaiders(location: LocationId, count: number) {
        for (let i = 0; i < count; i++) {
            if (this.game.raiders === 0) {
                return;
            }

            this.game.raiders--;
            const locationKey = LocationId[location];
            if (this.game.activeRaiders[locationKey] === undefined) {
                this.game.activeRaiders[locationKey] = 0;
            }
            this.game.activeRaiders[locationKey]++;
        }
    }

    private placeCivilians(location: LocationId, count: number) {
        for (let i = 0; i < count; i++) {
            if (this.game.civilianShips.length === 0) {
                return;
            }

            const civilian = dealOne(this.game.civilianShips);
            const locationKey = LocationId[location];
            if (this.game.activeCivilians[locationKey] === undefined) {
                this.game.activeCivilians[locationKey] = [];
            }
            this.game.activeRaiders[locationKey].push(civilian);
        }
    }

    private flagPresident() {
        const laura = this.findPlayer(CharacterId.LauraRoslin);
        if (laura) {
            laura.president = true;
            return;
        }
        const gaius = this.findPlayer(CharacterId.GaiusBaltar);
        if (gaius) {
            gaius.president = true;
            return;
        }
        const tom = this.findPlayer(CharacterId.TomZarek);
        if (tom) {
            tom.president = true;
            return;
        }
    }

    private flagAdmiral() {
        const will = this.findPlayer(CharacterId.WilliamAdama);
        if (will) {
            will.admiral = true;
            return;
        }
        const saul = this.findPlayer(CharacterId.SaulTigh);
        if (saul) {
            saul.admiral = true;
            return;
        }
        const helo = this.findPlayer(CharacterId.KarlAgathon);
        if (helo) {
            helo.admiral = true;
            return;
        }
    }

    private findPlayer(character: CharacterId) {
        return this.game.players.find(p => p.characterId === CharacterId.LauraRoslin);
    }
}
