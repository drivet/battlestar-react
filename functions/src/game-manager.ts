import { GameState } from "../../src/models/game-data";
import { FullPlayer, GameDocument } from "./game";
import { handleMovement } from "./transitions/movement";
import { handleSelectCharacter } from "./transitions/character-select";
import { handleCharacterSetup } from "./transitions/character-setup";
import { setupDecksAndTitles } from "./transitions/decks-titles";
import { handleReceiveInitialSkills } from "./transitions/initial-skills";
import { handleSetupDestiny } from "./transitions/setup-destiny";
import { handleSetupInitialShips } from "./transitions/initial-ships";
import { handleReceiveSkills } from "./transitions/receive-skills";
import { handleActionSelection } from "./transitions/action-select";
import { sandGameDoc } from "./sand";
import { refreshView } from "./viewable";
import { Input, InputResponse } from "../../src/models/inputs";
import { TransitionFn } from "./transitions/defs";
import { getBotResponse } from "./bots/bots";
import { handleAction } from "./transitions/action";

/**
 * This is always called because someone has given an input which in theory should allow us to continue the game
 */
export function runGame(gameDoc: GameDocument, triggerResponse: InputResponse<any>) {
    sandGameDoc(gameDoc);

    let response = triggerResponse;

    while (response) {
        let input = processInput(gameDoc, response);

        while (!gameDoc.gameState.inputRequest) {
            const transitionFn = getTransitionFn(gameDoc.gameState.state);
            transitionFn(gameDoc, input);
            input = null;
        }

        const userInReq = getUserInRequest(gameDoc);
        response = userInReq.bot ? getBotResponse(gameDoc, userInReq) : null;
    }

    gameDoc.view = refreshView(gameDoc.gameState, gameDoc.players);
}

function processInput(gameDoc: GameDocument, response: InputResponse<any>): Input<any> {
    if (gameDoc.gameState.inputRequest.userId !== response.userId) {
        const msg = 'InputRequest userId: ' + gameDoc.gameState.inputRequest.userId +
            ', response userId: ' + response.userId + ', does not match. Error!';
        throw new Error(msg);
    }

    if (gameDoc.gameState.inputRequest.inputId !== response.inputId) {
        const msg = 'InputRequest inputId: ' + gameDoc.gameState.inputRequest.inputId +
            ', response inputId: ' + response.inputId + ', does not match. Error!'
        throw new Error(msg);
    }

    const input = { ...gameDoc.gameState.inputRequest, ...response };

    // We've captured the input into a data variable, so we can delete the input request
    // Now we crank through the game until we need need another input, which may be a couple of cranks!
    gameDoc.gameState.inputRequest = null;
    gameDoc.responses = null;

    return input;
}

function getTransitionFn(state: GameState): TransitionFn {
    if (state === GameState.CharacterSelection) {
        return handleSelectCharacter;
    } else if (state === GameState.CharacterSetup) {
        return handleCharacterSetup;
    } else if (state === GameState.SetupCards) {
        return setupDecksAndTitles;
    } else if (state === GameState.InitialSkillSelection) {
        return handleReceiveInitialSkills;
    } else if (state === GameState.SetupDestiny) {
        return handleSetupDestiny;
    } else if (state === GameState.SetupInitialShips) {
        return handleSetupInitialShips;
    } else if (state === GameState.ReceiveSkills) {
        return handleReceiveSkills;
    } else if (state === GameState.Movement) {
        return handleMovement;
    } else if (state === GameState.ActionSelection) {
        return handleActionSelection;
    } else if (state === GameState.Action) {
        return handleAction;
    }
}

function getUserInRequest(gameDoc: GameDocument): FullPlayer {
    const inputRequest = gameDoc.gameState.inputRequest;
    return gameDoc.players[inputRequest.userId];
}
