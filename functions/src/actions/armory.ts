import { GameDocument, getPlayers } from "../game";
import { createRollCtx, DicePlayer, handleRoll, setupRollCtx } from "../roll-manager";
import { finishAction } from "../transitions/action";
import { Input } from "../../../src/models/inputs";

export function actionArmory(gameDoc: GameDocument, input: Input<any, any>) {
    setupRollCtx(gameDoc.gameState, getPlayers(gameDoc) as DicePlayer[], gameDoc.gameState.currentPlayer);
    const result = handleRoll(gameDoc, input);
    if (result) {
        executeOutcome(gameDoc, result);
    }
}

function executeOutcome(gameDoc: GameDocument, die: number) {
    if (die >= 7) {
        const centurions = gameDoc.gameState.boardedCenturions;
        // destroy a centurion closest to the end
        for (let i = centurions.length - 1; i >= 0; i--) {
            if (centurions[i] > 0) {
                centurions[i]--;
                break;
            }
        }
        trimZeros(centurions);
    }
    finishAction(gameDoc);
}

function trimZeros(data: number[]) {
    let i;
    for (i = data.length - 1; i >= 0 && data[i] === 0; i--) {}
    data.splice(i + 1, data.length - i - 1);
}
