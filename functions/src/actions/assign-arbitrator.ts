import { dealSkillCards, GameDocument, getCurrentPlayer, getPlayer, pullQuorumCardFromHand } from "../game";
import { addCards } from "../deck";
import { QuorumCardId, SkillType } from "../../../src/models/game-data";
import { finishAction } from "../transitions/action";
import { Input, InputId } from "../../../src/models/inputs";
import { makeRequest } from "../input";

interface AssignArbitratorCtx {
    state: AssignArbitratorState;
}

export enum AssignArbitratorState {
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
    chosenPlayer.arbitrator = true;
    pullQuorumCardFromHand(gameDoc.gameState, currentPlayer, QuorumCardId.AssignArbitrator);
    finishAction(gameDoc);
}

function handleSetup(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    addCards(player.skillCards, dealSkillCards(gameDoc.gameState, SkillType.Politics, 2));
}

export function actionAssignArbitrator(gameDoc: GameDocument, input: Input<string>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: AssignArbitratorState.Setup,
        } as AssignArbitratorCtx;
    }
    if (gameDoc.gameState.actionCtx.state === AssignArbitratorState.Setup) {
        handleSetup(gameDoc);
    } else if (gameDoc.gameState.actionCtx.state === AssignArbitratorState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input)
    }
}
