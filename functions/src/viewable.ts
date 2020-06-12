import { FullGameData, FullPlayer } from "./game-manager";
import {
    LocatedCivilianShips,
    LocationCounts,
    LocationId,
    PlayerData,
    ViewableGameData
} from "../../src/models/game-data";

function redactActiveCivilians(locatedCivilians: LocatedCivilianShips): LocationCounts {
    const result: LocationCounts = {};
    Object.keys(locatedCivilians).forEach(k => {
    });
    return result;
}

function redactPlayer(player: FullPlayer): PlayerData {
    return {
        userId: player.userId,
        characterId: player.characterId,
        admiral: player.admiral,
        president: player.president,
        location: player.location
    }
}

export function convertToViewable(full: FullGameData): ViewableGameData {
    return {
        state: full.state,
        players: full.players.map(redactPlayer),
        currentPlayer: full.currentPlayer,
        food: full.food,
        fuel: full.fuel,
        morale: full.morale,
        population: full.population,
        vipers: full.vipers,
        raptors: full.raptors,
        heavyRaiders: full.heavyRaiders,
        centurions: full.centurions,
        basestars: full.basestars,
        civilianShips: full.civilianShips.length,
        galacticaDamage: full.galacticaDamage.length,
        basestarDamage: full.basestarDamage.length,
        damagedVipers: full.damagedVipers,
        damagedLocations: full.damagedLocations,
        activeVipers: full.activeVipers,
        activeRaiders: full.activeRaiders,
        activeHeavyRaiders: full.activeHeavyRaiders,
        activeCivilians: full.activeCivilians,
        activeBasestars: full.activeBasestars,
        boardedCenturions: full.boardedCenturions,
        nukes: full.nukes,
        jumpPosition: full.jumpPosition,
        quorumDeck: full.quorumDeck!.length,
        destinationDeck: full.destinationDeck!.length,
        destinyDeck: full.destinyDeck!.length,
        crisisDeck: full.crisisDeck!.length,
        superCrisisDeck: full.superCrisisDeck!.length,
        loyaltyDeck: full.loyaltyDeck!.length,
        skillDecks: full.skillDecks
    }
}