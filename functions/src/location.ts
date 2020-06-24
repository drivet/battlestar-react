import { FullPlayer, GameDocument } from "./game";
import {
    CharacterType,
    GameState,
    getCharacter,
    LocationId,
    SkillCard,
    SkillType
} from "../../src/models/game-data";
import { InputId, MoveSelectionInput, MoveSelectionRequest } from "../../src/models/inputs";
import { getCurrentPlayer } from "./game-manager";
import { addCardToTop, removeCard } from "./deck";
import { isSpace, requiresDiscard } from "../../src/models/location";
import { findMatchingSkillCard } from "./skills";

export function handleMovement(gameDoc: GameDocument, possibleInput: MoveSelectionInput) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    const input: MoveSelectionInput = !possibleInput && currentPlayer.bot ?
        createBotMoveSelectionInput(gameDoc, currentPlayer): possibleInput;

    if (input) {
        currentPlayer.location = input.location;
        if (input.discardedSkill) {
            const cardFromHand: SkillCard = findMatchingSkillCard(currentPlayer, input.discardedSkill);
            addCardToTop(gameDoc.gameState.discardedSkillDecks[SkillType[cardFromHand.type]], cardFromHand);
            removeCard(currentPlayer.skillCards, cardFromHand);
        }
        gameDoc.gameState.state = GameState.Action;
    } else {
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.Movement,
            availableLocations: getAvailableLocations(gameDoc, currentPlayer)
        } as MoveSelectionRequest;
    }
}

function createBotMoveSelectionInput(gameDoc: GameDocument, player: FullPlayer): MoveSelectionInput {
    const availableLocations = getAvailableLocations(gameDoc, player);
    const location = availableLocations[0];
    return {
        userId: player.userId,
        inputId: InputId.ReceiveInitialSkills,
        location: location,
        discardedSkill: requiresDiscard(location, player) ? player.skillCards[0] : undefined
    }
}

function getAvailableLocations(gameDoc: GameDocument, player: FullPlayer): LocationId[] {
    if (player.revealedCylon) {
        return [LocationId.Caprica, LocationId.ResurrectionShip,
            LocationId.HumanFleet, LocationId.CylonFleet];
    }
    const locations = [
        LocationId.PressRoom,
        LocationId.PresidentsOffice,
        LocationId.Administration,
        LocationId.AdmiralsQuarters,
        LocationId.Armory,
        LocationId.ResearchLab,
        LocationId.HangarDeck,
        LocationId.Command,
        LocationId.Communications,
        LocationId.WeaponsControl,
        LocationId.FtlControl
    ];
    const c = getCharacter(player.characterId);
    if (c.type === CharacterType.Pilot) {
        if (!isSpace(player.location)) {
            locations.push(...[LocationId.BackBelow, LocationId.FrontBelow]);
        } else {
            locations.push(...getAdjacentLocations(player.location));
        }
    }
    return locations;
}

function getAdjacentLocations(location: LocationId): LocationId[] {
    if (!isSpace(location)) {
        console.log('location is not in space, no adjacent location: ' + location);
        return null;
    }

    if (location === LocationId.Front) {
        return [LocationId.FrontBelow, LocationId.FrontAbove];
    } else if (location === LocationId.Back) {
        return [LocationId.BackBelow, LocationId.BackAbove];
    } else if (location === LocationId.FrontAbove) {
        return [LocationId.Front, LocationId.BackAbove];
    } else if (location === LocationId.FrontBelow) {
        return [LocationId.Front, LocationId.BackBelow];
    } else if (location === LocationId.BackAbove) {
        return [LocationId.FrontAbove, LocationId.Back];
    } else if (location === LocationId.BackBelow) {
        return [LocationId.FrontBelow, LocationId.Back];
    } else {
        // should not happen
        console.warn('unknown location for adjacent check: ' + location);
        return null;
    }
}
