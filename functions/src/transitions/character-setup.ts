import { FullPlayer, GameDocument, getCurrentPlayer } from "../game";
import { CharacterId, GameState, getCharacter, LocationId } from "../../../src/models/game-data";
import { Input, InputId } from "../../../src/models/inputs";
import { makeRequest } from "../input";
import { nextPlayerAndChangeState } from "./defs";

export function handleCharacterSetup(gameDoc: GameDocument, input: Input<boolean>) {
    const player = getCurrentPlayer(gameDoc);
    if (player.characterId === CharacterId.LeeAdama) {
        handleApolloSetup(gameDoc, input, player);
    } else {
        handleStandardCharacterSetup(gameDoc, player);
    }
}

function handleApolloSetup(gameDoc: GameDocument, input: Input<boolean>, player: FullPlayer) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SelectInitialLocation, getCurrentPlayer(gameDoc).userId);
        return;
    }
    player.location = input.data ? LocationId.FrontBelow : LocationId.BackBelow;
    gameDoc.gameState.vipers--;
    nextPlayerAndChangeState(gameDoc, GameState.SetupCards)
}

function handleStandardCharacterSetup(gameDoc: GameDocument, player: FullPlayer) {
    const character = getCharacter(player.characterId);
    if (character.startLocation !== null && character.startLocation !== undefined) {
        player.location = getCharacter(player.characterId).startLocation;
    }
    nextPlayerAndChangeState(gameDoc, GameState.SetupCards)
}
