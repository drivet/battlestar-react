import { GameDocument } from "../game";
import { ActionId } from "../../../src/models/game-data";
import { actionNothing } from "../actions/nothing";
import { actionDrawQuorumCard } from "../actions/draw-quorum-card";
import { actionPressRoom } from "../actions/press-room";
import { actionInspirationalSpeech } from "../actions/inspirational-speech";
import { actionFoodRationing } from "../actions/food-rationing";
import { actionConsolidatePower } from "../actions/consolidate-power";
import { actionArrestOrder } from "../actions/arrest-order";
import { Input } from "../../../src/models/inputs";
import { actionResearchLab } from "../actions/research-lab";
import { actionEncourageMutiny } from "../actions/encourage-mutiny";
import { TransitionFn } from "./defs";
import { actionArmory } from "../actions/armory";

export function handleAction(gameDoc: GameDocument, input: Input<any, any>) {
    const action = gameDoc.gameState.currentAction.action;
    const actionFn: TransitionFn = lookupActionHandler(action);
    actionFn(gameDoc, input);
}

function lookupActionHandler(action: ActionId): TransitionFn {
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
    } else if (action === ActionId.ConsolidatePower) {
        return actionConsolidatePower;
    } else if (action === ActionId.ArrestOrder) {
        return actionArrestOrder;
    } else if (action === ActionId.ResearchLab) {
        return actionResearchLab;
    } else if (action === ActionId.EncourageMutiny) {
        return actionEncourageMutiny;
    } else if (action === ActionId.Armory) {
        return actionArmory;
    }
}
