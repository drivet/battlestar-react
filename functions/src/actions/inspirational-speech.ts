import { discardQuorumCard, GameDocument, getCurrentPlayer, removeQuorumCard, roll } from "../game";
import { GameState, QuorumCardId } from "../../../src/models/game-data";

export function actionInspirationalSpeech(gameDoc: GameDocument) {
    const die = roll();
    const player = getCurrentPlayer(gameDoc);
    if (die >= 6) {
        gameDoc.gameState.food++;
        removeQuorumCard(gameDoc.gameState, player, QuorumCardId.InspirationalSpeech);
    } else {
        discardQuorumCard(gameDoc.gameState, player, QuorumCardId.InspirationalSpeech);
    }
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
