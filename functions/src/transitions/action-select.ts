import { GameDocument, getCurrentPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { makeRequest } from "../input";
import { getAvailableActions } from "../../../src/actions";

export function handleActionSelection(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    gameDoc.gameState.inputRequest =
        makeRequest(InputId.SelectAction, player.userId, getAvailableActions(gameDoc.view, player));
}
