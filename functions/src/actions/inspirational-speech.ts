import { discardQuorumCard, GameDocument, getCurrentPlayer, getPlayers, removeQuorumCard } from "../game";
import { QuorumCardId } from "../../../src/models/game-data";
import { DicePlayer, handleRoll, setupRollCtx } from "../roll-manager";
import { finishAction } from "../transitions/action";
import { Input } from "../../../src/models/inputs";

export function actionInspirationalSpeech(gameDoc: GameDocument, input: Input<any, any>) {
    setupRollCtx(gameDoc.gameState, getPlayers(gameDoc) as DicePlayer[], gameDoc.gameState.currentPlayer);
    const result = handleRoll(gameDoc, input);
    if (result) {
       executeOutcome(gameDoc, result);
    }
}

function executeOutcome(gameDoc: GameDocument, result: number) {
    const player = getCurrentPlayer(gameDoc);
    if (result >= 6) {
        gameDoc.gameState.food++;
        removeQuorumCard(gameDoc.gameState, player, QuorumCardId.InspirationalSpeech);
    } else {
        discardQuorumCard(gameDoc.gameState, player, QuorumCardId.InspirationalSpeech);
    }
    finishAction(gameDoc);

}