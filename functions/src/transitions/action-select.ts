import { GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { makeRequest } from "../input";
import { AvailableActions, getAvailableActions } from "../../../src/actions";
import { ActionId, GameState } from "../../../src/models/game-data";

export function handleActionSelection(gameDoc: GameDocument, input: Input<ActionId>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest = makeRequest(InputId.SelectAction, player.userId);
        return;
    }

    if (!validate(input.data, getAvailableActions(gameDoc.view, player))) {
        throw new Error('invalid action selected ' + input.data);
    }

    gameDoc.gameState.currentAction = {
        action: input.data
    }
    gameDoc.gameState.state = GameState.Action;
}

function validate(action: ActionId, availActions: AvailableActions): boolean {
    const allActions = [
        ...ensure(availActions.locationActions),
        ...ensure(availActions.miscActions),
        ...ensure(availActions.loyaltyActions),
        ...ensure(availActions.skillActions),
        ...ensure(availActions.quorumActions),
        ...ensure(availActions.characterActions),
        ...ensure(availActions.titleActions)];
    return allActions.indexOf(action) !== -1;
}

function ensure(actionIds: ActionId[]): ActionId[] {
    return actionIds ? actionIds : [];
}
