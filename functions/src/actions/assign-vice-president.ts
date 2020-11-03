import { dealSkillCards, GameDocument, getCurrentPlayer, getPlayer, pullQuorumCardFromHand } from "../game";
import { addCards } from "../deck";
import { QuorumCardId, SkillType } from "../../../src/models/game-data";
import { finishAction } from "../transitions/action";
import { InputId } from "../../../src/models/inputs";
import { Input, makeRequest } from "../inputs/input";


interface AssignVpCtx {
    state: AssignVpState;
}

export enum AssignVpState {
    Setup,
    ChoosePlayer,
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const currentPlayer =  getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.PlayerSelect, currentPlayer.userId);
        return;
    }

    const chosenPlayer = getPlayer(gameDoc, input.data);
    chosenPlayer.vicePresident = true;
    pullQuorumCardFromHand(gameDoc.gameState, currentPlayer, QuorumCardId.AcceptProphecy);
    finishAction(gameDoc);
}

function handleSetup(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    addCards(player.skillCards, dealSkillCards(gameDoc.gameState, SkillType.Politics, 2));
}

export function actionAssignVp(gameDoc: GameDocument, input: Input<string>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: AssignVpState.Setup,
        } as AssignVpCtx;
    }
    if (gameDoc.gameState.actionCtx.state === AssignVpState.Setup) {
        handleSetup(gameDoc);
    } else if (gameDoc.gameState.actionCtx.state === AssignVpState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input)
    }
}
