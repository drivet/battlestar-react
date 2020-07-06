import { GameDocument } from "../game";
import { ActionId } from "../../../src/models/game-data";
import { actionNothing } from "../actions/nothing";
import { actionDrawQuorumCard } from "../actions/draw-quorum-card";
import { actionPressRoom } from "../actions/press-room";
import { actionInspirationalSpeech } from "../actions/inspirational-speech";
import { actionFoodRationing } from "../actions/food-rationing";

export function handleAction(gameDoc: GameDocument) {
    const action = gameDoc.gameState.currentAction.action;
    const actionFn = lookupActionHandler(action);
    actionFn(gameDoc);
}

function lookupActionHandler(action: ActionId) {
    if (action === ActionId.Nothing) {
        return actionNothing;
    } else if (action === ActionId.DrawQuorumCard) {
        return actionDrawQuorumCard;
    } else if (action === ActionId.PressRoom) {
        return actionPressRoom;
    } else if (action === ActionId.InspirationalSpeech) {
        return actionInspirationalSpeech;
    } else if (action === ActionId.FoodRationing) {
        return actionFoodRationing;
    }
}
