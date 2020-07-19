import { FullGameData, FullPlayer } from "./game";
import {
    LocationCounts,
    LocationIdKeys,
    PlayerData,
    SkillCardId,
    SkillCards,
    SkillDeckCounts,
    SkillType,
    SkillTypeKeys,
    ViewableGameData
} from "../../src/models/game-data";
import { LocatedCivilianShips } from "./civilians";
import { SkillCardDecks } from "./skill-cards";

function redactActiveCivilians(locatedCivilians: LocatedCivilianShips): LocationCounts {
    if (locatedCivilians) {
        const result: LocationCounts = {};
        Object.keys(locatedCivilians).forEach(k => {
            const key = k as LocationIdKeys;
            result[key] = locatedCivilians[key]!.length;
        });
        return result;
    } else {
        return {};
    }
}

function redactPlayer(player: FullPlayer): PlayerData {
    const playerData: PlayerData = {
        userId: player.userId,
        admiral: player.admiral,
        president: player.president,
        skillCounts: {}
    }
    if (player.characterId !== undefined) {
        playerData.characterId = player.characterId
    }
    if (player.location !== undefined) {
        playerData.location = player.location;
    }
    playerData.skillCounts = countSkills(player.skillCards);
    playerData.quorumCount = player.quorumHand.length;
    playerData.loyaltyCount = player.loyaltyCards.length;
    return playerData;
}

function redactSkillDecks(skillDecks: SkillCardDecks): SkillDeckCounts {
    if (skillDecks) {
        const result: SkillDeckCounts = {};
        Object.keys(skillDecks).forEach(k => {
            const key = k as SkillTypeKeys;
            result[key] = skillDecks[key]!.length;
        });
        return result;
    } else {
        return null;
    }
}

function countSkills(skillCards: SkillCardId[]): SkillDeckCounts {
    const result: SkillDeckCounts = {};
    skillCards.forEach(c => {
        const card = SkillCards[SkillCardId[c]];
        const key = SkillType[card.type];
        if (!result[key]) {
            result[key] = 0;
        }
        result[key]++;
    });
    return result;
}

export function refreshView(full: FullGameData, players: { [key: string]: FullPlayer}): ViewableGameData {
    const redactedPlayers = full.userIds.map(u => players[u]).map(redactPlayer);
    return {
        inputRequest: full.inputRequest,
        state: full.state,
        players: redactedPlayers,
        currentPlayer: full.currentPlayer,
        selectableCharacters: full.characterPool ? full.characterPool.selectable : null,
        distance: full.distance,
        food: full.food,
        fuel: full.fuel,
        morale: full.morale,
        population: full.population,
        vipers: full.vipers,
        raptors: full.raptors,
        raiders: full.raiders,
        heavyRaiders: full.heavyRaiders,
        centurions: full.centurions,
        basestars: full.basestars,
        civilianShips: full.civilianShips.length,
        galacticaDamage: full.galacticaDamage.length,
        basestarDamage: full.basestarDamage.length,
        damagedVipers: full.damagedVipers,
        damagedLocations: full.damagedLocations ? full.damagedLocations : null,
        activeVipers: full.activeVipers ? full.activeVipers: {},
        activeRaiders: full.activeRaiders ? full.activeRaiders: {},
        activeHeavyRaiders: full.activeHeavyRaiders ? full.activeHeavyRaiders: {},
        activeCivilians: redactActiveCivilians(full.activeCivilians),
        activeBasestars: full.activeBasestars ? full.activeBasestars : [],
        boardedCenturions: full.boardedCenturions,
        nukes: full.nukes,
        jumpPosition: full.jumpPosition,
        quorumDeck: full.quorumDeck ? full.quorumDeck.length : 0,
        destinationDeck: full.destinationDeck ? full.destinationDeck.length: 0,
        destinyDeck: full.destinyDeck ? full.destinyDeck.length: 0,
        crisisDeck: full.crisisDeck ? full.crisisDeck.length: 0,
        superCrisisDeck: full.superCrisisDeck ? full.superCrisisDeck.length: 0,
        loyaltyDeck: full.loyaltyDeck ? full.loyaltyDeck.length: 0,
        skillDecks: redactSkillDecks(full.skillDecks!),
        discardedSkillDecks: full.discardedSkillDecks ? full.discardedSkillDecks : null,
    }
}