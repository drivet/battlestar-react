import { GameDocument } from "./game";
import { InputResponse } from "../../src/models/inputs";

export function processInput(gameDoc: GameDocument, response: InputResponse) {
    // consume the response.  Only need one at a time
    gameDoc.responses = null;

    if (gameDoc.gameState.inputRequest.userId !== response.userId) {
        const msg = 'InputRequest userId: ' + gameDoc.gameState.inputRequest.userId +
            ', response userId: ' + response.userId + ', does not match. Error!';
        console.log(msg);
        return false;
    }

    if (gameDoc.gameState.inputRequest.inputId !== response.inputId) {
        const msg = 'InputRequest inputId: ' + gameDoc.gameState.inputRequest.inputId +
            ', response inputId: ' + response.inputId + ', does not match. Error!'
        console.log(msg);
        return false;
    }

    gameDoc.input = { ...gameDoc.gameState.inputRequest, ...response };

    // We've captured the input into a data variable, so we can delete the input request
    // Now we crank through the game until we need need another input, which may be a couple of cranks!
    gameDoc.gameState.inputRequest = null;
    return true;
}