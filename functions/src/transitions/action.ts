import { GameDocument } from "../game";
import { ActionId, GameState } from "../../../src/models/game-data";
import { actionNothing } from "../actions/nothing";
import { actionDrawQuorumCard } from "../actions/draw-quorum-card";
import { actionPressRoom } from "../actions/press-room";
import { actionInspirationalSpeech } from "../actions/inspirational-speech";
import { actionFoodRationing } from "../actions/food-rationing";
import { actionConsolidatePower } from "../actions/consolidate-power";
import { actionArrestOrder } from "../actions/arrest-order";
import { actionResearchLab } from "../actions/research-lab";
import { actionEncourageMutiny } from "../actions/encourage-mutiny";
import { TransitionFn } from "./defs";
import { actionArmory } from "../actions/armory";
import { actionPresidentialPardon } from "../actions/presidential-pardon";
import { actionAdministration } from "../actions/administration";
import { actionAdmiralsQuarters } from "../actions/admirals-quarters";
import { actionAssignVp } from "../actions/assign-vice-president";
import { actionBrig } from "../actions/brig";
import { Input } from "../inputs/input";

/**
 * Move the game to the crisis state, and clean up after yourself
 * @param gameDoc
 */
export function finishAction(gameDoc: GameDocument) {
    gameDoc.gameState.actionCtx = null;
    gameDoc.gameState.skillCheckCtx = null;
    gameDoc.gameState.rollCtx = null;
    gameDoc.gameState.state = GameState.Crisis;
}

export function handleAction(gameDoc: GameDocument, input: Input<any, any>) {
    const action = gameDoc.gameState.currentAction;
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
    } else if (action === ActionId.ConsolidatePower1 || action === ActionId.ConsolidatePower2) {
        return actionConsolidatePower;
    } else if (action === ActionId.ArrestOrder) {
        return actionArrestOrder;
    } else if (action === ActionId.ResearchLab) {
        return actionResearchLab;
    } else if (action === ActionId.EncourageMutiny) {
        return actionEncourageMutiny;
    } else if (action === ActionId.Armory) {
        return actionArmory;
    } else if (action === ActionId.PresidentialPardon) {
        return actionPresidentialPardon;
    } else if (action === ActionId.Administration) {
        return actionAdministration;
    } else if (action === ActionId.AdmiralsQuarters) {
        return actionAdmiralsQuarters;
    } else if (action === ActionId.AssignVicePresident) {
        return actionAssignVp;
    } else if (action === ActionId.Brig) {
        return actionBrig;
    }
}
