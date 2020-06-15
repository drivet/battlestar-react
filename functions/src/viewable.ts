import { FullGameData, FullPlayer } from "./game";
import {
    LocationCounts,
    LocationIdKeys,
    PlayerData, SkillDeckCounts, SkillTypeKeys,
    ViewableGameData
} from "../../src/models/game-data";
import { LocatedCivilianShips } from "./civilians";
import { SkillDecks } from "./skills";

function redactActiveCivilians(locatedCivilians: LocatedCivilianShips): LocationCounts {
    if (locatedCivilians) {
        const result: LocationCounts = {};
        Object.keys(locatedCivilians).forEach(k => {
            const key = k as LocationIdKeys;
            result[key] = locatedCivilians[key]!.length;
        });
        return result;
    } else {
        return null;
    }
}

function redactPlayer(player: FullPlayer): PlayerData {
    const data: PlayerData = {
        userId: player.userId,
        admiral: player.admiral,
        president: player.president,
    }
    if (player.characterId) {
        data.characterId = player.characterId;
    }
    if (player.location) {
        data.location = player.location
    }
    return data;
}

function redactSkillDecks(skillDecks: SkillDecks): SkillDeckCounts {
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

export function convertToViewable(full: FullGameData, players: { [key: string]: FullPlayer}): ViewableGameData {
    const redactedPlayers = full.userIds.map(u => players[u]).map(redactPlayer);
    return {
        inputRequest: full.inputRequest,
        state: full.state,
        players: redactedPlayers,
        currentPlayer: full.currentPlayer,
        selectableCharacters: full.characterPool ? full.characterPool.selectable : null,
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
        activeVipers: full.activeVipers ? full.activeVipers: null,
        activeRaiders: full.activeRaiders ? full.activeRaiders: null,
        activeHeavyRaiders: full.activeHeavyRaiders ? full.activeHeavyRaiders: null,
        activeCivilians: redactActiveCivilians(full.activeCivilians),
        activeBasestars: full.activeBasestars ? full.activeBasestars : null,
        boardedCenturions: full.boardedCenturions ? full.boardedCenturions: null,
        nukes: full.nukes,
        jumpPosition: full.jumpPosition,
        quorumDeck: full.quorumDeck ? full.quorumDeck.length : 0,
        destinationDeck: full.destinationDeck ? full.destinationDeck.length: 0,
        destinyDeck: full.destinyDeck ? full.destinyDeck.length: 0,
        crisisDeck: full.crisisDeck ? full.crisisDeck.length: 0,
        superCrisisDeck: full.superCrisisDeck ? full.superCrisisDeck.length: 0,
        loyaltyDeck: full.loyaltyDeck ? full.loyaltyDeck.length: 0,
        skillDecks: redactSkillDecks(full.skillDecks!)
    }
}