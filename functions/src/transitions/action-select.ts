import { GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { makeRequest } from "../input";
import { getAvailableActions } from "../../../src/actions";
import { ActionId, GameState } from "../../../src/models/game-data";

export function handleActionSelection(gameDoc: GameDocument, input: Input<ActionId, ActionId[]>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SelectAction, player.userId, getAvailableActions(gameDoc.view, player));
        return;
    }

    if (input.ctx.indexOf(input.data) === -1) {
        throw new Error('invalid action selected');
    }

    gameDoc.gameState.currentAction = {
        action: input.data
    }
    gameDoc.gameState.state = GameState.Action;
}
