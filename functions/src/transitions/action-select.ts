import { GameDocument, getCurrentPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { Input, makeRequest } from "../inputs/input";
import { AvailableActions, getAvailableActions } from "../../../src/actions";
import { ActionId, GameState, SelectedAction } from "../../../src/models/game-data";

export function handleActionSelection(gameDoc: GameDocument, input: Input<SelectedAction>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest = makeRequest(InputId.SelectAction, player.userId);
        return;
    }

    if (!validate(input.data, getAvailableActions(gameDoc.view, player))) {
        throw new Error('invalid action selected ' + input.data);
    }

    gameDoc.gameState.currentAction = input.data.actionId;
    gameDoc.gameState.state = GameState.Action;
}

function validate(selectedAction: SelectedAction, availActions: AvailableActions): boolean {
    const allActions = [
        ...ensure(availActions.locationActions),
        ...ensure(availActions.miscActions),
        ...ensure(availActions.loyaltyActions),
        ...ensure(availActions.skillActions),
        ...ensure(availActions.quorumActions),
        ...ensure(availActions.characterActions),
        ...ensure(availActions.titleActions)];
    return allActions.indexOf(selectedAction.actionId) !== -1;
}

function ensure(actionIds: ActionId[]): ActionId[] {
    return actionIds ? actionIds : [];
}
