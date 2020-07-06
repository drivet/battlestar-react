import { GameDocument, getCurrentPlayer, roll } from "../game";
import { GameState, QuorumCardId } from "../../../src/models/game-data";

export function actionInspirationalSpeech(gameDoc: GameDocument) {
    const die = roll();
    if (die >= 6) {
        gameDoc.gameState.morale++;
    }
    const player = getCurrentPlayer(gameDoc);
    const index = player.quorumHand.findIndex(q => q === QuorumCardId.InspirationalSpeech);
    player.quorumHand.splice(index, 1)
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
